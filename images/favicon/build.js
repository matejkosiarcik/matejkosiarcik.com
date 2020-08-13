const svg2img = require('svg2img')
const fs = require('fs')
const path = require('path')
const execa = require('execa')

const outDir = path.join(__dirname, 'artifacts')
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
}

(async () => {
    await new Promise((resolve, reject) => {
        svg2img(path.join(__dirname, 'favicon.svg'),
            { width: 16, height: 16, preserveAspectRatio: true },
            (_, buffer) => {
                fs.writeFileSync(path.join(outDir, '.favicon-16.png'), buffer)
                resolve()
            },
        )
        svg2img(path.join(__dirname, 'favicon.svg'),
            { width: 32, height: 32, preserveAspectRatio: true },
            (_, buffer) => {
                fs.writeFileSync(path.join(outDir, '.favicon-32.png'), buffer)
                resolve()
            },
        )
        svg2img(path.join(__dirname, 'favicon.svg'),
            { width: 48, height: 48, preserveAspectRatio: true },
            (_, buffer) => {
                fs.writeFileSync(path.join(outDir, '.favicon-48.png'), buffer)
                resolve()
            },
        )
        svg2img(path.join(__dirname, 'favicon.svg'),
            { width: 64, height: 64, preserveAspectRatio: true },
            (_, buffer) => {
                fs.writeFileSync(path.join(outDir, '.favicon-64.png'), buffer)
                resolve()
            },
        )
        svg2img(path.join(__dirname, 'favicon.svg'),
            { width: 96, height: 96, preserveAspectRatio: true },
            (_, buffer) => {
                fs.writeFileSync(path.join(outDir, '.favicon-96.png'), buffer)
                resolve()
            },
        )
        svg2img(path.join(__dirname, 'favicon.svg'),
            { width: 128, height: 128, preserveAspectRatio: true },
            (_, buffer) => {
                fs.writeFileSync(path.join(outDir, '.favicon-128.png'), buffer)
                resolve()
            },
        )
        svg2img(path.join(__dirname, 'favicon.svg'),
            { width: 256, height: 256, preserveAspectRatio: true },
            (_, buffer) => {
                fs.writeFileSync(path.join(outDir, '.favicon-256.png'), buffer)
                resolve()
            },
        )
    })
})()
