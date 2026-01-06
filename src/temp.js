import $ from './utils/dom-selector.js';
import {fieldGetCellValue} from "./utils/analyze/field-get-cell-value.js";
import {getFigure} from "./utils/analyze/check-figures/index.js";
import {rgbAt} from "./utils/canvas/rgb-at.js";

const btnScreen = $("btn-screen");
const canvas = $("canvas");
const canvasElements = $("canvas-elements");
const ctx = canvas.getContext("2d", {willReadFrequently: true});
const ctxEl = canvasElements.getContext("2d", {willReadFrequently: true});

const GRID = 8;

const width = 632;
const height = 632;
const heightEl = 240;

const fldName = 4;
const elsName = 3;

const img = new Image();
img.onload = () => {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
};
img.src = `/temp-images/fields/${fldName}.png`;

const img2 = new Image();
img2.onload = () => {
    canvasElements.width = width;
    canvasElements.height = heightEl;
    ctxEl.drawImage(img2, 0, 0, width, heightEl);
};
img2.src = `/temp-images/els/${elsName}.png`;

// setTimeout(startCalculateField, 1000);
setTimeout(startCalculateElements, 1000);

function startCalculateField() {
    for (let row = 0; row < GRID; row++) {
        for (let col = 0; col < GRID; col++) {
            const value = fieldGetCellValue(ctx, row, col);
            console.log(`${row}:${col} = ${value}`);
        }
    }
}

function startCalculateElements() {
    const bgColor = rgbAt(ctxEl, 5, 5);
    for (let i = 1; i < 4; i++) {
        console.log(getFigure(ctxEl, i, bgColor));
    }
}


// Take screenshot
/*
btnScreen.addEventListener("click", async () => {
    const adb = getStoreField('adb');
    console.log(adb)
    if (!adb) {
        console.log('ERROR NO adb')
        return;
    }
    try {
        const blob = await getScreenBlob(adb);
        const bitmap = await createImageBitmap(blob);

        // Поле
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(
            bitmap,
            44, 415, width, height, // область в исходнике
            0, 0, width, height    // область в canvas
        );

        // Фигуры
        canvasElements.width = width;
        canvasElements.height = heightEl;
        ctxEl.drawImage(
            bitmap,
            44, 1120, width, height, // область в исходнике
            0, 0, width, height    // область в canvas
        );
    } catch (e) {
        console.log('ERROR Take screenshot')
    }
});
*/


// Get figures