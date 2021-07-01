/* eslint-disable @typescript-eslint/no-var-requires */
import { SupportedSchemas } from '@s1seven/schema-tools-types';
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

describe('ExtractEmails', function () {
  const testSuitesMap = [
    {
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`,
      certificate: require('../../../fixtures/EN10168/v0.0.2/valid_cert.json'),
      version: 'v0.0.2',
      type: SupportedSchemas.EN10168,
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
      certificatePath: `${__dirname}/../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json`,
      certificate: require('../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json'),
      version: 'v0.0.2-2',
      type: SupportedSchemas.ECOC,
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          name: 'CARPENTER TECHNOLOGY (EUROPE) S.A./N.V.',
          role: 'Manufacturer',
          emails: null,
          vatId: 'BE0441345644',
          purchaseOrderNumber: undefined,
          purchaseOrderPosition: undefined,
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Customer]: {
          name: 'VOESTALPINE BOHLER AEROSPACE GMBH & CO KG',
          role: 'Customer',
          emails: ['contact@s1seven.com'],
          vatId: 'ATU38337108',
          purchaseOrderNumber: undefined,
          purchaseOrderPosition: undefined,
        },
        [ReceiverRoles.Recipient]: {
          name: 'VOESTALPINE BOHLER AEROSPACE GMBH & CO KG',
          role: 'Recipient',
          emails: null,
          vatId: 'ATU38337108',
          purchaseOrderNumber: undefined,
          purchaseOrderPosition: undefined,
        },
      },
    },
    {
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.0.2-1/valid_cert.json`,
      certificate: require('../../../fixtures/CoA/v0.0.2-1/valid_cert.json'),
      version: 'v0.0.2-1',
      type: SupportedSchemas.COA,
      expectedSenders: {
        [SenderRoles.Manufacturer]: {
          name: 'Plastic Productions AG',
          emails: ['hannes@s1seven.com'],
          vatId: '',
          role: 'Manufacturer',
          purchaseOrderNumber: '1',
          purchaseOrderPosition: '1',
        },
      },
      expectedReceivers: {
        [ReceiverRoles.Customer]: {
          name: 'Plastic Processor SE',
          emails: ['hannes@s1seven.com'],
          vatId: '',
          role: 'Customer',
          purchaseOrderNumber: '1',
          purchaseOrderPosition: '1',
        },
      },
    },
  ];

  testSuitesMap.forEach((testSuite) => {
    describe(testSuite.type, function () {
      describe('from certificate by passing it as an object', () => {
        let emailsList: PartyEmail[];
        const expectedReceivers = Object.values(testSuite.expectedReceivers);
        const expectedSenders = Object.values(testSuite.expectedSenders);

        beforeAll(async () => {
          emailsList = await extractEmails(testSuite.certificate);
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
          Object.entries(testSuite.expectedReceivers).forEach(([role, expectedReceiver]) => {
            const receiver = getReceiver(emailsList, role as ReceiverRoles);
            expect(receiver).toEqual(expectedReceiver);
          });
        });

        it('should extract senders by role', () => {
          Object.entries(testSuite.expectedSenders).forEach(([role, expectedSender]) => {
            const sender = getSender(emailsList, role as SenderRoles);
            expect(sender).toEqual(expectedSender);
          });
        });
      });

      if (!process.env.IS_BROWSER_ENV) {
        describe('from certificate by passing it as a file path', () => {
          let emailsList: PartyEmail[];
          const expectedReceivers = Object.values(testSuite.expectedReceivers);
          const expectedSenders = Object.values(testSuite.expectedSenders);

          beforeAll(async () => {
            emailsList = await extractEmails(testSuite.certificate);
          });

          it('should extract emails', () => {
            expect(emailsList).toEqual(expect.arrayContaining([...expectedReceivers, ...expectedSenders]));
          });
        });
      }
    });
  });
});
