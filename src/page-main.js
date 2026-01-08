import $ from './utils/dom-selector.js';
import {connectAdb, getScreenBlob} from './adb-client';
import {getStoreField, setCallback, updateStore} from "./store";
import {render} from "./render/index.js";
import {renderShape} from "./render/render-shape.js";
import {solveMove} from "./solver/index.js";
import {getFieldMatrix} from "./solver/get-field-matrix.js";
import {getElementsMatrix} from "./solver/get-elements-matrix.js";
import {arrayHash} from "./utils/array-hash.js";

const btnStart = $("start-button");
const boardOverlayRoot = $('result-overlay');

const canvas = $("canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

const canvasVisible = $("canvas-visible");
const ctxVisible = canvasVisible.getContext("2d", {willReadFrequently: true});


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

let loopInterval = 100;
let sameHashCountToRender = 3;
let sameScreenCounter = 0;
let lastHash = null;
let lastDrawHash = null;

function start() {
    setTimeout(async () => {
        await takeScreenshot();
        const {
            elements, field, colors, hash, isValid
        } = await getDataFromScreen();

        // console.log({
        //     elements, field, colors, hash, isValid
        // });
        console.log(hash);

        if (!isValid || hash !== lastHash) {
            lastHash = hash;
            sameScreenCounter = 0;
            return start();
        }

        sameScreenCounter++;
        if (sameScreenCounter < sameHashCountToRender) {
            return start();
        }

        if (lastDrawHash === hash) {
            sameScreenCounter = 0;
            console.log('SAME DRAW');
            return start();
        }

        console.log('UPDATE DRAW');
        lastDrawHash = hash;
        sameScreenCounter = 0;

        boardOverlayRoot.innerHTML = '';

        ctxVisible.drawImage(canvas, 0, 0);
        const result = solveMove(field, elements);
        const CELL = (canvas.clientWidth - 32) / 8;
        const leftPad = 16;
        const topPad = 159;
        let order = 1;

        console.log(result);

        if (!result) {
            updateStore('isGameOver', true);
            return;
        }

        for (const move of result.moves) {
            const x = move.c * CELL;
            const y = move.r * CELL;
            renderShape(boardOverlayRoot, x + leftPad, y + topPad, colors[move.pieceIndex], elements[move.pieceIndex], CELL, order++);
        }

        start();
    }, loopInterval);
}

async function takeScreenshot() {
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

        if (canvasVisible.width !== canvas.width || canvasVisible.height !== canvas.height) {
            canvasVisible.width = width;
            canvasVisible.height = height;
        }

        // Рисуем на canvas
        ctx.drawImage(
            bitmap,
            0, 0, width, height, // область в исходнике
            0, 0, width, height    // область в canvas
        );
    } catch (e) {
        console.log('ERROR Take screenshot')
    }
}

async function getDataFromScreen() {
    try {
        const {field, isValid} = getFieldMatrix(ctx);
        const {elements, colors} = getElementsMatrix(ctx);

        return {
            elements,
            field,
            colors,
            hash: arrayHash([field, elements, colors]),
            isValid: isValid
        }

    } catch (e) {
        console.log('ERROR getDataFromScreen');
    }
}
