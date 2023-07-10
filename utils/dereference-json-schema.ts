/* eslint-disable no-console */
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { writeFileSync } from 'fs';
import { parse, resolve } from 'path';
import yargs from 'yargs';

// e.g. npm run schema:dereference -- -p /Users/eamon/work/CoA-schemas/schema.json -d true

const argv = yargs
  .option('schemaFilePath', {
    type: 'string',
    demandOption: true,
    describe: 'Path to the schema file you wish to dereference',
    alias: 'p',
  })
  .option('writeFilePath', {
    type: 'string',
    describe: 'Path to write the dereferenced schema file, including filename',
    alias: 'w',
    coerce: (value) => {
      if (!value.endsWith('.json')) {
        throw new Error('writeFilePath must end with .json');
      }
      return value;
    },
  })
  .option('dereference', {
    type: 'boolean',
    default: false,
    describe: 'Whether to completely dereference the schema or just bundle all external references',
    alias: 'd',
  })
  .help()
  .alias('help', 'h')
  .parseSync();

const { schemaFilePath, writeFilePath, dereference } = argv;

(async () => {
  const fullSchemaPath = resolve(schemaFilePath);
  const defaultOutputFilename = 'readable-schema.json';
  const { dir } = parse(fullSchemaPath);
  const fullWritePath = writeFilePath ? resolve(writeFilePath) : resolve(dir, defaultOutputFilename);
  try {
    const schema = dereference
      ? await $RefParser.dereference(resolve(schemaFilePath))
      : await $RefParser.bundle(resolve(schemaFilePath));
    writeFileSync(fullWritePath, JSON.stringify(schema, null, 2));
  } catch (err) {
    console.error(err);
  }
})();
