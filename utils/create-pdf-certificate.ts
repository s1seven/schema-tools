/* eslint-disable no-console */
import fs from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { generatePdf } from '../packages/generate-pdf/src';
import { fileExists, normalizePath } from './helpers';

const fonts = {
  NotoSans: {
    normal: `${__dirname}/../fixtures/fonts/NotoSans-Regular.ttf`,
    bold: `${__dirname}/../fixtures/fonts/NotoSans-Bold.ttf`,
    light: `${__dirname}/../fixtures/fonts/NotoSans-Light.ttf`,
    italics: `${__dirname}/../fixtures/fonts/NotoSans-Italic.ttf`,
  },
  NotoSansSC: {
    normal: `${__dirname}/../fixtures/fonts/NotoSansSC-Regular.ttf`,
    bold: `${__dirname}/../fixtures/fonts/NotoSansSC-Bold.ttf`,
    light: `${__dirname}/../fixtures/fonts/NotoSansSC-Light.ttf`,
    italics: `${__dirname}/../fixtures/fonts/NotoSansSC-Regular.ttf`, // SC doesn't have italic
  },
};

const languageFontMap = {
  CN: 'NotoSansSC',
};

async function createPdf(options: {
  stylesPath: string;
  translationsPath: string;
  extraTranslationsPath: string | undefined;
  certificatePath: string;
  generatorPath: string;
  outputPath: string;
}) {
  const { stylesPath, translationsPath, extraTranslationsPath, certificatePath, generatorPath, outputPath } = options;
  const docDefinition: Omit<TDocumentDefinitions, 'content'> = {
    pageSize: 'A4',
    pageMargins: [20, 20, 20, 40],
    footer: (currentPage, pageCount) => ({
      text: currentPage.toString() + ' / ' + pageCount,
      style: 'footer',
      alignment: 'center',
    }),
    defaultStyle: {
      font: 'NotoSans',
      fontSize: 10,
    },
    styles: JSON.parse(fs.readFileSync(stylesPath, 'utf8')),
  };

  const translations = fs.readFileSync(translationsPath, 'utf-8');
  const extraTranslations = extraTranslationsPath ? JSON.parse(fs.readFileSync(extraTranslationsPath, 'utf-8')) : {};

  const pdfDoc = await generatePdf(path.resolve(certificatePath), {
    docDefinition,
    fonts,
    translations: JSON.parse(translations),
    extraTranslations,
    generatorPath,
    languageFontMap,
  });

  await writeFile(outputPath, pdfDoc);
}

const getCliArgs = () =>
  yargs(hideBin(process.argv))
    .usage('Usage: $0 -c [certificatePath] -o [outputPath] -t [translationsPath] -g [generatorPath] -s [styles')
    .options({
      certificatePath: {
        description: 'Path to the Certificate',
        demandOption: true,
        type: 'string',
        coerce: (certificatePath) => {
          if (!fileExists(certificatePath)) {
            throw new Error('Certificate Path does not exist.');
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
      generatorPath: {
        description: 'The path to the javascript file that will generate the PDF',
        demandOption: true,
        type: 'string',
        coerce: (val) => normalizePath(val),
        alias: 'g',
      },
      stylesPath: {
        description: 'The path to the styles file used for the PDF generation from the Schema repository',
        demandOption: true,
        type: 'string',
        coerce: (val) => normalizePath(val),
        alias: 's',
      },
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .parseSync();

(async function () {
  // incase you run directly with node from utils, uncomment the following line:
  // process.chdir('../');
  const argv = getCliArgs();
  try {
    await createPdf(argv);
    console.log('PDF generated');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
