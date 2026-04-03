import { ipcMain, app } from 'electron'

export const versionHandle = (): void => {
  ipcMain.handle('version', async () => {
    return app.getVersion()
  })
}
