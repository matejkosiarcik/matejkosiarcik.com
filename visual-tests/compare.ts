import * as fs from 'fs/promises';
import * as path from 'path';
import { PNG } from 'pngjs';
import * as pixelmatch from 'pixelmatch';

const treshold = 0.001;

async function listDir(root: string): Promise<{files: string[], directories: string[]}> {
  const files: string[] = [];
  const directories: string[] = [];

  await Promise.all((await fs.readdir(root)).map(async (entry) => {
    const entryPath = path.join(root, entry);
    const stats = await fs.stat(entryPath);
    if (stats.isDirectory()) {
      directories.push(entryPath);
    } else if (stats.isFile() && entry.endsWith('.png')) {
      files.push(entryPath);
    }
    return undefined;
  }));

  return { files, directories };
}

async function listDirRecursive(root: string): Promise<string[]> {
  const { files, directories } = await listDir(root);

  while (directories.length > 0) {
    const directory = directories.shift()!;

    const newEntries = await listDir(directory);
    files.push(...newEntries.files);
    directories.push(...newEntries.directories);
  }

  return files;
}

// merge 2 arrays
function union(arr1: string[], arr2: string[]): string[] {
  const joinedArray = [];
  joinedArray.push(...arr1, ...arr2);

  const set = new Set(joinedArray);

  const resultArray = Array.from(set.values());
  resultArray.sort();
  return resultArray;
}

// TODO: allow comparing images with nonmatching sizes
// create diff data
async function createDiffs() : Promise<{ name: string, diff: number }[]> {
  const [testFiles, referenceFiles] = await Promise.all([
    Promise.all((await listDirRecursive('test')).map((file) => file.replace(/^test./, ''))),
    Promise.all((await listDirRecursive('reference')).map((file) => file.replace(/^reference./, ''))),
    fs.rm('diff', { force: true, recursive: true }),
  ]);
  const allFiles = union(testFiles, referenceFiles);

  const imgDiffs: { name: string, diff: number }[] = [];
  await Promise.all(allFiles.map(async (file) => {
    const testFile = path.join('test', file);
    const referenceFile = path.join('reference', file);
    const diffFile = path.join('diff', file);
    const [testStats, referenceStats] = await Promise.all([
      fs.stat(testFile),
      fs.stat(referenceFile),
      fs.mkdir(path.dirname(diffFile), { recursive: true }),
    ]);
    if (!testStats.isFile()) {
      console.error(`Test file ${testFile} does not exist`);
      return;
    }
    if (!referenceStats.isFile()) {
      console.error(`Reference file ${referenceFile} does not exist`);
      return;
    }

    // const testImg = PNG.sync.read(await fs.readFile(testFile));
    // const referenceImg = PNG.sync.read(await fs.readFile(referenceFile));

    const [testBuffer, referenceBuffer] = await Promise.all([
      fs.readFile(testFile),
      fs.readFile(referenceFile),
    ]);
    const [testImg, referenceImg]: PNG[] = await Promise.all([
      new Promise((resolve) => {
        const img = new PNG();
        img.parse(testBuffer, () => resolve(img));
      }),
      new Promise((resolve) => {
        const img = new PNG();
        img.parse(referenceBuffer, () => resolve(img));
      }),
    ]);

    const diffImg = new PNG({ width: Math.max(testImg.width, referenceImg.width), height: Math.max(testImg.height, referenceImg.height) });
    const totalPixelsCount = diffImg.height * diffImg.width;
    const diffPixelsCount = pixelmatch(testImg.data, referenceImg.data, diffImg.data, diffImg.width, diffImg.height, { threshold: 0 });
    imgDiffs.push({ name: diffFile, diff: diffPixelsCount / totalPixelsCount });
    await fs.writeFile(diffFile, PNG.sync.write(diffImg));
  }));

  return imgDiffs;
}

// report diffs to CLI
async function report(imgDiffs: { name: string, diff: number }[]): Promise<boolean> {
  imgDiffs.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, ignorePunctuation: true }));

  const maxImgNameLength = Math.max(...imgDiffs.map((el) => el.name.length));
  const maxDiffLength = '100.00%'.length;

  console.log(`Treshold: ${(treshold * 100).toFixed(3)}`);
  console.log(`| ${'-'.repeat(maxImgNameLength)} | ${'-'.repeat(maxDiffLength)} |`);
  console.log(`| image${' '.repeat(maxImgNameLength - 5)} | ${' '.repeat(maxDiffLength - 4)}diff |`);
  console.log(`| ${'-'.repeat(maxImgNameLength)} | ${'-'.repeat(maxDiffLength)} |`);
  let failsCount = 0;
  for (const img of imgDiffs) {
    const isSuccess = img.diff <= treshold;
    failsCount += isSuccess ? 0 : 1;

    const colorStart = isSuccess ? (img.diff > 0 ? '\u001b[33m' : '\u001b[32m') : '\u001b[31m'; // eslint-disable-line no-nested-ternary
    const colorEnd = '\u001b[0m';

    const diff = `${(img.diff * 100).toFixed(2)}%`;
    const nameSpacer = ' '.repeat(maxImgNameLength - img.name.length);
    const diffSpacer = ' '.repeat(maxDiffLength - diff.length);
    const trailer = isSuccess ? '' : ' ❌';
    console.log(`| ${img.name}${nameSpacer} | ${diffSpacer}${colorStart}${diff}${colorEnd} |${trailer}`);
  }
  console.log(`| ${'-'.repeat(maxImgNameLength)} | ${'-'.repeat(maxDiffLength)} |`);
  console.log(`Found ${failsCount} failing images`);

  return failsCount === 0;
}

(async () => {
  const imgDiffs = await createDiffs();
  const isGlobalSuccess = await report(imgDiffs);

  if (!isGlobalSuccess) {
    process.exit(1);
  }
})();
