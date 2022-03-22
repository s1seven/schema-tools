/* eslint-disable @typescript-eslint/no-var-requires */
const { createWriteStream, readFileSync } = require('fs');
const { generatePdf } = require('./dist/index');

const CoACertificate = require('../../fixtures/CoA/v0.1.1/valid_cert.json');
const translations = JSON.parse(readFileSync('../../fixtures/CoA/v0.1.1/translations.json'));
const extraTranslations = JSON.parse(readFileSync('../../fixtures/CoA/v0.1.1/extraTranslations.json'));

(async function () {
  try {
    const fonts = {
      Lato: {
        normal: `${__dirname}/node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
        bold: `${__dirname}/node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
        italics: `${__dirname}/node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
        light: `${__dirname}/node_modules/lato-font/fonts/lato-light/lato-light.woff`,
      },
    };

    CoACertificate.RefSchemaUrl = 'https://schemas.s1seven.com/coa-schemas/v0.1.0/schema.json';
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
    };

    const pdfDoc = await generatePdf(CoACertificate, {
      docDefinition,
      outputType: 'stream',
      generatorPath: '/Users/eamon/work/schema-tools/packages/generate-coa-pdf-template/dist/generateContent.js',
      fonts,
      extraTranslations,
      translations,
    });

    const outputFilePath = './test.pdf';
    const writeStream = createWriteStream(outputFilePath);
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
  } catch (error) {
    console.error(error.message);
  }
})();
