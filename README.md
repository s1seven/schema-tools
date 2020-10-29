# Schema-tools

This repository contains tools to validate certificate(s), generate TS interfaces from a specified schema and generate HTML string from a certificate.

All the modules take as input a certificate path | url | object from which the `RefSchemaUrl` property will be resolved to fetch dependencies located `https://schemas.en10204.io/` such as schema reference, translations, templates ...

## Install

```bash
npm install @s1seven/schema-tools
```

## Validate

The `validate` module is using [AJV] to validate your certificate(s) residing in a specified folder | file | url or by using an JSONSchema or an array of JSONSchema.

### Examples

The example wrap the `validate` module in a function using `process.argv`.

The first argument is the folder path were resides your certificates to validate.

```bash
node ./examples/validate.js ./fixtures/en10168
```

## Generate TS Interfaces

The `generate` module is using [json-schema-to-typescript] to generate TS interfaces and types using a JSON / OpenAPI schema.

### Examples

The example wrap the `generate` module in a function using `process.argv`.

First argument is the schema url to generate from, the second argument is the filepath where interfaces will be saved.

```bash
node ./examples/generate-interfaces.js https://schemas.en10204.io/en10168-schemas/v0.0.2-2/schema.json ./certificate.ts
```

## Generate HTML

The `generateHtml` module is using [handlebars] and/or [mjml] to generate HTML string using a JSON schema.

### Examples

The example wrap the `generateHtml` module in a function using `process.argv`.

First argument is the certificate path to generate from.

```bash
node ./examples/generate-html.js ./fixtures/EN10168/valid_en10168_test.json
```

[ajv]: https://www.npmjs.com/package/ajv
[json-schema-to-typescript]: https://www.npmjs.com/package/json-schema-to-typescript
[handlebars]: https://www.npmjs.com/package/handlebars
[mjml]: https://www.npmjs.com/package/mjml
