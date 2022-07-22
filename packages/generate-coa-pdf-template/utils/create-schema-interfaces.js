/* eslint-disable @typescript-eslint/no-var-requires */
const { generate } = require('@s1seven/schema-tools-generate-interfaces');
const { writeFile } = require('fs/promises');
const path = require('path');
const prettier = require('prettier');

(async function (argv) {
  const schemaPath = argv[2] || 'https://schemas.s1seven.com/coa-schemas/v0.0.4/schema.json';
  const outputPath = argv[3] || `${__dirname}/../src/types/schemaTypes.ts`;
  const interfacesPath = path.resolve(outputPath);
  const interfaces = await generate(schemaPath);
  const prettyInterfaces = prettier.format(interfaces, {
    parser: 'typescript',
    singleQuote: true,
    printWidth: 120,
  });
  await writeFile(interfacesPath, prettyInterfaces);
})(process.argv);
