// import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
export function getPreloadPath(): string {
  // 渲染进程报错，window.electronAPI.app.getPreloadPath()调不通，是因为这里报错了
  // 模块 使用commonjs，使用import.meta.resolve会报错
  return join(__dirname, '../preload/index.js')
  // return fileURLToPath(import.meta.resolve('../preload/index.js'))
}
