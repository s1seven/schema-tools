/* eslint-disable no-console */
import path from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { generate } from '@s1seven/schema-tools-generate-interfaces';

import { fileExists, normalizePath } from './helpers';

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
        coerce: (val) => normalizePath(val),
        alias: 's',
      },
      outputPath: {
        description: 'The path to the output file',
        demandOption: true,
        type: 'string',
        coerce: (outputPath) => {
          const directoryPath = path.dirname(outputPath);
          if (!fileExists(directoryPath)) {
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
    })
    .parseSync();

  try {
    await generate(argv.schemaPath, argv.outputPath);
    console.log('Certificate interface generated');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
