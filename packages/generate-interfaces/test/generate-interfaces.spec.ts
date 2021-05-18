import axios from 'axios';
import { readFileSync } from 'fs';
import { generate } from '../src/index';

const en10168chemaPath = 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';
const eCoCSchemaPath = 'https://schemas.en10204.io/e-coc-schemas/v0.0.2-2/schema.json';

describe('GenerateInterfaces', function () {
  const en10168Certificate = readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.0.2/certificate.ts`, 'utf-8');
  const eCoCCertificate = readFileSync(`${__dirname}/../../../fixtures/E-CoC/v0.0.2-2/certificate.ts`, 'utf-8');

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

  describe('For EN10168 schema', function () {
    it('should generate TS interfaces and types certificate using external schema path (url)', async () => {
      const interfaces = await generate(en10168chemaPath, null, generateOptions);
      expect(interfaces).toEqual(en10168Certificate);
    }, 5000);

    it('should generate TS interfaces and types certificate using external schema (object) ', async () => {
      const { data: schema } = await axios.get(en10168chemaPath, {
        responseType: 'json',
      });
      const interfaces = await generate(schema, null, generateOptions);
      expect(interfaces).toEqual(en10168Certificate);
    }, 5000);
  });

  describe('For E-CoC schema', function () {
    it('should generate TS interfaces and types certificate using external schema path (url)', async () => {
      const interfaces = await generate(eCoCSchemaPath, null, generateOptions);
      expect(interfaces).toEqual(eCoCCertificate);
    }, 5000);
  });
});
