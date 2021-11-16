module.exports = {
  launchOptions: {
    headless: process.env.HEADLESS !== 'false',
  },
  contextOptions: {
    baseURL: process.env.BASE_URL,
    strictSelectors: true,
  },
  browsers: ['chromium', 'firefox', 'webkit'],
};
