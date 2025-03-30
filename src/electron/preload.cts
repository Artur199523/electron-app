import {ipcRenderer} from "electron";

const electron = require('electron')

electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback) => {
        ipcOn("statistics", (stats) => {
            callback(stats)
        })
    },
    getStaticData: () => ipcInvoke("getStaticData")
} satisfies Window['electron'])


function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
) {
    return ipcRenderer.invoke(key)
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    ipcRenderer.on(key, (_, payload) => callback(payload))
}