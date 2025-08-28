import { ipcMain } from 'electron'

export const ipcTestOn = (): void => {
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
}
