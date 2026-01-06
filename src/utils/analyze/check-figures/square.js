import {rgbAt} from "../../canvas/rgb-at.js";
import {isCloseColor} from "../../canvas/is-close-color.js";
import {SAME_COLOR_TOLERANCE} from "../../../share/config.js";
import {drawPoint} from "../../canvas/draw-point.js";

export const CELL_SIZE = 35;

export function checkIsSquare(ctx, startX, startY, bgColor) {
    console.log(startX, startY, bgColor);
    const bg = rgbAt(ctx, startX - CELL_SIZE, startY - CELL_SIZE);
    if (!bg) return false;
    if (!isCloseColor(bg, bgColor, SAME_COLOR_TOLERANCE)) return false;

    // центры 3x3
    const centers = [];
    for (let gy = 0; gy < 3; gy++) {
        for (let gx = 0; gx < 3; gx++) {
            const cx = Math.round(startX + gx * CELL_SIZE + CELL_SIZE / 2);
            const cy = Math.round(startY + gy * CELL_SIZE + CELL_SIZE / 2);
            centers.push({ x: cx, y: cy });
            drawPoint(ctx, cx - 5, cy - 5);
        }
    }

    const first = rgbAt(ctx, centers[0].x, centers[0].y);
    if (!first) return false;

    // фигура не должна совпадать с фоном
    if (isCloseColor(first, bgColor, SAME_COLOR_TOLERANCE)) return false;

    for (let i = 1; i < centers.length; i++) {
        const p = rgbAt(ctx, centers[i].x, centers[i].y);
        if (!p) return false;
        if (!isCloseColor(p, first, SAME_COLOR_TOLERANCE)) return false;
    }

    return true;
}