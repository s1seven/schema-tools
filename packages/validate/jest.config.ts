/* eslint-disable */
export default {
  displayName: 'validate',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/validate',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 65,
      functions: 60,
      lines: 85,
    },
  },
};
