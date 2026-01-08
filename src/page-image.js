import $ from './utils/dom-selector.js';
import {setCallback} from "./store";
import {render} from "./render/index.js";
import {getElementsMatrix} from "./solver/get-elements-matrix.js";
import {getFieldMatrix} from "./solver/get-field-matrix.js";
import {solveMove} from "./solver/index.js";
import {renderShape} from "./render/render-shape.js";

const btnStart = $("start-button");
const boardOverlayRoot = $('result-overlay');
const inputImg = $("img-num");

const canvas = $("canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

// Callback на изменение store
setCallback(render);

const WINDOW_WIDTH = 720;
const WINDOW_HEIGHT = 1650;
btnStart.addEventListener("click", async () => {
    boardOverlayRoot.innerHTML = '';
    const imageName = inputImg.value;
    const img = new Image();
    img.onload = () => {
        canvas.width = WINDOW_WIDTH;
        canvas.height = WINDOW_HEIGHT;
        ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, WINDOW_WIDTH, WINDOW_HEIGHT
        );
        solve();
    };
    img.src = `/temp-images/${imageName}.jpg`;
});

async function solve() {
    const field = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(getFieldMatrix(ctx).field);
        }, 600)
    });
    const {elements, colors} = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(getElementsMatrix(ctx));
        }, 600)
    });

    console.log(field, elements)

    console.time('solve');
    const result = solveMove(field, elements);
    console.timeEnd('solve');

    console.log(result);

    const CELL = (canvas.clientWidth - 32) / 8;
    const leftPad = 16;
    const topPad = 159;
    let order = 1;
    for (const move of result.moves) {
        const x = move.c * CELL;
        const y = move.r * CELL;
        renderShape(boardOverlayRoot, x + leftPad, y + topPad, colors[order - 1], elements[move.pieceIndex], CELL, order++);
    }
}

