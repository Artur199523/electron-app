import {app, BrowserWindow, Menu} from 'electron'
import {ipcWebContentSen, isDev} from "./util.js";

export function createMenu(mainWindow: BrowserWindow) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
            {
                //  For macOS we need to add like this label: process.platform === 'darwin' ? undefined : 'App'
                label: "App",
                type: "submenu",
                submenu: [
                    {
                        label: "Quit",
                        click: app.quit
                    },
                    {
                        label: "DevTools",
                        click: () => mainWindow.webContents.openDevTools(),
                        visible: isDev()
                    },
                ]
            },
            {
                label: "View",
                type: "submenu",
                submenu: [
                    {
                        label: "CPU",
                        click: () => ipcWebContentSen('changeView', mainWindow.webContents, 'CPU')
                    },
                    {
                        label: "RAM",
                        click: () => ipcWebContentSen('changeView', mainWindow.webContents, 'RAM')
                    },
                    {
                        label: "STORAGE",
                        click: () => ipcWebContentSen('changeView', mainWindow.webContents, 'STORAGE')
                    }
                ]
            },
        ]
    ))
}