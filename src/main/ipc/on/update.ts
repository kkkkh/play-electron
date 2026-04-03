import { getExePath, getResourcePath, getUserDataPath } from '@electron/utils/path'
import { ipcMain } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import { cleanFiles, copyFileStream, createDirectory, removeFileOrDir } from '@electron/utils/file'
import extract from 'extract-zip'
import { spawn } from 'node:child_process'
import { dialog } from 'electron'
import { getMainWindow } from '@electron/utils/window'
import { compareVersions, validateStrict } from 'compare-versions'
import { downloadUpdateFile, getUpdateVersionInfo } from '@main/api'
import {
  UPDATER_HAS_LATEST_VERSION,
  UPDATER_UPDATE_AVAILABLE,
  UPDATER_DOWNLOAD_PROGRESS
} from '@electron/constants/channel'
import type { VersionInfo } from '@main/types/api'

export interface FileInfo extends fs.Stats {
  fileName: string
}

export async function getVersionFile(dir: string): Promise<FileInfo[]> {
  const incrementalFilesPath = getUserDataPath(dir)

  await createDirectory(incrementalFilesPath)
  const files = await fs.promises.readdir(incrementalFilesPath)
  const fileList: FileInfo[] = []

  for (const file of files) {
    const fullPath = path.join(incrementalFilesPath, file)

    const stats = fs.statSync(fullPath)

    if (stats.isFile()) {
      fileList.push({ ...stats, fileName: file })
    }
  }

  return fileList
}

export async function hasBackupCurrentVersionFile() {
  const fileList = await getVersionFile('historical-versions')
  let hasCurrentVersion = false

  for (const item of fileList) {
    if ([app.getVersion()].includes(item.fileName.replace('.zip', ''))) {
      hasCurrentVersion = true
    }
  }

  return hasCurrentVersion
}

export async function updateResources(sourceUnzipPath: string) {
  try {
    if (import.meta.env.DEV) return
    const targetUnzipBakPath = getResourcePath('resourcesbak')
    const historicalFilePath = getUserDataPath('historical-versions')
    const outputZipFile = path.join(historicalFilePath, `${app.getVersion()}.zip`)

    await createDirectory(targetUnzipBakPath)
    await createDirectory(historicalFilePath)
    const isBackupCurrentVersion = await hasBackupCurrentVersionFile()

    extract(sourceUnzipPath, { dir: targetUnzipBakPath })
      .then(async () => {
        app.quit()
        app.on('quit', () => {
          const child = spawn(
            `"${getUserDataPath('update.exe')}"`,
            [
              `"${getResourcePath()}"`,
              `"${getExePath()}"`,
              'true',
              `${!isBackupCurrentVersion}`,
              'false',
              `"${outputZipFile}"`
            ],
            {
              detached: true,
              shell: true,
              stdio: ['ignore']
            }
          )

          child.unref()
        })
      })
      .catch(() => {
        const mainWindow = getMainWindow()

        void removeFileOrDir(sourceUnzipPath)
        void dialog.showMessageBox(mainWindow!, {
          type: 'error',
          title: 'unzip update file error',
          message:
            'Error in decompressing incremental update package. Please log in again to download.'
        })
      })
  } catch (error) {
    console.error(error)
  }
}

export async function installAppByFullUpdate(exePath: string, installDir: string) {
  try {
    const installerExtension = path.extname(exePath).toLowerCase()

    if (installerExtension !== '.exe' || import.meta.env.DEV) {
      return
    }

    app.quit()
    app.on('quit', () => {
      const child = spawn(`"${exePath}"`, ['/S', `/D="${installDir}"`], {
        detached: true,
        shell: true,
        stdio: ['ignore']
      })

      child.unref()
    })
  } catch (error) {
    console.error('Install failed:', error)
  }
}

export async function extractInstall(filePath: string, data: VersionInfo) {
  try {
    const mainWindow = getMainWindow()
    const targetInstallPath = getUserDataPath('install')

    await createDirectory(targetInstallPath)
    extract(filePath, { dir: targetInstallPath })
      .then(() => {
        // 非强制全量更新
        mainWindow?.webContents.send(UPDATER_UPDATE_AVAILABLE, data)
      })
      .catch(() => {
        void removeFileOrDir(filePath)
        void dialog.showMessageBox(mainWindow!, {
          type: 'error',
          title: 'Unzip installation package update file error',
          message:
            'Error in decompressing the full update package. Please log in again to download.'
        })
      })
  } catch (error) {
    console.error(error)
  }
}

export async function backupsCurrentDownloadVersionFile(sourceFile: string) {
  const fileList = await getVersionFile('historical-versions')
  const historicalFilePath = getUserDataPath('historical-versions')
  const fileName = path.basename(sourceFile)
  let hasCurrentVersion = false

  for (const item of fileList) {
    if ([fileName].includes(item.fileName)) {
      hasCurrentVersion = true
    }
  }
  if (hasCurrentVersion) return
  await copyFileStream(sourceFile, historicalFilePath)
}

