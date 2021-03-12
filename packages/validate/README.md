# Schema-tools-validate

[![npm][npm-image]][npm-url] 

[npm-image]: https://img.shields.io/npm/v/@s1seven/schema-tools-validate.svg?style=flat
[npm-url]: https://npmjs.org/package/@s1seven/schema-tools-validate

This repository contains tools to validate certificate(s).

The `validate` module is using [AJV] to validate your certificate(s), it takes as input a certificate path | url | object | object[] from which the `RefSchemaUrl` property will be resolved to fetch dependencies located `https://schemas.en10204.io/` such as schema reference, translations, templates ...

## Install

```bash
npm install @s1seven/schema-tools-validate
```

### Examples

The example wrap the `validate` module in a function using `process.argv`.

The first argument is the folder path were resides your certificates to validate.

```bash
node ./examples/validate.js ./fixtures/en10168
```

[ajv]: https://www.npmjs.com/package/ajv
[json-schema-to-typescript]: https://www.npmjs.com/package/json-schema-to-typescript
