/* eslint-disable */
export default {
  displayName: 'extract-emails',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/extract-emails',
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 60,
      functions: 85,
      lines: 85,
    },
  },
};
