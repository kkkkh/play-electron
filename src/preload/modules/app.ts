import { rendererSendSync } from '@electron/utils/ipc'
import { APP_GET_PRELOAD_PATH } from '@electron/constants/channel'

export default {
  getPreloadPath: () => rendererSendSync(APP_GET_PRELOAD_PATH)
}
