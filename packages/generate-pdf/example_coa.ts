/* eslint-disable @typescript-eslint/no-var-requires */
import { writeFile } from 'fs/promises';
import { readFileSync } from 'node:fs';
import { performance, PerformanceObserver } from 'node:perf_hooks';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { generatePdf } from './src/index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require(`${__dirname}/../generate-coa-pdf-template/utils/styles.js`);

const CoACertificate = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/valid_cert_1.json`, 'utf-8'));
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/translations.json`, 'utf-8'));
const extraTranslations = JSON.parse(
  readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/extra_translations.json`, 'utf-8'),
);
const generatorPath = `${__dirname}/../../dist/packages/generate-coa-pdf-template/generateContent.cjs`;

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
      font: 'NotoSansSC',
      fontSize: 10,
    },
    styles,
  };

  try {
    const pdfDoc = await performance.timerify(generatePdf)(CoACertificate, {
      docDefinition,
      generatorPath,
      fonts,
      extraTranslations,
      translations,
      languageFontMap,
      attachCertificate: true,
      a3Compliant: true,
      title: 'coa-test.pdf',
    });
    await performance.timerify(store)(pdfDoc);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
})();
