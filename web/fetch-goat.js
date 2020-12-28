const fs = require('fs')
const path = require('path')
const execa = require('execa')
require('isomorphic-fetch');

(async () => {
    const goatResponse = await fetch('https://gc.zgo.at/count.js')
    const originalScript = await goatResponse.text()
    try {
        fs.mkdirSync(path.resolve(__dirname, 'script', 'tmp'))
    } catch(e) {}
    const scriptPath = path.join(__dirname, 'script', 'tmp', 'goat.js')
    fs.writeFileSync(scriptPath, originalScript)
    await execa('terser', ['--ie8', '--safari10', '--output', scriptPath, scriptPath])
})()
