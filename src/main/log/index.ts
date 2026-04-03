// 使用 electron-log 主进程版本
import log from 'electron-log/main'

// 日志写到本地日志文件
// 级别 silly 最啰嗦，几乎全打
log.transports.file.level = import.meta.env.DEV
  ? 'silly'
  : (import.meta.env.VITE_LOG_LEVEL ?? 'warn')
// 文件日志最大大小
log.transports.file.maxSize = 50 * 1024 * 1024
// 控制台日志级别
log.transports.console.level = import.meta.env.DEV ? 'silly' : false
// 自动捕获错误
log.errorHandler.startCatching()

export default log
