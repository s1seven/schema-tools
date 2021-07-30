import { defaultSchemaUrl } from './constants';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/translate';

describe('Translate', () => {
  it('correctly translate Certificate into 2 languages', async () => {
    const translations = await getTranslations(['DE', 'EN'], defaultSchemaUrl);
    const i18n = new Translate(translations, ['DE', 'EN']);
    const translation = i18n.translate('Customer', 'Certificate');
    expect(translation).toEqual('Kunde / Customer'); // eslint-disable-line quotes
  });

  it('correctly translate Certificate into 1 language', async () => {
    const translations = await getTranslations(['FR'], defaultSchemaUrl);
    const i18n = new Translate(translations, ['FR']);
    const translation = i18n.translate('Customer', 'Certificate');
    expect(translation).toEqual('Client');
  });
});
