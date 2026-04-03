import pkg from '../package.json' with { type: 'json' }
import archiver from 'archiver'
import fs from 'node:fs'
import path from 'node:path'

function getPkgName() {
  const name = pkg.name

  if (!name) {
    throw new Error('package name is required')
  }
  return name
}

function getAppVersion(isExeFile) {
  const version = pkg.version

  if (!version) {
    throw new Error('package version is required')
  }

  if (isExeFile) {
    return `${version}-all`
  }

  return version
}

async function compressFile(input, output) {
  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(output)
    const archive = archiver('zip', { zlib: { level: 9 } })

    outputStream.on('close', () => {
      console.log(`${output} compression completed, total size: ${archive.pointer()} bytes`)
      resolve()
    })

    archive.on('error', (err) => {
      console.error(`Error during compression of ${input}:`, err)
      reject(err)
    })

    archive.pipe(outputStream)

    if (fs.statSync(input).isDirectory()) {
      archive.directory(input, false)
    } else {
      archive.file(input, { name: `${getAppVersion(true)}.exe` })
    }

    archive.finalize()
  })
}

async function compressFiles(filesToCompress) {
  try {
    console.log('Files compressed start!', filesToCompress)
    await Promise.all(
      filesToCompress.map(async ({ input, output }) => {
        try {
          await compressFile(input, output)
        } catch (err) {
          console.error(`Failed to compress ${input}:`, err)
          throw err
        }
      })
    )
    console.log('All files compressed successfully!')
  } catch (err) {
    console.error('Error during compression process:', err)
    throw err
  }
}

export default async function (context) {
  const directoryToCompress = path.join(context.outDir, 'win-unpacked', 'resources')
  const sourceExePath = path.join(context.outDir, `${getPkgName()}-${getAppVersion()}-setup.exe`)
  const destExePath = path.join(context.outDir, `${getAppVersion(true)}.exe`)

  const outputDirZipFile = path.join(context.outDir, `${getAppVersion()}.zip`)
  const outputExeZipFile = path.join(context.outDir, `${getAppVersion(true)}.zip`)

  await fs.promises.copyFile(sourceExePath, destExePath)

  const filesToCompress = [
    { input: destExePath, output: outputExeZipFile },
    { input: directoryToCompress, output: outputDirZipFile }
  ]

  compressFiles(filesToCompress).catch((err) => {
    console.error('Compression process failed:', err)
  })

  // 这里写你的自定义逻辑
}
