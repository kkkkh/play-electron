import { ipcTestOn } from './ipcTest'
import { appGetPathOn } from './appGetPath'
import { clearLocalStorageOn } from './clearLocalStorage'

export const icpMainOn = (): void => {
  clearLocalStorageOn()
  ipcTestOn()
  appGetPathOn()
}
