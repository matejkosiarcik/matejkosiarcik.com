const svg2img = require('svg2img')
const fs = require('fs')
const path = require('path')
// TODO: check favicons-webpack-plugin

svg2img(path.join(__dirname, 'assets', 'favicon', 'favicon.svg'),
    { width: 64, height: 64, preserveAspectRatio: true },
    (_, buffer) => {
        fs.writeFileSync(path.join(__dirname, 'assets', 'favicon', 'favicon.png'), buffer)
    }
)
