export async function getScreenBlob(adb) {
    const sp = adb.subprocess.shellProtocol;
    if (!sp) throw new Error("Shell protocol not supported on this device"); // :contentReference[oaicite:2]{index=2}

    const { stdout: pngBytes, stderr, exitCode } =
        await sp.spawnWait("screencap -p"); // :contentReference[oaicite:3]{index=3}

    if (exitCode !== 0) {
        console.error("exitCode", exitCode, "stderr bytes", stderr?.byteLength);
    }

    return new Blob([pngBytes], { type: "image/png" });
}