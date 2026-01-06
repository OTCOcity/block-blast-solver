export function cropZeros(m) {
    const h = m.length;
    const w = m[0]?.length ?? 0;
    if (!h || !w) {
        return [];
    }

    let top = h, left = w, bottom = -1, right = -1;

    for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
            if (m[r][c]) {
                if (r < top) top = r;
                if (c < left) left = c;
                if (r > bottom) bottom = r;
                if (c > right) right = c;
            }
        }
    }

    // вообще нет единиц — фигуры нет
    if (bottom === -1) {
        return [];
    }

    const out = [];
    for (let r = top; r <= bottom; r++) {
        out.push(m[r].slice(left, right + 1));
    }

    return out;
}