/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-var-requires */
import { SupportedSchemas } from '@s1seven/schema-tools-types';

import {
  extractParties,
  getReceiver,
  getReceivers,
  getSender,
  getSenders,
  PartyEmail,
  ReceiverRoles,
  SenderRoles,
} from '../src/index';

describe('ExtractEmails', function () {
  const testSuitesMap = [
    {
      version: 'v0.0.2',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.0.2/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Seller]: {
          emails: ['sbs.steeltrader@gmail.com'],
          vatId: 'IT00504870015',
          name: 'ALESSIO TUBI S.p.A.',
          role: 'Seller',
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Buyer]: {
          emails: ['sbs.steelfactory@gmail.com'],
          vatId: 'CZ49356704',
          name: 'KOENIGFRANKSTAHL S.R.O.',
          role: 'Buyer',
          dunsId: undefined,
        },
      },
    },
    {
      version: 'v0.1.0',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.1.0/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.1.0/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Seller]: {
          emails: ['sbs.steelfactory@gmail.com'],
          name: 'Steel Mill SE',
          role: 'Seller',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Buyer]: {
          emails: ['sbs.steeltrader@gmail.com'],
          name: 'Steel Trading AG',
          role: 'Buyer',
          vatId: 'DE12234567890',
          dunsId: undefined,
        },
      },
    },
    {
      version: 'v0.2.0',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.2.0/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.2.0/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Seller]: {
          emails: ['sbs.steelfactory@gmail.com'],
          name: 'Steel Mill SE',
          role: 'Seller',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Buyer]: {
          emails: ['sbs.steeltrader@gmail.com'],
          name: 'Steel Trading AG',
          role: 'Buyer',
          vatId: 'DE12234567890',
          dunsId: undefined,
        },
      },
    },
    {
      version: 'v0.3.0',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.3.0/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.3.0/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Seller]: {
          emails: [],
          name: 'Steel Mill SE',
          role: 'Seller',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Buyer]: {
          emails: [],
          name: 'Steel Trading AG',
          role: 'Buyer',
          vatId: 'DE12234567890',
          dunsId: undefined,
        },
        [ReceiverRoles.CertificateConsignee]: {
          emails: [],
          vatId: undefined,
          dunsId: '123456789',
          name: 'Steel User AG',
          role: 'CertificateConsignee',
        },
      },
    },
    {
      version: 'v0.4.0',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.4.0/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.4.0/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Seller]: {
          emails: [],
          name: 'Steel Mill SE',
          role: 'Seller',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Buyer]: {
          emails: ['sbs.steeltrader@gmail.com'],
          name: 'Steel Trading AG',
          role: 'Buyer',
          vatId: 'DE12234567890',
          dunsId: undefined,
        },
        [ReceiverRoles.CertificateConsignee]: {
          emails: ['sbs.steeltrader@gmail.com'],
          vatId: undefined,
          dunsId: '12234567890',
          name: 'Steel Trading AG',
          role: 'CertificateConsignee',
        },
      },
    },
    {
      version: 'v0.4.1',
      type: SupportedSchemas.EN10168,
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.4.1/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.4.1/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Seller]: {
          emails: [],
          name: 'Steel Mill SE',
          role: 'Seller',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Buyer]: {
          emails: ['sbs.steeltrader@gmail.com'],
          name: 'Steel Trading AG',
          role: 'Buyer',
          vatId: undefined,
          dunsId: '12234567890',
        },
        [ReceiverRoles.CertificateConsignee]: {
          emails: ['sbs.steeltrader@gmail.com'],
          vatId: undefined,
          dunsId: undefined,
          name: 'Steel Trading AG',
          role: 'CertificateConsignee',
        },
      },
    },
    {
      version: 'v1.0.0',
      type: SupportedSchemas.ECOC,
      certificatePath: `${__dirname}/../../../fixtures/E-CoC/v1.0.0/valid_cert.json`,
      certificate: require('../../../fixtures/E-CoC/v1.0.0/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          emails: [],
          name: 'Material Manufacturing SE',
          role: 'Manufacturer',
          vatId: 'AT123456789',
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Recipient]: {
          emails: [],
          name: 'Material Trading AG',
          role: 'Recipient',
          vatId: 'DE12234567890',
        },
      },
    },
    {
      version: 'v0.0.4',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.0.4/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v0.0.4/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Green Plastics AG',
          role: 'Manufacturer',
          vatId: undefined,
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Customer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Plastic Processor SE',
          role: 'Customer',
          vatId: undefined,
          dunsId: undefined,
        },
      },
    },
    {
      version: 'v0.1.0',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.1.0/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v0.1.0/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Green Plastics AG',
          role: 'Manufacturer',
          vatId: undefined,
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Customer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Plastic Processor SE',
          role: 'Customer',
          vatId: undefined,
          dunsId: undefined,
        },
        [ReceiverRoles.Receiver]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Plastic Processor SE',
          role: 'Receiver',
          vatId: undefined,
          dunsId: undefined,
        },
      },
    },
    {
      version: 'v0.2.0',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.2.0/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v0.2.0/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Green Plastics AG',
          role: 'Manufacturer',
          vatId: undefined,
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Customer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Plastic Processor SE',
          role: 'Customer',
          vatId: undefined,
          dunsId: undefined,
        },
        [ReceiverRoles.Receiver]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Plastic Processor SE',
          role: 'Receiver',
          vatId: undefined,
          dunsId: undefined,
        },
      },
    },
    {
      version: 'v1.0.0',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v1.0.0/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v1.0.0/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Green Plastics AG',
          role: 'Manufacturer',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Customer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Plastic Processor SE',
          role: 'Customer',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
        [ReceiverRoles.Receiver]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Plastic Processor SE',
          role: 'Receiver',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
      },
    },
    {
      version: 'v1.1.0',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v1.1.0/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v1.1.0/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Green Plastics AG',
          role: 'Manufacturer',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Customer]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Plastic Processor SE',
          role: 'Customer',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
        [ReceiverRoles.Receiver]: {
          emails: ['s1seven.certificates@gmail.com'],
          name: 'Plastic Processor SE',
          role: 'Receiver',
          vatId: 'AT123456789',
          dunsId: undefined,
        },
      },
    },
  ];

  testSuitesMap.forEach((testSuite) => {
    const {
      certificate,
      certificatePath,
      expectedReceivers: receivers,
      expectedSenders: senders,
      type,
      version,
    } = testSuite;
    describe(`${type} - version ${version}`, function () {
      describe('from certificate by passing it as an object', () => {
        let emailsList: PartyEmail[];
        const expectedReceivers = Object.values(receivers);
        const expectedSenders = Object.values(senders);

        beforeAll(async () => {
          emailsList = await extractParties(certificate);
        });

        it('should extract emails', () => {
          const expectedParties = [...expectedReceivers, ...expectedSenders];
          if (process.env.IS_BROWSER_ENV) {
            expect(emailsList).toEqual(jasmine.arrayContaining(expectedParties));
          } else {
            expect(emailsList).toEqual(expect.arrayContaining(expectedParties));
          }
        });

        it('should extract receivers', () => {
          const receivers = getReceivers(emailsList);
          expect(receivers).toEqual(expectedReceivers);
        });

        it('should extract senders', () => {
          const senders = getSenders(emailsList);
          expect(senders).toEqual(expectedSenders);
        });

        it('should extract receivers by role', () => {
          Object.entries(receivers).forEach(([role, expectedReceiver]) => {
            const receiver = getReceiver(emailsList, role as ReceiverRoles);
            expect(receiver).toEqual(expectedReceiver);
          });
        });

        it('should extract senders by role', () => {
          Object.entries(senders).forEach(([role, expectedSender]) => {
            const sender = getSender(emailsList, role as SenderRoles);
            expect(sender).toEqual(expectedSender);
          });
        });
      });

      if (!process.env.IS_BROWSER_ENV) {
        describe('from certificate by passing it as a file path', () => {
          let emailsList: PartyEmail[];
          const expectedReceivers = Object.values(receivers);
          const expectedSenders = Object.values(senders);

          beforeAll(async () => {
            emailsList = await extractParties(certificatePath);
          });

          it('should extract emails', () => {
            expect(emailsList).toEqual(expect.arrayContaining([...expectedReceivers, ...expectedSenders]));
          });
        });
      }
    });
  });
});
