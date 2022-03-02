# Schema-tools

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Schema-tools CI](https://github.com/s1seven/schema-tools/actions/workflows/node.yml/badge.svg)](https://github.com/s1seven/schema-tools/actions/workflows/node.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=s1seven%3Aschema-tools&metric=alert_status&token=0a4150e61b1839bce6a382c9ca31f087ac30435a)](https://sonarcloud.io/dashboard?id=s1seven%3Aschema-tools)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs1seven%2Fschema-tools.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs1seven%2Fschema-tools?ref=badge_shield)

This repository contains a suite of components and modules to handle certificates and schemas.
The specification of these libraries can be found in [SEP](https://s1seven.github.io/SEP/schemas/).

## Supported Schemas

| Name                                                               | Version range |
| ------------------------------------------------------------------ | :-----------: |
| [EN10168](https://github.com/thematerials-network/EN10168-schemas) | 0.0.2 - 0.2.x |
| [E-CoC](https://github.com/thematerials-network/E-CoC-schemas)     | 0.0.2 - 1.0.0 |
| [CoA](https://github.com/thematerials-network/CoA-schemas)         | 0.0.3 - 0.1.x |
| [CDN](https://github.com/thematerials-network/CDN-schemas)         |      xx       |

## List of packages

- [Certificate-Model](https://github.com/s1seven/schema-tools/tree/master/packages/certificate-model#readme)
The certificate-model module provides a class using template pattern to generate a class / instances based a given JSON schema.

- [Extract-Emails](https://github.com/s1seven/schema-tools/tree/master/packages/extract-emails#readme)
This repository contains tools to extract emails from certificate(s).

- [Generate-HTML](https://github.com/s1seven/schema-tools/tree/master/packages/generate-html#readme)
The generate-html module is using handlebars and/or mjml to generate HTML string using a JSON schema.

- [Certificate-Summary](https://github.com/s1seven/schema-tools/blob/main/packages/certificate-summary/README.md)
Build certificate summary by retrieving general common properties.

- [Generate-CoA-PDF-Template](https://github.com/s1seven/schema-tools/blob/main/packages/generate-coa-pdf-template/README.md)
This package provides a minified script to be used in CoA-schemas specific verison release.

- [Generate-En10168-PDF-Template](https://github.com/s1seven/schema-tools/blob/main/packages/generate-en10168-pdf-template/README.md)
This package provides a minified script to be used in EN10168-schemas specific verison release. 

- [Versioning](https://github.com/s1seven/schema-tools/blob/main/packages/versioning/README.md)
Update all files containing versioning during release.

- [Generate-PDF](https://github.com/s1seven/schema-tools/tree/master/packages/generate-pdf#readme)
The generate-pdf module uses pdfmake to generate PDF buffer | stream from a certificate as JSON or HTML.

- [Generate-Interfaces](https://github.com/s1seven/schema-tools/tree/master/packages/generate-interfaces#readme)
The generate-interfaces module is using the json-schema-to-typescript package to generate TS interfaces and types using a JSON / OpenAPI schema.

- [Types](https://github.com/s1seven/schema-tools/tree/master/packages/types#readme)
Contains shared types. Uses duck typing / type guards for quick validation. To be updated every time the schema is updated.

- [Utils](https://github.com/s1seven/schema-tools/tree/master/packages/utils#readme)
internal utilities including caching.

- [Validate](https://github.com/s1seven/schema-tools/tree/master/packages/validate#readme)
Takes certificates as input and validates them by using downloaded json schema.

## Dependency graph

![dependency graph](./graph.png)

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs1seven%2Fschema-tools.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs1seven%2Fschema-tools?ref=badge_large)

## Contributing

When updating the schema, the tools need to be updated at the same time.

Process:
1. Update the schema in question
2. Check and update the types 
3. For a new Release Candidate, add a new fixture (used for testing)


## Starting out

To get started, run `npm install`, `npm run build` and `npm run bootstrap`