import HttpError from '@main/errors/http'
import type { RequestOpts, JSONResponse } from '@main/types/base'
import { session } from 'electron'
import log from '@main/log'

async function jsonResponseHandler<T>(res: Response): Promise<JSONResponse<T> | Response> {
  if (!res.ok) {
    throw new HttpError(String(res.status), res.statusText || String(res.status))
  }

  const contentType = res.headers.get('Content-Type')

  if (contentType?.includes('application/json')) {
    const json = await res.json()

    if (json.code !== '200') {
      log.warn('Request failed:', json)
      throw new HttpError(json.code, json.message || 'Unknown error')
    }

    return json
  }

  if (contentType?.includes('application/octet-stream')) {
    const response = res

    // const blob: any = await res.blob()

    return response
  }
  throw new HttpError('Unsupported content type', 'The response content type is not supported')
}

export default function request<T>(
  url: string,
  init: RequestOpts = {}
): Promise<JSONResponse<T> | Response> {
  const { disabledTimeout = false, timeout = 600_000, ...opts } = init

  const signal = AbortSignal.timeout(timeout)

  let options: RequestOpts = {
    ...opts,
    signal
  }

  if (disabledTimeout) {
    options = {
      ...opts
    }
  }

  session.defaultSession.allowNTLMCredentialsForDomains('*')

  return session.defaultSession.fetch(url, options).then((res) => jsonResponseHandler<T>(res))
}
