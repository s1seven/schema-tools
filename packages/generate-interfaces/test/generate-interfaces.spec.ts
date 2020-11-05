import axios from 'axios';
import { readFileSync } from 'fs';
import { generate } from '../src/index';

const schemaPath = 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('GenerateInterfaces', function () {
  const certificate = readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.0.2/certificate.ts`, 'utf-8');

  const generateOptions = {
    bannerComment: '',
    style: {
      bracketSpacing: false,
      printWidth: 100,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      useTabs: false,
    },
  };

  it('should generate TS interfaces and types certificate using external schema path (url)', async () => {
    const interfaces = await generate(schemaPath, null, generateOptions);
    expect(interfaces).toEqual(certificate);
  }, 5000);

  it('should generate TS interfaces and types certificate using external schema (object) ', async () => {
    const { data: schema } = await axios.get(schemaPath, {
      responseType: 'json',
    });
    const interfaces = await generate(schema, null, generateOptions);
    expect(interfaces).toEqual(certificate);
  }, 5000);
});
