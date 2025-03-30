import {ipcMain, WebContents, ipcRenderer} from "electron";

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(key: Key, handle: () => EventPayloadMapping[Key]) {
    ipcMain.handle(key, () => handle())
}

export function ipcWebContentSen<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload)
}