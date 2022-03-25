/* eslint-disable @typescript-eslint/no-var-requires */
const { createWriteStream, readFileSync } = require('fs');
const { generatePdf } = require('./dist/index');
const styles = require(`${__dirname}/../generate-coa-pdf-template/utils/styles.js`);

const CoACertificate = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v0.2.0/valid_cert.json`));
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v0.2.0/translations.json`));
const extraTranslations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v0.2.0/extra_translations.json`));
const generatorPath = '../generate-coa-pdf-template/dist/generateContent.js';

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

    // CoACertificate.RefSchemaUrl = 'https://schemas.s1seven.com/coa-schemas/v0.2.0/schema.json';
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 40],
      footer: (currentPage, pageCount) => ({
        text: currentPage.toString() + ' / ' + pageCount,
        style: 'footer',
        alignment: 'center',
      }),
      defaultStyle: {
        font: 'Lato',
        fontSize: 10,
      },
      styles,
    };

    const pdfDoc = await generatePdf(CoACertificate, {
      docDefinition,
      outputType: 'stream',
      generatorPath,
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
