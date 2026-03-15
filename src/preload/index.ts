import { contextBridge } from 'electron'
import { electronAPI as electron } from '@electron-toolkit/preload'
import appAPI from './modules/app'
// Custom APIs for renderer
const electronAPI = {
  app: appAPI
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  console.log('process.contextIsolated')
  try {
    contextBridge.exposeInMainWorld('electron', electron)
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
    contextBridge.exposeInMainWorld('IS_IN_ELECTRON', true)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electron
  // @ts-ignore (define in dts)
  window.electronAPI = electronAPI
  // @ts-ignore (define in dts)
  window.IS_IN_ELECTRON = true
}
