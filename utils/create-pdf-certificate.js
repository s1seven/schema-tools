'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const { generatePdf } = require('@s1seven/schema-tools-generate-pdf');

// eslint-disable-next-line sonarjs/cognitive-complexity
(async function () {
  // incase you run directly with node from utils, uncomment the following line:
  // process.chdir('../');

  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 -c [certificatePath] -o [outputPath] -t [translationsPath] -g [generatorPath] -s [styles')
    .options({
      certificatePath: {
        description: 'Path to the Certificate',
        demandOption: true,
        type: 'string',
        coerce: (certificatePath) => {
          if (!fs.existsSync(path.resolve(certificatePath))) {
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
            throw new Error('This filePath does not exist.');
          } else {
            return path.resolve(translationsPath);
          }
        },
        alias: 't',
      },
      generatorPath: {
        description: 'The path to the javascript file that will generate the PDF',
        demandOption: true,
        type: 'string',
        coerce: (generatorPath) => {
          if (!fs.existsSync(path.resolve(generatorPath))) {
            throw new Error('This generator script filePath does not exist.');
          } else {
            return path.resolve(generatorPath);
          }
        },
        alias: 'g',
      },
      stylesPath: {
        description: 'The path to the styles file used for the PDF generation from the Schema repository',
        demandOption: true,
        type: 'string',
        coerce: (stylesPath) => {
          if (!fs.existsSync(path.resolve(stylesPath))) {
            throw new Error('This styles filePath does not exist.');
          } else {
            return path.resolve(stylesPath);
          }
        },
        alias: 's',
      },
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    }).argv;

  try {
    const fonts = {
      Lato: {
        normal: './node_modules/lato-font/fonts/lato-normal/lato-normal.woff',
        bold: './node_modules/lato-font/fonts/lato-bold/lato-bold.woff',
        italics: './node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff',
        light: './node_modules/lato-font/fonts/lato-light/lato-light.woff',
      },
    };

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 40],
      footer: function (currentPage, pageCount) {
        return { text: currentPage.toString() + ' / ' + pageCount, style: 'footer', alignment: 'center' };
      },
      defaultStyle: {
        font: 'Lato',
        fontSize: 10,
      },
      styles: JSON.parse(fs.readFileSync(argv.stylesPath, 'utf8')),
    };

    const translations = fs.readFileSync(argv.translationsPath, 'utf-8');

    const pdfDoc = await generatePdf(path.resolve(argv.certificatePath), {
      docDefinition,
      outputType: 'stream',
      fonts,
      translations: JSON.parse(translations),
      generatorPath: argv.generatorPath,
    });

    const writeStream = createWriteStream(argv.outputPath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    await new Promise((resolve, reject) => {
      writeStream
        .on('finish', () => {
          resolve(true);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
    console.log('PDF generated');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
