# Schema-tools-generate-interfaces

[![npm][npm-image]][npm-url] 

[npm-image]: https://img.shields.io/npm/v/@s1seven/schema-tools-generate-interfaces.svg?style=flat
[npm-url]: https://npmjs.org/package/@s1seven/schema-tools-generate-interfaces

The `generate-interfaces` module is using [json-schema-to-typescript] to generate TS interfaces and types using a JSON / OpenAPI schema.

## Install

```bash
npm install @s1seven/schema-tools-generate-interfaces
```

### Examples

The example wrap the `generate` module in a function using `process.argv`.

First argument is the schema url to generate from, the second argument is the filepath where interfaces will be saved.

```bash
node ./examples/generate-interfaces.js https://schemas.s1seven.com/en10168-schemas/v0.0.2/schema.json ./certificate.ts
```

[json-schema-to-typescript]: https://www.npmjs.com/package/json-schema-to-typescript
