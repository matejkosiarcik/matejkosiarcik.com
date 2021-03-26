const svg2img = require('svg2img');
const fs = require('fs');
const path = require('path');

(async () => {
  async function createSize(size, filename) {
    await new Promise(resolve => {
      svg2img(path.join(__dirname, 'original', 'favicon.svg'),
        { width: size, height: size, preserveAspectRatio: true },
        (_, buffer) => {
          fs.writeFileSync(path.join(__dirname, 'artifacts', filename ?? `.favicon-${size}.png`), buffer);
          resolve();
        });
    });
  }

  [16, 32].forEach(async size => {
    await createSize(size);
  });
  await createSize(64, 'favicon.png');
  await createSize(180, 'apple-touch-icon.png');
})();
