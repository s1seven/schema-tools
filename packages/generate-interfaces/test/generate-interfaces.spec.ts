import axios from 'axios';
import { readFileSync } from 'fs';
import prettier from 'prettier';

import { SupportedSchemas } from '@s1seven/schema-tools-types';

import { generate } from '../src/index';

const loadCertificate = (filePath: string) => {
  const rawCertificate = readFileSync(filePath, 'utf-8');
  return prettier.format(rawCertificate, {
    parser: 'babel-ts',
  });
};

describe('GenerateInterfaces', function () {
  const testsMap = [
    {
      type: SupportedSchemas.EN10168,
      schemaPath: 'https://schemas.s1seven.com/en10168-schemas/v0.0.2/schema.json',
      version: 'v0.0.2',
      certificateInterfaces: loadCertificate(`${__dirname}/../../../fixtures/EN10168/v0.0.2/certificate.ts`),
    },
    {
      type: SupportedSchemas.EN10168,
      schemaPath: 'https://schemas.s1seven.com/en10168-schemas/v0.1.0/schema.json',
      version: 'v0.1.0',
      certificateInterfaces: loadCertificate(`${__dirname}/../../../fixtures/EN10168/v0.1.0/certificate.ts`),
    },
    {
      type: SupportedSchemas.EN10168,
      schemaPath: 'https://schemas.s1seven.com/en10168-schemas/v0.2.0/schema.json',
      version: 'v0.2.0',
      certificateInterfaces: loadCertificate(`${__dirname}/../../../fixtures/EN10168/v0.2.0/certificate.ts`),
    },
    {
      type: SupportedSchemas.EN10168,
      schemaPath: 'https://schemas.s1seven.com/en10168-schemas/v0.3.0/schema.json',
      version: 'v0.3.0',
      certificateInterfaces: loadCertificate(`${__dirname}/../../../fixtures/EN10168/v0.3.0/certificate.ts`),
    },
    {
      type: SupportedSchemas.ECOC,
      schemaPath: 'https://schemas.s1seven.com/e-coc-schemas/v1.0.0/schema.json',
      version: 'v1.0.0',
      certificateInterfaces: loadCertificate(`${__dirname}/../../../fixtures/E-CoC/v1.0.0/certificate.ts`),
    },
    {
      type: SupportedSchemas.COA,
      schemaPath: 'https://schemas.s1seven.com/coa-schemas/v0.0.4/schema.json',
      version: 'v0.0.4',
      certificateInterfaces: loadCertificate(`${__dirname}/../../../fixtures/CoA/v0.0.4/certificate.ts`),
    },
    {
      type: SupportedSchemas.COA,
      schemaPath: 'https://schemas.s1seven.com/coa-schemas/v0.1.0/schema.json',
      version: 'v0.1.0',
      certificateInterfaces: loadCertificate(`${__dirname}/../../../fixtures/CoA/v0.1.0/certificate.ts`),
    },
    {
      type: SupportedSchemas.COA,
      schemaPath: 'https://schemas.s1seven.com/coa-schemas/v0.2.0/schema.json',
      version: 'v0.2.0',
      certificateInterfaces: loadCertificate(`${__dirname}/../../../fixtures/CoA/v0.2.0/certificate.ts`),
    },
    // {
    //   type: SupportedSchemas.COA,
    //   schemaPath: 'https://schemas.s1seven.com/coa-schemas/v1.0.0/schema.json',
    //   version: 'v1.0.0',
    //   certificateInterfaces: loadCertificate(`${__dirname}/../../../fixtures/CoA/v1.0.0/certificate.ts`),
    // },
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
    const { certificateInterfaces, schemaPath, type, version } = testSuite;
    describe(`For ${type} - version ${version}`, () => {
      it('should generate TS interfaces and types certificate using external schema path (url)', async () => {
        const interfaces = await generate(schemaPath, null, generateOptions);
        const prettyInterfaces = prettier.format(interfaces, {
          parser: 'babel-ts',
        });
        expect(prettyInterfaces).toEqual(certificateInterfaces);
      }, 5000);

      it('should generate TS interfaces and types certificate using external schema (object) ', async () => {
        const { data: schema } = await axios.get(schemaPath, { responseType: 'json' });
        const interfaces = await generate(schema, null, generateOptions);
        const prettyInterfaces = prettier.format(interfaces, {
          parser: 'babel-ts',
        });
        expect(prettyInterfaces).toEqual(certificateInterfaces);
      }, 5000);
    });
  });
});
