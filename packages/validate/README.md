# Schema-tools-validate

[![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/@s1seven/schema-tools-validate.svg?style=flat
[npm-url]: https://npmjs.org/package/@s1seven/schema-tools-validate

This repository contains tools to validate certificate(s).

The `validate` module is using [AJV] to validate your certificate(s), it takes as input a certificate path | url | object | object[] from which the `RefSchemaUrl` property will be resolved to fetch dependencies located `https://schemas.s1seven.com/` such as schema reference, translations, templates ...

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

## Debugging

Error logging has been implemented in `loadLocalCertificates`. To see the errors, run your command with the environment variable `DEBUG=schema-tools-validate`.

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build validate` to build the library.

## Running unit tests

Run `nx test validate` to execute the unit tests via [Jest](https://jestjs.io).
