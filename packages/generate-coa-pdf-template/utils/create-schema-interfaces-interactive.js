/* eslint-disable @typescript-eslint/no-var-requires */
const { generate } = require('@s1seven/schema-tools-generate-interfaces');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fs = require('fs');

const rl = readline.createInterface({ input, output });

(async function () {
  const schemaPath = await new Promise((resolve) => {
    rl.question('What is the filepath to the updated schema CoA? ', resolve);
  });

  rl.close();

  if (schemaPath && fs.existsSync(schemaPath)) {
    const outputPath = `${__dirname}/../src/types/schemaTypes.ts`;
    await generate(schemaPath, path.resolve(outputPath));
  }
})();
