import request from '@main/request'
import type { VersionInfo } from '@main/types/api'
import type { JSONResponse } from '@main/types/base'

const baseUrl = 'http://localhost:3000'

export const getUpdateVersionInfo = (): Promise<JSONResponse<VersionInfo>> => {
  // return request(`${baseUrl}/getUpdateVersionInfo`, {
  //   method: 'get'
  // })
  return Promise.resolve({
    // 增量更新
    data: {
      version: '1.0.4',
      updateType: 1
    },
    // 全量更新
    // data: {
    //   version: '1.0.4-all',
    //   updateType: 0
    // },
    success: true,
    code: '200',
    message: 'success'
  })
}

export const downloadUpdateFile = async (params: VersionInfo): Promise<Response> => {
  const url = new URL(`${baseUrl}/getFileByNodeStream`)
  // const url = new URL(`${baseUrl}/getFileByWebStream`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  return request(url.toString(), {
    method: 'get'
  }) as Promise<Response>
}
