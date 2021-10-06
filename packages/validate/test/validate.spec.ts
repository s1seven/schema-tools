/* eslint-disable @typescript-eslint/no-var-requires */
import { SupportedSchemas } from '@s1seven/schema-tools-types';
import { validate } from '../src/index';

const typeLiteral = 'type';
const mustBeObjectLiteral = 'must be object';
const mustBeEnum = 'must be equal to one of the allowed values';
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
    {
      type: SupportedSchemas.EN10168,
      fixturesPath: '../../../fixtures/EN10168',
      version: 'v0.1.0',
      validCertificate: require('../../../fixtures/EN10168/v0.1.0/valid_cert.json'),
      invalidCertificate: require('../../../fixtures/EN10168/v0.1.0/invalid_cert.json'),
      validationErrors: (basePath: string, certVersion: string) => ({
        [certVersion]: [
          {
            expected: mustBeEnum,
            keyword: 'enum',
            path: `${basePath}/DocumentMetadata/state`,
            root: 'v0.1.0',
            schemaPath: '#/properties/DocumentMetadata/properties/state/enum',
          },
          {
            expected: "must have required property 'CertificateLanguages'",
            keyword: 'required',
            path: `${basePath}/Certificate`,
            root: certVersion,
            schemaPath: '#/properties/Certificate/required',
          },
          {
            expected: "must have required property 'VAT_Id'",
            keyword: 'required',
            path: `${basePath}/Certificate/CommercialTransaction/A01`,
            root: certVersion,
            schemaPath: '#/definitions/Company/required',
          },
          {
            expected: "must have required property 'B10'",
            keyword: 'required',
            path: `${basePath}/Certificate/ProductDescription`,
            root: certVersion,
            schemaPath: '#/required',
          },
          {
            expected: "must have required property 'Symbol'",
            keyword: 'required',
            path: `${basePath}/Certificate/Inspection/ChemicalComposition/C71`,
            root: certVersion,
            schemaPath: '#/definitions/ChemicalElement/required',
          },
        ],
      }),
    },
    {
      type: SupportedSchemas.ECOC,
      fixturesPath: '../../../fixtures/E-CoC',
      version: 'v0.0.2',
      validCertificate: require('../../../fixtures/E-CoC/v0.0.2/valid_cert.json'),
      invalidCertificate: require('../../../fixtures/E-CoC/v0.0.2/invalid_cert.json'),
      validationErrors: (basePath: string, certVersion: string) => ({
        [certVersion]: [
          {
            expected: "must have required property 'Results'",
            keyword: 'required',
            path: `${basePath}/EcocData`,
            root: certVersion,
            schemaPath: '#/properties/EcocData/oneOf/2/required',
          },
          {
            expected: "must have required property 'CountryCode'",
            keyword: 'required',
            path: `${basePath}/EcocData/Data/Parties/0/PartyAddress`,
            root: certVersion,
            schemaPath: '#/definitions/Address/required',
          },
          {
            expected: mustBeEnum,
            keyword: 'enum',
            path: `${basePath}/EcocData/Data/Parties/1/PartyIdentifier/0/NameOfIdentifier`,
            root: certVersion,
            schemaPath: '#/definitions/CompanyIdentifier/properties/NameOfIdentifier/enum',
          },
          {
            expected: mustBeEnum,
            keyword: 'enum',
            path: `${basePath}/EcocData/Data/Parties/1/PartyRole`,
            root: certVersion,
            schemaPath: '#/definitions/PartyRole/enum',
          },
        ],
      }),
    },
    {
      type: SupportedSchemas.COA,
      fixturesPath: '../../../fixtures/CoA',
      version: 'v0.0.4',
      validCertificate: require('../../../fixtures/CoA/v0.0.4/valid_cert.json'),
      invalidCertificate: require('../../../fixtures/CoA/v0.0.4/invalid_cert.json'),
      validationErrors: (basePath: string, certVersion: string) => ({
        [certVersion]: [
          {
            expected: "must have required property 'Name'",
            keyword: 'required',
            path: `${basePath}/Certificate/Parties/Manufacturer`,
            root: certVersion,
            schemaPath: '#/required',
          },
          {
            expected: "must have required property 'VAT'",
            keyword: 'required',
            path: `${basePath}/Certificate/Parties/Manufacturer/Identifier`,
            root: certVersion,
            schemaPath: '#/definitions/Identifier/required',
          },
          {
            expected: 'must match format "date"',
            keyword: 'format',
            path: `${basePath}/Certificate/BusinessTransaction/OrderConfirmation/Date`,
            root: certVersion,
            schemaPath: '#/definitions/BusinessTransaction/properties/OrderConfirmation/properties/Date/format',
          },
          {
            expected: 'must be string',
            keyword: 'type',
            path: `${basePath}/Certificate/BusinessTransaction/Delivery/Number`,
            root: certVersion,
            schemaPath: '#/definitions/BusinessTransaction/properties/Delivery/properties/Number/type',
          },
          {
            expected: "must have required property 'Property'",
            keyword: 'required',
            path: `${basePath}/Certificate/Analysis/Inspections/1`,
            root: certVersion,
            schemaPath: '#/definitions/Inspection/required',
          },
        ],
      }),
    },
  ];

  testsMap.forEach((testSuite) => {
    const { fixturesPath, invalidCertificate, type, validCertificate, validationErrors, version } = testSuite;
    describe(`${type} - version ${version}`, () => {
      const folderPath = `${fixturesPath}/${version}`;

      it('should validate valid certificate using certificate (object) ', async () => {
        const certificate = validCertificate;
        const errors = await validate(certificate);
        expect(errors).toBeNull();
      });

      it('should validate invalid certificate using certificate (object)', async () => {
        const certificate = invalidCertificate;
        const expectedErrors = validationErrors('schema.json', version);
        //
        const errors = await validate(certificate);
        expect(errors).toEqual(expectedErrors);
      });

      it('should validate invalid and valid certificate by providing them in an array', async () => {
        const expectedErrors = validationErrors('schema.json', version);
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
          const expectedErrors = validationErrors('invalid_cert.json', version);
          //
          const errors = await validate(invalidCertificatePath(folderPath));
          expect(errors).toEqual(expectedErrors);
        });

        it('should validate invalid and valid certificate by providing container folders path', async () => {
          const expectedErrors = validationErrors('invalid_cert.json', version);
          //
          const errors = await validate(`${__dirname}/${folderPath}`, {
            ignoredExts: ['html', 'ts', 'js', 'md', 'pdf'],
            ignoredPaths: ['translations.json'],
          });
          expect(errors).toEqual(expectedErrors);
        });
      }
    });
  });
});
