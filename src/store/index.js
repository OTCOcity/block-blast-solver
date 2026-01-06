const store = {
    adb: null,
    isPhoneConnected: false,
    isPhoneConnectedError: false,
    isFieldValid: false,
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
    console.log({...store})
    return store[key] ?? null;
}
