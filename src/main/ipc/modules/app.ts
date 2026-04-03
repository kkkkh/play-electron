import { rendererSendSync, rendererOn } from '@electron/utils/ipc'
import {
  APP_GET_PRELOAD_PATH,
  UPDATER_HAS_LATEST_VERSION,
  UPDATER_UPDATE_AVAILABLE,
  UPDATER_DOWNLOAD_PROGRESS
} from '@electron/constants/channel'
import type { VersionInfo } from '@main/types/api'
import type { ProgressInfo as DownloadProgress } from 'electron-updater'

export default {
  getPreloadPath: () => rendererSendSync(APP_GET_PRELOAD_PATH),
  onUpdateHasLatestVersion: (callback: (hasLatestVersion: boolean) => void) =>
    rendererOn<boolean>(UPDATER_HAS_LATEST_VERSION, (_, hasLatestVersion) =>
      callback(hasLatestVersion)
    ),
  onUpdateAvailable: (callback: (info: VersionInfo) => void) =>
    rendererOn<VersionInfo>(UPDATER_UPDATE_AVAILABLE, (_, info) => callback(info)),
  onDownloadProgress: (callback: (info: DownloadProgress) => void) =>
    rendererOn<DownloadProgress>(UPDATER_DOWNLOAD_PROGRESS, (_, progress) => callback(progress))
}
