import { readFileSync } from 'fs';

import { Translate } from '../src';
import { getTranslations } from './getTranslations';
const extraTranslations = JSON.parse(readFileSync('../../fixtures/CoA/v0.1.1/extraTranslations.json', 'utf8'));

describe('Translate', () => {
  describe('EN10168 certificate', () => {
    const defaultSchemaUrl = 'https://schemas.s1seven.com/en10168-schemas/v0.1.0/schema.json';

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

  describe('CoA certificate CAMPUS', () => {
    const defaultSchemaUrl = 'https://schemas.s1seven.com/coa-schemas/v0.1.0/schema.json';

    it('correctly translate a Property into 2 languages', async () => {
      const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
      const i18n = new Translate(translations, extraTranslations, ['EN', 'DE']);
      const translation = i18n.extraTranslate('CAMPUS', '1', 'Property', 'Yield stress');
      expect(translation).toEqual('Yield stress / Streckspannung');
    });

    it('correctly translate a Property into 2 languages', async () => {
      const translations = await getTranslations(['DE'], defaultSchemaUrl);
      const i18n = new Translate(translations, extraTranslations, ['DE']);
      const translation = i18n.extraTranslate('CAMPUS', '1', 'Property', 'Yield stress');
      expect(translation).toEqual('Streckspannung');
    });

    it('correctly translate a TestCondition into 2 languages', async () => {
      const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
      const i18n = new Translate(translations, extraTranslations, ['EN', 'DE']);
      const translation = i18n.extraTranslate('CAMPUS', '785', 'TestConditions', 'of test plate');
      expect(translation).toEqual('of test plate / der Testplatte');
    });
  });
});
