import fs from 'fs'

// FUNCTION FOR CREATE DIRECTORY:
const createDirectoryIfNotExists = (directoryPath:any) => {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true })
    }
}

export {
    createDirectoryIfNotExists
}