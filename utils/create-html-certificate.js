'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const { generateHtml } = require('@s1seven/schema-tools-generate-html');

(async function () {
  // incase you run directly with node from utils, uncomment the following line:
  // process.chdir('../');

  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 -s [schemaPath] -o [outputPath] -t [translationsPath] -T [templatePath]')
    .options({
      certificatePath: {
        description: 'Path to the schema',
        demandOption: true,
        type: 'string',
        coerce: (certificatePath) => {
          if (!fs.existsSync(path.resolve(certificatePath))) {
            throw new Error('Certificate file path does not exist.');
          } else {
            return path.resolve(certificatePath);
          }
        },
        alias: 'c',
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
      translationsPath: {
        description: 'The path to the translations file',
        demandOption: true,
        type: 'string',
        coerce: (translationsPath) => {
          if (!fs.existsSync(path.resolve(translationsPath))) {
            throw new Error('This translation filePath does not exist.');
          } else {
            return path.resolve(translationsPath);
          }
        },
        alias: 't',
      },
      templatePath: {
        description: 'The path to the handlebars template file in the Schema directory',
        demandOption: true,
        type: 'string',
        coerce: (templatePath) => {
          if (!fs.existsSync(path.resolve(templatePath))) {
            throw new Error('This template filePath does not exist.');
          } else {
            return path.resolve(templatePath);
          }
        },
        alias: 'T',
      },
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    }).argv;

  try {
    const translations = fs.readFileSync(argv.translationsPath, 'utf-8');
    const html = await generateHtml(path.resolve(argv.certificatePath), {
      templateType: 'hbs',
      templatePath: argv.templatePath,
      translations: JSON.parse(translations),
    });
    fs.writeFileSync(path.resolve(argv.outputPath), html);
    console.log('HTML generated');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
