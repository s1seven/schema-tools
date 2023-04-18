import { ExternalStandardsEnum, ExtraTranslations, Translations } from '@s1seven/schema-tools-types';

import { Translate } from '../src';
import { getExtraTranslations, getTranslations } from './getTranslations';

describe('Translate', () => {
  describe('EN10168 certificate', () => {
    const defaultSchemaUrl = 'https://schemas.s1seven.dev/en10168-schemas/v0.3.0/schema.json';

    it('correctly translate certificateFields into 2 languages', async () => {
      const translations = await getTranslations(['DE', 'EN'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['DE', 'EN']);
      const translation = i18n.translate('A01', 'certificateFields');
      expect(translation).toEqual([
        { text: 'A01 ' },
        { font: undefined, text: 'Herstellerwerk / ' },
        { font: undefined, text: "Manufacturer's plant" },
      ]);
    });

    it('correctly translate certificateGroups into 2 languages', async () => {
      const translations = await getTranslations(['DE', 'FR'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['DE', 'FR']);
      const translation = i18n.translate('ProductDescription', 'certificateGroups');
      expect(translation).toEqual([
        { font: undefined, text: 'Beschreibung des Erzeugnisses / ' },
        { font: undefined, text: 'Description du produit' },
      ]);
    });

    it('correctly translate certificateGroups into 1 language', async () => {
      const translations = await getTranslations(['FR'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['FR']);
      const translation = i18n.translate('ChemicalComposition', 'otherFields');
      expect(translation).toEqual([{ font: undefined, text: 'Composition chimique' }]);
    });
  });

  describe('CoA certificate', () => {
    const defaultSchemaUrl = 'https://schemas.s1seven.dev/coa-schemas/v0.2.0/schema.json';

    it('correctly translate Certificate into 2 languages', async () => {
      const translations = await getTranslations(['DE', 'EN'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['DE', 'EN']);
      const translation = i18n.translate('Customer', 'Certificate');
      expect(translation).toEqual([
        { font: undefined, text: 'Kunde / ' },
        { font: undefined, text: 'Customer' },
      ]);
    });

    it('correctly translate Certificate into 1 language', async () => {
      const translations = await getTranslations(['FR'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['FR']);
      const translation = i18n.translate('Customer', 'Certificate');
      expect(translation).toEqual([{ font: undefined, text: 'Client' }]);
    });

    it('correctly translate a Property into 2 languages when externalStandard is CAMPUS', async () => {
      const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
      const extraTranslations = await getExtraTranslations(['EN', 'DE'], defaultSchemaUrl, [
        ExternalStandardsEnum.CAMPUS,
      ]);
      const i18n = new Translate(translations, extraTranslations, ['EN', 'DE']);
      const translation = i18n.extraTranslate(ExternalStandardsEnum.CAMPUS, '1', 'Property', 'Yield stress');
      expect(translation).toEqual([
        { font: undefined, text: 'Yield stress / ' },
        { font: undefined, text: 'Streckspannung' },
      ]);
    });

    it('correctly translate a Property into 1 language when externalStandard is CAMPUS', async () => {
      const translations = await getTranslations(['DE'], defaultSchemaUrl);
      const extraTranslations = await getExtraTranslations(['DE'], defaultSchemaUrl, [ExternalStandardsEnum.CAMPUS]);
      const i18n = new Translate(translations, extraTranslations, ['DE']);
      const translation = i18n.extraTranslate(ExternalStandardsEnum.CAMPUS, '1', 'Property', 'Yield stress');
      expect(translation).toEqual([{ font: undefined, text: 'Streckspannung' }]);
    });

    it('correctly translate a TestCondition into 2 languages when externalStandard is CAMPUS', async () => {
      const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
      const extraTranslations = await getExtraTranslations(['EN', 'DE'], defaultSchemaUrl, [
        ExternalStandardsEnum.CAMPUS,
      ]);
      const i18n = new Translate<Translations, ExtraTranslations>(translations, extraTranslations, ['EN', 'DE']);
      const translation = i18n.extraTranslate(ExternalStandardsEnum.CAMPUS, '785', 'TestConditions', 'of test plate');
      expect(translation).toEqual([
        { font: undefined, text: 'of test plate / ' },
        { font: undefined, text: 'der Testplatte' },
      ]);
    });

    it('returns the default translation when externalStandard is undefined', async () => {
      const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
      const defaultTranslation = 'of test';
      const extraTranslations = await getExtraTranslations(['EN', 'DE'], defaultSchemaUrl, [
        ExternalStandardsEnum.CAMPUS,
      ]);
      const i18n = new Translate<Translations, ExtraTranslations>(translations, extraTranslations, ['EN', 'DE']);
      const translation = i18n.extraTranslate(undefined, '785', 'TestConditions', defaultTranslation);
      expect(translation).toEqual([{ font: undefined, text: defaultTranslation }]);
    });
  });

  describe('languageFontMap', () => {
    it('default languageFontMap is set to {}', async () => {
      const defaultSchemaUrl = 'https://schemas.s1seven.dev/coa-schemas/v1.1.0/schema.json';
      const translations = await getTranslations(['CN', 'EN'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['CN', 'EN']);
      expect(i18n.languageFontMap).toEqual({});
    });

    it('languageFontMap is corretly set', async () => {
      const defaultSchemaUrl = 'https://schemas.s1seven.dev/coa-schemas/v1.1.0/schema.json';
      const translations = await getTranslations(['CN', 'EN'], defaultSchemaUrl);
      const languageFontMap = { CN: 'NotoSansSC' };
      const i18n = new Translate(translations, {}, ['CN', 'EN'], languageFontMap);
      const translation = i18n.translate('Customer', 'Certificate');
      expect(i18n.languageFontMap).toEqual(languageFontMap);
      expect(translation).toEqual([
        { font: 'NotoSansSC', text: '客户 / ' },
        { font: undefined, text: 'Customer' },
      ]);
    });
  });
});
