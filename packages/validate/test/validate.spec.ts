/* eslint-disable @typescript-eslint/no-var-requires */
import { SupportedSchemas } from '../../types/src';
import { validate } from '../src/index';

const typeLiteral = 'type';
const mustBeObjectLiteral = 'must be object';
const measurmentSchemaPath = '#/definitions/Measurement/type';

describe('ValidateSchema', function () {
  const validCertificatePath = (folderPath: string) =>
    process.env.IS_BROWSER_ENV ? `${folderPath}/valid_cert.json` : `${__dirname}/${folderPath}/valid_cert.json`;
  const invalidCertificatePath = (folderPath: string) =>
    process.env.IS_BROWSER_ENV ? `${folderPath}/invalid_cert.json` : `${__dirname}/${folderPath}/invalid_cert.json`;

  const testsMap = [
    {
      type: SupportedSchemas.EN10168,
      fixturesPath: '../../../fixtures/EN10168',
      version: 'v0.0.2',
      validCertificate: require('../../../fixtures/EN10168/v0.0.2/valid_cert.json'),
      invalidCertificate: require('../../../fixtures/EN10168/v0.0.2/invalid_cert.json'),
      validationErrors: (basePath: string, certVersion: string) => ({
        [certVersion]: [
          {
            root: certVersion,
            path: `${basePath}/Certificate/ProductDescription/B02`,
            keyword: typeLiteral,
            schemaPath: '#/properties/B02/type',
            expected: mustBeObjectLiteral,
          },
          {
            root: certVersion,
            path: `${basePath}/Certificate/ProductDescription/B10`,
            keyword: typeLiteral,
            schemaPath: measurmentSchemaPath,
            expected: mustBeObjectLiteral,
          },
          {
            root: certVersion,
            path: `${basePath}/Certificate/ProductDescription/B12`,
            keyword: typeLiteral,
            schemaPath: measurmentSchemaPath,
            expected: mustBeObjectLiteral,
          },
        ],
      }),
    },
    // {
    //   type: SupportedSchemas.ECOC,
    //   fixturesPath: '../../../fixtures/E-CoC',
    //   version: 'v0.0.2-2',
    //   validCertificate: require('../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json'),
    //   invalidCertificate: require('../../../fixtures/E-CoC/v0.0.2-2/invalid_cert.json'),
    //   validationErrors: (basePath: string, certVersion: string) => ({
    //     [certVersion]: [
    //       {
    //         expected: 'must be equal to one of the allowed values',
    //         keyword: 'enum',
    //         path: `${basePath}/EcocData/DataLevel`,
    //         root: certVersion,
    //         schemaPath: '#/properties/DataLevel/enum',
    //       },
    //     ],
    //   }),
    // },
    // {
    //   type: SupportedSchemas.COA,
    //   fixturesPath: '../../../fixtures/CoA',
    //   version: 'v0.0.2-1',
    //   validCertificate: require('../../../fixtures/CoA/v0.0.2-1/valid_cert.json'),
    //   invalidCertificate: require('../../../fixtures/CoA/v0.0.2-1/invalid_cert.json'),
    //   validationErrors: (basePath: string, certVersion: string) => ({
    //     [certVersion]: [
    //       {
    //         root: certVersion,
    //         path: `${basePath}/Certificate`,
    //         keyword: 'required',
    //         schemaPath: '#/properties/Certificate/required',
    //         expected: `must have required property 'CertificateLanguages'`, // eslint-disable-line
    //       },
    //       {
    //         root: certVersion,
    //         path: `${basePath}/Certificate/Date`,
    //         keyword: 'format',
    //         schemaPath: '#/properties/Certificate/properties/Date/format',
    //         expected: 'must match format "date"',
    //       },
    //       {
    //         root: certVersion,
    //         path: `${basePath}/Certificate/BusinessReferences/Order/Number`,
    //         keyword: 'type',
    //         schemaPath: '#/definitions/BusinessReferences/properties/Order/properties/Number/type',
    //         expected: 'must be string',
    //       },
    //     ],
    //   }),
    // },
  ];

  testsMap.forEach((testSuite) => {
    describe(testSuite.type, () => {
      const folderPath = `${testSuite.fixturesPath}/${testSuite.version}`;

      it('should validate valid certificate using certificate (object) ', async () => {
        const certificate = testSuite.validCertificate;
        const errors = await validate(certificate);
        expect(errors).toBeNull();
      });

      it('should validate invalid certificate using certificate (object)', async () => {
        const certificate = testSuite.invalidCertificate;
        const expectedErrors = testSuite.validationErrors('schema.json', testSuite.version);
        //
        const errors = await validate(certificate);
        expect(errors).toEqual(expectedErrors);
      });

      it('should validate invalid and valid certificate by providing them in an array', async () => {
        const validCertificate = testSuite.validCertificate;
        const invalidCertificate = testSuite.invalidCertificate;
        const expectedErrors = testSuite.validationErrors('schema.json', testSuite.version);
        //
        const errors = await validate([validCertificate, invalidCertificate]);
        expect(errors).toEqual(expectedErrors);
      });

      if (!process.env.IS_BROWSER_ENV) {
        it('should validate valid certificate using certificate path (string)', async () => {
          const errors = await validate(validCertificatePath(folderPath));
          expect(errors).toBeNull();
        });

        it('should validate invalid certificate using certificate path (string)', async () => {
          const expectedErrors = testSuite.validationErrors('invalid_cert.json', testSuite.version);
          //
          const errors = await validate(invalidCertificatePath(folderPath));
          expect(errors).toEqual(expectedErrors);
        });

        it('should validate invalid and valid certificate by providing container folders path', async () => {
          const expectedErrors = testSuite.validationErrors('invalid_cert.json', testSuite.version);
          //
          const errors = await validate(`${__dirname}/${folderPath}`, {
            ignoredExts: ['html', 'ts', 'js', 'md'],
            ignoredPaths: ['translations.json'],
          });
          expect(errors).toEqual(expectedErrors);
        });
      }
    });
  });
});
