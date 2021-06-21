// This file hashes assets foo.js -> foo.123.js
// Also renames references to these files in .html and all files

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const hasha = require('hasha');

// glob resource files
const assetFiles = glob.sync('public/**/*.{css,js}');
const documentFiles = glob.sync('public/**/*.html');

// returns hash of file as string
async function fileHash(filePath) {
  const hashBase16 = await hasha.fromFile(filePath, { algorithm: 'sha256' });
  const hashBase36 = BigInt(`0x${hashBase16}`).toString(36); // base36 represents numbers [0-9] and letters [a-z]
  return hashBase36.substr(0, 12);
}

// replace all occurrences of "pattern" in "content" with "value"
function replaceAll(content, pattern, value) {
  const output = content.replace(pattern, value);
  if (output === content) {
    return output;
  }
  return replaceAll(output, pattern, value);
}

(async () => {
  const assetHashes = await Promise.all(assetFiles.map(fileHash));
  const oldAssetNames = [];
  const newAssetNames = [];

  // get list of asset files to rename
  for (let i = 0; i < assetFiles.length; i += 1) {
    const oldAssetPath = assetFiles[i];
    const newAssetPath = assetFiles[i].replace(/\.([a-zA-Z0-9]+)$/, `.${assetHashes[i]}.$1`);

    oldAssetNames.push(path.basename(oldAssetPath));
    newAssetNames.push(path.basename(newAssetPath));

    console.log(`Move ${oldAssetPath} -> ${newAssetPath}`);
    fs.renameSync(oldAssetPath, newAssetPath);
  }

  // rename asset files in documents
  documentFiles.forEach((documentFilePath) => {
    let documentContent = fs.readFileSync(documentFilePath).toString('utf-8');
    for (let i = 0; i < assetFiles.length; i += 1) {
      documentContent = replaceAll(documentContent, oldAssetNames[i], newAssetNames[i]);
    }
    fs.writeFileSync(documentFilePath, documentContent, { encoding: 'utf-8' });
  });

  // NOTE: this currently does not rename references for example when .js file includes .css file
  // But I don't need it for this project, so I can live without it
})();
