import { Page } from 'playwright';

export async function waitForIdle(page: Page) {
  await page.evaluate(() => new Promise((resolve) => {
    if (window.requestIdleCallback) { // currently unavailable on webkit
      window.requestIdleCallback(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  }));
}

export async function waitForReady(page: Page) {
  await page.evaluate(() => new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve(null);
    }

    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        document.onreadystatechange = () => null;
        resolve(null);
      }
    };
  }));
}

export async function waitForImages(page: Page) {
  await page.$$eval('img', (images) => new Promise((resolveAll) => {
    Promise.all(images.map((image) => new Promise((resolveOne) => {
      if (image.complete) {
        resolveOne(null);
      } else {
        image.addEventListener('load', resolveOne);
        image.addEventListener('error', resolveOne);
      }
    }))).then(resolveAll);
  }));
}
