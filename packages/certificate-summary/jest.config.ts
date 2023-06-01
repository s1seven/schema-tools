/* eslint-disable */
export default {
  displayName: 'certificate-summary',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/certificate-summary',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 60,
      functions: 50,
      lines: 85,
    },
  },
};
