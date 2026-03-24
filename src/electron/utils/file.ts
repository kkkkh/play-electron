import fs from 'node:fs'
import path from 'node:path'

export async function createDirectory(folderPath: string): Promise<void> {
  if (fs.existsSync(folderPath)) {
    const stats = fs.lstatSync(folderPath)

    if (stats.isDirectory()) {
      return
    }

    throw new Error('Path exists but is not a directory')
  }

  // 创建文件夹
  await fs.promises.mkdir(folderPath, { recursive: true })
}

export async function removeFileOrDir(dirPath: string): Promise<void> {
  if (!fs.existsSync(dirPath)) {
    return void 0
  }

  const stats = fs.lstatSync(dirPath)

  if (stats.isDirectory()) {
    return fs.promises.rm(dirPath, { recursive: true })
  }

  return fs.promises.unlink(dirPath)
}

export async function copyFileStream(sourceFile: string, targetDir: string) {
  await createDirectory(targetDir)
  const fileName = path.basename(sourceFile)
  const targetFile = path.join(targetDir, fileName)

  const readStream = fs.createReadStream(sourceFile)
  const writeStream = fs.createWriteStream(targetFile)

  readStream.on('error', (err) => console.error(`Error reading file: ${err}`))
  writeStream.on('error', (err) => console.error(`Error writing file: ${err}`))

  readStream.pipe(writeStream)

  writeStream.on('finish', () => {
    console.log(`File copied successfully: ${sourceFile} -> ${targetFile}`)
  })
}
