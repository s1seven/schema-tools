/* eslint-disable */
export default {
  displayName: 'generate-en10168-pdf-template',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/generate-en10168-pdf-template',
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 45,
      functions: 65,
      lines: 70,
    },
  },
  reporters: ['summary'],
};
