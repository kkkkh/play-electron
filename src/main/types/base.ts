export interface JSONResponse<T = Record<string, unknown>> {
  success: boolean
  code: string
  message: string
  data: T
}

export interface RequestOpts extends RequestInit {
  timeout?: number
  disabledTimeout?: boolean
}

export interface ApiUpdateInfo {
  version: string
  releaseNotes: string
  remark: string
  ossUrl: string
  sha512: string
  releaseDate: string
  size: string
}

export interface ErrorJSON {
  name: string
  message: string
  cause?: ErrorJSON
  [key: string]: unknown
}

export interface ErrorWithToJson extends Error {
  toJSON?: () => ErrorJSON
}
