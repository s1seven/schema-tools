/* eslint-disable */
export default {
  displayName: 'generate-coa-pdf-template',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/generate-coa-pdf-template',
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 35,
      functions: 80,
      lines: 65,
    },
  },
};
