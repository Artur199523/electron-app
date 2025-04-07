import {app, BrowserWindow, Tray} from "electron"
import path from "path";

import {getAssetsPath, getPreloadPath, getUIPath} from "./pathResolver.js";
import {getStaticData, pollResources} from "./resourceManager.js";
import {ipcMainHandle, isDev} from "./util.js";

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        }
    })

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123")
    } else {
        mainWindow.loadFile(getUIPath())
    }

    pollResources(mainWindow)

    ipcMainHandle('getStaticData', () => {
        return getStaticData()
    })

    // for macOS we need to use another image and for that we can add this => process.platform === 'darwin' ? {macOS.png} : {Windows.png}
    new Tray(path.join(getAssetsPath(), 'desktopIcon.png'))
})