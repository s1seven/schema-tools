# Schema-tools-generate-html

[![npm][npm-image]][npm-url] 

[npm-image]: https://img.shields.io/npm/v/@s1seven/schema-tools-generate-html.svg?style=flat
[npm-url]: https://npmjs.org/package/@s1seven/schema-tools-generate-html

The `generate-html` module is using [handlebars] and/or [mjml] to generate HTML string using a JSON schema.

## Install

```bash
npm install @s1seven/schema-tools-generate-html
```

### Examples

The example wrap the `generateHtml` module in a function using `process.argv`.

First argument is the certificate path to generate from.

```bash
node ./examples/generate-html.js ../../fixtures/EN10168/v0.0.2/valid_en10168_test.json
```

[handlebars]: https://www.npmjs.com/package/handlebars
[mjml]: https://www.npmjs.com/package/mjml
