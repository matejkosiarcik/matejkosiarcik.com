const process = require('process');
const dotenv = require('dotenv');
const fs = require('fs');

if (process.env.NODE_ENV) {
  dotenv.config({ path: `${process.cwd()}/${process.env.NODE_ENV}.env` });
}

if (process.argv.includes('--updateSnapshot') || process.argv.includes('-u')) {
  fs.rmSync('snapshots', { recursive: true, force: true });
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
