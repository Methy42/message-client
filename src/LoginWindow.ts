import { app, BrowserWindow } from "electron";
import * as path from "path";

export default class LoginWindow {
    private window: BrowserWindow | null = null;

    constructor() {
        this.create();
    }

    create() {
        if (this.window) {
            return;
        }

        app.whenReady().then(() => {
            this.window = new BrowserWindow({
                height: 500,
                webPreferences: {
                    preload: path.join(__dirname, "preload.js"),
                },
                width: 300,
                show: false,
            });

            this.window.loadURL("http://localhost:5173/#login");
            this.window.webContents.openDevTools({ mode: "detach" });

            this.window.on("closed", () => {
                this.window = null;
            });
        });
    }
    
    open() {
        if (this.window) {
            this.window.restore();
            this.window.show();
            this.window.focus();
            return;
        }
    }

    close() {
        if (this.window) {
            this.window.close();
        }
    }
}