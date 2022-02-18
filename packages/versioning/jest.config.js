/* eslint-disable @typescript-eslint/no-var-requires */
const base = require('../../jest.config.base.js');
const pkg = require('./package.json');

const projectName = pkg.name.split('@s1seven/schema-tools-').pop();

module.exports = {
  ...base,
  name: pkg.name,
  displayName: pkg.name,
  rootDir: '../..',
  testMatch: [`<rootDir>/packages/${projectName}/**/*.spec.ts`],
  coverageDirectory: `<rootDir>/packages/${projectName}/coverage/`,
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 65,
      functions: 65,
      lines: 70,
    },
  },
  reporters: ['default'],
  moduleDirectories: ['node_modules'],
};
