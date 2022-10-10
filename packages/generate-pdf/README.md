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

## Troubleshooting

### Dependencies

If the tests pass locally but fail in the CI, try updating the dependencies (including Ghostscript and GraphicsMagick). Ensure that the dependencies are the same locally as in the CI.

### Styles

The styles (specifically the margins) at `generate-coa-pdf-template/utils/styles.js` are slightly different from the styles in the `CoA-schemas` repo. This should be obvious when visually comparing the fixture with the PDF created by the final `should render PDF certificate using certificate object, local PDF generator script, styles and translations` test. If this is the case, run the `fixtures:pdf` command again, using the styles from `generate-coa-pdf-template/utils/styles.js`.
