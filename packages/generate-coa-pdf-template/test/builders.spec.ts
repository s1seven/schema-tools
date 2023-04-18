/* eslint-disable sonarjs/no-duplicate-string */
import { localizeDate, localizeNumber, Translate } from '@s1seven/schema-tools-generate-pdf-template-helpers';
import {
  CampusTranslations,
  ExternalStandardsTranslations,
  LanguageFontMap,
  Languages,
} from '@s1seven/schema-tools-types';

import {
  createAnalysis,
  createAttachments,
  createBusinessReferences,
  createContacts,
  createDisclaimer,
  createGeneralInfo,
  createHeader,
  createInspection,
  createProductDescription,
  createReceivers,
} from '../src/generateContent';
import { CoATranslations, Disclaimer, Parties, Product } from '../src/types';
import { certificate, defaultSchemaUrl } from './constants';
import { getExtraTranslations, getTranslations } from './getTranslations';

const getI18N = (
  translations: CoATranslations,
  extraTranslations: CampusTranslations,
  languages: Languages[] = ['EN', 'DE'],
  languageFontMap?: LanguageFontMap,
) => {
  translations = languages.reduce((acc, key) => {
    acc[key] = translations[key];
    return acc;
  }, {} as CoATranslations);
  return new Translate<CoATranslations>(
    translations,
    extraTranslations as ExternalStandardsTranslations,
    languages,
    languageFontMap,
  );
};

