const { validate } = require('../dist/index');

const defaultSchemaPath =
  'https://raw.githubusercontent.com/s1seven/schemas/main/EN10168.schema.json';

(async function (argv) {
  const externalSchemaPath = argv[2] || defaultSchemaPath;
  const localSchemasDir = argv[3] || __dirname;
  try {
    const errors = await validate(externalSchemaPath, localSchemasDir, {
      ignoredPaths: [
        '.DS_Store',
        '.git',
        '.gitignore',
        'node_modules',
        'package.json',
        'package-lock.json',
      ],
      ignoredExts: ['ts', 'js', 'md'],
    });
    console.error(JSON.stringify(errors, null, 2));
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
