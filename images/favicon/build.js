const svg2img = require('svg2img')
const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, 'artifacts')
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
}

(async () => {
    async function createSize(size) {
        await new Promise(resolve => {
            svg2img(path.join(__dirname, 'favicon.svg'),
                { width: size, height: size, preserveAspectRatio: true },
                (_, buffer) => {
                    fs.writeFileSync(path.join(outDir, `.favicon-${size}.png`), buffer)
                    resolve()
                },
            )
        })
    }

    [16, 32, 48, 64, 96, 128, 256].forEach(async size => {
        await createSize(size)
    })
})()
