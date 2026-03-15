import { APP_GET_PRELOAD_PATH } from '@electron/constants/channel'
import { mainOnSync } from '@electron/utils/ipc'
import { getPreloadPath } from '@electron/utils/path'

const unsubscribeFns: UnsubscribeFn[] = []
export function register(): void {
  unsubscribeFns.push(mainOnSync<string>(APP_GET_PRELOAD_PATH, () => getPreloadPath()))
}

export function unregister(): void {
  const fns = unsubscribeFns.splice(0)

  for (const fn of fns) {
    fn()
  }
}
