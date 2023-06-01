/* eslint-disable */
export default {
  displayName: 'certificate-model',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/certificate-model',
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 50,
      functions: 65,
      lines: 75,
    },
  },
};