describe('Rendering', () => {
  let translations: CoATranslations;
  let extraTranslations: CampusTranslations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
    extraTranslations = await getExtraTranslations(['EN', 'DE'], defaultSchemaUrl, ['CAMPUS']);
  });

  it('createHeader() - should correctly render manufacturer details', () => {
    const parties = {
      Manufacturer: {
        Name: 'Green Plastics AG',
        Street: 'Kunststoffgasse 1',
        ZipCode: '10003',
        City: 'Berlin',
        Country: 'DE',
        Email: 's1seven.certificates@gmail.com',
        Identifiers: {
          VAT: 'AT123456789',
          DUNS: '',
          CageCode: '',
        },
      },
      Customer: {
        Name: 'Plastic Processor SE',
        Street: 'Plastik Street 1',
        ZipCode: '1230',
        City: 'Wien',
        Country: 'AT',
        Email: 's1seven.certificates@gmail.com',
        Identifiers: {
          VAT: 'AT123456789',
        },
      },
      Receiver: {
        Name: 'Plastic Processor SE',
        Street: ['Plastik Street 1', 'Werk 1'],
        ZipCode: '1230',
        City: 'Wien',
        Country: 'AT',
        Email: 's1seven.certificates@gmail.com',
        Identifiers: {
          VAT: 'AT123456789',
        },
      },
    };
    const header = createHeader(parties as unknown as Parties, certificate.Certificate.Logo);
    const tableBody = header.table.body;
    expect(tableBody[0].length).toEqual(2);
    expect(tableBody[0][0][0]).toEqual(expect.objectContaining({ image: certificate.Certificate.Logo }));
    expect(tableBody[0][1][0]).toEqual(
      expect.objectContaining({ text: certificate.Certificate.Parties.Manufacturer.Name, style: 'h4' }),
    );
    expect(header.table.widths).toEqual([250, 300]);
  });

  it('createHeader() - if GoodsReceiver is present, add an empty middle row', () => {
    const header = createHeader(certificate.Certificate.Parties as unknown as Parties, certificate.Certificate.Logo);
    const tableBody = header.table.body;
    expect(tableBody[0].length).toEqual(3);
    expect(tableBody[0][0][0]).toEqual(expect.objectContaining({ image: certificate.Certificate.Logo }));
    expect(tableBody[0][1]).toEqual([]);
    expect(tableBody[0][2][0]).toEqual(
      expect.objectContaining({ text: certificate.Certificate.Parties.Manufacturer.Name, style: 'h4' }),
    );
    expect(header.table.widths).toEqual(['33%', '33%', '33%']);
  });

  it('createReceivers() - should correctly render receivers details', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const receivers = createReceivers(certificate.Certificate.Parties as unknown as Parties, i18n);
    const tableBody = receivers.table.body;
    const titles = tableBody[0];
    expect(tableBody[0].length).toEqual(3);
    expect(titles[0][0]).toEqual(
      expect.objectContaining({
        text: i18n.translate('Customer', 'Certificate'),
        style: { bold: true, fontSize: 10, margin: [0, 4, 0, 4] },
      }),
    );
    expect(tableBody[1][0][0]).toEqual(
      expect.objectContaining({
        text: certificate.Certificate.Parties.Customer.Name,
        style: 'h4',
      }),
    );
    expect(tableBody[1][0][0]).toEqual(
      expect.objectContaining({
        text: certificate.Certificate.Parties.GoodsReceiver.Name,
        style: 'h4',
      }),
    );
    expect(receivers.table.widths).toEqual(['33%', '33%', '33%']);
  });

  it('createReceivers() - should correctly render receivers details with languageFontMap custom font', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE'], { DE: 'Helvetica' });
    const receivers = createReceivers(certificate.Certificate.Parties as unknown as Parties, i18n);
    const tableBody = receivers.table.body;
    const titles = tableBody[0];
    expect(tableBody[0].length).toEqual(3);
    expect(titles[0][0]).toEqual(
      expect.objectContaining({
        text: [
          { text: 'Customer / ', font: undefined },
          { text: 'Kunde', font: 'Helvetica' },
        ],
        style: { bold: true, fontSize: 10, margin: [0, 4, 0, 4] },
      }),
    );
  });

  it('createReceivers() - renders correctly with both CompanyName and Name', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const parties: Parties = {
      Manufacturer: {
        CompanyName: 'Green Plastics AG',
        Street: 'Kunststoffgasse 1',
        ZipCode: '10003',
        City: 'Berlin',
        Country: 'DE',
        Email: 's1seven.certificates@gmail.com',
        Identifiers: {
          VAT: 'AT123456789',
          DUNS: '',
          CageCode: '',
        },
      },
      Customer: {
        CompanyName: 'Plastic Processor SE',
        Street: 'Plastik Street 1',
        ZipCode: '1230',
        City: 'Wien',
        Country: 'AT',
        Email: 's1seven.certificates1@gmail.com',
        Identifiers: {
          VAT: 'AT123456789',
        },
      },
      Receiver: {
        Name: 'Plastic Processor SE',
        Street: ['Plastik Street 1', 'Werk 1'],
        ZipCode: '1230',
        City: 'Wien',
        Country: 'AT',
        Email: 's1seven.certificates2@gmail.com',
        Identifiers: {
          VAT: 'AT123456789',
        },
      },
    };
    const receivers = createReceivers(parties, i18n);
    const tableBody = receivers.table.body;
    const titles = tableBody[0];
    expect(tableBody[0].length).toEqual(2);
    expect(receivers.table.widths).toEqual([250, 300]);
    expect(titles[0][0]).toEqual(
      expect.objectContaining({
        text: i18n.translate('Customer', 'Certificate'),
        style: { bold: true, fontSize: 10, margin: [0, 4, 0, 4] },
      }),
    );
    expect(tableBody[1][0][0]).toEqual(
      expect.objectContaining({
        text: parties.Customer.CompanyName,
        style: 'h4',
      }),
    );
    expect(tableBody[1][1][0]).toEqual(
      expect.objectContaining({
        text: parties.Receiver?.Name,
        style: 'h4',
      }),
    );
  });

  it('createGeneralInfo() - should correctly render certificate Id and Date', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const generalInfo = createGeneralInfo(certificate as any, i18n);
    const tableBody = generalInfo[2].table.body;
    expect(tableBody[0].length).toEqual(4);
    expect(tableBody[0][0]).toEqual(
      expect.objectContaining({
        text: i18n.translate('Id', 'Certificate'),
        style: 'tableHeader',
      }),
    );
    expect(tableBody[0][1]).toEqual(expect.objectContaining({ text: certificate.Certificate.Id }));
    expect(tableBody[0][2]).toEqual(expect.objectContaining({ text: i18n.translate('Date', 'Certificate') }));
    expect(tableBody[0][3]).toEqual(
      expect.objectContaining({ text: localizeDate(certificate.Certificate.Date, i18n.languages) }),
    );
  });

  it('createBusinessReferences() - should correctly render titles', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const businessTransaction = createBusinessReferences(certificate.Certificate.BusinessTransaction, i18n);
    const tableBody = businessTransaction[2].table.body;
    expect(tableBody[0][0]).toEqual(
      expect.objectContaining({ text: i18n.translate('Order', 'Certificate'), style: 'h5' }),
    );
    expect(tableBody[0][2]).toEqual(
      expect.objectContaining({ text: i18n.translate('Delivery', 'Certificate'), style: 'h5' }),
    );
  });

  it('createBusinessReferences() - should correctly render quantities', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const businessTransaction = createBusinessReferences(certificate.Certificate.BusinessTransaction, i18n);
    const tableBody = businessTransaction[2].table.body;
    const { Order, Delivery } = certificate.Certificate.BusinessTransaction;
    expect(tableBody[3][1]).toEqual(
      expect.objectContaining({
        text: `${localizeNumber(Order.Quantity, i18n.languages)} ${Order.QuantityUnit}`,
      }),
    );
    expect(tableBody[3][3]).toEqual(
      expect.objectContaining({
        text: `${localizeNumber(Delivery.Quantity, i18n.languages)} ${Delivery.QuantityUnit}`,
      }),
    );
  });

  it('createProductDescription() - should correctly render product', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const productDescription = createProductDescription(certificate.Certificate.Product as Product, i18n);
    const tableBody = productDescription[2].table.body;
    const { Id, ProductionBatchId, AdditionalInformation } = certificate.Certificate.Product;
    expect(tableBody[0][0]).toEqual(
      expect.objectContaining({ text: i18n.translate('ProductId', 'Certificate'), style: 'tableHeader' }),
    );
    expect(tableBody[0][2]).toEqual(expect.objectContaining({ text: Id, style: 'p' }));
    expect(tableBody[6][2]).toEqual(expect.objectContaining({ text: ProductionBatchId, style: 'p' }));
    expect(tableBody[10][2]).toEqual(expect.objectContaining({ text: AdditionalInformation.join(', '), style: 'p' }));
    // expect(tableBody[7][2]).toEqual(
    //   expect.objectContaining({ text: localizeDate(ProductionDate, i18n.languages), style: 'p' }),
    // );
  });

  it('createAnalysis() - should correctly render inspections', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const analysis = createAnalysis(certificate.Certificate.Analysis as any, i18n);
    const lotIdRow = analysis[2].table.body;
    const tableBody = analysis[3].table.body;
    const { LotId, Inspections } = certificate.Certificate.Analysis;

    expect(lotIdRow[0][0]).toEqual(
      expect.objectContaining({ text: i18n.translate('LotId', 'Certificate'), style: 'h5' }),
    );
    expect(lotIdRow[0][2]).toEqual(expect.objectContaining({ text: LotId }));

    expect(tableBody[0][0]).toEqual(expect.objectContaining({ text: i18n.translate('Property', 'Certificate') }));
    expect(tableBody[0][3]).toEqual(expect.objectContaining({ text: i18n.translate('Value', 'Certificate') }));
    expect(tableBody[1][0]['text'][0]).toEqual(expect.objectContaining({ text: Inspections[0].Property }));
    expect(tableBody[1][3]).toEqual(
      expect.objectContaining({ text: localizeNumber(Inspections[0].Value, i18n.languages) }),
    );
    expect(tableBody[2][0]['text'][0]).toEqual(expect.objectContaining({ text: Inspections[1].Property }));
    expect(tableBody[2][3]).toEqual(
      expect.objectContaining({ text: localizeNumber(Inspections[1].Value, i18n.languages) }),
    );
  });

  it('createAnalysis() - should correctly render AdditionalInformation', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const analysis = createAnalysis(certificate.Certificate.Analysis as any, i18n);
    const tableBody = analysis[3].table.body;
    const { AdditionalInformation } = certificate.Certificate.Analysis;
    expect(tableBody[10][0]).toEqual(
      expect.objectContaining({ text: i18n.translate('AdditionalInformation', 'Certificate') }),
    );
    expect(tableBody[11][0]).toEqual(expect.objectContaining({ text: AdditionalInformation.join('\n') }));
  });

  it('createInspection() - should correctly localize inspections', () => {
    const analysis = {
      PropertyId: '1038',
      Property: 'MFR',
      Method: 'DIN EN ISO 1133',
      Unit: 'g/10m_',
      Value: '31.5',
      ValueType: 'number',
      Minimum: '15.1',
      Maximum: '35.4',
      TestConditions: 'According customer specification',
    };

    const i18n = getI18N(translations, extraTranslations, ['DE', 'EN']);
    const inspection = createInspection(analysis as any, i18n);
    expect(inspection[3]).toEqual(expect.objectContaining({ text: '31,5', style: 'caption' }));
    expect(inspection[4]).toEqual(expect.objectContaining({ text: '15,1', style: 'caption' }));
    expect(inspection[5]).toEqual(expect.objectContaining({ text: '35,4', style: 'caption' }));

    const i18n2 = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const inspection2 = createInspection(analysis as any, i18n2);
    expect(inspection2[3]).toEqual(expect.objectContaining({ text: '31.5', style: 'caption' }));
    expect(inspection2[4]).toEqual(expect.objectContaining({ text: '15.1', style: 'caption' }));
    expect(inspection2[5]).toEqual(expect.objectContaining({ text: '35.4', style: 'caption' }));
  });

  it('createInspection() - if Value is not a number, it should not localize it', () => {
    const analysis = {
      PropertyId: '239',
      Property: 'Type of failure',
      Method: 'ISO 179/1eU',
      Value: 'C',
      ValueType: 'string',
    };

    const i18n = getI18N(translations, extraTranslations, ['DE', 'EN']);
    const inspection = createInspection(analysis as any, i18n);
    expect(inspection[3]).toEqual(expect.objectContaining({ text: 'C', style: 'caption' }));
  });

  it('createContacts() - should correctly render contact details', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const contacts = createContacts(certificate.Certificate.Contacts, i18n);
    const tableBody = contacts[2].table.body;
    const { Contacts } = certificate.Certificate;
    expect(tableBody[0][0]).toEqual(
      expect.objectContaining({ text: i18n.translate('ContactName', 'Certificate'), style: 'tableHeader' }),
    );
    expect(tableBody[0][3]).toEqual(
      expect.objectContaining({ text: i18n.translate('ContactEmail', 'Certificate'), style: 'tableHeader' }),
    );
    expect(tableBody[1][0]).toEqual(expect.objectContaining({ text: Contacts[0].Name, style: 'p' }));
    expect(tableBody[2][3]).toEqual(expect.objectContaining({ text: Contacts[1].Email, style: 'p' }));
  });

  it('createAttachments() - should correctly render attachment name', () => {
    const i18n = getI18N(translations, extraTranslations, ['EN', 'DE']);
    const attachments = createAttachments(certificate.Certificate.Attachments as any, i18n);
    const tableBody = attachments[2].table.body;
    const [{ FileName }] = certificate.Certificate.Attachments;
    expect(tableBody[0][0]).toEqual(expect.objectContaining({ text: FileName, style: 'p' }));
  });

  it('createDisclaimer() - should correctly render the disclaimer', () => {
    const disclaimer = createDisclaimer(certificate.Certificate.Disclaimer as Disclaimer);
    const tableBody = disclaimer[1].columns[0]['table']['body'];
    const { Disclaimer } = certificate.Certificate;
    expect(tableBody[0][0]).toEqual(expect.objectContaining({ text: Disclaimer, style: 'disclaimer' }));
  });
});
