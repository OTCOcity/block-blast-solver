import {colorDist} from "./color-dist.js";

export function isCloseColor(a, b, tolerance) {
    return colorDist(a, b) <= tolerance;
}