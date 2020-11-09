# Schema-tools-certificate-model

The `certificate-model` module provides a class using template pattern to generate a class / instances based a given JSON schema.

## Examples

The example uses the `CertificateModel` class in a function using `process.argv`.

First argument is the schema type, and the second argument is the version of the schema that should be loaded to create a classe extending `CertificateModel`.

```bash
node ./examples/certificate-model.js en10168-schemas v0.0.2
```
