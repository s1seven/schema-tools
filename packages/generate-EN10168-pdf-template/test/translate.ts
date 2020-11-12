import { getTranslations } from '../src/lib/helpers';
import { Translate } from '../src/lib/translate';

const defaultSchemaUrl = 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Translate', () => {
  it('correctly translate certificateFields into 2 languages', async () => {
    const translations = await getTranslations(['DE', 'EN'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const translation = i18n.translate('A01', 'certificateFields');
    expect(translation).toEqual("A01 Herstellerwerk / Manufacturer's plant");
  });

  it('correctly translate certificateGroups into 2 languages', async () => {
    const translations = await getTranslations(['DE', 'FR'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const translation = i18n.translate('ProductDescription', 'certificateGroups');
    expect(translation).toEqual('Beschreibung des Erzeugnisses / Description du produit');
  });
  
  it('correctly translate certificateGroups into 1 language', async () => {
    const translations = await getTranslations(['FR'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const translation = i18n.translate('ChemicalComposition', 'otherFields');
    expect(translation).toEqual('Composition chimique');
  });
});
