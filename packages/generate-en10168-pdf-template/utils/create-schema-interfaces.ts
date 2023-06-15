import { writeFile } from 'fs/promises';
import path from 'path';
import prettier from 'prettier';

import { generate } from '@s1seven/schema-tools-generate-interfaces';

(async function (argv) {
  const schemaPath = argv[2] || 'https://schemas.s1seven.com/en10168-schemas/v0.1.0/schema.json';
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