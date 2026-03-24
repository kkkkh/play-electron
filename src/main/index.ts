import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { ipcMainHandle } from './ipc/handle/index'
import { ipcMainOn } from './ipc/on/index'
import { registerShortcuts, unregisterShortcuts } from './shortcut'
import { registerMainIpc, unregisterMainIpc } from './ipc'
import { createWindow } from '@electron/utils/window'
import { copyFileStream } from '@electron/utils/file'
import { getResourcePath, getUserDataPath } from '@electron/utils/path'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // 创建浏览器窗口
  createWindow()
  // ipcMain.on：模块注册（更通用方案）
  registerMainIpc()
  // ipcMain.on：直接绑定
  ipcMainOn()
  // ipcMain.handle：直接绑定
  ipcMainHandle()
  //
  registerShortcuts()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  await copyFileStream(getResourcePath('raw/shell/update.exe'), getUserDataPath())
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.once('will-quit', async () => {
  unregisterMainIpc()
  unregisterShortcuts()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
