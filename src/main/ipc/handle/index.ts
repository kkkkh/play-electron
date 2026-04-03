import { printHandle } from './print'
import { versionHandle } from './version'

export const ipcMainHandle = (): void => {
  printHandle()
  versionHandle()
}
