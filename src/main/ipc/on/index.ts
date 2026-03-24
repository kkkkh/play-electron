import { ipcTestOn } from './ipcTest'
import { appGetPathOn } from './appGetPath'
import { clearLocalStorageOn } from './clearLocalStorage'
import { updateOn } from './update'

export const ipcMainOn = (): void => {
  clearLocalStorageOn()
  ipcTestOn()
  appGetPathOn()
  updateOn()
}
