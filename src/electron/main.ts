import {app, BrowserWindow, Menu} from "electron"

import {getStaticData, pollResources} from "./resourceManager.js";
import {getPreloadPath, getUIPath} from "./pathResolver.js";
import {ipcMainHandle, ipcMainOn, isDev} from "./util.js";
import {createTray} from "./tray.js";
import {createMenu} from "./menu.js";

// This will hide the menu bar at all
// Menu.setApplicationMenu(null)

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        },
        frame: false
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

    ipcMainOn('sendFrameAction', (payload) => {
        switch (payload) {
            case "CLOSE":
                mainWindow.close()
                break
            case "MINIMIZE":
                mainWindow.minimize()
                break
            case "MAXIMIZE":
                mainWindow.maximize()
        }
    })

    createTray(mainWindow)
    handleCloseEvent(mainWindow)
    createMenu(mainWindow)
})

function handleCloseEvent(mainWindow: BrowserWindow) {
    let willClose = false;

    mainWindow.on('close', (e) => {
        if (willClose) {
            return;
        }
        e.preventDefault()
        mainWindow.hide()

        if (app.dock) {
            app.dock.hide()
        }
    })

    app.on('before-quit', () => {
        willClose = true;
    })

    mainWindow.on('show', () => {
        willClose = false;
    })
}