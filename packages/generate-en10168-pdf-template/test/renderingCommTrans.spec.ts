/* eslint-disable sonarjs/no-duplicate-string */
import { createCommercialTransaction } from '../src/lib/commercialTransaction';
import { createTransactionParties } from '../src/lib/createTransactionParties';
import { CommercialTransaction, EN10168Translations } from '../src/types';
import { certificate, defaultSchemaUrl } from './constants';
import { getI18N, getTranslations } from './getTranslations';

describe('Rendering commercial transaction', () => {
  let translations: EN10168Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders for testingCertificate', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const commercialTransaction = createCommercialTransaction(
      certificate.Certificate.CommercialTransaction as any,
      i18n,
    );
    const tableBody = commercialTransaction[2].table.body;

    expect(tableBody.length).toEqual(9);
    expect(tableBody[0]).toEqual([
      {
        text: [
          {
            text: 'A02 ',
          },
          {
            font: undefined,
            text: 'Type of inspection document / ',
          },
          {
            font: undefined,
            text: 'Art der Prüfbescheinigung',
          },
        ],
        style: 'tableHeader',
        colSpan: 3,
      },
      {},
      {},
      {
        text: 'Mill Certificate EN 10204 3.1',
        style: 'p',
      },
    ]);
    expect(tableBody[7]).toEqual([
      {
        text: [
          {
            text: 'A98 ',
          },
          {
            font: undefined,
            text: 'Delivery number / ',
          },
          {
            font: undefined,
            text: 'Lieferscheinnummer',
          },
        ],
        style: 'tableHeader',
        colSpan: 3,
      },
      {},
      {},

      {
        text: 'DN-1583836',
        style: 'p',
      },
    ]);

    expect(tableBody[8]).toEqual([
      {
        text: [
          {
            text: 'A99 ',
          },
          {
            font: undefined,
            text: 'Aviso number / ',
          },
          {
            font: undefined,
            text: 'Avisonummer',
          },
        ],
        style: 'tableHeader',
        colSpan: 3,
      },
      {},
      {},
      {
        text: 'AV-87682933',
        style: 'p',
      },
    ]);
  });
});

