import { expect } from 'chai';

const certificate = require('./testingCertificate.json');
import { Translate } from '../utils/translate';
import { createTransactionParties } from '../src/lib/createTransactionParties';
import { createCommercialTransaction } from '../src/lib/commercialTransaction';

describe('Rendering commercial transaction', () => {
  it('correctly renders for testingCertificate', () => {
    const i18n = new Translate(['EN', 'DE']);
    const commercialTransaction = createCommercialTransaction(certificate.Certificate.CommercialTransaction, i18n);
    const tableBody = commercialTransaction.content[0].table.body;

    expect(tableBody.length).to.be.equal(16);
    expect(tableBody[0]).to.be.eql([
      [{ text: "A04 Manufacturer's mark / Zeichen des Herstellers", style: 'h3' }],
      [{ text: "A01 Manufacturer's plant / Herstellerwerk", style: 'h3' }],
      [{ text: "A06.1 Purchaser / Besteller", style: 'h3' }],
    ]);
    expect(tableBody[4]).to.be.eql(
      [{ text: "Commercial transaction / Angaben zum Geschäftsvorgang", style: 'h2', colSpan: 3 }, {}, {}],
    );
    expect(tableBody[8]).to.be.eql(
      [{ text: "A07 Purchaser order number / Kundenbestellnummer", style: 'p', colSpan: 2 }, {}, "0334/2019/ZZS"],
    );
    expect(tableBody[15]).to.be.eql(
      [{ text: "Buyer Reference Number", style: 'p', colSpan: 1 }, {text: "BRN-1583836 ", colSpan: 2}],
    );
  });
})

describe('Rendering transaction parties', () => {
  it('correctly renders for testingCertificate', () => {
    const i18n = new Translate(['EN', 'DE']);
    const tableBody = createTransactionParties(certificate.Certificate.CommercialTransaction, i18n)
    expect(tableBody.length).to.be.equal(4);
    expect(tableBody[0]).to.be.eql([
      [{text: "A04 Manufacturer's mark / Zeichen des Herstellers", style: "h3"}],
      [{text: "A01 Manufacturer's plant / Herstellerwerk", style: "h3"}],
      [{text: "A06.1 Purchaser / Besteller", style: "h3"}]
    ]);
    expect(tableBody[2]).to.be.eql([
      [{text: "A06.3 Recipient of the test certificate / Empfänger der Prüfbescheinigung", style: "h3"}], "", ""
    ]);
    expect(tableBody[3]).to.be.eql([
      [
        {text: "Steel User AG", style: "p"},
        {text: "Handelsgasse 1", style: "p"},
        {text: "Berlin,10115,DE", style: "p"},
        {text: "DE12234567890", style: "p"},
        {text: "sbs.steeltrader@gmail.com", style: "p"},
      ], "", ""
    ]);
  });
  it("correctly renders when Manufacturer's mark is not provided", () => {
    const i18n = new Translate(['EN', 'DE']);
    const tableBody = createTransactionParties({
      "A01": {
        "CompanyName": "Steel Factory",
        "Street": "Stahlstrasse 1",
        "ZipCode": "4010",
        "City": "Linz",
        "Country": "ZZ",
        "VAT_Id": "U12345678",
        "Email": "steelbutsmart@protonmail.com"
      },
      "A06": {
        "CompanyName": "Steel Factory",
        "Street": "Stahlstrasse 1",
        "ZipCode": "4010",
        "City": "Linz",
        "Country": "ZZ",
        "VAT_Id": "U12345678",
        "Email": "steelbutsmart@protonmail.com"
      },
    }, i18n)
    expect(tableBody.length).to.be.equal(2);
    expect(tableBody[0]).to.be.eql([
      [{text: "A01 Manufacturer's plant / Herstellerwerk", style: "h3"}],
      [{text: "A06 Purchaser / Besteller", style: "h3"}],
      ''
    ]);
  });
})


