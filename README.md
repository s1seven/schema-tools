# Schema-tools

This repository contains tools to validate and generate TS interfaces using your json-schema implementation.

## Install

```bash
npm install @s1seven/schema-tools
```

## Validate

The `validate` module is using [AJV] to validate your schemas residing in a specified folder against a specified JSON schema reference.

### Examples

The example wrap the validate module in a function using `process.argv`.

First argument is the schema path to compare with, the second argument is the folder path were resides your schemas to validate.

```bash
node ./examples/validate.js https://raw.githubusercontent.com/s1seven/schemas/main/EN10168-v1.0.schema.json ./fixtures/en10168
```

## Generate

The `generate` module is using [json-schema-to-typescript] to generate TS interfaces / types using a JSON / OpenAPI schema reference.

### Examples

The example wrap the generate module in a function using `process.argv`.

First argument is the schema path to generate from, the second argument is the filepath where interfaces will be saved.

```bash
node ./examples/generate.js https://raw.githubusercontent.com/s1seven/schemas/main/EN10168-v1.0.schema.json ./fixtures/en10168
```

[ajv]: https://www.npmjs.com/package/ajv
[json-schema-to-typescript]: https://www.npmjs.com/package/json-schema-to-typescript
