import { ECoCSchema, EN10168Schema, JSONSchema7, Schemas, SchemaTypes } from '@s1seven/schema-tools-types';
import { CertificateModel } from '../src/index';
import invalidECoCCertificate from '../../../fixtures/E-CoC/v0.0.2-2/invalid_cert.json';
import invalidEN10168Certificate from '../../../fixtures/EN10168/v0.0.2/invalid_cert.json';
import { loadExternalFile } from '@s1seven/schema-tools-utils';
import validECoCCertificate from '../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json';
import validEN10168Certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';

const mustBeObject = 'must be object';

describe('CertificateModel', function () {
  describe('EN10168', function () {
    const schemaType = 'en10168-schemas' as SchemaTypes;
    const version = 'v0.0.2';
    const schemaConfig = { version, schemaType };
    const validationErrors = [
      {
        root: '',
        path: '/Certificate/ProductDescription/B02',
        keyword: 'type',
        schemaPath: '#/properties/B02/type',
        expected: mustBeObject,
      },
      {
        root: '',
        path: '/Certificate/ProductDescription/B10',
        keyword: 'type',
        schemaPath: '#/definitions/Measurement/type',
        expected: mustBeObject,
      },
      {
        root: '',
        path: '/Certificate/ProductDescription/B12',
        keyword: 'type',
        schemaPath: '#/definitions/Measurement/type',
        expected: mustBeObject,
      },
    ];

    const testValidation = (cert: CertificateModel<Schemas>) => {
      const validation = cert.validate();
      const toJSON = cert.toJSON();
      expect(validation.valid).toEqual(true);
      expect(JSON.stringify(toJSON, null, 2)).toEqual(JSON.stringify(validEN10168Certificate, null, 2));
    };

    it('should build and validate instance using schemaConfig EN10168 v0.0.2  when using valid certificate', async () => {
      const CertModel = await CertificateModel.build({ schemaConfig });
      const cert = new CertModel<EN10168Schema>(validEN10168Certificate);
      cert.once('ready', () => {
        testValidation(cert);
      });
    }, 6000);

    it('should build and validate instance using schema EN10168 v0.0.2 when using valid certificate', async () => {
      const schema = (await loadExternalFile(
        'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json',
        'json',
      )) as JSONSchema7;
      const cert = await CertificateModel.buildInstance({ schema }, validEN10168Certificate);
      cert.once('ready', () => {
        testValidation(cert);
      });
    }, 6000);

    it('should return schema properties', async () => {
      const CertModel = await CertificateModel.build({ schemaConfig });
      const cert = new CertModel<EN10168Schema>(validEN10168Certificate);
      await new Promise((resolve) => {
        cert.on('ready', () => resolve(true));
      });
      const { schemaProperties } = cert;
      expect(schemaProperties).toHaveProperty('RefSchemaUrl');
      expect(schemaProperties).toHaveProperty('Certificate');
      expect(schemaProperties).toHaveProperty('DocumentMetadata');
    }, 8000);

    it('should NOT build invalid instance using schemaConfig EN10168 v0.0.2 when using invalid certificate', async () => {
      const expectedError = new Error(JSON.stringify(validationErrors, null, 2));
      const CertModel = await CertificateModel.build({ schemaConfig });
      const cert = new CertModel<EN10168Schema>(invalidEN10168Certificate);
      cert.on('error', (error) => {
        expect(error).toEqual(expectedError);
      });
    }, 6000);

    it('should NOT set invalid instance using schemaConfig EN10168 v0.0.2 when using invalid certificate', async () => {
      const expectedError = new Error(JSON.stringify(validationErrors, null, 2));
      const CertModel = await CertificateModel.build({ schemaConfig });
      const cert = new CertModel<EN10168Schema>(validEN10168Certificate);
      await new Promise((resolve, reject) => {
        cert.once('ready', () => resolve(true));
        cert.once('error', reject);
      });
      await expect(cert.set(invalidEN10168Certificate)).rejects.toThrow(expectedError);
    }, 6000);
  });

  describe.skip('E-CoC', function () {
    const schemaType = 'e-coc-schemas' as SchemaTypes;
    const version = 'v0.0.2-2';
    const schemaConfig = { version, schemaType };

    it('should build model using schema config E-CoC v0.0.2-2 when using valid certificate', async () => {
      const CertModel = await CertificateModel.build({ schemaConfig });
      const cert = new CertModel<ECoCSchema>(validECoCCertificate);
      await new Promise((resolve) => {
        cert.once('ready', () => resolve(true));
      });

      const validation = cert.validate();
      const toJSON = cert.toJSON();
      expect(JSON.stringify(toJSON, null, 2)).toEqual(JSON.stringify(validECoCCertificate, null, 2));
      expect(validation.valid).toEqual(true);
    }, 6000);

    it('should NOT build model using schema config E-CoC v0.0.2-2 when using invalid certificate', async () => {
      const CertModel = await CertificateModel.build({ schemaConfig });

      const cert = new CertModel<EN10168Schema>(invalidECoCCertificate);
      cert.on('error', (error) => {
        expect(error).toEqual(
          new Error(
            JSON.stringify(
              [
                {
                  root: '',
                  path: '/EcocData/DataLevel',
                  keyword: 'enum',
                  schemaPath: '#/properties/DataLevel/enum',
                  expected: 'must be equal to one of the allowed values',
                },
              ],
              null,
              2,
            ),
          ),
        );
      });
    }, 6000);
  });
});
