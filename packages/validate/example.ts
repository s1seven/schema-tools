/* eslint-disable no-console */
import { validate } from './src/index';

(async function (argv) {
  const localSchemasDir = argv[2] || '../../fixtures/';
  try {
    const errors = await validate(localSchemasDir, {
      ignoredPaths: ['.DS_Store', '.git', '.gitignore', 'node_modules', 'package.json', 'package-lock.json'],
      ignoredExts: ['ts', 'js', 'md'],
    });
    console.error(JSON.stringify(errors, null, 2));
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
