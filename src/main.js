import $ from './utils/dom-selector.js';
import {connectAdb} from './adb-client';
import {setCallback, updateStore} from "./store";
import {render} from "./render/index.js";

const btnStart = $("start-button");

// Callback на изменение store
setCallback(render);


// TEMP FOR TEST
updateStore('adb', {})
updateStore('isPhoneConnected', true)
updateStore('isPhoneConnectedError', false)

btnStart.addEventListener("click", async () => {
    try {
        const adb = await connectAdb();
        if (adb) {
            updateStore('adb', adb)
            updateStore('isPhoneConnected', true)
            updateStore('isPhoneConnectedError', false)
        }
    } catch (e) {
        updateStore('isPhoneConnectedError', true)
        updateStore('isPhoneConnected', false)
    }
});
