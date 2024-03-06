/* eslint-disable @typescript-eslint/no-var-requires */
import { writeFile } from 'fs/promises';
import { readFileSync } from 'node:fs';
import { performance, PerformanceObserver } from 'node:perf_hooks';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { generatePdf } from './src/index';

const styles = require(`${__dirname}/../generate-en10168-pdf-template/utils/styles.js`);

const en10168Certificate = JSON.parse(
  readFileSync(`${__dirname}/../../fixtures/EN10168/v0.4.1/valid_cert.json`, 'utf-8'),
);
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/EN10168/v0.4.1/translations.json`, 'utf-8'));

const generatorPath = `${__dirname}/../../dist/packages/generate-en10168-pdf-template/generateContent.cjs`;

async function store(pdfDoc: Buffer) {
  const outputFilePath = './coa-test.pdf';
  await writeFile(outputFilePath, pdfDoc);
}

(async function () {
  const obs = new PerformanceObserver((items) => {
    for (const item of items.getEntries()) {
      // eslint-disable-next-line no-console
      console.log(item.name, { duration: item.duration, startTime: item.startTime });
    }
  });
  obs.observe({ entryTypes: ['function'] });

  const fonts = {
    NotoSans: {
      normal: `${__dirname}/../../fixtures/fonts/NotoSans-Regular.ttf`,
      bold: `${__dirname}/../../fixtures/fonts/NotoSans-Bold.ttf`,
      light: `${__dirname}/../../fixtures/fonts/NotoSans-Light.ttf`,
      italics: `${__dirname}/../../fixtures/fonts/NotoSans-Italic.ttf`,
    },
    NotoSansSC: {
      normal: `${__dirname}/../../fixtures/fonts/NotoSansSC-Regular.ttf`,
      bold: `${__dirname}/../../fixtures/fonts/NotoSansSC-Bold.ttf`,
      light: `${__dirname}/../../fixtures/fonts/NotoSansSC-Light.ttf`,
      italics: `${__dirname}/../../fixtures/fonts/NotoSansSC-Regular.ttf`, // SC doesn't have italic
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
      font: 'NotoSansSC',
      fontSize: 10,
    },
    styles,
  };

  try {
    const pdfDoc = await performance.timerify(generatePdf)(en10168Certificate, {
      docDefinition,
      fonts,
      generatorPath,
      translations,
    });

    await performance.timerify(store)(pdfDoc);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
})();
