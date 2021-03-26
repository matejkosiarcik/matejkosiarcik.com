const fs = require('fs');
const path = require('path');
const execa = require('execa');
require('isomorphic-fetch');

(async () => {
  // fetch script from network
  const response = await fetch('https://gc.zgo.at/count.js');
  const script = await response.text();

  // write script to file
  try {
    fs.mkdirSync(path.resolve(__dirname, 'script', 'tmp'));
  } catch (e) { return; }
  const scriptPath = path.join(__dirname, 'script', 'tmp', 'goatcounter.js');
  fs.writeFileSync(scriptPath, script);

  // minify script file
  await execa('terser', ['--ie8', '--safari10', '--output', scriptPath, scriptPath]);
})();

// TODO: consider if it is possible to replace with this
// curl 'https://gc.zgo.at/count.js' | terser --ie8 --safari10 --output script/tmp/goatcounter.js
