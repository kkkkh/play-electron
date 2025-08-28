import { ElectronAPI as Electron } from '@electron-toolkit/preload'
export {}

interface ElectronAPPAPI {
  getPreloadPath: () => string
}

declare global {
  interface ElectronAPI {
    app: ElectronAPPAPI
    ping: () => void
  }
}

declare global {
  interface Window {
    electron: Electron
    electronAPI: ElectronAPI
    IS_IN_ELECTRON: boolean
  }
}
