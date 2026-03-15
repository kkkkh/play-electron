import { ipcMain, session } from 'electron'

export const clearLocalStorageOn = (): void => {
  ipcMain.on('clearLocalStorage', () => {
    const webviewSession = session.fromPartition('persist:webview')
    webviewSession
      .clearStorageData({
        origin: 'http://127.0.0.1:5500/', // 只清这个 origin 的
        storages: ['localstorage'] // 也可以加上 'cookies', 'indexdb', 'websql', 'serviceworkers'
      })
      .then(() => {
        console.log('Webview storage cleared!')
      })
  })
}
