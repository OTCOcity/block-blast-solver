import {checkIsSquare} from "./square.js";

const FIGURE_BLOCK_SIZE = 210;
const LEFT_PAD = 50;
const TOP_PAD = 60;

export function getFigure(ctx, n, bgColor) {
    // cfg: { baseX, baseY, slotStepX, cellSize, tolerance, bgProbe }
    const startX = LEFT_PAD + (n - 1) * FIGURE_BLOCK_SIZE;
    const startY = TOP_PAD;

    // от больших/уникальных к мелким/похожим
    if (checkIsSquare(ctx, startX, startY, bgColor)) return 'square3';

    // дальше по аналогии:
    // if (checkIsHLine4(img, startX, startY, bgColor, cfg)) return 'hline4';
    // if (checkIsHLine3(img, startX, startY, bgColor, cfg)) return 'hline3';
    // ...

    return 'none';
}