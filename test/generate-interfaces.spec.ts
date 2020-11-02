import axios from 'axios';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { generate } from '../src/generate-interfaces';

const schemaPath = `https://schemas.en10204.io/en10168-schemas/v0.0.2-2/schema.json`;

describe('GenerateInterfaces', function () {
  this.timeout(4000);

  const certificate = readFileSync(
    `${__dirname}/../fixtures/EN10168/certificate.ts`,
    'utf-8'
  );

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
    expect(interfaces).to.be.equal(certificate);
  });

  it('should generate TS interfaces and types certificate using external schema (object) ', async () => {
    const { data: schema } = await axios.get(schemaPath, {
      responseType: 'json',
    });
    const interfaces = await generate(schema, null, generateOptions);
    expect(interfaces).to.be.equal(certificate);
  });
});
