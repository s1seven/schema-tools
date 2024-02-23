/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { generatePdf } from './src/index';
const styles = require(`${__dirname}/../generate-en10168-pdf-template/utils/styles.js`);

const en10168Certificate = JSON.parse(
  readFileSync(`${__dirname}/../../fixtures/EN10168/v0.4.1/valid_cert.json`, 'utf-8'),
);
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/EN10168/v0.4.1/translations.json`, 'utf-8'));
const generatorPath = '../generate-en10168-pdf-template/dist/generateContent.cjs';

(async function () {
  try {
    const fonts = {
      NotoSans: {
        normal: `${__dirname}/../../fixtures/fonts/NotoSans-Regular.ttf`,
        bold: `${__dirname}/../../fixtures/fonts/NotoSans-Bold.ttf`,
        light: `${__dirname}/../../fixtures/fonts/NotoSans-Light.ttf`,
        italics: `${__dirname}/../../fixtures/fonts/NotoSans-Italic.ttf`,
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
        font: 'NotoSans',
        fontSize: 10,
      },
      styles,
    };

    const pdfDoc = await generatePdf(en10168Certificate, {
      docDefinition,
      fonts,
      generatorPath,
      translations,
    });

    const outputFilePath = './en10168-test.pdf';
    await writeFile(outputFilePath, pdfDoc);
  } catch (error) {
    console.error(error.message);
  }
})();
