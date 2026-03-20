```bat
:: 关闭命令回显，避免执行时把每条命令打印到窗口里
@echo off

:: 如果第 5 个参数是 true，则强制等待 55 秒，常用于等主程序彻底退出、释放文件占用
if /i "%5"=="true" (
  timeout /t 55 /nobreak >nul
)

:: 如果第 4 个参数是 true，则调用 PowerShell 将 %1\resources\* 压缩到第 6 个参数指定的 zip 路径
if /i "%4"=="true" (
  powershell -command "Add-Type -AssemblyName System.IO.Compression.FileSystem; Compress-Archive -Path '%1\resources\*' -DestinationPath '%6' -Force -CompressionLevel Fastest"
)

:: 如果第 3 个参数是 true，则删除当前 resources 目录，并将 resourcesbak 重命名为 resources，完成回滚或恢复
if /i "%3"=="true" (
  rd /s /q %1\resources
  ren %1\resourcesbak resources
)

:: 最后重新启动第 2 个参数指定的 exe 程序
start "" %2
