import { defineConfig } from "vite";

export default defineConfig({
    optimizeDeps: {
        exclude: [
            "@yume-chan/adb",
            "@yume-chan/adb-daemon-webusb",
            "@yume-chan/adb-credential-web",
            "@yume-chan/stream-extra",
        ],
    },
    esbuild: { target: "esnext" },
    build: { target: "esnext" },
});
