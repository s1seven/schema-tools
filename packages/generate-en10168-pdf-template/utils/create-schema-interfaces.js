/* eslint-disable @typescript-eslint/no-var-requires */
const { generate } = require('@s1seven/schema-tools-generate-interfaces');
const path = require('path');

(async function (argv) {
  const schemaPath = argv[2] || 'https://schemas.en10204.io/en10168-schemas/v0.1.0/schema.json';
  const outputPath = argv[3] || `${__dirname}/../src/types/schemaTypes.ts`;
  await generate(schemaPath, path.resolve(outputPath));
})(process.argv);
