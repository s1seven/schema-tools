// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('./jest.config.base.js');

module.exports = {
  ...base,
  projects: ['<rootDir>/packages/*/jest.config.js'],
  // collectCoverageFrom: ['<rootDir>/packages/*/src/**'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 50,
      functions: 65,
      lines: 70,
    },
  },
  coverageDirectory: '<rootDir>/coverage/',
  reporters: ['default'],
  moduleDirectories: ['node_modules'],
};
