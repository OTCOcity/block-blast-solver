const store = {
    adb: null,
    isPhoneConnected: false,
    isPhoneConnectedError: false,
    isFieldValid: false,
    isGameOver: false,
}

let callback = null;
let updateTimeoutId;
let prevStore = null;

export const setCallback = (func) => callback = func;

export const updateStore = (key, value) => {
    if (!prevStore) {
        prevStore = {...store};
    }
    store[key] = value;

    updateTimeoutId && clearTimeout(updateTimeoutId);
    updateTimeoutId = setTimeout(() => {
        callback?.({...store}, {...prevStore});
        prevStore = null;
    })
}

export const getStoreField = (key) => {
    return store[key] ?? null;
}
