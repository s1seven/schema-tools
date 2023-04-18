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
[html-to-pdfmake]: https://www.npmjs.com/package/html-to-pdfmake

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
import fs from 'fs';
import { createWriteStream } from 'fs';
import path from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { generatePdf, TDocumentDefinitions } from '../packages/generate-pdf/src';
import { fileExists, normalizePath } from './helpers';

const fonts = {
  Lato: {
    normal: './node_modules/lato-font/fonts/lato-normal/lato-normal.woff',
    bold: './node_modules/lato-font/fonts/lato-bold/lato-bold.woff',
    italics: './node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff',
    light: './node_modules/lato-font/fonts/lato-light/lato-light.woff',
  },
};

async function createPdf(options: {
  stylesPath: string;
  translationsPath: string;
  extraTranslationsPath: string | undefined;
  certificatePath: string;
  generatorPath: string;
  outputPath: string;
}) {
  const { stylesPath, translationsPath, extraTranslationsPath, certificatePath, generatorPath, outputPath } = options;
  const docDefinition: Omit<TDocumentDefinitions, 'content'> = {
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
    styles: JSON.parse(fs.readFileSync(stylesPath, 'utf8')),
  };

  const translations = fs.readFileSync(translationsPath, 'utf-8');
  const extraTranslations = extraTranslationsPath ? JSON.parse(fs.readFileSync(extraTranslationsPath, 'utf-8')) : {};

  const pdfDoc = await generatePdf(path.resolve(certificatePath), {
    docDefinition,
    outputType: 'stream',
    fonts,
    translations: JSON.parse(translations),
    extraTranslations,
    generatorPath,
  });

  const writeStream = createWriteStream(outputPath);
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
}
```

### Overriding fonts

The font defaults to Lato, but this can be overridden by passing in a `languageFontMap` object to the options.

TODO: get example from `create-pdf-certificate.ts`

## Troubleshooting

### Dependencies

If the tests pass locally but fail in the CI, try updating the dependencies (including Ghostscript and GraphicsMagick). Ensure that the dependencies are the same locally as in the CI.

### Styles

The styles (specifically the margins) at `generate-coa-pdf-template/utils/styles.js` are slightly different from the styles in the `CoA-schemas` repo. This should be obvious when visually comparing the fixture with the PDF created by the final `should render PDF certificate using certificate object, local PDF generator script, styles and translations` test. If this is the case, run the `fixtures:pdf` command again, using the styles from `generate-coa-pdf-template/utils/styles.js`.