export async function saveFile(
  response: Response,
  outputPath: string,
  fileName: string,
  data: VersionInfo,
  updateType: number
): Promise<void> {
  const mainWindow = getMainWindow()

  try {
    await createDirectory(outputPath)
    const filePath = path.join(outputPath, fileName)
    const totalSize = Number.parseInt(response.headers.get('Content-Length') || '0')
    let downloaded = 0

    const reader = response.body?.getReader()
    const writer = fs.createWriteStream(filePath)

    // 处理文件流
    const pump = async () => {
      const { done, value } = (await reader?.read()) ?? { done: true, value: new Uint8Array() }

      if (done) {
        console.log(`File downloaded successfully to ${filePath}`)
        writer.end()
        reader?.releaseLock()
        // 增量更新
        if (updateType === 1) {
          mainWindow?.webContents.send(UPDATER_UPDATE_AVAILABLE, data)
        }

        // 全量更新解压
        if (updateType === 0) {
          void extractInstall(filePath, data)
        }

        // 备份当前下载的版本
        await backupsCurrentDownloadVersionFile(filePath)

        return
      }

      downloaded += value.length
      const progress = (downloaded / totalSize) * 100

      mainWindow?.webContents.send(UPDATER_DOWNLOAD_PROGRESS, {
        percent: progress.toFixed(2)
      })

      // 写入数据
      const canContinue = writer.write(Buffer.from(value))

      // 如果写入流缓冲区已满，等待 drain 事件
      if (!canContinue) {
        await new Promise<void>((resolve) => {
          writer.once('drain', resolve)
        })
      }

      // 继续读取下一块数据
      await pump()
    }

    await pump()
    writer.on('error', () => {
      void cleanFiles(outputPath)

      mainWindow?.webContents.send(UPDATER_UPDATE_AVAILABLE, null)

      void dialog.showMessageBox(mainWindow!, {
        type: 'error',
        title: 'Update file writing error',
        message: 'The download of update file is abnormal, please log in again to download'
      })
    })
  } catch (error) {
    void cleanFiles(outputPath)

    mainWindow?.webContents.send(UPDATER_UPDATE_AVAILABLE, null)

    void dialog.showMessageBox(mainWindow!, {
      type: 'error',
      title: 'Download update file write error',
      message: JSON.stringify(error)
    })
  }
}

async function getDownloadUpdateFile(data: VersionInfo) {
  try {
    const fileList = await getVersionFile('incremental-files')

    let hasNewVersion = false

    for (const item of fileList) {
      if ([data.version].includes(item.fileName.replace('.zip', ''))) {
        hasNewVersion = true
      }
    }

    if (hasNewVersion) {
      const mainWindow = getMainWindow()

      mainWindow?.webContents.send(UPDATER_UPDATE_AVAILABLE, data)

      return
    }

    const response = await downloadUpdateFile(data)
    const incrementalFilesPath = getUserDataPath('incremental-files')

    await saveFile(
      response as Response,
      incrementalFilesPath,
      `${data.version}.zip`,
      data,
      data.updateType
    )
  } catch (error) {
    console.error(error)
  }
}

async function getUpdateVersionInfoData() {
  try {
    const { data } = await getUpdateVersionInfo()
    const currentVersion = app.getVersion()
    const newVersion = data.version
    const mainWindow = getMainWindow()

    if (validateStrict(newVersion) && validateStrict(currentVersion)) {
      const compareRes = compareVersions(newVersion, currentVersion) > 0

      if (compareRes) {
        mainWindow?.webContents.send(UPDATER_HAS_LATEST_VERSION, true, newVersion)
        await getDownloadUpdateFile(data)
      } else {
        mainWindow?.webContents.send(UPDATER_HAS_LATEST_VERSION, false)
      }
    } else {
      mainWindow?.webContents.send(UPDATER_HAS_LATEST_VERSION, false)
    }
  } catch (error) {
    console.error(error)
  }
}

export const updateOn = (): void => {
  ipcMain.on('update', async () => {
    const version = '1.0.2'
    const incrementalFilesPath = getUserDataPath('incremental-files')
    const sourceUnzipPath = path.join(incrementalFilesPath, `${version}.zip`)
    updateResources(sourceUnzipPath)
  })

  ipcMain.on('updateAll', async () => {
    const version = '1.0.4-all'
    const targetInstallPath = getUserDataPath('install')
    const exePath = path.join(targetInstallPath, `${version}.exe`)
    const installDir = getResourcePath()
    void installAppByFullUpdate(exePath, installDir)
  })

  ipcMain.on('checkUpdate', async () => {
    getUpdateVersionInfoData()
  })
}
