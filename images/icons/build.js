const fs = require('fs');
const path = require('path');
const glob = require('glob-all');
const execa = require('execa');

const outDir = path.join(__dirname, 'artifacts');
try {
  fs.mkdirSync(outDir);
} catch (e) { return; }
if (!fs.existsSync(outDir)) {
  console.log('Could not create/find output directory');
}

process.chdir(__dirname);

async function svg2png(inputFile, outputFile, width, height) {
  await execa('rsvg-convert', ['-f', 'png', '-w', `${width}`, '-h', `${height}`, inputFile, '-o', outputFile]);
}

(async () => {
  await Promise.all(
    glob.sync(['original/{placeholder,terminal,docker,warning}.svg'])
      .map((inputFile) => svg2png(inputFile, path.join(outDir, `${path.basename(inputFile, '.svg')}.png`), 80, 80)),
    glob.sync(['original/{autodnd,zenplayer}.svg'])
      .map((inputFile) => svg2png(inputFile, path.join(outDir, `${path.basename(inputFile, '.svg')}.png`), 100, 100)),
  );
})();
