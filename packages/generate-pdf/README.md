# Schema-tools-generate-pdf

[![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/@s1seven/schema-tools-generate-pdf.svg?style=flat
[npm-url]: https://npmjs.org/package/@s1seven/schema-tools-generate-pdf

The `generate-pdf` module is using [pdfmake] to generate PDF buffer | stream from a certificate as JSON or HTML.

## Install

```bash
npm install @s1seven/schema-tools-generate-pdf
```

[pdfmake]: https://www.npmjs.com/package/pdfmake

## Using generate-pdf example

When using `generatePdf`, you can either pass in paths to local files or use remote versions.
Note that you must always pass in the filepath to the font files as seen below.

### Use remote options

```ts
const fonts = {
  Lato: {
    normal: './node_modules/lato-font/fonts/lato-normal/lato-normal.woff',
    bold: './node_modules/lato-font/fonts/lato-bold/lato-bold.woff',
    italics: './node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff',
    light: './node_modules/lato-font/fonts/lato-light/lato-light.woff',
  },
};
const generatePdfOptions = {
  outputType: 'stream',
  fonts,
};
const pdfDoc = await generatePdf(validCertificate, generatePdfOptions);
```

### Use local options

```ts
const { createWriteStream, readFileSync } = require('fs');
const { generatePdf } = require('@s1seven/schema-tools-generate-pdf');
const styles = require(`${__dirname}/../generate-coa-pdf-template/utils/styles.js`);

const CoACertificate = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/valid_cert.json`));
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/translations.json`));
const extraTranslations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/extra_translations.json`));
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

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 40],
      footer: (currentPage, pageCount) => ({
        text: currentPage.toString() + ' / ' + pageCount,
        style: 'footer',
        alignment: 'center',
      }),
      // The value of `defaultStyle.font` must be the same as one of the keys from `fonts`,
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
```

### Overriding fonts

The font defaults to Lato, but this can be overridden by passing in a `languageFontMap` object to the options.

```ts
const { createWriteStream, readFileSync } = require('fs');
const { generatePdf } = require('./dist/index');
const styles = require(`${__dirname}/../generate-coa-pdf-template/utils/styles.js`);

const CoACertificate = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/valid_cert.json`));
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/translations.json`));
const extraTranslations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/extra_translations.json`));
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
      NotoSansSC: {
        normal: `${__dirname}/../../fixtures/fonts/noto-sans-sc-chinese-simplified-300-normal.woff2`,
        bold: `${__dirname}/../../fixtures/fonts/noto-sans-sc-chinese-simplified-700-normal.woff2`,
        italics: `${__dirname}/../../fixtures/fonts/noto-sans-sc-chinese-simplified-300-normal.woff2`,
        light: `${__dirname}/../../fixtures/fonts/noto-sans-sc-chinese-simplified-100-normal.woff2`,
      },
    };

    // The value must be the same as one of the keys from `fonts`,
    // The key must be a supported language
    const languageFontMap = {
      CN: 'NotoSansSC',
    };

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 40],
      footer: (currentPage, pageCount) => ({
        text: currentPage.toString() + ' / ' + pageCount,
        style: 'footer',
        alignment: 'center',
      }),
      // The value of `defaultStyle.font` must be the same as one of the keys from `fonts`,
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
```

## Troubleshooting

### Dependencies

If the tests pass locally but fail in the CI, try updating the dependencies (including Ghostscript and GraphicsMagick). Ensure that the dependencies are the same locally as in the CI.

### Styles

The styles (specifically the margins) at `generate-coa-pdf-template/utils/styles.js` are slightly different from the styles in the `CoA-schemas` repo. This should be obvious when visually comparing the fixture with the PDF created by the final `should render PDF certificate using certificate object, local PDF generator script, styles and translations` test. If this is the case, run the `fixtures:pdf` command again, using the styles from `generate-coa-pdf-template/utils/styles.js`.
