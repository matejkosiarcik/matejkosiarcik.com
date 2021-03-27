const fs = require('fs');
const path = require('path');
const glob = require('glob-all');
const execa = require('execa');
const process = require('process');

async function svg2png(inputFile, outputFile, width, height) {
  await execa('rsvg-convert', ['-f', 'png', '-w', `${width}`, '-h', `${height}`, inputFile, '-o', outputFile]);
}

(async () => {
  process.chdir(__dirname);

  const outDir = path.join(__dirname, 'artifacts');
  if (!fs.existsSync(outDir)) {
    console.log("Can't find output directory");
  }

  await Promise.all(
    glob.sync(['original/{placeholder,terminal,docker,warning}.svg'])
      .map((inputFile) => svg2png(inputFile, path.join(outDir, `${path.basename(inputFile, '.svg')}.png`), 80, 80)),
    glob.sync(['original/{autodnd,zenplayer}.svg'])
      .map((inputFile) => svg2png(inputFile, path.join(outDir, `${path.basename(inputFile, '.svg')}.png`), 100, 100)),
  );
})();
