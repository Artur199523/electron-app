import {BrowserWindow, Tray, Menu, app} from "electron";
import path from "path";

import {getAssetsPath} from "./pathResolver.js";

export function createTray(mainWindow: BrowserWindow) {
    // For macOS we need to use another image and for that we can add this => process.platform === 'darwin' ? {macOS.png} : {Windows.png}
    const tray = new Tray(path.join(getAssetsPath(), 'desktopIcon.png'))

    tray.setContextMenu(Menu.buildFromTemplate([
        // For macOS we need to check  if(app.dock) { app.dock.show() }
        {
            label: 'Show',
            click: () => mainWindow.show()
        },
        {
            label: 'Quit',
            click: () => app.quit(),
        }
    ]))
}