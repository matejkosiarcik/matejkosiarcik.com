import * as fs from 'fs/promises';
import * as path from 'path';
import { PNG } from 'pngjs';
import * as pixelmatch from 'pixelmatch';

export class VizzResult {
  public readonly diff: number;

  public readonly imageName: string;

  public readonly referenceDir: string;

  public readonly testDir: string;

  public readonly diffDir: string;

    constructor(
        diff: number,
        imageName: string,
        referenceDir: string,
        testDir: string,
        diffDir: string,
    ) {
      this.diff = diff;
      this.imageName = imageName;
      this.referenceDir = referenceDir;
      this.testDir = testDir;
      this.diffDir = diffDir;
    }
}

export interface ReportOptions {
    treshold: number,
}

export async function compare(imageName: string, referenceDir: string, testDir: string, diffDir: string): Promise<VizzResult> {
    const testFile = path.join('test', imageName);
    const referenceFile = path.join('reference', imageName);
    const diffFile = path.join('diff', imageName);

    const [testStats, referenceStats] = await Promise.all([
        fs.stat(testFile),
        fs.stat(referenceFile),
        fs.mkdir(path.dirname(diffFile), { recursive: true }),
    ]);
    if (!testStats.isFile()) {
        console.error(`Test file ${testFile} does not exist`);
        return new VizzResult(NaN, imageName, referenceDir, testDir, diffDir);
    }
    if (!referenceStats.isFile()) {
        console.error(`Reference file ${referenceFile} does not exist`);
        return new VizzResult(NaN, imageName, referenceDir, testDir, diffDir);
    }

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

    if (referenceImg.width !== testImg.width) {
        console.error(`Widths do not match (reference ${referenceImg.width} : test ${testImg.width})`);
        return new VizzResult(NaN, imageName, referenceDir, testDir, diffDir);
    }
    if (referenceImg.height !== testImg.height) {
        console.error(`Heights do not match (reference ${referenceImg.height} : test ${testImg.height})`);
        return new VizzResult(NaN, imageName, referenceDir, testDir, diffDir);
    }

    const diffImg = new PNG({ width: Math.max(testImg.width, referenceImg.width), height: Math.max(testImg.height, referenceImg.height) });
    const totalPixelsCount = diffImg.height * diffImg.width;
    const diffPixelsCount = pixelmatch(testImg.data, referenceImg.data, diffImg.data, diffImg.width, diffImg.height, { threshold: 0 });
    await fs.writeFile(diffFile, PNG.sync.write(diffImg));
    return new VizzResult(diffPixelsCount / totalPixelsCount, imageName, referenceDir, testDir, diffDir);
}

export async function report(comparisons: VizzResult[], options: ReportOptions): Promise<boolean> {
    comparisons.sort((a, b) => a.imageName.localeCompare(b.imageName, undefined, { numeric: true, ignorePunctuation: true }));

    const maxImgNameLength = Math.max(...comparisons.map((el) => el.imageName.length));
    const maxDiffLength = '100.00%'.length;

    console.log(`| ${'-'.repeat(maxImgNameLength)} | ${'-'.repeat(maxDiffLength)} |`);
    console.log(`| image${' '.repeat(maxImgNameLength - 5)} | ${' '.repeat(maxDiffLength - 4)}diff |`);
    console.log(`| ${'-'.repeat(maxImgNameLength)} | ${'-'.repeat(maxDiffLength)} |`);
    let failsCount = 0;
    for (const img of comparisons) {
        const isSuccess = img.diff <= options.treshold;
        failsCount += isSuccess ? 0 : 1;

        const colorStart = isSuccess ? (img.diff > 0 ? '\u001b[33m' : '\u001b[32m') : '\u001b[31m'; // eslint-disable-line no-nested-ternary
        const colorEnd = '\u001b[0m';

        const diff = `${Number.isFinite(img.diff) ? (img.diff * 100).toFixed(2) : '-'}%`;
        const nameSpacer = ' '.repeat(maxImgNameLength - img.imageName.length);
        const diffSpacer = ' '.repeat(maxDiffLength - diff.length);
        const trailer = isSuccess ? '' : ' ❌';
        console.log(`| ${img.imageName}${nameSpacer} | ${diffSpacer}${colorStart}${diff}${colorEnd} |${trailer}`);
    }
    console.log(`| ${'-'.repeat(maxImgNameLength)} | ${'-'.repeat(maxDiffLength)} |`);
    console.log(`Found ${failsCount} failing images`);

    return failsCount === 0;
}
