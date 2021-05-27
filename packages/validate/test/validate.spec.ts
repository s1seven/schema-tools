/* eslint-disable @typescript-eslint/no-var-requires */
import { readFileSync } from 'fs';
import { validate } from '../src/index';

const certVersion = 'v0.0.2';
const typeLiteral = 'type';
const mustBeObjectLiteral = 'must be object';
const schemaPath = '#/definitions/Measurement/type';

const certificateFoldersPath = `${__dirname}/../../../fixtures/EN10168/v0.0.2`;
const validCertificatePath = `${certificateFoldersPath}/valid_cert.json`;
const invalidCertificatePath = `${certificateFoldersPath}/invalid_cert.json`;
const invalidCert = require('../../../fixtures/EN10168/v0.0.2/invalid_cert.json');
const validCert = require('../../../fixtures/EN10168/v0.0.2/valid_cert.json');
const invalidCertsValidationResponse = {
  [certVersion]: [
    {
      root: certVersion,
      path: 'invalid_cert.json/Certificate/ProductDescription/B02',
      keyword: typeLiteral,
      schemaPath: '#/properties/B02/type',
      expected: mustBeObjectLiteral,
    },
    {
      root: certVersion,
      path: 'invalid_cert.json/Certificate/ProductDescription/B10',
      keyword: typeLiteral,
      schemaPath: schemaPath,
      expected: mustBeObjectLiteral,
    },
    {
      root: certVersion,
      path: 'invalid_cert.json/Certificate/ProductDescription/B12',
      keyword: typeLiteral,
      schemaPath: schemaPath,
      expected: mustBeObjectLiteral,
    },
  ],
};

const invalidCertResponseByRefSchemaUrl = {
  ['v0.0.2']: [
    {
      path: 'schema.json/Certificate/ProductDescription/B02',
      root: 'v0.0.2',
      keyword: typeLiteral,
      schemaPath: '#/properties/B02/type',
      expected: mustBeObjectLiteral,
    },
    {
      expected: mustBeObjectLiteral,
      keyword: typeLiteral,
      path: 'schema.json/Certificate/ProductDescription/B10',
      root: 'v0.0.2',
      schemaPath: schemaPath,
    },
    {
      expected: mustBeObjectLiteral,
      keyword: typeLiteral,
      path: 'schema.json/Certificate/ProductDescription/B12',
      root: 'v0.0.2',
      schemaPath: schemaPath,
    },
  ],
};

browserTests();
if (!process.env.IS_BROWSER_ENV) {
  serverSideTests();
}

function browserTests() {
  describe('ValidateSchema', function () {
    describe('EN10168 types', () => {
      it('Should validate valid example certificate', async () => {
        expect(await validate(validCert)).toEqual({});
      });
      it('Should validate valid invalid certificate', async () => {
        expect(await validate(invalidCert)).toEqual(invalidCertResponseByRefSchemaUrl);
      });
    });
  });
}

function serverSideTests() {
  describe('ValidateSchema', function () {
    describe('EN10168 types', () => {
      it('should validate valid example certificate using certificate path (string)', async () => {
        expect(await validate(validCertificatePath)).toEqual({});
      }, 5000);

      it('should validate valid example certificate using certificate (object) ', async () => {
        const schema = JSON.parse(readFileSync(validCertificatePath, 'utf8') as string);
        expect(await validate(schema)).toEqual({});
      }, 5000);

      it('should validate invalid example certificate using certificate path (string)', async () => {
        expect(await validate(invalidCertificatePath)).toEqual(invalidCertsValidationResponse);
      }, 5000);

      it('should validate invalid example certificate using certificate (object)', async () => {
        const schema = JSON.parse(readFileSync(invalidCertificatePath, 'utf8') as string);
        expect(await validate(schema)).toEqual(invalidCertResponseByRefSchemaUrl);
      }, 5000);

      it('should validate invalid and valid example certificate by providing container folders path', async () => {
        const validationResults = await validate(certificateFoldersPath, {
          ignoredExts: ['html', 'ts', 'js', 'md'],
        });

        expect(validationResults).toEqual(invalidCertsValidationResponse);
      }, 5000);

      it('should validate invalid and valid example certificate by providing them in an array', async () => {
        const invalidSchema = JSON.parse(readFileSync(invalidCertificatePath, 'utf8') as string);
        const validSchema = JSON.parse(readFileSync(validCertificatePath, 'utf8') as string);
        expect(await validate([validSchema, invalidSchema])).toEqual(invalidCertResponseByRefSchemaUrl);
      }, 5000);
    });

    describe('E-CoC types', () => {
      const validCertificatePath = `${__dirname}/../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json`;
      const invalidCertificatePath = `${__dirname}/../../../fixtures/E-CoC/v0.0.2-2/invalid_cert.json`;

      it('should validate valid example certificate using certificate path (string)', async () => {
        expect(await validate(validCertificatePath)).toEqual({});
      }, 5000);

      it('should validate invalid example certificate using certificate path (string)', async () => {
        expect(await validate(invalidCertificatePath)).toEqual({
          ['v0.0.2-2']: [
            {
              expected: 'must be equal to one of the allowed values',
              keyword: 'enum',
              path: 'invalid_cert.json/EcocData/DataLevel',
              root: 'v0.0.2-2',
              schemaPath: '#/properties/DataLevel/enum',
            },
          ],
        });
      }, 5000);
    });
  });
}
