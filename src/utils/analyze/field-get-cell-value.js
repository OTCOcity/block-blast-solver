import {drawPoint} from "../canvas/draw-point.js";
import {colorDist} from "../canvas/color-dist.js";
import {rgbAt} from "../canvas/rgb-at.js";

const LEFT_START = 40;
const TOP_START = 416;
const CELL = 79.3;

const diffThreshold = 40;

export function fieldGetCellValue(ctx, row, col) {
    const x0 = col * CELL;
    const y0 = row * CELL;

    // 3 пикселя по диагонали внутри клетки (не у границ!)
    const p1 = [x0 + CELL * 0.3 + LEFT_START, y0 + CELL * 0.06 + TOP_START];
    const p2 = [x0 + CELL * 0.5 + LEFT_START, y0 + CELL * 0.5 + TOP_START];
    const p3 = [x0 + CELL * 0.7 + LEFT_START, y0 + CELL * 0.9 + TOP_START];

    const c1 = rgbAt(ctx, p1[0], p1[1]);
    const c2 = rgbAt(ctx, p2[0], p2[1]);
    const c3 = rgbAt(ctx, p3[0], p3[1]);

    drawPoint(ctx, ...p1);
    drawPoint(ctx, ...p2);
    drawPoint(ctx, ...p3);

    return allThreeDifferent(c1, c2, c3, diffThreshold) ? 1 : 0;
}

function allThreeDifferent(c1, c2, c3, threshold = 40) {
    return (
        colorDist(c1, c2) >= threshold ||
        colorDist(c2, c3) >= threshold ||
        colorDist(c1, c3) >= threshold
    );
}