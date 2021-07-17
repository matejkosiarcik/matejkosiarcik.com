import * as playwright from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';
import { compare, report, VizzResult } from './library';

const baseUrl = process.env.BASE_URL;
if (!baseUrl) {
  console.error('BASE_URL not set.');
  process.exit(1);
}

const treshold = 0.001;

const pages = [
  {
    name: 'home',
    url: '/',
  },
  {
    name: 'zenplayer',
    url: '/zenplayer',
  },
  {
    name: '404',
    url: '/404',
  },
];

const viewports = [
  {
    width: 375,
    height: 667,
  },
  {
    width: 640,
    height: 480,
  },
  {
    width: 1024,
    height: 768,
  },
  {
    width: 1920,
    height: 1080,
  },
  {
    width: 4096,
    height: 2160,
  },
];

const browsers = [
  {
    name: 'chromium',
    browser: playwright.chromium,
  },
  {
    name: 'firefox',
    browser: playwright.firefox,
  },
  {
    name: 'webkit',
    browser: playwright.webkit,
  },
];

(async () => {
  await fs.rm('test', { force: true, recursive: true });
  const comparisons: VizzResult[] = [];

  await Promise.all(browsers.map(async (browserInfo) => {
    const browser = await browserInfo.browser.launch({ headless: true });
    const context = await browser.newContext();

    await Promise.all(pages.map(async (pageInfo) => {
      const viewportDir = path.join(pageInfo.name, browserInfo.name, 'viewport');
      const fullpageDir = path.join(pageInfo.name, browserInfo.name, 'full');
      const [page] = await Promise.all([
        context.newPage(),
        fs.mkdir(viewportDir, { recursive: true }),
        fs.mkdir(fullpageDir, { recursive: true }),
      ]);

      // This is serial for a reason
      // When running it all at the same time, I found it can degrades performance (starting so many tabs/processes)
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto(`${baseUrl}${pageInfo.url}`, { waitUntil: 'networkidle' });

        // force load all async resources
        await page.$$eval('[loading=lazy]', (elements) => elements.forEach((element) => element.setAttribute('loading', 'eager')));

        const viewportImg = path.join(viewportDir, `${viewport.width}x${viewport.height}.png`);
        const fullpageImg = path.join(fullpageDir, `${viewport.width}x${viewport.height}.png`);
        await Promise.all([
          page.screenshot({ path: path.join('test', viewportImg) }),
          page.screenshot({ path: path.join('test', fullpageImg), fullPage: true }),
        ]);
        comparisons.push(...await Promise.all([
          compare(viewportImg, 'reference', 'test', 'diff'),
          compare(fullpageImg, 'reference', 'test', 'diff'),
        ]));
      }

      await page.close();
    }));

    await browser.close();
  }));

  const success = await report(comparisons, { treshold: treshold });
  if (!success) {
    process.exit(1);
  }
})();
