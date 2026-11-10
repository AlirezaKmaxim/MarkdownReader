import { ElectronAPI } from '@electron-toolkit/preload'

export type OpenedFile = {
  content: string
  name: string
  path: string
}

export type MarkdownReaderApi = {
  platform: NodeJS.Platform
  openFile: () => Promise<OpenedFile | null>
  readFilePath: (filePath: string) => Promise<OpenedFile>
  getInitialFile: () => Promise<OpenedFile | null>
  getPathForFile: (file: File) => string
  setTitle: (title: string) => Promise<void>
  openDefaultAppsSettings: () => Promise<void>
  setLocale: (locale: 'fa' | 'en') => Promise<void>
  onFileOpened: (callback: (file: OpenedFile) => void) => () => void
  onFileChanged: (callback: (file: OpenedFile) => void) => () => void
  onFileError: (callback: (message: string) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: MarkdownReaderApi
  }
}
