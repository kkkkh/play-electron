/// <reference types="vite/client" />
/// <reference types="vite-plugin-electron/electron-env" />

export {}

declare global {
  type UnsubscribeFn = () => void

  type IpcMainResult<T> =
    | {
        data: T // the result of the function
        errorJSON?: string
      }
    | {
        data?: undefined
        errorJSON: string
      }
}
