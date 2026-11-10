import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, extname, basename, resolve } from 'path'
import { readFile } from 'fs/promises'
import { existsSync, watch, type FSWatcher } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

type Locale = 'fa' | 'en'

// The renderer owns the language setting and mirrors it here (app:setLocale)
const MAIN_MESSAGES = {
  fa: {
    appTitle: 'مارک‌داون خوان آرام',
    unsupported: 'فقط فایل‌های .md و .txt پشتیبانی می‌شوند',
    openError: 'خطا در باز کردن فایل',
    dialogTitle: 'انتخاب فایل مارک‌داون'
  },
  en: {
    appTitle: 'Aram Markdown Reader',
    unsupported: 'Only .md and .txt files are supported',
    openError: 'Could not open the file',
    dialogTitle: 'Choose a Markdown file'
  }
} satisfies Record<Locale, Record<string, string>>

let locale: Locale = 'fa'
let currentFileName: string | null = null

const msg = (key: keyof (typeof MAIN_MESSAGES)['fa']): string => MAIN_MESSAGES[locale][key]

function windowTitle(): string {
  return currentFileName ? `${currentFileName} — ${msg('appTitle')}` : msg('appTitle')
}
const ALLOWED_EXTENSIONS = new Set(['.md', '.txt', '.markdown'])

type OpenedFile = { content: string; name: string; path: string }

let mainWindow: BrowserWindow | null = null
// File passed on the command line (e.g. double-clicking a .md in Explorer)
let pendingFilePath: string | null = findFileArg(process.argv)
let watcher: FSWatcher | null = null
let watchTimer: NodeJS.Timeout | null = null

function findFileArg(argv: string[]): string | null {
  for (let i = argv.length - 1; i >= 1; i--) {
    const arg = argv[i]
    if (!arg || arg.startsWith('-')) continue
    if (!ALLOWED_EXTENSIONS.has(extname(arg).toLowerCase())) continue
    const full = resolve(arg)
    if (existsSync(full)) return full
  }
  return null
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 640,
    minHeight: 480,
    show: false,
    autoHideMenuBar: true,
    title: msg('appTitle'),
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    stopWatching()
    mainWindow = null
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

async function readMarkdownFile(filePath: string): Promise<OpenedFile> {
  const ext = extname(filePath).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(msg('unsupported'))
  }
  const content = await readFile(filePath, 'utf-8')
  return { content, name: basename(filePath), path: filePath }
}

function stopWatching(): void {
  watcher?.close()
  watcher = null
  if (watchTimer) clearTimeout(watchTimer)
  watchTimer = null
}

// Reload the document when it is edited in another program
function watchFile(win: BrowserWindow, filePath: string): void {
  stopWatching()
  try {
    watcher = watch(filePath, () => {
      if (watchTimer) clearTimeout(watchTimer)
      watchTimer = setTimeout(async () => {
        try {
          const file = await readMarkdownFile(filePath)
          if (!win.isDestroyed()) win.webContents.send('file:changed', file)
        } catch {
          // File was removed or is mid-write; ignore until the next change
        }
      }, 200)
    })
  } catch {
    watcher = null
  }
}

async function loadFileForWindow(win: BrowserWindow, filePath: string): Promise<OpenedFile> {
  const file = await readMarkdownFile(filePath)
  currentFileName = file.name
  win.setTitle(windowTitle())
  watchFile(win, file.path)
  return file
}

async function openPathInWindow(filePath: string): Promise<void> {
  if (!mainWindow) {
    pendingFilePath = filePath
    return
  }
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.focus()
  try {
    const file = await loadFileForWindow(mainWindow, filePath)
    mainWindow.webContents.send('file:opened', file)
  } catch (err) {
    const message = err instanceof Error ? err.message : msg('openError')
    mainWindow.webContents.send('file:error', message)
  }
}

// Keep one window: opening another .md from Explorer reuses it
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', (_event, argv) => {
    const filePath = findFileArg(argv)
    if (filePath) {
      openPathInWindow(filePath)
    } else if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // macOS delivers files through this event instead of argv
  app.on('open-file', (event, filePath) => {
    event.preventDefault()
    openPathInWindow(filePath)
  })

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.markdownreader.pro')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    ipcMain.handle('dialog:openFile', async (event) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      const options: Electron.OpenDialogOptions = {
        title: msg('dialogTitle'),
        properties: ['openFile'],
        filters: [
          { name: 'Markdown', extensions: ['md', 'markdown', 'txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }
      const result = win
        ? await dialog.showOpenDialog(win, options)
        : await dialog.showOpenDialog(options)

      if (result.canceled || result.filePaths.length === 0) {
        return null
      }

      if (!win) return readMarkdownFile(result.filePaths[0])
      return loadFileForWindow(win, result.filePaths[0])
    })

    ipcMain.handle('file:readPath', async (event, filePath: string) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) return readMarkdownFile(filePath)
      return loadFileForWindow(win, filePath)
    })

    ipcMain.handle('file:getInitial', async (event) => {
      const filePath = pendingFilePath
      pendingFilePath = null
      if (!filePath) return null
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) return readMarkdownFile(filePath)
      return loadFileForWindow(win, filePath)
    })

    ipcMain.handle('window:setTitle', (event, title: string) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (win) {
        win.setTitle(title || msg('appTitle'))
      }
    })

    ipcMain.handle('app:setLocale', (event, next: unknown) => {
      if (next !== 'fa' && next !== 'en') return
      locale = next
      BrowserWindow.fromWebContents(event.sender)?.setTitle(windowTitle())
    })

    // Windows 10/11 don't let apps silently become the default handler;
    // send the user straight to the "Default apps" settings page instead.
    ipcMain.handle('app:openDefaultAppsSettings', async () => {
      if (process.platform === 'win32') {
        await shell.openExternal('ms-settings:defaultapps')
      }
    })

    mainWindow = createWindow()

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
