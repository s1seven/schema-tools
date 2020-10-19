const { validate } = require('../dist/validate-schemas');

const defaultSchemaPath = 'https://raw.githubusercontent.com/s1seven/schemas/main/EN10168-v1.0.schema.json';

(async function (argv) {
  const externalSchemaPath = argv[2] || defaultSchemaPath;
  const localSchemasDir = argv[3] || __dirname;
  try {
    const errors = await validate(externalSchemaPath, localSchemasDir);
    console.error(JSON.stringify(errors, null, 2));
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
