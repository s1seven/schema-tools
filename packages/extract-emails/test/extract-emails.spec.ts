import { extractEmails, getReceiver, getReceivers, getSender, getSenders } from '../src/index';

const en10168CertificatePath = `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`;
const eCoCCertificatePath = `${__dirname}/../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json`;

describe('ExtractEmails', function () {
  it('should extract emails from EN10168 certificate', async () => {
    const emailsList = await extractEmails(en10168CertificatePath);

    const expectedSeller = {
      emails: ['sbs.steeltrader@gmail.com'],
      vatId: 'IT00504870015',
      name: 'ALESSIO TUBI S.p.A.',
      role: 'Seller',
      purchaseOrderNumber: '3100-L-42006554',
      purchaseOrderPosition: '',
    };

    const expectedBuyer = {
      emails: ['sbs.steelfactory@gmail.com'],
      vatId: 'CZ49356704',
      name: 'KOENIGFRANKSTAHL S.R.O.',
      role: 'Buyer',
      purchaseOrderNumber: '3100-L-42006554',
      purchaseOrderPosition: '',
    };

    expect(emailsList).toEqual([expectedSeller, expectedBuyer]);

    const receivers = getReceivers(emailsList);
    expect(receivers).toEqual([expectedBuyer]);

    const receiver = getReceiver(emailsList, 'Buyer');
    expect(receiver).toEqual(expectedBuyer);

    const sender = getSender(emailsList, 'Seller');
    expect(sender).toEqual(expectedSeller);

    const senders = getSenders(emailsList);
    expect(senders).toEqual([expectedSeller]);
  }, 3000);

  it('should extract emails from E-CoC certificate', async () => {
    const emailsList = await extractEmails(eCoCCertificatePath);

    const expectedManufacturer = {
      name: 'CARPENTER TECHNOLOGY (EUROPE) S.A./N.V.',
      role: 'Manufacturer',
      emails: null,
      vatId: 'BE0441345644',
      purchaseOrderNumber: undefined,
      purchaseOrderPosition: undefined,
    };
    const expectedCustomer = {
      name: 'VOESTALPINE BOHLER AEROSPACE GMBH & CO KG',
      role: 'Customer',
      emails: ['contact@s1seven.com'],
      vatId: 'ATU38337108',
      purchaseOrderNumber: undefined,
      purchaseOrderPosition: undefined,
    };
    const expectedRecipient = {
      name: 'VOESTALPINE BOHLER AEROSPACE GMBH & CO KG',
      role: 'Recipient',
      emails: null,
      vatId: 'ATU38337108',
      purchaseOrderNumber: undefined,
      purchaseOrderPosition: undefined,
    };
    expect(emailsList).toEqual([expectedManufacturer, expectedCustomer, expectedRecipient]);

    const receiver = getReceiver(emailsList, 'TestLab');
    expect(receiver).toEqual(null);

    const receivers = getReceivers(emailsList);
    expect(receivers).toEqual([expectedCustomer, expectedRecipient]);

    const sender = getSender(emailsList, 'Supplier');
    expect(sender).toEqual(null);

    const senders = getSenders(emailsList);
    expect(senders).toEqual([expectedManufacturer]);
  }, 3000);
});
