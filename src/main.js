import { Adb, AdbDaemonTransport } from "@yume-chan/adb";
import AdbWebCredentialStore from "@yume-chan/adb-credential-web";
import { AdbDaemonWebUsbDeviceManager } from "@yume-chan/adb-daemon-webusb";

const $ = (id) => document.getElementById(id);
const logEl = $("log");
const btnConnect = $("btnConnect");
const btnShot = $("btnShot");
const img = $("img");

const log = (...args) => {
    logEl.textContent += args.join(" ") + "\n";
};

const credentialStore = new AdbWebCredentialStore();
let adb = null;

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

    console.log(device)
    if (!device) return null; // пользователь отменил пикер

    const connection = await device.connect();
    console.log(connection)

    const transport = await AdbDaemonTransport.authenticate({
        serial: device.serial,
        connection,
        credentialStore,
    });
    console.log(transport);

    adb = new Adb(transport);
    return adb;
}


btnConnect.addEventListener("click", async () => {
    try {
        await connectAdb();
    } catch (e) {
        console.error(e);
        log("❌", e?.message ?? String(e));
    }
});
btnShot.addEventListener("click", async () => {
    try {
        await start();
    } catch (e) {
        console.error(e);
        log("❌", e?.message ?? String(e));
    }
});

async function start() {
    await takeScreenshot(img);
    setTimeout(() => { start(); }, 100)
}

async function getPreviouslyGrantedDevice() {
    const devices = await navigator.usb.getDevices(); // без UI
    return devices[0] ?? null;
}

async function takeScreenshot(imgEl) {
    const sp = adb.subprocess.shellProtocol;
    if (!sp) throw new Error("Shell protocol not supported on this device"); // :contentReference[oaicite:2]{index=2}

    const { stdout: pngBytes, stderr, exitCode } =
        await sp.spawnWait("screencap -p"); // :contentReference[oaicite:3]{index=3}

    if (exitCode !== 0) {
        console.error("exitCode", exitCode, "stderr bytes", stderr?.byteLength);
    }

    const blob = new Blob([pngBytes], { type: "image/png" });
    imgEl.src = URL.createObjectURL(blob);
}
