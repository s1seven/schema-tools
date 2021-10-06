/* eslint-disable @typescript-eslint/no-var-requires */

const { generate } = require('./dist/index');

const defaultExternalSchemaPath = 'https://schemas.s1seven.com/en10168-schemas/v0.0.2/schema.json';
const defaultInterfacesPath = `${__dirname}/certificate.ts`;

(async function (argv) {
  try {
    const schemaPath = argv[2] || defaultExternalSchemaPath;
    const interfacesPath = argv[3] || defaultInterfacesPath;
    await generate(schemaPath, interfacesPath, {
      bannerComment: '',
      style: {
        bracketSpacing: false,
        printWidth: 100,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        useTabs: false,
      },
    });
    console.log('Typescript interfaces generated');
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
