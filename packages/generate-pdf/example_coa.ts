import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { generatePdf } from './src/index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require(`${__dirname}/../generate-coa-pdf-template/utils/styles.js`);

const CoACertificate = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/valid_cert_1.json`, 'utf-8'));
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/translations.json`, 'utf-8'));
const extraTranslations = JSON.parse(
  readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/extra_translations.json`, 'utf-8'),
);
const generatorPath = '../generate-coa-pdf-template/dist/generateContent.cjs';

(async function () {
  try {
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

    const pdfDoc = await generatePdf(CoACertificate, {
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

    const outputFilePath = './coa-test.pdf';
    await writeFile(outputFilePath, pdfDoc);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
})();
