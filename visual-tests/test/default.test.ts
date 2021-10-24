import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: 0.05,
  failureThresholdType: 'percent',
  customSnapshotsDir: 'snapshots',
  updatePassedSnapshot: true,
});
expect.extend({ toMatchImageSnapshot });

const viewports = [
  {
    label: 'Phone',
    width: 375,
    height: 667,
  },
  {
    label: 'Tablet',
    width: 1024,
    height: 768,
  },
  {
    label: 'HD',
    width: 1280,
    height: 720,
  },
  {
    label: 'FullHD',
    width: 1920,
    height: 1080,
  },
  {
    label: 'UltraHD',
    width: 3840,
    height: 2160,
  },
];

const locations = [
  {
    name: 'home',
    url: '/',
  },
  {
    name: 'projects',
    url: '/projects',
  },
  {
    name: 'about',
    url: '/about',
  },
  {
    name: 'blog',
    url: '/blog',
  },
  {
    name: '404',
    url: '/404',
  },
  {
    name: 'zenplayer',
    url: '/zenplayer',
  },
];

describe.each(locations)('$name', (location: typeof locations[0]) => {
  beforeAll(async () => {
    await page.goto(`${baseUrl}${location.url}`, { waitUntil: 'load' });

    // Force load all images
    await page.$$eval('[loading=lazy]', (elements) => elements.forEach((element) => element.setAttribute('loading', 'eager')));
  });

  test.each(viewports)('$width x $height', async (viewport: typeof viewports[0]) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.pause();

    const [landingImage, fullpageImage] = await Promise.all([
      page.screenshot({ fullPage: false }),
      page.screenshot({ fullPage: true }),
    ]);
    expect(landingImage).toMatchImageSnapshot({ customSnapshotIdentifier: `${location.name}_${viewport.width}x${viewport.height}_landing_${browserName}` });
    expect(fullpageImage).toMatchImageSnapshot({ customSnapshotIdentifier: `${location.name}_${viewport.width}x${viewport.height}_fullpage_${browserName}` });
  });
});
