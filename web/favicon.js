const svg2img = require('svg2img')
const fs = require('fs')
const path = require('path')
const execa = require('execa')

svg2img(path.join(__dirname, 'assets', 'favicon', 'favicon.svg'),
    { width: 64, height: 64, preserveAspectRatio: true },
    (_, buffer) => {
        fs.writeFileSync(path.join(__dirname, 'assets', 'favicon', 'favicon.png'), buffer)
    }
);

(async () => {
    execa('convert', [
        '-define', 'icon:auto-resize=32,16',
        '-background', 'none',
        '-colors', '256',
        '-density', '1000',
        path.join(__dirname, 'assets', 'favicon', 'favicon.png'),
        path.join(__dirname, 'assets', 'favicon', 'favicon.ico')
    ])
})()
