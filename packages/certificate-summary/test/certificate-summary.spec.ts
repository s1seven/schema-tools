/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-var-requires */
import { SupportedSchemas } from '@s1seven/schema-tools-types';

import { buildCertificateSummary, CertificateSummary } from '../src/index';

describe('CertificateSummary', function () {
  const testSuitesMap = [
    {
      version: 'v0.0.2',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.0.2/valid_cert.json'),
      expectedSummary: {
        sellerName: 'ALESSIO TUBI S.p.A.',
        buyerName: 'KOENIGFRANKSTAHL S.R.O.',
        certificateIdentifier: '11263/E/20',
        productDescription: 'Longitudinally welded steel tubes ERW',
        purchaseDeliveryNumber: '003288/22',
        purchaseDeliveryPosition: undefined,
        purchaseOrderNumber: '3100-L-42006554',
        purchaseOrderPosition: '',
        quantity: [],
        material: 'ferrous',
      },
    },
    {
      version: 'v0.1.0',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.1.0/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.1.0/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Steel Mill SE',
        buyerName: 'Steel Trading AG',
        certificateIdentifier: '1866645/001',
        productDescription: 'Seamleass Steel Tubes Hot Roild',
        purchaseDeliveryNumber: 'DN-1583836',
        purchaseDeliveryPosition: undefined,
        purchaseOrderNumber: '0334/2019/ZZS',
        purchaseOrderPosition: '1',
        quantity: [{ value: 5739.3, unit: 'kg' }],
        material: 'ferrous',
      },
    },
    {
      version: 'v0.2.0',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.2.0/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.2.0/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Steel Mill SE',
        buyerName: 'Steel Trading AG',
        certificateIdentifier: '1866645/001',
        productDescription: 'Seamleass Steel Tubes Hot Roild',
        purchaseDeliveryNumber: 'DN-1583836',
        purchaseDeliveryPosition: undefined,
        purchaseOrderNumber: '0334/2019/ZZS',
        purchaseOrderPosition: '1',
        quantity: [{ value: 5739.3, unit: 'kg' }],
        material: 'ferrous',
      },
    },
    {
      version: 'v0.3.0',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.3.0/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.3.0/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Steel Mill SE',
        buyerName: 'Steel Trading AG',
        certificateIdentifier: '1866645/001',
        productDescription: 'Seamleass Steel Tubes Hot Roild',
        purchaseDeliveryNumber: 'DN-1583836',
        purchaseDeliveryPosition: undefined,
        purchaseOrderNumber: '0334/2019/ZZS',
        purchaseOrderPosition: '1',
        quantity: [{ value: 5739, unit: 'kg' }],
        material: 'ferrous',
      },
    },
    {
      version: 'v0.4.0',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.4.0/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.4.0/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Steel Mill SE',
        buyerName: 'Steel Trading AG',
        certificateIdentifier: '1866645/001',
        productDescription: 'Seamleass Steel Tubes Hot Roild',
        purchaseDeliveryNumber: 'DN-1583836',
        purchaseDeliveryPosition: undefined,
        purchaseOrderNumber: '0334/2019/ZZS',
        purchaseOrderPosition: '1',
        quantity: [{ value: 5739, unit: 'kg' }],
        material: 'ferrous',
      },
    },
    {
      version: 'v0.4.1',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.4.1/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.4.1/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Steel Mill SE',
        buyerName: 'Steel Trading AG',
        certificateIdentifier: '1866645/001',
        productDescription: 'Seamleass Steel Tubes Hot Roild',
        purchaseDeliveryNumber: 'DN-1583836',
        purchaseDeliveryPosition: undefined,
        purchaseOrderNumber: '0334/2019/ZZS',
        purchaseOrderPosition: '1',
        quantity: [{ value: 5739, unit: 'kg' }],
        material: 'ferrous',
      },
    },
    {
      version: 'v1.0.0',
      type: SupportedSchemas.ECOC,
      certificatePath: `${__dirname}/../../../fixtures/E-CoC/v1.0.0/valid_cert.json`,
      certificate: require('../../../fixtures/E-CoC/v1.0.0/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Material Manufacturing SE',
        buyerName: 'Material Trading AG',
        certificateIdentifier: '89172671',
        productDescription: undefined,
        purchaseDeliveryNumber: undefined,
        purchaseDeliveryPosition: undefined,
        purchaseOrderNumber: undefined,
        purchaseOrderPosition: undefined,
        quantity: [
          [
            { value: 1096, unit: 'Kg' },
            { value: 6, unit: 'Pcs' },
          ],
          [
            { value: 1093, unit: 'Kg' },
            { value: 6, unit: 'Pcs' },
          ],
        ],
        material: 'non-ferrous',
      },
    },
    {
      version: 'v0.0.4',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.0.4/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v0.0.4/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Green Plastics AG',
        buyerName: 'Plastic Processor SE',
        certificateIdentifier: '43',
        productDescription: 'Product Number 2',
        purchaseDeliveryNumber: '3',
        purchaseDeliveryPosition: undefined,
        purchaseOrderNumber: '1',
        purchaseOrderPosition: '1',
        quantity: [{ value: 90, unit: 'kg' }],
        material: 'chemical',
      },
    },
    {
      version: 'v0.1.0',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.1.0/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v0.1.0/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Green Plastics AG',
        buyerName: 'Plastic Processor SE',
        certificateIdentifier: '43',
        productDescription: 'Manufactured Product Name',
        purchaseDeliveryNumber: '3000/20',
        purchaseDeliveryPosition: '1',
        purchaseOrderNumber: '1000/12/12/2021',
        purchaseOrderPosition: '000010',
        quantity: [{ value: 90, unit: 'kg' }],
        material: 'chemical',
      },
    },
    {
      version: 'v0.2.0',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.2.0/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v0.2.0/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Green Plastics AG',
        buyerName: 'Plastic Processor SE',
        certificateIdentifier: '43',
        productDescription: 'Manufactured Product Name',
        purchaseDeliveryNumber: '3000/20',
        purchaseDeliveryPosition: '1',
        purchaseOrderNumber: '1000/12/12/2021',
        purchaseOrderPosition: '000010',
        quantity: [{ value: 90, unit: 'kg' }],
        material: 'chemical',
      },
    },
    {
      version: 'v1.0.0',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v1.0.0/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v1.0.0/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Green Plastics AG',
        buyerName: 'Plastic Processor SE',
        certificateIdentifier: '43',
        productDescription: 'Manufactured Product Name',
        purchaseDeliveryNumber: '3000/20',
        purchaseDeliveryPosition: '1',
        purchaseOrderNumber: '1000/12/12/2021',
        purchaseOrderPosition: '000010',
        quantity: [{ value: 90, unit: 'kg' }],
        material: 'chemical',
      },
    },
    {
      version: 'v1.1.0',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v1.1.0/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v1.1.0/valid_cert.json'),
      expectedSummary: {
        sellerName: 'Green Plastics AG',
        buyerName: 'Plastic Processor SE',
        certificateIdentifier: '43',
        productDescription: 'Manufactured Product Name',
        purchaseDeliveryNumber: '3000/20',
        purchaseDeliveryPosition: '1',
        purchaseOrderNumber: '1000/12/12/2021',
        purchaseOrderPosition: '000010',
        quantity: [{ value: 90, unit: 'kg' }],
        material: 'chemical',
      },
    },
  ];

  testSuitesMap.forEach((testSuite) => {
    const { certificate, certificatePath, expectedSummary, type, version } = testSuite;
    describe(`${type} - version ${version}`, function () {
      describe('from certificate by passing it as an object', () => {
        let certificateSummary: CertificateSummary;

        beforeAll(async () => {
          certificateSummary = await buildCertificateSummary(certificate);
        });

        it('should build certificate summary', () => {
          expect(certificateSummary).toEqual(expectedSummary);
        });
      });

      if (!process.env.IS_BROWSER_ENV) {
        describe('from certificate by passing it as a file path', () => {
          let certificateSummary: CertificateSummary;

          beforeAll(async () => {
            certificateSummary = await buildCertificateSummary(certificatePath);
          });

          it('should build certificate summary', () => {
            expect(certificateSummary).toEqual(expectedSummary);
          });
        });
      }
    });
  });
});
