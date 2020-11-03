# Schema-tools-generate-html

The `generate-html` module is using [handlebars] and/or [mjml] to generate HTML string using a JSON schema.

### Examples

The example wrap the `generateHtml` module in a function using `process.argv`.

First argument is the certificate path to generate from.

```bash
node ./examples/generate-html.js ../../fixtures/EN10168/valid_en10168_test.json
```

[handlebars]: https://www.npmjs.com/package/handlebars
[mjml]: https://www.npmjs.com/package/mjml
