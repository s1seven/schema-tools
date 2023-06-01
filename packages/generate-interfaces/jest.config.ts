/* eslint-disable */
export default {
  displayName: 'generate-interfaces',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/generate-interfaces',
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 70,
      functions: 95,
      lines: 85,
    },
  },
};
