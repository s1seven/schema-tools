/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createWriteStream, readFileSync } from 'fs';

import { generatePdf, TDocumentDefinitions } from './src/index';
const styles = require(`${__dirname}/../generate-en10168-pdf-template/utils/styles.js`);

const en10168Certificate = JSON.parse(
  readFileSync(`${__dirname}/../../fixtures/EN10168/v0.4.1/valid_cert.json`, 'utf-8'),
);
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/EN10168/v0.4.1/translations.json`, 'utf-8'));
const generatorPath = '../generate-en10168-pdf-template/dist/generateContent.cjs';

(async function () {
  try {
    const fonts = {
      Lato: {
        normal: `${__dirname}/../../node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
        bold: `${__dirname}/../../node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
        italics: `${__dirname}/../../node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
        light: `${__dirname}/../../node_modules/lato-font/fonts/lato-light/lato-light.woff`,
      },
    };

    // en10168Certificate.RefSchemaUrl = 'https://schemas.s1seven.com/en10168-schemas/v0.0.3-2/schema.json';
    const docDefinition: Partial<TDocumentDefinitions> = {
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

    const pdfDoc = await generatePdf(en10168Certificate, {
      docDefinition,
      outputType: 'stream',
      fonts,
      generatorPath,
      translations,
    });

    const outputFilePath = './en10168-test.pdf';
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
