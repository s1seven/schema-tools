/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { stdin as input, stdout as output } from 'process';
import readline from 'readline';

// TODO: fix module not found error when called from packages/generate-coa-pdf-template/project.json
// could this be moved to packages/generate-coa-pdf-template/utils?
import { generate } from '@s1seven/schema-tools-generate-interfaces';

const rl = readline.createInterface({ input, output });

(async function (argv) {
  const outputPath = argv[2];
  const directoryPath = path.dirname(outputPath);

  if (!fs.existsSync(path.resolve(directoryPath))) {
    console.warn('Output directory does not exist.');
    process.exit(1);
  }

  try {
    const schemaPath: string = await new Promise((resolve) => {
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
