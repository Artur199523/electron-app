import {ipcMain, WebContents, WebFrameMain} from "electron";
import {getUIPath} from "./pathResolver.js";
import {pathToFileURL} from "url"

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(key: Key, handle: () => EventPayloadMapping[Key]) {
    ipcMain.handle(key, (event) => {
        validateEventFrame(event.senderFrame)
        return handle()
    })
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(key: Key, handle: (payload: EventPayloadMapping[Key] ) => void) {
    ipcMain.on(key, (event,payload) => {
        validateEventFrame(event.senderFrame)
        return handle(payload)
    })
}

export function ipcWebContentSen<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload)
}

export function validateEventFrame(frame: WebFrameMain | null) {
    if (!frame) {
        throw new Error("Frame is either navigated or destroyed, skipping validation.");
    }

    if(isDev() && new URL(frame.url).host === "localhost:5123") {
        return
    }

    if(frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error("Malicious event")
    }
}