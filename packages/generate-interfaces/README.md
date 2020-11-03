# Schema-tools-generate-interfaces

The `generate-interfaces` module is using [json-schema-to-typescript] to generate TS interfaces and types using a JSON / OpenAPI schema.

### Examples

The example wrap the `generate` module in a function using `process.argv`.

First argument is the schema url to generate from, the second argument is the filepath where interfaces will be saved.

```bash
node ./examples/generate-interfaces.js https://schemas.en10204.io/en10168-schemas/v0.0.2-2/schema.json ./certificate.ts
```

[json-schema-to-typescript]: https://www.npmjs.com/package/json-schema-to-typescript
