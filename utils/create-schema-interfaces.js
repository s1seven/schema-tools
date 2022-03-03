'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const { generate } = require('@s1seven/schema-tools-generate-interfaces');

(async function () {
  // incase you run directly with node from utils, uncomment the following line:
  // process.chdir('../');

  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 -s [schemaPath] -o [outputPath]')
    .options({
      schemaPath: {
        description: 'Path to the schema',
        demandOption: true,
        type: 'string',
        coerce: (schemaPath) => {
          if (!fs.existsSync(path.resolve(schemaPath))) {
            throw new Error('FilePath does not exist.');
          } else {
            return path.resolve(schemaPath);
          }
        },
        alias: 's',
      },
      outputPath: {
        description: 'The path to the output file',
        demandOption: true,
        type: 'string',
        coerce: (outputPath) => {
          const directoryPath = path.dirname(outputPath);

          if (!fs.existsSync(path.resolve(directoryPath))) {
            throw new Error('Output directory does not exist.');
          } else {
            return path.resolve(outputPath);
          }
        },
        alias: 'o',
      },
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    }).argv;

  try {
    await generate(argv.schemaPath, argv.outputPath);
    console.log('Certificate generated');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
