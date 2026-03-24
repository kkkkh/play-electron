// import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { app } from 'electron'

export function getPreloadPath(): string {
  // 渲染进程报错，window.electronAPI.app.getPreloadPath()调不通，是因为这里报错了
  // 模块 使用commonjs，使用import.meta.resolve会报错
  return path.join(__dirname, '../preload/index.js')
  // return fileURLToPath(import.meta.resolve('../preload/index.js'))
}

export function getPath(name: Parameters<typeof app.getPath>[0], subPath = ''): string {
  if (!app) {
    throw new Error('app is not ready')
  }

  const p = app.getPath(name)

  if (!subPath) return p

  return path.join(p, subPath)
}

export function getUserDataPath(subPath = '') {
  return getPath('userData', subPath)
}

export function getExePath(subPath = '') {
  return getPath('exe', subPath)
}

export function getAppPath(subPath = '') {
  if (!app) {
    throw new Error('app is not ready')
  }
  const appPath = app.getAppPath()

  if (!subPath) return appPath

  return path.join(appPath, subPath)
}

export function getResourcePath(subPath = '') {
  if (import.meta.env.DEV) {
    // 开发环境下，直接使用根路径作为资源路径
    return getAppPath(subPath)
  }

  const resourcesPath = process.resourcesPath

  if (!subPath) return resourcesPath

  return path.join(resourcesPath, subPath)
}
