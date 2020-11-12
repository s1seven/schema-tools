import { measurement } from '../src/lib/measurement';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';
import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';

const defaultSchemaUrl = certificate.RefSchemaUrl || 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Rendering measurement', () => {
  it('', async () => {
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const measruements = measurement(certificate.Certificate.ProductDescription.B10, 'B10', i18n);
    console.log(measruements);
  });
});
