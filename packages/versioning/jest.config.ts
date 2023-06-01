/* eslint-disable */
export default {
  displayName: 'versioning',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/versioning',
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 65,
      functions: 65,
      lines: 70,
    },
  },
};
