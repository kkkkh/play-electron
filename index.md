# electron
#### AppData
- Windows 操作系统中的 AppData
在 Windows 操作系统中，AppData 是一个目录，用于存储应用程序的用户数据。这个目录通常位于 `C:\Users\<YourUsername>\AppData`。
AppData 目录下有三个子目录：
- Roaming: 用于存储可以在不同设备之间漫游的数据，例如应用程序的配置设置、用户偏好等。这些数据会跟随用户的 Microsoft 账户在不同的电脑上同步。
- Local: 用于存储不应该漫游到其他设备的数据，例如缓存文件、大型数据文件等。这些数据仅存储在本地设备上。
- LocalLow: 用于存储低完整性级别的应用程序的数据，例如在受限环境中运行的应用程序。

#### userData
- `app.getPath('userData')` 返回的目录对应于 Windows 系统中的 `C:\Users\<YourUsername>\AppData\Roaming\<YourAppName>` 。
- 实际上是 AppData 目录下的一个特定子目录，用于存储特定应用程序的数据。
- 这个目录是应用存储和读取用户相关数据的安全且推荐的位置

- 操作平台
  - macOS: `~/Library/Application Support/<YourAppName>`
  - Windows: `%APPDATA%/<YourAppName>`，通常是 `C:\Users\<YourUsername>\AppData\Roaming\<YourAppName>`
  - Linux: `~/.config/<YourAppName>`

- 其他目录
  - temp 目录用于存储应用程序在运行时生成的临时文件。这些文件通常用于缓存数据、处理中间结果或在不同进程之间传递数据。
    -  `C:\Users\HAOTIA~1.ZHA\AppData\Local\Temp`
  - downloads 目录是用户存储从网络下载文件的默认位置。
    - `C:\Users\usename\Downloads`
  - exe 文件是打包后的应用程序的主程序。当用户安装你的应用程序后，.exe 文件通常位于安装目录下
    - `D:\projectname\node_modules\.pnpm\electron@35.5.1\node_modules\electron\dist\electron.exe`

