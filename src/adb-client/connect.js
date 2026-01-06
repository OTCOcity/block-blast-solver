import {AdbDaemonWebUsbDeviceManager} from "@yume-chan/adb-daemon-webusb";
import {Adb, AdbDaemonTransport} from "@yume-chan/adb";
import AdbWebCredentialStore from "@yume-chan/adb-credential-web";

const credentialStore = new AdbWebCredentialStore();

export async function connectAdb() {
    // requestDevice обязан быть по клику (user activation)
    if (!AdbDaemonWebUsbDeviceManager.BROWSER) {
        throw new Error("WebUSB is not supported in this browser");
    }

    let devices = await AdbDaemonWebUsbDeviceManager.BROWSER.getDevices();
    let device = devices[0];

    if (!device) {
        // впервые или права потерялись — нужен UI
        device = await AdbDaemonWebUsbDeviceManager.BROWSER.requestDevice();
    }

    if (!device) {
        console.log('No device found');
        return null;
    } // пользователь отменил пикер

    const connection = await device.connect();

    const transport = await AdbDaemonTransport.authenticate({
        serial: device.serial,
        connection,
        credentialStore,
    });

    return new Adb(transport);
}