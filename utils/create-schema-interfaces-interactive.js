/* eslint-disable @typescript-eslint/no-var-requires */
const { generate } = require('@s1seven/schema-tools-generate-interfaces');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fs = require('fs');

const rl = readline.createInterface({ input, output });

(async function (argv) {
  const outputPath = argv[2];
  const directoryPath = path.dirname(outputPath);

  if (!fs.existsSync(path.resolve(directoryPath))) {
    console.warn('Output directory does not exist.');
    process.exit(1);
  }

  try {
    const schemaPath = await new Promise((resolve) => {
      rl.question('What is the filepath to the updated schema CoA? ', resolve);
    });

    rl.close();

    if (schemaPath && fs.existsSync(path.resolve(schemaPath))) {
      await generate(path.resolve(schemaPath), path.resolve(outputPath));
    } else {
      console.warn('FilePath does not exist.');
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})(process.argv);
