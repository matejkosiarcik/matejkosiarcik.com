const process = require('process');
const dotenv = require('dotenv');

if (process.env.NODE_ENV) {
  config = dotenv.config({ path: `${process.cwd()}/${process.env.NODE_ENV}.env` });
}

module.exports = {
  preset: 'jest-playwright-preset',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    baseUrl: process.env.BASE_URL,
  },
};
