module.exports = {
  launchOptions: {
      headless: process.env.HEADLESS !== 'false',
      slowMo: process.env.SLOWMO ? Number.parseInt(process.env.SLOWMO, 10) : 0,
  },
  browsers: ['chromium', 'firefox', 'webkit'],
};
