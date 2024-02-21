/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createWriteStream, readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { finished } from 'node:stream/promises';

import { generatePdf, TDocumentDefinitions } from './src/index';

const styles = require(`${__dirname}/../generate-coa-pdf-template/utils/styles.js`);

const CoACertificate = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/valid_cert_1.json`, 'utf-8'));
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/translations.json`, 'utf-8'));
const extraTranslations = JSON.parse(
  readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/extra_translations.json`, 'utf-8'),
);
const generatorPath = `${__dirname}/../../dist/packages/generate-coa-pdf-template/generateContent.cjs`;

async function store(pdfDoc: PDFKit.PDFDocument) {
  const outputFilePath = './coa-test.pdf';
  const writeStream = createWriteStream(outputFilePath);
  const stream = pdfDoc.pipe(writeStream);
  pdfDoc.end();
  await finished(stream);
}

(async function () {
  const obs = new PerformanceObserver((items) => {
    for (const item of items.getEntries()) {
      console.log(item.name, { duration: item.duration, startTime: item.startTime });
    }
  });
  obs.observe({ entryTypes: ['function'] });

  const fonts = {
    Lato: {
      normal: `${__dirname}/../../node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
      bold: `${__dirname}/../../node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
      italics: `${__dirname}/../../node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
      light: `${__dirname}/../../node_modules/lato-font/fonts/lato-light/lato-light.woff`,
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
  const docDefinition: Partial<TDocumentDefinitions> = {
    pageSize: 'A4',
    pageMargins: [20, 20, 20, 40],
    footer: (currentPage, pageCount) => ({
      style: 'footer',
      text: currentPage.toString() + ' / ' + pageCount,
      alignment: 'center',
    }),
    defaultStyle: {
      font: 'Lato',
      fontSize: 10,
    },
    styles,
  };

  try {
    const pdfDoc = await performance.timerify(generatePdf)(CoACertificate, {
      docDefinition,
      outputType: 'stream',
      generatorPath,
      fonts,
      extraTranslations,
      translations,
      languageFontMap,
    });

    await performance.timerify(store)(pdfDoc);
  } catch (error) {
    console.error(error.message);
  }
})();
