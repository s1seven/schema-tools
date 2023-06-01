/* eslint-disable */
export default {
  displayName: 'generate-pdf-template-helpers',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/generate-pdf-template-helpers',
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 40,
      functions: 55,
      lines: 60,
    },
  },
};
