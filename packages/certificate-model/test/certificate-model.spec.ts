import { EN10168Schema, JSONSchema7 } from '@s1seven/schema-tools-types';
import { loadExternalFile } from '@s1seven/schema-tools-utils';
import { CertificateModel } from '../src/index';
import validEn10168Certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';
import invalidEN10168Certificate from '../../../fixtures/EN10168/v0.0.2/invalid_cert.json';
import validECoCCertificate from '../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json';
import invalidECoCCertificate from '../../../fixtures/E-CoC/v0.0.2-2/invalid_cert.json';

describe('CertificateModel', function () {
  it('should build and validate instance using schemaConfig EN10168 v0.0.2  when using valid certificate', async () => {
    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: 'v0.0.2',
        schemaType: 'en10168-schemas',
      },
    });

    const cert = new CertModel<EN10168Schema>(validEn10168Certificate);
    cert.on('ready', () => {
      const validation = cert.validate();
      const toJSON = cert.toJSON();
      expect(JSON.stringify(toJSON, null, 2)).toEqual(JSON.stringify(validEn10168Certificate, null, 2));
      expect(validation.valid).toEqual(true);
    });
  }, 6000);

  it('should build and validate instance using schema EN10168 v0.0.2 when using valid certificate', async () => {
    const schema = (await loadExternalFile(
      'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json',
      'json',
    )) as JSONSchema7;

    const cert = await CertificateModel.buildInstance({ schema }, validEn10168Certificate);
    cert.on('ready', () => {
      const validation = cert.validate();
      const toJSON = cert.toJSON();
      expect(JSON.stringify(toJSON, null, 2)).toEqual(JSON.stringify(validEn10168Certificate, null, 2));
      expect(validation.valid).toEqual(true);
    });
  }, 5000);

  it('should NOT build invalid instance using schemaConfig EN10168 v0.0.2 when using invalid certificate', async () => {
    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: 'v0.0.2',
        schemaType: 'en10168-schemas',
      },
    });

    const cert = new CertModel<EN10168Schema>(invalidEN10168Certificate);
    cert.on('error', (error) => {
      expect(error).toEqual(
        new Error(
          JSON.stringify(
            [
              {
                root: '',
                path: '.Certificate.ProductDescription.B02',
                keyword: 'type',
                schemaPath: '#/properties/B02/type',
                expected: 'should be object',
              },
            ],
            null,
            2,
          ),
        ),
      );
    });
  }, 5000);

  it('should NOT set invalid instance using schemaConfig EN10168 v0.0.2 when using invalid certificate', async () => {
    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: 'v0.0.2',
        schemaType: 'en10168-schemas',
      },
    });

    const cert = new CertModel<EN10168Schema>(validEn10168Certificate);
    await new Promise((resolve) => {
      cert.on('ready', () => resolve());
    });

    await expect(cert.set(invalidEN10168Certificate)).rejects.toThrow(
      JSON.stringify(
        [
          {
            root: '',
            path: '.Certificate.ProductDescription.B02',
            keyword: 'type',
            schemaPath: '#/properties/B02/type',
            expected: 'should be object',
          },
        ],
        null,
        2,
      ),
    );
  }, 5000);

  it('should build model using schema config E-CoC v0.0.2-2 when using valid certificate', async () => {
    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: 'v0.0.2-2',
        schemaType: 'e-coc-schemas',
      },
    });

    const cert = new CertModel<EN10168Schema>(validECoCCertificate);
    await new Promise((resolve) => {
      cert.on('ready', () => resolve());
    });

    const validation = cert.validate();
    const toJSON = cert.toJSON();
    expect(JSON.stringify(toJSON, null, 2)).toEqual(JSON.stringify(validECoCCertificate, null, 2));
    expect(validation.valid).toEqual(true);
  }, 5000);

  it('should NOT build model using schema config E-CoC v0.0.2-2 when using invalid certificate', async () => {
    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: 'v0.0.2-2',
        schemaType: 'e-coc-schemas',
      },
    });

    const cert = new CertModel<EN10168Schema>(invalidECoCCertificate);
    cert.on('error', (error) => {
      expect(error).toEqual(
        new Error(
          JSON.stringify(
            [
              {
                expected: 'should be equal to one of the allowed values',
                keyword: 'enum',
                path: '.EcocData.DataLevel',
                root: '',
                schemaPath: '#/properties/DataLevel/enum',
              },
            ],
            null,
            2,
          ),
        ),
      );
    });
  }, 5000);
});
