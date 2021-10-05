import { getTranslations } from './getTranslations';
import { Translate } from '../src';

describe('Translate', () => {
  describe('EN10168 certificate', () => {
    const defaultSchemaUrl = 'https://schemas.s1seven.com/en10168-schemas/v0.1.0/schema.json';

    it('correctly translate certificateFields into 2 languages', async () => {
      const translations = await getTranslations(['DE', 'EN'], defaultSchemaUrl);
      const i18n = new Translate(translations, ['DE', 'EN']);
      const translation = i18n.translate('A01', 'certificateFields');
      expect(translation).toEqual("A01 Herstellerwerk / Manufacturer's plant"); // eslint-disable-line quotes
    });

    it('correctly translate certificateGroups into 2 languages', async () => {
      const translations = await getTranslations(['DE', 'FR'], defaultSchemaUrl);
      const i18n = new Translate(translations, ['DE', 'FR']);
      const translation = i18n.translate('ProductDescription', 'certificateGroups');
      expect(translation).toEqual('Beschreibung des Erzeugnisses / Description du produit');
    });

    it('correctly translate certificateGroups into 1 language', async () => {
      const translations = await getTranslations(['FR'], defaultSchemaUrl);
      const i18n = new Translate(translations, ['FR']);
      const translation = i18n.translate('ChemicalComposition', 'otherFields');
      expect(translation).toEqual('Composition chimique');
    });
  });

  describe('CoA certificate', () => {
    const defaultSchemaUrl = 'https://schemas.s1seven.com/coa-schemas/v0.0.4/schema.json';

    it('correctly translate Certificate into 2 languages', async () => {
      const translations = await getTranslations(['DE', 'EN'], defaultSchemaUrl);
      const i18n = new Translate(translations, ['DE', 'EN']);
      const translation = i18n.translate('Customer', 'Certificate');
      expect(translation).toEqual('Kunde / Customer');
    });

    it('correctly translate Certificate into 1 language', async () => {
      const translations = await getTranslations(['FR'], defaultSchemaUrl);
      const i18n = new Translate(translations, ['FR']);
      const translation = i18n.translate('Customer', 'Certificate');
      expect(translation).toEqual('Client');
    });
  });
});
