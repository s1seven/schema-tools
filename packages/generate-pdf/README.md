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
  NotoSans: {
    normal: `${__dirname}/../../fixtures/fonts/NotoSans-Regular.ttf`,
    bold: `${__dirname}/../../fixtures/fonts/NotoSans-Bold.ttf`,
    light: `${__dirname}/../../fixtures/fonts/NotoSans-Light.ttf`,
    italics: `${__dirname}/../../fixtures/fonts/NotoSans-Italic.ttf`,
  },
};
const generatePdfOptions = {
  fonts,
};
const pdfDoc = await generatePdf(validCertificate, generatePdfOptions);
```

### Use local options

```ts
const { readFileSync } = require('fs');
const { generatePdf } = require('@s1seven/schema-tools-generate-pdf');
const styles = require(`${__dirname}/../generate-coa-pdf-template/utils/styles.js`);

const CoACertificate = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/valid_cert.json`));
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/translations.json`));
const extraTranslations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/extra_translations.json`));
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
        font: 'NotoSans',
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
    });

    const outputFilePath = './test.pdf';
    await writeFile(outputFilePath, pdfDoc);
  } catch (error) {
    console.error(error.message);
  }
})();
```

### Overriding fonts

The font defaults to NotoSans, but this can be overridden by passing in a `languageFontMap` object to the options.

```ts
const { readFileSync } = require('fs');
const { generatePdf } = require('./dist/index');
const styles = require(`${__dirname}/../generate-coa-pdf-template/utils/styles.js`);

const CoACertificate = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/valid_cert.json`));
const translations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/translations.json`));
const extraTranslations = JSON.parse(readFileSync(`${__dirname}/../../fixtures/CoA/v1.1.0/extra_translations.json`));
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
        font: 'NotoSans',
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
    });

    const outputFilePath = './test.pdf';
    await writeFile(outputFilePath, pdfDoc);
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
