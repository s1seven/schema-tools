import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';
import { createTransactionParties } from '../src/lib/createTransactionParties';
import { createCommercialTransaction } from '../src/lib/commercialTransaction';
import { CommercialTransaction } from '../src/types';

const defaultSchemaUrl = certificate.RefSchemaUrl || 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Rendering commercial transaction', () => {
  let translations: Record<string, unknown>;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders for testingCertificate', async () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE });
    const commercialTransaction = createCommercialTransaction(certificate.Certificate.CommercialTransaction, i18n);
    const tableBody = commercialTransaction.table.body;

    expect(tableBody.length).toEqual(10);
    expect(tableBody[0]).toEqual([
      { text: 'Commercial transaction / Angaben zum Geschäftsvorgang', style: 'h2', colSpan: 3 },
      {},
      {},
    ]);
    expect(tableBody[1]).toEqual([
      {
        text: 'A02 Type of inspection document / Art der Prüfbescheinigung',
        style: 'tableHeader',
        colSpan: 2,
      },
      {},
      {
        text: 'Inspection Certificate 3.1 according to EN 10204',
        style: 'p',
      },
    ]);
    expect(tableBody[8]).toEqual([
      {
        text: 'Invoice',
        style: 'tableHeader',
        colSpan: 1,
      },
      {
        text: '18/01067/D ',
        style: 'p',
        colSpan: 2,
      },
    ]);

    expect(tableBody[9]).toEqual([
      {
        text: 'Date of delivery note',
        style: 'tableHeader',
        colSpan: 1,
      },
      {
        text: '2020-09-29 ',
        style: 'p',
        colSpan: 2,
      },
    ]);
  });
});

describe('Rendering transaction parties', () => {
  let translations: Record<string, unknown>;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders for testingCertificate', async () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE });
    const transactionParties = createTransactionParties(certificate.Certificate.CommercialTransaction, i18n);
    const tableBody = transactionParties.table.body;

    expect(tableBody.length).toEqual(2);
    expect(tableBody[0]).toEqual([
      [
        {
          text: "A04 Manufacturer's mark / Zeichen des Herstellers",
          style: 'tableHeader',
        },
      ],
      [
        {
          text: "A01 Manufacturer's plant / Herstellerwerk",
          style: 'tableHeader',
        },
      ],
      [
        {
          text: 'A06 Purchaser / Besteller',
          style: 'tableHeader',
        },
      ],
    ]);
    expect(tableBody[1]).toEqual([
      [
        {
          image:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADICAYAAADGFbfiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVCMjk1QjRCNDYzMzExRTdBQjA5RDRGRTc4RTNENTY0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVCMjk1QjRDNDYzMzExRTdBQjA5RDRGRTc4RTNENTY0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUIyOTVCNDk0NjMzMTFFN0FCMDlENEZFNzhFM0Q1NjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUIyOTVCNEE0NjMzMTFFN0FCMDlENEZFNzhFM0Q1NjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6qvOERAAAgtElEQVR42uydCZBlVXnH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',
          width: 150,
        },
      ],
      [
        {
          text: 'ALESSIO TUBI S.p.A.',
          style: 'p',
        },
        {
          text: 'Via Ruggero Boscovich',
          style: 'p',
        },
        {
          text: 'Milano,31 - 20124,IT',
          style: 'p',
        },
        {
          style: 'p',
          text: undefined,
        },
        {
          text: 'sbs.steeltrader@gmail.com',
          style: 'p',
        },
      ],
      [
        {
          text: 'KOENIGFRANKSTAHL S.R.O.',
          style: 'p',
        },
        {
          text: 'MODLETICE, 76',
          style: 'p',
        },
        {
          text: 'Modletice,251 7,CZ',
          style: 'p',
        },
        {
          text: 'CZ49356704',
          style: 'p',
        },
        {
          text: 'sbs.steelfactory@gmail.com',
          style: 'p',
        },
      ],
    ]);
  });

  it("correctly renders when Manufacturer's mark is not provided", async () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE });
    const transactionParties = createTransactionParties(
      {
        A01: {
          CompanyName: 'Steel Factory',
          Street: 'Stahlstrasse 1',
          ZipCode: '4010',
          City: 'Linz',
          Country: 'ZZ',
          VAT_Id: 'U12345678',
          Email: 'steelbutsmart@protonmail.com',
        },
        A06: {
          CompanyName: 'Steel Factory',
          Street: 'Stahlstrasse 1',
          ZipCode: '4010',
          City: 'Linz',
          Country: 'ZZ',
          VAT_Id: 'U12345678',
          Email: 'steelbutsmart@protonmail.com',
        },
      } as CommercialTransaction,
      i18n,
    );
    const tableBody = transactionParties.table.body;

    expect(tableBody.length).toEqual(2);
    expect(tableBody[0]).toEqual([
      [{ text: "A01 Manufacturer's plant / Herstellerwerk", style: 'tableHeader' }],
      [{ text: 'A06 Purchaser / Besteller', style: 'tableHeader' }],
      '',
    ]);
  });
});
