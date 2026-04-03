import type { ErrorJSON, ErrorWithToJson } from '@main/types/base'

export function ErrorToJSON(error: ErrorWithToJson): ErrorJSON {
  if (typeof error?.toJSON === 'function') {
    return error?.toJSON()
  }

  return {
    name: error.name,
    message: error.message,
    cause: error.cause ? ErrorToJSON(error.cause as Error) : undefined
  }
}
