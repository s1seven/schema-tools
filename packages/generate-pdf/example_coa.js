/* eslint-disable @typescript-eslint/no-var-requires */
const { createWriteStream, readFileSync } = require('fs');
const { generatePdf } = require('./dist/index');
const styles = require(`${__dirname}/../generate-coa-pdf-template/utils/styles.js`);

const CoACertificate = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/valid_cert_1.json`));
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/translations.json`));
const extraTranslations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/extra_translations.json`));
const generatorPath = '../generate-coa-pdf-template/dist/generateContent.cjs';

(async function () {
  try {
    const fonts = {
      Lato: {
        normal: `${__dirname}/node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
        bold: `${__dirname}/node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
        italics: `${__dirname}/node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
        light: `${__dirname}/node_modules/lato-font/fonts/lato-light/lato-light.woff`,
      },
      NotoSansSC: {
        normal: `${__dirname}/../../fixtures/fonts/noto-sans-sc-chinese-simplified-300-normal.woff2`,
        bold: `${__dirname}/../../fixtures/fonts/noto-sans-sc-chinese-simplified-700-normal.woff2`,
        italics: `${__dirname}/../../fixtures/fonts/noto-sans-sc-chinese-simplified-300-normal.woff2`,
        light: `${__dirname}/../../fixtures/fonts/noto-sans-sc-chinese-simplified-100-normal.woff2`,
      },
    };

    const languageFontMap = {
      CN: 'NotoSansSC',
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
      languageFontMap,
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
