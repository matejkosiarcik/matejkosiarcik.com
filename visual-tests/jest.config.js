module.exports = {
  preset: 'jest-playwright-preset',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    baseUrl: process.env.BASE_URL,
  },
};
