import { contextBridge, ipcRenderer, webUtils, type IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export type OpenedFile = {
  content: string
  name: string
  path: string
}

function subscribe<T>(channel: string, callback: (payload: T) => void): () => void {
  const listener = (_event: IpcRendererEvent, payload: T): void => callback(payload)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

const api = {
  platform: process.platform,
  openFile: (): Promise<OpenedFile | null> => ipcRenderer.invoke('dialog:openFile'),
  readFilePath: (filePath: string): Promise<OpenedFile> =>
    ipcRenderer.invoke('file:readPath', filePath),
  getInitialFile: (): Promise<OpenedFile | null> => ipcRenderer.invoke('file:getInitial'),
  getPathForFile: (file: File): string => webUtils.getPathForFile(file),
  setTitle: (title: string): Promise<void> => ipcRenderer.invoke('window:setTitle', title),
  openDefaultAppsSettings: (): Promise<void> => ipcRenderer.invoke('app:openDefaultAppsSettings'),
  onFileOpened: (callback: (file: OpenedFile) => void): (() => void) =>
    subscribe('file:opened', callback),
  onFileChanged: (callback: (file: OpenedFile) => void): (() => void) =>
    subscribe('file:changed', callback),
  onFileError: (callback: (message: string) => void): (() => void) =>
    subscribe('file:error', callback)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error define in dts
  window.electron = electronAPI
  // @ts-expect-error define in dts
  window.api = api
}
