import {rgbAt} from "../../canvas/rgb-at.js";
import {SAME_COLOR_SOFT_TOLERANCE, SAME_COLOR_TOLERANCE} from "../../../share/config.js";
import {colorDist} from "../../canvas/color-dist.js";
import {drawPoint} from "../../canvas/draw-point.js";
import {cropZeros} from "./crop-zeroes.js";

const LEFT_START = 48;
const TOP_STAR = 1148;

const BLOCK_SIZE = 210;

const FIGURE_LEFT_PADS = [LEFT_START, LEFT_START + BLOCK_SIZE, LEFT_START + 2 * BLOCK_SIZE];

const CROSS_PAD_LEFT = -7; // Смещение в бок, чтобы нивилировать выравнивание
const CROSS_PAD_TOP = -10; // Смещение в бок, чтобы нивилировать выравнивание

const CELL = 35;
const SIZE = 5;

export function getFigure(ctx, blockNumber) {
    const startX = FIGURE_LEFT_PADS[blockNumber - 1] - CROSS_PAD_LEFT;
    const startY = TOP_STAR - CROSS_PAD_TOP;
    const bgColor = rgbAt(ctx, startX - 5, startY - 5);

    const mask = Array.from({length: SIZE}, () => Array(SIZE).fill(0));
    let figureColor = null;

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const x = startX + c * CELL + CELL / 2;
            const y = startY + r * CELL + CELL / 2;

            const color = rgbAt(ctx, x | 0, y | 0);
            drawPoint(ctx, x, y);

            const isFigure = colorDist(color, bgColor) > SAME_COLOR_SOFT_TOLERANCE;
            const isSameAsFirstFigure = figureColor ? figureColor && colorDist(color, figureColor) < SAME_COLOR_SOFT_TOLERANCE : true;

            if (isFigure && figureColor === null) {
                figureColor = color;
            }
            mask[r][c] = isFigure && isSameAsFirstFigure ? 1 : 0;

/*
            console.log({
                r, c,
                value: mask[r][c],
                colorDist: bgColor ? colorDist(color, bgColor) : false,
                figColorDist: figureColor ? colorDist(color, figureColor) : false,
                figureColor
            })
*/
        }
    }

    return [cropZeros(mask), figureColor];
}
