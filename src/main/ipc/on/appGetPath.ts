import { app, ipcMain } from 'electron'

export const appGetPathOn = (): void => {
  ipcMain.on('appGetPath', () => {
    const userDataPath = app.getPath('userData')
    const appDataPath = app.getPath('appData')
    const tempPath = app.getPath('temp')
    const downloadsPath = app.getPath('downloads')
    const exePath = app.getPath('exe')
    console.log(userDataPath) // C:\Users\usename\AppData\Roaming\electron
    console.log(appDataPath) // C:\Users\usename\AppData\Roaming
    console.log(tempPath) // C:\Users\AAAA~1.BBB\AppData\Local\Temp
    console.log(downloadsPath) // C:\Users\usename\Downloads\
    console.log(exePath) // 本地路径 D:\projectname\node_modules\.pnpm\electron@35.5.1\node_modules\electron\dist\electron.exe
  })
}
