import $ from "../utils/dom-selector.js";

const btnStart = $("start-button");

const phoneLoadingText = $("phone-loading-text");
const phoneLoadingSpinner = $("phone-loading-spinner");

const hint = $("hint");


export const render = (store, prevStore) =>  {
    // Подключили телефон по usb
    if (!prevStore.isPhoneConnected && store.isPhoneConnected) {
        btnStart.style.display = "none";
        phoneLoadingText.style.display = "none";
        phoneLoadingSpinner.style.display = "block";
        hint.innerText = 'Пытаемся определить поле с игрой. Запустите на телефоне игру Block Blast и начните Classic Game';
    }

    // Ошибка подключения телефона по usb
    if (!prevStore.isPhoneConnectedError && store.isPhoneConnectedError) {
        btnStart.style.display = "block";
        hint.innerText = 'Произошла ошибка подключения, проверьте разрешения на телефоне';
    }

    if (!prevStore.isGameOver && store.isGameOver) {
        hint.innerText = 'GAME OVER';
    }
}