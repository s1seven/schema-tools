import { expect } from 'chai';
import { extractEmails } from '../src/extract-emails';

const en10168CertificatePath = `${__dirname}/../fixtures/EN10168/valid_cert.json`;
const eCoCCertificatePath = `${__dirname}/../fixtures/E-CoC/valid_cert.json`;

describe('ExtractEmails', function () {
  this.timeout(4000);

  it('should extract emails from EN10168 certificate', async () => {
    const emailsList = await extractEmails(en10168CertificatePath);
    const expectedResult = [
      {
        emails: ['sbs.steeltrader@gmail.com'],
        name: 'ALESSIO TUBI S.p.A.',
        role: 'Seller',
        purchaseOrderNumber: '3100-L-42006554',
        purchaseOrderPosition: undefined,
      },
      {
        emails: ['sbs.steelfactory@gmail.com'],
        name: 'KOENIGFRANKSTAHL S.R.O.',
        role: 'Buyer',
        purchaseOrderNumber: '3100-L-42006554',
        purchaseOrderPosition: undefined,
      },
    ];
    expect(emailsList).to.deep.equal(expectedResult);
  });

  it('should extract emails from E-CoC certificate', async () => {
    const emailsList = await extractEmails(eCoCCertificatePath);
    const expectedResult = [
      {
        name: 'VOESTALPINE BOHLER AEROSPACE GMBH & CO KG',
        role: 'Customer',
        emails: ['contact@s1seven.com'],
      },
    ];
    expect(emailsList).to.deep.equal(expectedResult);
  });
});
