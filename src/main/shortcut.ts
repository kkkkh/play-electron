import { globalShortcut } from 'electron'
import { getFocusedWindow } from './window'

export function registerShortcuts(): void {
  // 注册快捷键
  globalShortcut.registerAll(['CommandOrControl+R', 'F5'], () => {
    console.log('registerShortcuts', 'CommandOrControl+R', 'F5')
    // 一开始没有生效，是因为其他的electron应用占用了注册快捷键
    const focusedWindow = getFocusedWindow()
    focusedWindow?.webContents.reloadIgnoringCache()
  })
}

export function unregisterShortcuts(): void {
  globalShortcut.unregisterAll()
}
