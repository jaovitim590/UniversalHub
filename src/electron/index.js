import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false
    }
});

    mainWindow.loadURL("http://localhost:5173");
}

app.whenReady()
    .then(() => {
        createWindow();

        ipcMain.on("window:minimize", () => {
            mainWindow.minimize();
        });

        ipcMain.on("window:maximize", () => {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        });

        ipcMain.on("window:close", () => {
            mainWindow.close();
        });
    })
    .catch(console.error);