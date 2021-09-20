module.exports = {
  launchOptions: {
    headless: process.env.HEADLESS !== 'false',
  },
  browsers: ['chromium', 'firefox', 'webkit'],
};
