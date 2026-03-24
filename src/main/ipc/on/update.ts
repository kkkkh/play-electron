import { getExePath, getResourcePath, getUserDataPath } from '@electron/utils/path'
import { ipcMain } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import { createDirectory, removeFileOrDir } from '@electron/utils/file'
import extract from 'extract-zip'
import { spawn } from 'node:child_process'
import { dialog } from 'electron'
import { getMainWindow } from '@electron/utils/window'

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
    // if (import.meta.env.DEV) return
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

export const updateOn = (): void => {
  // IPC test
  ipcMain.on('update', async () => {
    const version = '1.0.2'
    const incrementalFilesPath = getUserDataPath('incremental-files')
    const sourceUnzipPath = path.join(incrementalFilesPath, `${version}.zip`)
    updateResources(sourceUnzipPath)
  })
}
