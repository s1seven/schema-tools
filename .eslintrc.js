module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignorePatterns: ['**/fixtures/*', '**/schemaTypes.ts'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  rules: {
    quotes: ['warn', 'single'],
    'member-access': 'off',
    'sort-imports': ['warn', { ignoreCase: true, memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'] }],
    'interface-name': 'off',
    'arrow-parens': 'off',
    'object-literal-sort-keys': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
