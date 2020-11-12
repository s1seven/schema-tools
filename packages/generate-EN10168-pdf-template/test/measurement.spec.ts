import { measurement } from '../src/lib/measurement';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';
import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';

const defaultSchemaUrl = certificate.RefSchemaUrl || 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Rendering measurement', () => {
  it('works for example certificate', async () => {
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const measurements = measurement(certificate.Certificate.ProductDescription.B10, 'B10', i18n);
    const expected = [
      { text: 'B10 Length / Länge ', style: 'tableHeader' },
      {},
      {},
      { aling: 'justify', columns: [{ text: '1200 mm' }, { text: '' }, { text: '' }] },
    ];
    expect(measurements[0]).toEqual(expected);
  });
  it('renders correctly with Maximun, Minimum and Property', async () => {
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const input = {
      Value: 200,
      Minimum: 100,
      Maximum: 350,
      Unit: 'mm',
      Property: 'LengthProperty',
    };
    const measurements = measurement(input, 'B10', i18n);
    const expected = [
      { text: 'B10 Length / Länge LengthProperty', style: 'tableHeader' },
      {},
      {},
      { aling: 'justify', columns: [{ text: '200 mm' }, { text: 'min 100 mm' }, { text: 'max 350 mm' }] },
    ];
    expect(measurements[0]).toEqual(expected);
  });
});
