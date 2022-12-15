import fs from 'fs';
import path from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { generateHtml } from '../packages/generate-html/src';
import { fileExists, normalizePath } from './helpers';

async function createHtml(options: {
  translationsPath: string;
  extraTranslationsPath: string | undefined;
  partialsMapPath: string | undefined;
  certificatePath: string;
  templatePath: string;
  outputPath: string;
}) {
  const { translationsPath, extraTranslationsPath, certificatePath, partialsMapPath, templatePath, outputPath } =
    options;
  const translations = fs.readFileSync(translationsPath, 'utf-8');
  const extraTranslations = extraTranslationsPath ? JSON.parse(fs.readFileSync(extraTranslationsPath, 'utf-8')) : {};
  const partialsMap = partialsMapPath ? JSON.parse(fs.readFileSync(partialsMapPath, 'utf-8')) : undefined;

  const html = await generateHtml(path.resolve(certificatePath), {
    templateType: 'hbs',
    templatePath,
    translations: JSON.parse(translations),
    extraTranslations,
    partialsMap,
  });
  fs.writeFileSync(path.resolve(outputPath), html);
}

// eslint-disable-next-line sonarjs/cognitive-complexity
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
          if (!fileExists(directoryPath)) {
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
        coerce: (val) => normalizePath(val),
        alias: 't',
      },
      extraTranslationsPath: {
        description: 'The path to the external translations file',
        demandOption: false,
        type: 'string',
        coerce: (val) => normalizePath(val),
        alias: 'e',
      },
      partialsMapPath: {
        description: 'The path to the partials map file',
        demandOption: false,
        type: 'string',
        coerce: (val) => normalizePath(val),
        alias: 'p',
      },
      templatePath: {
        description: 'The path to the handlebars template file in the Schema directory',
        demandOption: true,
        type: 'string',
        coerce: (val) => normalizePath(val),
        alias: 'T',
      },
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    }).argv;

  try {
    await createHtml(argv);
    console.log('HTML generated');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
