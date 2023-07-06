/* eslint-disable no-console */
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
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
    default: './readableSchema.json',
    describe: 'Path to write the dereferenced schema file',
    alias: 'w',
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
  try {
    const schema = dereference
      ? await $RefParser.dereference(resolve(schemaFilePath))
      : await $RefParser.bundle(resolve(schemaFilePath));
    writeFileSync(writeFilePath, JSON.stringify(schema, null, 2));
  } catch (err) {
    console.error(err);
  }
})();
