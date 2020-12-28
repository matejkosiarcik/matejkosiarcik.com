const fs = require('fs')
const path = require('path')
require('isomorphic-fetch');

(async () => {
    const goatResponse = await fetch('https://gc.zgo.at/count.js')
    const originalScript = await goatResponse.text()
    try {
        fs.mkdirSync(path.resolve(__dirname, 'script', 'tmp'))
    } catch(e) {}
    // TODO: replace this monstrosity with terser
    const minifiedScript = originalScript.split('\n')
        .map(line => line.replace(/^\s+/, '').replace(/\/\/.*$/g, ''))
        .filter(line => line !== '')
        .join('\n')
        .replace(/[ \t ]+/g, ' ')
        .replace(/, /g, ',')
        .replace(/ ?([\+-=\|?:!&\*\(\)\[\]\{\}]+) ?/g, '$1')
    fs.writeFileSync(path.join(__dirname, 'script', 'tmp', 'goat.js'), minifiedScript)
})()
