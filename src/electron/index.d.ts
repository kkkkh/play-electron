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
