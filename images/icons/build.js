const fs = require('fs')
const path = require('path')
const glob = require('glob-all')
const execa = require('execa')

const outDir = path.join(__dirname, 'artifacts')
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
}

process.chdir(__dirname);

async function svg2png(inputFile, outputFile, width, height) {
    await execa('rsvg-convert', ['-f', 'png', '-w', `${width}`, '-h', `${height}`, inputFile, '-o', outputFile])
}

async function svg2dark(inputFile, outputFile, fromColor, toColor) {
    const svgContent = fs.readFileSync(inputFile).toString().replace(fromColor, toColor)
    fs.writeFileSync(outputFile, svgContent)
}

(async () => {
    for (let inputFile of glob.sync(['original/{placeholder,terminal}.svg'])) {
        await svg2png(inputFile, path.join(outDir, path.basename(inputFile, '.svg') + '.png'), 80, 80)
    }

    for (let inputFile of glob.sync(['original/{autodnd,zenplayer}.svg'])) {
        await svg2png(inputFile, path.join(outDir, path.basename(inputFile, '.svg') + '.png'), 100, 100)
    }
})()
