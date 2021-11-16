import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import { locations, viewports } from '../utils/constants';
import { waitForIdle, waitForImages, waitForReady } from '../utils/utils';

expect.extend({
  toMatchImageSnapshot: configureToMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: 'percent',
    customSnapshotsDir: 'snapshots',
    updatePassedSnapshot: true,
  }),
});

describe.each(locations)('$name', (location: typeof locations[0]) => {
  beforeAll(async () => {
    await page.goto(`${baseUrl}${location.url}`, { waitUntil: 'load' });

    // Force load all images
    await page.$$eval('[loading],img,iframe', (elements) => {
      elements.forEach((element) => {
        element.setAttribute('loading', 'eager');
      });
    });
    await waitForReady(page);
    await waitForIdle(page);
    await waitForImages(page);
  });

  test.each(viewports)('$width x $height', async (viewport: typeof viewports[0]) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    const fullpageImage = await page.screenshot({ fullPage: true });
    expect(fullpageImage).toMatchImageSnapshot({ customSnapshotIdentifier: `${location.name}_${viewport.width}x${viewport.height}_${browserName}` });
  });
});
