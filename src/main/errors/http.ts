import type { ErrorJSON } from '@main/types/base'

import CustomError from './custom'

export default class HttpError extends CustomError {
  public code: string

  constructor(code: string, message: string, cause?: Error) {
    super(message, { cause })
    this.code = code
  }

  public toJSON(): ErrorJSON {
    return {
      ...super.toJSON(),
      code: this.code
    }
  }
}
