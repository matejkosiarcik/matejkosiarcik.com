import * as fs from 'fs/promises';
import * as path from 'path';
import { compare, report } from './library';

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

(async () => {
  const [testFiles, referenceFiles] = await Promise.all([
    Promise.all((await listDirRecursive('test')).map((file) => file.replace(/^test./, ''))),
    Promise.all((await listDirRecursive('reference')).map((file) => file.replace(/^reference./, ''))),
    fs.rm('diff', { force: true, recursive: true }),
  ]);
  const allFiles = union(testFiles, referenceFiles);

  const comparisons = await Promise.all(allFiles.map((img) => compare(img, 'reference', 'test', 'diff')));
  const success = await report(comparisons, { treshold: treshold });

  if (!success) {
    process.exit(1);
  }
})();
