import path from "path";
import { BrowserWindow, app, ipcMain } from "electron";

export default class LoginWindow {
    private window: BrowserWindow | null = null;

    constructor() {
    }

    private async create() {
        if (this.window) {
            return;
        }

        await app.whenReady();

        this.window = new BrowserWindow({
            width: 300,
            height: 500,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                nodeIntegrationInWorker: true,
                webSecurity: false
            },
            frame: false,
        });

        this.window.loadFile(path.join(__dirname, "./ui/login/index.html"));
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
}
