import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

class MainWindow {
    private window: BrowserWindow | null = null;

    constructor() {
        ipcMain.on("set-window-size", (event, option) => {
            console.log(`Setting window size to ${option.width}x${option.height}`);
            
            this.setSize(option.width, option.height);
        });
    }

    async create() {
        if (this.window) {
            return;
        }

        await app.whenReady();

        this.window = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                nodeIntegrationInWorker: true,
                webSecurity: false
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