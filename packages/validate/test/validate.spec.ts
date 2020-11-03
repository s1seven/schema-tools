import { readFileSync } from 'fs';
import { validate } from '../src/index';

describe('ValidateSchema', function () {
  describe('EN10168 types', () => {
    const validCertificatePath = `${__dirname}/../../../fixtures/EN10168/valid_cert.json`;
    const invalidCertificatePath = `${__dirname}/../../../fixtures/EN10168/invalid_cert.json`;

    it('should validate valid example certificate using certificate path (string)', async () => {
      expect(await validate(validCertificatePath)).toEqual({});
    }, 3000);

    it('should validate valid example certificate using certificate (object) ', async () => {
      const schema = JSON.parse(readFileSync(validCertificatePath, 'utf8') as string);
      expect(await validate(schema)).toEqual({});
    }, 3000);

    it('should validate invalid example certificate using certificate path (string)', async () => {
      expect(await validate(invalidCertificatePath)).toEqual({
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
    }, 3000);

    it('should validate invalid example certificate using certificate (object)', async () => {
      const schema = JSON.parse(readFileSync(invalidCertificatePath, 'utf8') as string);
      expect(await validate(schema)).toEqual({
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
    }, 3000);
  });

  describe('E-CoC types', () => {
    const validCertificatePath = `${__dirname}/../../../fixtures/E-CoC/valid_cert.json`;
    const invalidCertificatePath = `${__dirname}/../../../fixtures/E-CoC/invalid_cert.json`;

    it('should validate valid example certificate using certificate path (string)', async () => {
      expect(await validate(validCertificatePath)).toEqual({});
      // await expect(generate(invalidTestFile, interfaceFilePath)).rejects.toThrow(`ENOENT: no such file or directory, open '${invalidTestFile}'`);
      // expect(() => {
      //   const loggerWithErr = new WinstonLoggerService({
      //     projectName: '',
      //   });
      //   expect(loggerWithErr).toBeUndefined();
      // }).toThrowError('projectName is required');
    }, 3000);

    it('should validate invalid example certificate using certificate path (string)', async () => {
      expect(await validate(invalidCertificatePath)).toEqual({
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
    }, 3000);
  });
});
