import { expect } from 'chai';
import { JSONSchema } from 'json-schema-to-typescript';
import { EN10168Schema, loadExternalFile } from '../src';
import { CertificateModel } from '../src/certificate-model';
import validEn10168Certificate from '../fixtures/EN10168/valid_cert.json';
import invalidEN10168Certificate from '../fixtures/EN10168/invalid_cert.json';
import invalidECoCCertificate from '../fixtures/E-CoC/valid_cert.json';

describe('BuilModel', function () {
  this.timeout(4000);

  it('should build and validate instance using schemaConfig EN10168 v0.0.2-2', async () => {
    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: 'v0.0.2-2',
        schemaType: 'en10168-schemas',
      },
    });

    const cert = new CertModel<EN10168Schema>(validEn10168Certificate);

    const validation = cert.validate();
    const toJSON = cert.toJSON();
    expect(JSON.stringify(toJSON, null, 2)).to.be.equal(
      JSON.stringify(validEn10168Certificate, null, 2)
    );
    expect(validation.valid).to.be.equal(true);
  });

  it('should build and validate instance using schema EN10168 v0.0.2-2', async () => {
    const schema = (await loadExternalFile(
      'https://schemas.en10204.io/en10168-schemas/v0.0.2-2/schema.json',
      'json'
    )) as JSONSchema;

    const cert = await CertificateModel.buildInstance(
      { schema },
      validEn10168Certificate
    );

    const validation = cert.validate();
    const toJSON = cert.toJSON();
    expect(JSON.stringify(toJSON, null, 2)).to.be.equal(
      JSON.stringify(validEn10168Certificate, null, 2)
    );
    expect(validation.valid).to.be.equal(true);
  });

  it('should not build invalid instance using schemaConfig EN10168 v0.0.2-2', async () => {
    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: 'v0.0.2-2',
        schemaType: 'en10168-schemas',
      },
    });

    expect(() => {
      new CertModel<EN10168Schema>(invalidEN10168Certificate);
    }).to.throw(
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
        2
      )
    );
  });

  // TODO: fix $ref resolution for https://e-coc.org/schema/v1.0.0/MaterialCertification.json#/definitions/MaterialTest
  it.skip('should build model using schema config E-CoC v0.0.2', async () => {
    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: 'v0.0.2-0',
        schemaType: 'e-coc-schemas',
      },
    });

    const cert = new CertModel<EN10168Schema>(invalidECoCCertificate);

    const validation = cert.validate();
    const toJSON = cert.toJSON();
    expect(JSON.stringify(toJSON, null, 2)).to.be.equal(
      JSON.stringify(invalidECoCCertificate, null, 2)
    );
    expect(validation.valid).to.be.equal(true);
  });
});
