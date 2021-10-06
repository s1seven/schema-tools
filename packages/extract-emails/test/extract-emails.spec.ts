/* eslint-disable @typescript-eslint/no-var-requires */
import {
  extractEmails,
  getReceiver,
  getReceivers,
  getSender,
  getSenders,
  PartyEmail,
  ReceiverRoles,
  SenderRoles,
} from '../src/index';
import { SupportedSchemas } from '@s1seven/schema-tools-types';

describe('ExtractEmails', function () {
  const certificateEmail = 's1seven.certificates@gmail.com';
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
          purchaseOrderNumber: '3100-L-42006554',
          purchaseOrderPosition: '',
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Buyer]: {
          emails: ['sbs.steelfactory@gmail.com'],
          vatId: 'CZ49356704',
          name: 'KOENIGFRANKSTAHL S.R.O.',
          role: 'Buyer',
          purchaseOrderNumber: '3100-L-42006554',
          purchaseOrderPosition: '',
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
          purchaseOrderNumber: '0334/2019/ZZS',
          purchaseOrderPosition: '1',
          role: 'Seller',
          vatId: 'AT123456789',
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Buyer]: {
          emails: ['sbs.steeltrader@gmail.com'],
          name: 'Steel Trading AG',
          purchaseOrderNumber: '0334/2019/ZZS',
          purchaseOrderPosition: '1',
          role: 'Buyer',
          vatId: 'DE12234567890',
        },
      },
    },
    {
      version: 'v0.0.2',
      type: SupportedSchemas.ECOC,
      certificatePath: `${__dirname}/../../../fixtures/E-CoC/v0.0.2/valid_cert.json`,
      certificate: require('../../../fixtures/E-CoC/v0.0.2/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          emails: [certificateEmail],
          name: 'Material Manufacturing SE',
          purchaseOrderNumber: undefined,
          purchaseOrderPosition: undefined,
          role: 'Manufacturer',
          vatId: 'AT123456789',
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Recipient]: {
          emails: [certificateEmail],
          name: 'Material Trading AG',
          purchaseOrderNumber: undefined,
          purchaseOrderPosition: undefined,
          role: 'Recipient',
          vatId: 'DE12234567890',
        },
      },
    },
    {
      version: 'v0.0.3',
      type: SupportedSchemas.COA,
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.0.3/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v0.0.3/valid_cert.json'),
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          emails: [certificateEmail],
          name: 'Green Plastics AG',
          purchaseOrderNumber: '1',
          purchaseOrderPosition: '1',
          role: 'Manufacturer',
          vatId: '',
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Customer]: {
          emails: [certificateEmail],
          name: 'Plastic Processor SE',
          purchaseOrderNumber: '1',
          purchaseOrderPosition: '1',
          role: 'Customer',
          vatId: '',
        },
      },
    },
  ];

  testSuitesMap.forEach((testSuite) => {
    const { certificate, expectedReceivers: receivers, expectedSenders: senders, type, version } = testSuite;
    describe(`${type} - version ${version}`, function () {
      describe('from certificate by passing it as an object', () => {
        let emailsList: PartyEmail[];
        const expectedReceivers = Object.values(receivers);
        const expectedSenders = Object.values(senders);

        beforeAll(async () => {
          emailsList = await extractEmails(certificate);
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
            emailsList = await extractEmails(certificate);
          });

          it('should extract emails', () => {
            expect(emailsList).toEqual(expect.arrayContaining([...expectedReceivers, ...expectedSenders]));
          });
        });
      }
    });
  });
});
