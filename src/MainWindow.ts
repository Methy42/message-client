import { app, BrowserWindow } from "electron";
import * as path from "path";

export default class MainWindow {
    private window: BrowserWindow | null = null;

    constructor() {
        this.create();
    }

    async create() {
        if (this.window) {
            return;
        }

        await app.whenReady();

        this.window = new BrowserWindow({
            height: 500,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
            },
            width: 300,
            show: false,
            frame: false,
        });

        this.window.loadURL("http://localhost:5173/");
        this.window.webContents.openDevTools({ mode: "detach" });

        this.window.on("closed", () => {
            this.window = null;
        });
    }
    
    async open() {
        if (this.window) {
            this.window.restore();
            this.window.show();
            this.window.focus();
            return;
        } else {
            await this.create();
            this.window?.show();
        }
    }

    close() {
        if (this.window) {
            this.window.close();
        }
    }
}