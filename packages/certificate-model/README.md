# Schema-tools-certificate-model

[![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/@s1seven/schema-tools-certificate-model.svg?style=flat
[npm-url]: https://npmjs.org/package/@s1seven/schema-tools-certificate-model

The `certificate-model` module provides a class using template pattern to generate a class / instances based a given JSON schema.

## Install

```bash
npm install @s1seven/schema-tools-certificate-model
```

## Examples

The example uses the `CertificateModel` class in a function using `process.argv`.

First argument is the schema type, and the second argument is the version of the schema that should be loaded to create a classe extending `CertificateModel`.

```bash
node ./examples/certificate-model.js en10168-schemas v0.0.2
```

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build certificate-model` to build the library.

## Running unit tests

Run `nx test certificate-model` to execute the unit tests via [Jest](https://jestjs.io).
