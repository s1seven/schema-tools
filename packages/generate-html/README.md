# Schema-tools-generate-html

[![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/@s1seven/schema-tools-generate-html.svg?style=flat
[npm-url]: https://npmjs.org/package/@s1seven/schema-tools-generate-html

The `generate-html` module uses [handlebars] to generate HTML string using a JSON schema.

## Install

```bash
npm install @s1seven/schema-tools-generate-html
```

### Examples

The example wrap the `generateHtml` module in a function using `process.argv`.

First argument is the certificate path to generate from.

```bash
node ./example.js ../../fixtures/EN10168/v0.0.2/valid_en10168_test.json
```

[handlebars]: https://www.npmjs.com/package/handlebars

### Using partials

`generateHtml` has been updated to include support for handlebars partials.
A `partialsMap` can be passed in as a property on `GenerateHtmlOptions`.

For an example, look at the following example taken from `example_partial.js`.

```javascript
const html = await generateHtml(certificatePath, {
  translations,
  templatePath,
  templateType: 'hbs',
  partialsMap: {
    inspection: templatePartialPath,
  },
});
```

Any partials passed in will be retrieved and compiled. If no `partialsMap` is passed in, `getPartials` will attempt to use the `ref` URL to see if there is a `partials-map.json` file present.
Example:
If the following URL is present on a certificate:
`https://schemas.s1seven.com/en10168-schemas/v0.3.0/schema.json`
`getPartials` will check to see if the file `https://schemas.s1seven.com/en10168-schemas/v0.3.0/partials-map.json` exists. If not, it will fail silently and continue to generate the html file without partials. This is to maintain compatability with schemas that do not use partials.

## Debugging

Error logging has been implemented in `getPartials`. To see the errors, run your command with the environment variable `DEBUG=schema-tools-generate-html`.
