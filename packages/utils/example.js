/* eslint-disable sonarjs/no-duplicate-string */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { castCertificate } = require('./dist/certificates');
const sampleCertificate = {
  RefSchemaUrl: 'https://schemas.s1seven.com/coa-schemas/v0.1.0/schema.json',
  Certificate: {
    CertificateLanguages: ['IT', 'TR'],
    Id: '43',
    Date: '2021-12-12',
    Standard: {
      Norm: 'EN 10204:2004',
      Type: '3.1',
    },
    Parties: {
      Manufacturer: {
        Name: 'Green Plastics AG',
        AddressLine1: 'Kunststoffgasse 1',
        ZipCode: '10003',
        City: 'Berlin',
        Country: 'DE',
        Email: 's1seven.certificates@gmail.com',
        Identifier: {
          VAT: '',
          DUNS: '',
          CageCode: '',
        },
      },
      Customer: {
        Name: 'Plastic Processor SE',
        AddressLine1: 'Plastik Street 1',
        ZipCode: '1230',
        City: 'Wien',
        Country: 'AT',
        Email: 's1seven.certificates@gmail.com',
        Identifier: {
          VAT: '',
        },
      },
      Receiver: {
        Name: 'Plastic Processor SE',
        AddressLine1: 'Plastik Street 1',
        AddressLine2: 'Werk 1',
        ZipCode: '1230',
        City: 'Wien',
        Country: 'AT',
        Email: 's1seven.certificates@gmail.com',
        Identifier: {
          VAT: '',
        },
      },
    },
    BusinessTransaction: {
      Order: {
        Id: '1000/12/12/2021',
        Position: '000010',
        Date: '2021-12-01',
        Quantity: 100,
        QuantityUnit: 'kg',
        CustomerProductId: '10011',
        CustomerProductName: 'Plastic',
        GoodsReceiptId: '1000_10_10',
      },
      OrderConfirmation: {
        Id: '22',
        Date: '2021-12-01',
      },
      Delivery: {
        Id: '3000/20',
        Position: '1',
        Date: '2021-12-13',
        Quantity: 90,
        QuantityUnit: 'kg',
        InternalOrderId: '3384048234',
        InternalOrderPosition: '000020',
        Transport: ['W345678'],
      },
    },
    Product: {
      Id: '20000 01',
      Name: 'Manufactured Product Name',
      CountryOfOrigin: 'DE',
      PlaceOfOrigin: 'Berlin',
      FillingBatchId: '210000',
      FillingBatchDate: '2021-12-12',
      Standards: ['ASTM D-4066 PA0111', 'ASTM D-4066 PA0121'],
      ProductionBatchId: '100001',
      ProductionDate: '2017-12-01',
      ExpirationDate: '2021-12-12',
      AdditionalInformation: ['Information 1', 'Information 2'],
    },
    Analysis: {
      LotId: '123456789 10',
      PropertiesStandard: 'CAMPUS',
      Inspections: [
        {
          PropertyId: '1038',
          Property: 'MFR',
          Method: 'DIN EN ISO 1133',
          Unit: 'g/10m_',
          Value: '31',
          ValueType: 'number',
          Minimum: 15,
          Maximum: 35,
          TestConditions: 'According customer specification',
        },
        {
          PropertyId: '1039',
          Property: 'Density',
          Method: 'DIN EN ISO 1183-1A',
          Unit: 'g/cm³',
          Value: '85',
          ValueType: 'number',
          Minimum: 85,
          Maximum: 89,
        },
        {
          PropertyId: '11',
          Property: 'Charpy impact strength',
          Method: 'ISO 179/1eU',
          Unit: 'kJ/m²',
          Value: '85',
          ValueType: 'number',
        },
        {
          PropertyId: '239',
          Property: 'Type of failure',
          Method: 'ISO 179/1eU',
          Value: 'C',
          ValueType: 'string',
        },
      ],
      AdditionalInformation: ['Information 1', 'Information 2'],
    },
    DeclarationOfConformity: {
      Declaration: 'This document is valid without signature.',
      CE: {
        CE_Image: '',
        NotifiedBodyNumber: '0780',
        YearDocumentIssued: '18',
        DocumentNumber: '0780-PPP-P012',
      },
    },
    Contacts: [
      {
        Name: 'Josef Manager',
        Role: 'Quality Manager',
        Department: 'Factory Production Control',
        Email: 'contact1@email.com',
        Phone: '+31 6 12345678',
      },
    ],
    Logo: '',
  },
};

const result = castCertificate(sampleCertificate);
