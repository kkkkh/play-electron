import { ElectronAPI as Electron } from '@electron-toolkit/preload'
import type { ProgressInfo as DownloadProgress } from 'electron-updater'
import type { VersionInfo } from '@main/types/api'

export {}

interface ElectronAPPAPI {
  getPreloadPath: () => string
  onUpdateHasLatestVersion: (callback: (hasLatestVersion: boolean) => void) => void
  onUpdateAvailable: (callback: (info: VersionInfo) => void) => void
  onDownloadProgress: (callback: (info: DownloadProgress) => void) => void
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
