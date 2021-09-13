import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: 0.05,
  failureThresholdType: 'percent',
});
expect.extend({ toMatchImageSnapshot });

const viewports = [
  {
    label: 'phone',
    width: 375,
    height: 667,
  },
  {
    label: 'tablet',
    width: 1024,
    height: 768,
  },
  {
    label: 'fullhd',
    width: 1920,
    height: 1080,
  },
];

const locations = [
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

describe.each(locations)('$name', (location: typeof locations[0]) => {
  beforeAll(async () => {
    await page.goto(`${baseUrl}${location.url}`, { waitUntil: 'networkidle' });

    // Force load all images
    await page.$$eval('[loading=lazy]', (elements) => elements.forEach((element) => element.setAttribute('loading', 'eager')));
  });

  test.each(viewports)('$width x $height', async (viewport: typeof viewports[0]) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    const [landingImage, fullpageImage] = await Promise.all([
      page.screenshot({ fullPage: false }),
      page.screenshot({ fullPage: true }),
    ]);
    expect(landingImage).toMatchImageSnapshot({ customSnapshotIdentifier: `${location.name}_${viewport.width}x${viewport.height}_landing_${browserName}` });
    expect(fullpageImage).toMatchImageSnapshot({ customSnapshotIdentifier: `${location.name}_${viewport.width}x${viewport.height}_fullpage_${browserName}` });
  });
});
