import { ipcMain, ipcRenderer, type IpcMainEvent } from 'electron'

export function mainOnSync<T = void>(
  channel: string,
  listener: (event: IpcMainEvent, ...args: unknown[]) => Promise<T> | T
): UnsubscribeFn {
  const listenerWrapper = async (event: IpcMainEvent, ...args: unknown[]): Promise<void> => {
    try {
      const res = await listener(event, ...args)
      event.returnValue = { data: res } satisfies IpcMainResult<T>
    } catch (e) {
      event.returnValue = { errorJSON: JSON.stringify(e) } satisfies IpcMainResult<T>
    }
  }

  ipcMain.on(channel, listenerWrapper)

  return () => ipcMain.removeListener(channel, listenerWrapper)
}

export function rendererSendSync<T = void>(channel: string, ...args: unknown[]): T {
  const res: IpcMainResult<T> = ipcRenderer.sendSync(channel, ...args)

  if (res.errorJSON) {
    throw JSON.parse(res.errorJSON)
  }

  return res.data as T
}
