import { app, BrowserWindow } from "electron";
import * as path from "path";
import events from "../common/Events";

class MainWindow {
    private window: BrowserWindow | null = null;

    constructor() {
        events.addEventListener("set-window-size", (event) => {
            this.setSize(event.width, event.height);
        });
    }

    async create() {
        if (this.window) {
            return;
        }

        await app.whenReady();

        this.window = new BrowserWindow({
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
            },
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
        }
    }

    close() {
        if (this.window) {
            this.window.close();
        }
    }

    setSize(width: number, height: number) {
        if (this.window) {
            console.log(`Setting window size to ${width}x${height}`);
            
            this.window.setSize(width, height, true);
        }
    }
}

export default new MainWindow();