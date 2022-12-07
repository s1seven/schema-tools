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
      expect(translation).toEqual("A01 Herstellerwerk / Manufacturer's plant"); // eslint-disable-line quotes
    });

    it('correctly translate certificateGroups into 2 languages', async () => {
      const translations = await getTranslations(['DE', 'FR'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['DE', 'FR']);
      const translation = i18n.translate('ProductDescription', 'certificateGroups');
      expect(translation).toEqual('Beschreibung des Erzeugnisses / Description du produit');
    });

    it('correctly translate certificateGroups into 1 language', async () => {
      const translations = await getTranslations(['FR'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['FR']);
      const translation = i18n.translate('ChemicalComposition', 'otherFields');
      expect(translation).toEqual('Composition chimique');
    });
  });

  describe('CoA certificate', () => {
    const defaultSchemaUrl = 'https://schemas.s1seven.dev/coa-schemas/v0.2.0/schema.json';

    it('correctly translate Certificate into 2 languages', async () => {
      const translations = await getTranslations(['DE', 'EN'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['DE', 'EN']);
      const translation = i18n.translate('Customer', 'Certificate');
      expect(translation).toEqual('Kunde / Customer');
    });

    it('correctly translate Certificate into 1 language', async () => {
      const translations = await getTranslations(['FR'], defaultSchemaUrl);
      const i18n = new Translate(translations, {}, ['FR']);
      const translation = i18n.translate('Customer', 'Certificate');
      expect(translation).toEqual('Client');
    });

    it('correctly translate a Property into 2 languages when externalStandard is CAMPUS', async () => {
      const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
      const extraTranslations = await getExtraTranslations(['EN', 'DE'], defaultSchemaUrl, [
        ExternalStandardsEnum.CAMPUS,
      ]);
      const i18n = new Translate(translations, extraTranslations, ['EN', 'DE']);
      const translation = i18n.extraTranslate(ExternalStandardsEnum.CAMPUS, '1', 'Property', 'Yield stress');
      expect(translation).toEqual('Yield stress / Streckspannung');
    });

    it('correctly translate a Property into 2 languages when externalStandard is CAMPUS', async () => {
      const translations = await getTranslations(['DE'], defaultSchemaUrl);
      const extraTranslations = await getExtraTranslations(['DE'], defaultSchemaUrl, [ExternalStandardsEnum.CAMPUS]);
      const i18n = new Translate(translations, extraTranslations, ['DE']);
      const translation = i18n.extraTranslate(ExternalStandardsEnum.CAMPUS, '1', 'Property', 'Yield stress');
      expect(translation).toEqual('Streckspannung');
    });

    it('correctly translate a TestCondition into 2 languages when externalStandard is CAMPUS', async () => {
      const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
      const extraTranslations = await getExtraTranslations(['EN', 'DE'], defaultSchemaUrl, [
        ExternalStandardsEnum.CAMPUS,
      ]);
      const i18n = new Translate<Translations, ExtraTranslations>(translations, extraTranslations, ['EN', 'DE']);
      const translation = i18n.extraTranslate(ExternalStandardsEnum.CAMPUS, '785', 'TestConditions', 'of test plate');
      expect(translation).toEqual('of test plate / der Testplatte');
    });

    it('returns the default translation when externalStandard is undefined', async () => {
      const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
      const defaultTranslation = 'of test';
      const extraTranslations = await getExtraTranslations(['EN', 'DE'], defaultSchemaUrl, [
        ExternalStandardsEnum.CAMPUS,
      ]);
      const i18n = new Translate<Translations, ExtraTranslations>(translations, extraTranslations, ['EN', 'DE']);
      const translation = i18n.extraTranslate(undefined, '785', 'TestConditions', defaultTranslation);
      expect(translation).toEqual(defaultTranslation);
    });
  });
});
