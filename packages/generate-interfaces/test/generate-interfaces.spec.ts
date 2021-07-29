import axios from 'axios';
import { generate } from '../src/index';
import { readFileSync } from 'fs';
import { SupportedSchemas } from '@s1seven/schema-tools-types';

describe('GenerateInterfaces', function () {
  const testsMap = [
    {
      type: SupportedSchemas.EN10168,
      schemaPath: 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json',
      version: 'v0.0.2',
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.0.2/certificate.ts`, 'utf-8'),
    },
    {
      type: SupportedSchemas.EN10168,
      schemaPath: 'https://schemas.en10204.io/en10168-schemas/v0.1.0/schema.json',
      version: 'v0.1.0',
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.1.0/certificate.ts`, 'utf-8'),
    },
    {
      type: SupportedSchemas.ECOC,
      schemaPath: 'https://schemas.en10204.io/e-coc-schemas/v0.0.2/schema.json',
      version: 'v0.0.2',
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/E-CoC/v0.0.2/certificate.ts`, 'utf-8'),
    },
    {
      type: SupportedSchemas.COA,
      schemaPath: 'https://schemas.en10204.io/coa-schemas/v0.0.2/schema.json',
      version: 'v0.0.2',
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/CoA/v0.0.2/certificate.ts`, 'utf-8'),
    },
  ];

  const generateOptions = {
    bannerComment: '',
    format: true,
    style: {
      bracketSpacing: false,
      printWidth: 100,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      useTabs: false,
    },
  };

  testsMap.forEach((testSuite) => {
    const { schemaInterface, schemaPath, type, version } = testSuite;
    describe(`For ${type} - version ${version}`, () => {
      it('should generate TS interfaces and types certificate using external schema path (url)', async () => {
        const interfaces = await generate(schemaPath, null, generateOptions);
        expect(interfaces).toEqual(schemaInterface);
      }, 5000);

      it('should generate TS interfaces and types certificate using external schema (object) ', async () => {
        const { data: schema } = await axios.get(schemaPath, { responseType: 'json' });
        const interfaces = await generate(schema, null, generateOptions);
        expect(interfaces).toEqual(schemaInterface);
      }, 5000);
    });
  });
});
