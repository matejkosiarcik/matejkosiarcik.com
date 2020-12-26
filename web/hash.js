const fs = require('fs')
const path = require('path')
const glob = require('glob')
const hasha = require('hasha')

const resourceFiles = glob.sync('public/**/*.{css,js}');
const htmlFiles = glob.sync('public/**/*.html');

async function fileHash(filePath) {
    const hashBase16 = await hasha.fromFile(filePath, {algorithm: 'sha256'})
    const hashBase36 = BigInt(`0x${hashBase16}`).toString(36)
    return hashBase36.substr(0,10)
}

(async () => {
    const resourceHashes = await Promise.all(resourceFiles.map(fileHash))

    const oldFileNames = []
    const newFileNames = []

    for (let i in resourceFiles) {
        const oldPath = resourceFiles[i]
        const newPath = resourceFiles[i].replace(/\.([a-zA-Z0-9]+)$/, `.${resourceHashes[i]}.$1`)

        oldFileNames.push(path.basename(oldPath))
        newFileNames.push(path.basename(newPath))

        console.log(`Move ${oldPath} -> ${newPath}`)
        fs.renameSync(oldPath, newPath)
    }

    htmlFiles.forEach(filePath => {
        let fileContent = fs.readFileSync(filePath).toString('utf-8')
        for (let i in resourceFiles) {
            while (true) {
                let newFileContent = fileContent.replace(oldFileNames[i], newFileNames[i])
                if (newFileContent === fileContent) {
                    break
                }
                fileContent = newFileContent
            }
        }

        fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' })
    })
})()
