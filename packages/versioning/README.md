# `versioning`

The `SchemaRepositoryVersion` class is used to update schemas and fixtures in schema repostories.

It can be required and invoked as follows:

```javascript
const { SchemaRepositoryVersion } = require('@s1seven/schema-tools-versioning');

const defaultServerUrl = 'https://schemas.s1seven.com/en10168-schemas';
const schemaFilePaths = [{ filePath: 'schema.json', properties: [{ path: '$id', value: 'schema.json' }] }]; // the value will be passed to buildRefSchemaUrl when setting $id

const updater = new SchemaRepositoryVersion(
  defaultServerUrl,
  schemaFilePaths,
  version, // new version number to be applied
  translationsObject,
  extraTranslationsObject,
  'schema.json', // this value is used as the default value by buildRefSchemaUrl, for example, by updateJsonFixturesVersion
);
```

`SchemaRepositoryVersion` contains several methods, such as `updateSchemasVersion` which updates the `$id` in the schemas in the repository on which it is used.
The `updateJsonFixturesVersion` method updates the `RefSchemaUrl` in the sammple certificates in `test/fixtures`.

## Usage

```
const versioning = require('versioning');

// TODO: DEMONSTRATE API
```
