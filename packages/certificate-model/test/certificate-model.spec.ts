/* eslint-disable @typescript-eslint/no-var-requires */
import { formatValidationErrors, loadExternalFile } from '@s1seven/schema-tools-utils';
import { JSONSchema7, Schemas, SchemaTypes, SupportedSchemas } from '@s1seven/schema-tools-types';
import { CertificateModel } from '../src/index';

describe('CertificateModel', function () {
  const mustBeObject = 'must be object';
  const testSuitesMap = [
    {
      version: 'v0.0.2',
      type: SupportedSchemas.EN10168,
      schemaType: 'en10168-schemas' as SchemaTypes,
      schemaUrl: 'https://schemas.s1seven.com/en10168-schemas/v0.0.2/schema.json',
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`,
      validCertificate: require('../../../fixtures/EN10168/v0.0.2/valid_cert.json') as Schemas,
      invalidCertificate: require('../../../fixtures/EN10168/v0.0.2/invalid_cert.json') as Schemas,
      expectedSchemaProperties: ['RefSchemaUrl', 'Certificate', 'DocumentMetadata'],
      validationErrors: [
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
      ],
    },
    {
      version: 'v0.0.2',
      type: SupportedSchemas.ECOC,
      schemaType: 'e-coc-schemas' as SchemaTypes,
      schemaUrl: 'https://schemas.s1seven.com/e-coc-schemas/v0.0.2/schema.json',
      certificatePath: `${__dirname}/../../../fixtures/E-CoC/v0.0.2/valid_cert.json`,
      validCertificate: require('../../../fixtures/E-CoC/v0.0.2/valid_cert.json') as Schemas,
      invalidCertificate: require('../../../fixtures/E-CoC/v0.0.2/invalid_cert.json') as Schemas,
      expectedSchemaProperties: ['RefSchemaUrl', 'EcocData', 'Declaration'],
      validationErrors: [
        {
          root: '',
          path: '/EcocData',
          keyword: 'required',
          schemaPath: '#/properties/EcocData/oneOf/2/required',
          expected: "must have required property 'Results'",
        },
        {
          root: '',
          path: '/EcocData/Data/Parties/0/PartyAddress',
          keyword: 'required',
          schemaPath: '#/definitions/Address/required',
          expected: "must have required property 'CountryCode'",
        },
        {
          root: '',
          path: '/EcocData/Data/Parties/1/PartyIdentifier/0/NameOfIdentifier',
          keyword: 'enum',
          schemaPath: '#/definitions/CompanyIdentifier/properties/NameOfIdentifier/enum',
          expected: 'must be equal to one of the allowed values',
        },
        {
          root: '',
          path: '/EcocData/Data/Parties/1/PartyRole',
          keyword: 'enum',
          schemaPath: '#/definitions/PartyRole/enum',
          expected: 'must be equal to one of the allowed values',
        },
      ],
    },
    {
      version: 'v0.0.4',
      type: SupportedSchemas.COA,
      schemaType: 'coa-schemas' as SchemaTypes,
      schemaUrl: 'https://schemas.s1seven.com/coa-schemas/v0.0.4/schema.json',
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.0.4/valid_cert.json`,
      validCertificate: require('../../../fixtures/CoA/v0.0.4/valid_cert.json') as Schemas,
      invalidCertificate: require('../../../fixtures/CoA/v0.0.4/invalid_cert.json') as Schemas,
      expectedSchemaProperties: ['RefSchemaUrl', 'Certificate'],
      validationErrors: [
        {
          root: '',
          path: '/Certificate/Parties/Manufacturer',
          keyword: 'required',
          schemaPath: '#/required',
          expected: "must have required property 'Name'",
        },
        {
          root: '',
          path: '/Certificate/Parties/Manufacturer/Identifier',
          keyword: 'required',
          schemaPath: '#/definitions/Identifier/required',
          expected: "must have required property 'VAT'",
        },
        {
          root: '',
          path: '/Certificate/BusinessTransaction/OrderConfirmation/Date',
          keyword: 'format',
          schemaPath: '#/definitions/BusinessTransaction/properties/OrderConfirmation/properties/Date/format',
          expected: 'must match format "date"',
        },
        {
          root: '',
          path: '/Certificate/BusinessTransaction/Delivery/Number',
          keyword: 'type',
          schemaPath: '#/definitions/BusinessTransaction/properties/Delivery/properties/Number/type',
          expected: 'must be string',
        },
        {
          root: '',
          path: '/Certificate/Analysis/Inspections/1',
          keyword: 'required',
          schemaPath: '#/definitions/Inspection/required',
          expected: "must have required property 'Property'",
        },
      ],
    },
  ];

  testSuitesMap.forEach((testSuite) => {
    const {
      expectedSchemaProperties,
      invalidCertificate,
      validCertificate,
      validationErrors,
      schemaType,
      schemaUrl,
      type,
      version,
    } = testSuite;
    describe(`${type} - version ${version}`, function () {
      const schemaConfig = { version, schemaType };

      const testValidation = (cert: CertificateModel<Schemas>) => {
        const validation = cert.validate();
        const toJSON = cert.toJSON();
        expect(validation.valid).toEqual(true);
        expect(JSON.stringify(toJSON, null, 2)).toEqual(JSON.stringify(validCertificate, null, 2));
      };

      const waitReady = (cert: CertificateModel<Schemas>) =>
        new Promise((resolve) => {
          cert.once('ready', () => resolve(true));
        });

      it('should build and validate instance using schemaConfig when using valid certificate', async () => {
        const CertModel = await CertificateModel.build({ schemaConfig });
        const cert = new CertModel<Schemas>(validCertificate);
        await waitReady(cert);
        testValidation(cert);
      }, 7000);

      it('should build and validate instance using schema when using valid certificate', async () => {
        const schema = (await loadExternalFile(schemaUrl, 'json')) as JSONSchema7;
        const cert = await CertificateModel.buildInstance({ schema }, validCertificate);
        await waitReady(cert);
        testValidation(cert);
      }, 7000);

      it('should return schema properties', async () => {
        const CertModel = await CertificateModel.build({ schemaConfig });
        const cert = new CertModel<Schemas>(validCertificate);
        await waitReady(cert);
        const { schemaProperties } = cert;
        expectedSchemaProperties.forEach((prop) => {
          expect(schemaProperties).toHaveProperty(prop);
        });
      }, 8000);

      it('should NOT build invalid instance using schemaConfig when using invalid certificate', async () => {
        const expectedError = new Error(JSON.stringify(validationErrors, null, 2));
        const CertModel = await CertificateModel.build({ schemaConfig });
        const cert = new CertModel<Schemas>(invalidCertificate, { internal: false, validate: true, throwError: true });
        const error = await new Promise((resolve) => {
          cert.on('error', resolve);
        });
        expect(error).toEqual(expectedError);
      }, 7000);

      it('should NOT set invalid instance using schemaConfig when using invalid certificate', async () => {
        const CertModel = await CertificateModel.build({ schemaConfig });
        const cert = new CertModel<Schemas>(validCertificate);
        await waitReady(cert);
        const { errors } = cert.validate(invalidCertificate);
        expect(formatValidationErrors(errors)).toEqual(validationErrors);
        await expect(cert.set(invalidCertificate, { validate: true, throwError: true })).rejects.toThrow();
      }, 8000);
    });
  });
});