describe('Rendering transaction parties', () => {
  let translations: EN10168Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders for testingCertificate', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const transactionParties = createTransactionParties(certificate.Certificate.CommercialTransaction as any, i18n);
    const tableBody = transactionParties.table.body;

    expect(tableBody.length).toEqual(4);
    expect(tableBody[0]).toEqual([
      [
        {
          text: [
            {
              text: 'A04 ',
            },
            {
              font: undefined,
              text: "Manufacturer's mark / ",
            },
            {
              font: undefined,
              text: 'Zeichen des Herstellers',
            },
          ],
          style: 'tableHeader',
        },
      ],
      [
        {
          text: [
            {
              text: 'A01 ',
            },
            {
              font: undefined,
              text: "Manufacturer's plant / ",
            },
            {
              font: undefined,
              text: 'Herstellerwerk',
            },
          ],
          style: 'tableHeader',
        },
      ],
      [
        {
          text: [
            {
              text: 'A06.1 ',
            },
            {
              font: undefined,
              text: 'Purchaser / ',
            },
            {
              font: undefined,
              text: 'Besteller',
            },
          ],
          style: 'tableHeader',
        },
      ],
    ]);
    expect(tableBody[1]).toEqual([
      [
        {
          image:
            'data:image/png;base64,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',
          width: 150,
        },
      ],
      [
        { text: 'Steel Mill SE', style: 'p' },
        [
          { text: 'Stahlstrasse 1', style: 'p' },
          { text: 'Street 2', style: 'p' },
        ],
        { text: 'Linz,4040,AT', style: 'p' },
      ],
      [
        { text: 'Steel Trading AG', style: 'p' },
        { text: 'Handelsgasse 1', style: 'p' },
        { text: 'Berlin,10115,DE', style: 'p' },
        { text: 'sbs.steeltrader@gmail.com', style: 'p' },
      ],
    ]);
    expect(tableBody[2]).toEqual([
      [
        {
          text: [
            {
              text: 'A06.3 ',
            },
            {
              font: undefined,
              text: 'Recipient of the test certificate / ',
            },
            {
              font: undefined,
              text: 'Empfänger der Prüfbescheinigung',
            },
          ],
          style: 'tableHeader',
        },
      ],
      '',
      '',
    ]);
    expect(tableBody[3]).toEqual([
      [
        { text: 'Steel Trading AG', style: 'p' },
        { text: 'Handelsgasse 1', style: 'p' },
        { text: 'Berlin,10115,DE', style: 'p' },
        { text: 'sbs.steeltrader@gmail.com', style: 'p' },
      ],
      '',
      '',
    ]);
  });

  // eslint-disable-next-line
  it("correctly renders when Manufacturer's mark is not provided", () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const transactionParties = createTransactionParties(
      {
        A01: {
          CompanyName: 'Steel Factory',
          Street: 'Stahlstrasse 1',
          ZipCode: '4010',
          City: 'Linz',
          Country: 'ZZ',
          Identifiers: {
            VAT: 'U12345678',
          },
          Email: 'steelbutsmart@protonmail.com',
        },
        A06: {
          CompanyName: 'Steel Traadaing',
          Street: 'Handelsgasse 1',
          ZipCode: '10115',
          City: 'Berlin',
          Country: 'DE',
          Identifiers: {
            VAT: 'DE12234567890',
          },
          Email: 'steelbutsmart@protonmail.com',
        },
      } as unknown as CommercialTransaction,
      i18n,
    );
    const tableBody = transactionParties.table.body;

    expect(tableBody.length).toEqual(2);
    expect(tableBody[0]).toEqual([
      [
        {
          text: [
            {
              text: 'A01 ',
            },
            {
              font: undefined,
              text: "Manufacturer's plant / ",
            },
            {
              font: undefined,
              text: 'Herstellerwerk',
            },
          ],
          style: 'tableHeader',
        },
      ],
      [
        {
          text: [
            {
              text: 'A06 ',
            },
            {
              font: undefined,
              text: 'Purchaser / ',
            },
            {
              font: undefined,
              text: 'Besteller',
            },
          ],
          style: 'tableHeader',
        },
      ],
      '',
    ]);
  });

  it('correctly renders both Name and CompanyName, with and without email address', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const parties = {
      A01: {
        Name: 'Steel Factory',
        Street: 'Stahlstrasse 1',
        ZipCode: '4010',
        City: 'Linz',
        Country: 'ZZ',
        Identifiers: {
          VAT: 'U12345678',
        },
        Email: 'steelbutsmart@protonmail.com',
      },
      A06: {
        CompanyName: 'Steel Traadaing',
        Street: 'Handelsgasse 1',
        ZipCode: '10115',
        City: 'Berlin',
        Country: 'DE',
        Identifiers: {
          VAT: 'DE12234567890',
        },
      },
    };
    const transactionParties = createTransactionParties(parties as unknown as CommercialTransaction, i18n);
    const tableBody = transactionParties.table.body;
    expect(tableBody.length).toEqual(2);
    expect(tableBody[0]).toEqual([
      [
        {
          text: [
            {
              text: 'A01 ',
            },
            {
              font: undefined,
              text: "Manufacturer's plant / ",
            },
            {
              font: undefined,
              text: 'Herstellerwerk',
            },
          ],
          style: 'tableHeader',
        },
      ],
      [
        {
          text: [
            {
              text: 'A06 ',
            },
            {
              font: undefined,
              text: 'Purchaser / ',
            },
            {
              font: undefined,
              text: 'Besteller',
            },
          ],
          style: 'tableHeader',
        },
      ],
      '',
    ]);
    expect(tableBody[1][0][0]).toEqual(
      expect.objectContaining({
        text: parties.A01.Name,
        style: 'p',
      }),
    );
    expect(tableBody[1][0][3]).toEqual(
      expect.objectContaining({
        text: parties.A01.Email,
        style: 'p',
      }),
    );
    expect(tableBody[1][1][0]).toEqual(
      expect.objectContaining({
        text: parties.A06.CompanyName,
        style: 'p',
      }),
    );
  });
});
