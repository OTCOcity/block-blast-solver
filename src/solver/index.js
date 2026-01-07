import {FILED_GRID_SIZE} from "../share/config.js";

const SIZE = FILED_GRID_SIZE;
const CELLS = SIZE * SIZE;

// Precompute row/col masks for 8x8
const ROW_MASKS = Array.from({ length: SIZE }, (_, r) => {
    let m = 0n;
    for (let c = 0; c < SIZE; c++) m |= 1n << BigInt(r * SIZE + c);
    return m;
});

const COL_MASKS = Array.from({ length: SIZE }, (_, c) => {
    let m = 0n;
    for (let r = 0; r < SIZE; r++) m |= 1n << BigInt(r * SIZE + c);
    return m;
});

function popcount64(mask) {
    // BigInt popcount
    let cnt = 0;
    while (mask) {
        mask &= (mask - 1n);
        cnt++;
    }
    return cnt;
}

function boardMatrixToMask(board8x8) {
    let m = 0n;
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board8x8[r]?.[c] === 1) {
                m |= 1n << BigInt(r * SIZE + c);
            }
        }
    }
    return m;
}

function maskToBoardMatrix(mask) {
    const b = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const bit = 1n << BigInt(r * SIZE + c);
            b[r][c] = (mask & bit) ? 1 : 0;
        }
    }
    return b;
}

function isEmptyMatrix(mat) {
    if (!Array.isArray(mat) || mat.length === 0) return true;
    for (const row of mat) {
        for (const v of row) if (v === 1) return false;
    }
    return true;
}

function trimPieceMatrix(mat) {
    // Removes empty outer rows/cols. Returns { coords, h, w }.
    // coords are relative (dr, dc) of 1-cells.
    const h0 = mat.length;
    const w0 = Math.max(0, ...mat.map(r => r.length));

    let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;

    for (let r = 0; r < h0; r++) {
        for (let c = 0; c < (mat[r]?.length ?? 0); c++) {
            if (mat[r][c] === 1) {
                if (r < minR) minR = r;
                if (c < minC) minC = c;
                if (r > maxR) maxR = r;
                if (c > maxC) maxC = c;
            }
        }
    }

    if (minR === Infinity) {
        return { coords: [], h: 0, w: 0 };
    }

    const h = maxR - minR + 1;
    const w = maxC - minC + 1;

    const coords = [];
    for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
            if (mat[r]?.[c] === 1) coords.push([r - minR, c - minC]);
        }
    }

    return { coords, h, w };
}

function buildShiftedMaskFromCoords(coords, topR, topC) {
    let m = 0n;
    for (const [dr, dc] of coords) {
        const r = topR + dr;
        const c = topC + dc;
        m |= 1n << BigInt(r * SIZE + c);
    }
    return m;
}

function clearLines(boardMask) {
    // Finds full rows/cols, clears them, returns { board, clearedLines }
    let clearMask = 0n;
    let cleared = 0;

    for (let r = 0; r < SIZE; r++) {
        const rm = ROW_MASKS[r];
        if ((boardMask & rm) === rm) {
            clearMask |= rm;
            cleared++;
        }
    }

    for (let c = 0; c < SIZE; c++) {
        const cm = COL_MASKS[c];
        if ((boardMask & cm) === cm) {
            clearMask |= cm;
            cleared++;
        }
    }

    return {
        board: boardMask & ~clearMask,
        clearedLines: cleared,
    };
}

function generatePlacements(boardMask, piece) {
    // piece: { coords, h, w }
    // returns array of { r, c, placedMask, afterMask, clearedLines }
    const res = [];
    if (!piece || piece.coords.length === 0) return res;

    for (let r = 0; r <= SIZE - piece.h; r++) {
        for (let c = 0; c <= SIZE - piece.w; c++) {
            const placedMask = buildShiftedMaskFromCoords(piece.coords, r, c);
            if ((boardMask & placedMask) !== 0n) continue; // overlap => invalid

            const merged = boardMask | placedMask;
            const { board: afterMask, clearedLines } = clearLines(merged);

            res.push({ r, c, placedMask, afterMask, clearedLines });
        }
    }
    return res;
}

/**
 * Solve one move (place all available pieces).
 *
 * @param {number[][]} board8x8 - 8x8 matrix of 0/1
 * @param {Array<number[][]>} pieces - up to 3 matrices (can be [] or empty)
 * @returns {null | { moves: Array<{pieceIndex:number, r:number, c:number}>, finalBoard:number[][], finalOccupied:number }}
 */
export function solveMove(board8x8, pieces) {
    const initialBoard = boardMatrixToMask(board8x8);

    // Normalize pieces: keep original index for result
    const normPieces = [];
    for (let i = 0; i < pieces.length; i++) {
        const mat = pieces[i];
        if (isEmptyMatrix(mat)) continue; // "figure may not exist"
        const trimmed = trimPieceMatrix(mat);
        if (trimmed.coords.length === 0) continue;
        normPieces.push({ ...trimmed, originalIndex: i });
    }

    // If no pieces at all => already "best"
    if (normPieces.length === 0) {
        return {
            moves: [],
            finalBoard: maskToBoardMatrix(initialBoard),
            finalOccupied: popcount64(initialBoard),
        };
    }

    // remainingMask uses bits 0..(n-1) for normPieces
    const n = normPieces.length;
    const fullMask = (1 << n) - 1;

    const memo = new Map(); // key -> { bestOcc, bestMoves, bestFinalMask }

    function keyOf(boardMask, remainMask) {
        return boardMask.toString(16) + "|" + remainMask;
    }

    function dfs(boardMask, remainMask) {
        const k = keyOf(boardMask, remainMask);
        if (memo.has(k)) return memo.get(k);

        // terminal: no remaining pieces
        if (remainMask === 0) {
            const res = {
                possible: true,
                bestOcc: popcount64(boardMask),
                bestMoves: [],
                bestFinalMask: boardMask,
            };
            memo.set(k, res);
            return res;
        }

        let bestOcc = Infinity;
        let bestMoves = null;
        let bestFinalMask = null;

        // Try each next piece (order matters)
        for (let pi = 0; pi < n; pi++) {
            if (((remainMask >> pi) & 1) === 0) continue;

            const piece = normPieces[pi];
            const placements = generatePlacements(boardMask, piece);

            // If no placements for this piece in this state, maybe other piece first helps
            // so we don't immediately fail here.
            for (const p of placements) {
                const nextRemain = remainMask & ~(1 << pi);
                const child = dfs(p.afterMask, nextRemain);
                if (!child.possible) continue;

                // Objective: minimize occupied cells after placing all pieces
                if (child.bestOcc < bestOcc) {
                    bestOcc = child.bestOcc;
                    bestFinalMask = child.bestFinalMask;
                    bestMoves = [
                        { pieceIndex: piece.originalIndex, r: p.r, c: p.c },
                        ...child.bestMoves,
                    ];
                }
            }
        }

        const res =
            bestMoves === null
                ? { possible: false }
                : { possible: true, bestOcc, bestMoves, bestFinalMask };

        memo.set(k, res);
        return res;
    }

    const out = dfs(initialBoard, fullMask);
    if (!out.possible) return null;

    return {
        moves: out.bestMoves,
        finalBoard: maskToBoardMatrix(out.bestFinalMask),
        finalOccupied: out.bestOcc,
    };
}

