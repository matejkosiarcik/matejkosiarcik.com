const svg2img = require('svg2img')
const fs = require('fs')
const path = require('path')
const execa = require('execa')

const outDir = path.join(__dirname, 'favicon', 'generated')
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
}

(async () => {
    await new Promise((resolve, reject) => {
        svg2img(path.join(__dirname, 'favicon', 'favicon.svg'),
            { width: 64, height: 64, preserveAspectRatio: true },
            (_, buffer) => {
                fs.writeFileSync(path.join(outDir, 'favicon.png'), buffer)
                resolve()
            }
        )
    })

    execa('convert', [
        '-define', 'icon:auto-resize=32,16',
        '-background', 'none',
        '-colors', '256',
        '-density', '1000',
        path.join(outDir, 'favicon.png'),
        path.join(outDir, 'favicon.ico'),
    ])
})()
