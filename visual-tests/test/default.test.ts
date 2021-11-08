import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import viewports from '../utils/viewports';
import locations from '../utils/locations';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: 0.05,
  failureThresholdType: 'percent',
  customSnapshotsDir: 'snapshots',
  updatePassedSnapshot: true,
});
expect.extend({ toMatchImageSnapshot });

describe.each(locations)('$name', (location: typeof locations[0]) => {
  beforeAll(async () => {
    await page.goto(`${baseUrl}${location.url}`, { waitUntil: 'load' });

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
