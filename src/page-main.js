import $ from './utils/dom-selector.js';
import {connectAdb, getScreenBlob} from './adb-client';
import {getStoreField, setCallback, updateStore} from "./store";
import {render} from "./render/index.js";
import {renderShape} from "./render/render-shape.js";
import {solveMove} from "./solver/index.js";
import {getFieldMatrix} from "./solver/get-field-matrix.js";
import {getElementsMatrix} from "./solver/get-elements-matrix.js";

const btnStart = $("start-button");
const boardOverlayRoot = $('result-overlay');

const canvas = $("canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});


// Callback на изменение store
setCallback(render);

btnStart.addEventListener("click", async () => {
    try {
        const adb = await connectAdb();
        if (adb) {
            updateStore('adb', adb)
            updateStore('isPhoneConnected', true)
            updateStore('isPhoneConnectedError', false)
            start();
        }
    } catch (e) {
        updateStore('isPhoneConnectedError', true)
        updateStore('isPhoneConnected', false)
    }
});

let screenshotInterval = 0;
function start() {
    setTimeout(async () => {
        await takeScreenshot();

        start();
    }, screenshotInterval);
    screenshotInterval = 2500;
}


// Take screenshot
async function takeScreenshot() {
    boardOverlayRoot.innerHTML = '';
    const adb = getStoreField('adb');
    if (!adb) {
        updateStore('isPhoneConnectedError', true);
        return;
    }
    try {
        const blob = await getScreenBlob(adb);
        const bitmap = await createImageBitmap(blob);
        const {width, height} = bitmap;

        canvas.width = width;
        canvas.height = height;

        // Поле
        ctx.drawImage(
            bitmap,
            0, 0, width, height, // область в исходнике
            0, 0, width, height    // область в canvas
        );

        const field = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(getFieldMatrix(ctx));
            }, 600)
        });
        const {elements, colors} = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(getElementsMatrix(ctx));
            }, 600)
        });

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
    } catch (e) {
        console.log('ERROR Take screenshot')
    }
};