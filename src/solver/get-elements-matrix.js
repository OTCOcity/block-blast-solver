import {getFigure} from "../utils/analyze/get-figure/index.js";

export function getElementsMatrix(ctx) {
    const elements = [];
    const colors = [];
    for (let i = 1; i < 4; i++) {
        const [element, color] = getFigure(ctx, i);
        elements.push(element);
        colors.push(color ? `rgb(${color[0]}, ${color[1]}, ${color[2]})` : 'blue');
    }
    // console.log(elements);
    return {elements, colors};
}
