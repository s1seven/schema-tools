/* eslint-disable @typescript-eslint/no-unused-vars */
import { certificate, defaultSchemaUrl } from './constants';
import {
  // createAnalysis,
  // createAttachments,
  // createBusinessReferences,
  // createContacts,
  // createGeneralInfo,
  createHeader,
  // createProductDescription,
  createReceivers,
} from '../src/generateContent';
import { Translate, Translations } from '@s1seven/schema-tools-generate-pdf-template-helpers';
import { getTranslations } from './getTranslations';

describe('Rendering', () => {
  let translations: Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  describe('createHeader', () => {
    it('should correctly render manufacturer details', () => {
      const header = createHeader(certificate.Certificate.Parties, certificate.Certificate.Logo);
      const tableBody = header.table.body;
      expect(tableBody[0].length).toEqual(2);
      expect(tableBody[0][0][0]).toEqual(expect.objectContaining({ image: certificate.Certificate.Logo }));
      expect(tableBody[0][1][0]).toEqual(
        expect.objectContaining({ text: certificate.Certificate.Parties.Manufacturer.Name, style: 'h4' }),
      );
    });
  });

  describe('createReceivers', () => {
    it('should correctly render receivers details', () => {
      const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);
      const receivers = createReceivers(certificate.Certificate.Parties, i18n);
      const tableBody = receivers.table.body;
      const titles = tableBody[0];
      expect(tableBody[0].length).toEqual(2);
      expect(titles[0][0]).toEqual(
        expect.objectContaining({ style: { bold: true, fontSize: 10, margin: [0, 4, 0, 4] } }),
      );
    });
  });

  // describe('createGeneralInfo', () => {});

  // describe('createBusinessReferences', () => {});

  // describe('createProductDescription', () => {});

  // describe('createAnalysis', () => {});

  // describe('createContacts', () => {});

  // describe('createAttachments', () => {});
});
