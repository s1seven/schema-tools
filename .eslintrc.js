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
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  ignorePatterns: ['**/fixtures/*', '**/schemaTypes.ts', '**/dist'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', 'import', 'simple-import-sort', '@nx'],
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
    'member-access': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effects.
          ['^\\u0000'],
          // 3rd party.
          ['^@?\\w'],
          // Internal packages.
          ['^(@s1s|@s1seven)(/.*|$)'],
          // Anything not fitting group above.
          ['^'],
          // Relative imports.
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'interface-name': 'off',
    'arrow-parens': 'off',
    'object-literal-sort-keys': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'logical-assignment-operators': ['error', 'always', { enforceForIfStatements: true }],
    'no-console': 'error',
  },
};
