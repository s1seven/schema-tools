import { expect } from 'chai';
import { readFile } from '../src/utils';
import { validate } from '../src/validate-schemas';

describe('ValidateSchema', function () {
  this.timeout(4000);

  describe('EN10168 types', () => {
    const validCertificatePath = `${__dirname}/../fixtures/EN10168/valid_cert.json`;
    const invalidCertificatePath = `${__dirname}/../fixtures/EN10168/invalid_cert.json`;

    it('should validate valid example certificate using certificate path (string)', async () => {
      expect(await validate(validCertificatePath)).to.deep.equal({});
    });

    it('should validate valid example certificate using certificate (object) ', async () => {
      const schema = JSON.parse(
        (await readFile(validCertificatePath, 'utf8')) as string
      );
      expect(await validate(schema)).to.deep.equal({});
    });

    it('should validate invalid example certificate using certificate path (string)', async () => {
      expect(await validate(invalidCertificatePath)).to.deep.equal({
        EN10168: [
          {
            path: 'invalid_cert.json.Certificate.ProductDescription.B02',
            root: 'EN10168',
            keyword: 'type',
            schemaPath: '#/properties/B02/type',
            expected: 'should be object',
          },
        ],
      });
    });

    it('should validate invalid example certificate using certificate (object)', async () => {
      const schema = JSON.parse(
        (await readFile(invalidCertificatePath, 'utf8')) as string
      );
      expect(await validate(schema)).to.deep.equal({
        ['v0.0.2-1']: [
          {
            path: 'schema.json.Certificate.ProductDescription.B02',
            root: 'v0.0.2-1',
            keyword: 'type',
            schemaPath: '#/properties/B02/type',
            expected: 'should be object',
          },
        ],
      });
    });
  });

  describe('E-CoC types', () => {
    const validCertificatePath = `${__dirname}/../fixtures/E-CoC/valid_cert.json`;
    const invalidCertificatePath = `${__dirname}/../fixtures/E-CoC/invalid_cert.json`;

    it('should validate valid example certificate using certificate path (string)', async () => {
      expect(await validate(validCertificatePath)).to.deep.equal({});
    });

    it('should validate invalid example certificate using certificate path (string)', async () => {
      expect(await validate(invalidCertificatePath)).to.deep.equal({
        ['E-CoC']: [
          {
            expected: 'should be equal to one of the allowed values',
            keyword: 'enum',
            path: 'invalid_cert.json.EcocData.DataLevel',
            root: 'E-CoC',
            schemaPath: '#/properties/DataLevel/enum',
          },
        ],
      });
    });
  });
});
