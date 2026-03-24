import { BrowserWindow } from 'electron'
import icon from '../../../resources/icon.png?asset'
import path from 'node:path'
import { shell } from 'electron'
import { is } from '@electron-toolkit/utils'

let mainWindowId: null | number = null

export function createWindow(): void {
  // #region main-BrowserWindow
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true, // 允许使用webview标签
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindowId = mainWindow.id
  // #endregion main-BrowserWindow
  // console.log('preload', join(__dirname, '../preload/index.js'))
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

export function getMainWindow(): BrowserWindow | null {
  if (mainWindowId === null) return null

  return getWindowById(mainWindowId)
}

export function getWindowById(id: number): BrowserWindow | null {
  return BrowserWindow.fromId(id)
}
