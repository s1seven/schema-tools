import { renderMeasurement, renderMeasurementArray } from '../src/lib/measurement';
import { EN10168Translations } from '../src/types';
import { certificate, defaultSchemaUrl } from './constants';
import { getI18N, getTranslations } from './getTranslations';

describe('Rendering measurement', () => {
  let translations: EN10168Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('works for example certificate', async () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const measurements = renderMeasurement(certificate.Certificate.ProductDescription.B10, 'B10', i18n);
    const expected = [
      { text: 'B10 Length / Länge Length', style: 'tableHeader' },
      {},
      {},
      {
        alignment: 'justify',
        columns: [
          { text: '12,000 mm', style: 'p' },
          { text: '', style: 'p' },
          { text: '', style: 'p' },
        ],
      },
    ];
    expect(measurements[0]).toEqual(expected);
  });

  it('renders correctly with Maximum, Minimum and Property', async () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const input = {
      Value: 200,
      Minimum: 100,
      Maximum: 350,
      Unit: 'mm',
      Property: 'LengthProperty',
    };
    const measurements = renderMeasurement(input, 'B10', i18n);
    const expected = [
      { text: 'B10 Length / Länge LengthProperty', style: 'tableHeader' },
      {},
      {},
      {
        alignment: 'justify',
        columns: [
          { text: '200 mm', style: 'p' },
          { text: 'min 100 mm', style: 'p' },
          { text: 'max 350 mm', style: 'p' },
        ],
      },
    ];
    expect(measurements[0]).toEqual(expected);
  });

  it('renders correctly Measurement array ', async () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const input = [
      {
        Value: 200,
        Unit: 'mm',
        Property: 'LengthProperty',
      },
      {
        Value: 250,
        Unit: 'mm',
        Property: 'LengthProperty',
      },
    ];
    const measurements = renderMeasurementArray(input, 'C31', i18n);
    const expected = [
      { text: 'C31 Individual values / Einzelwerte', style: 'tableHeader' },
      {},
      {},
      {
        style: 'p',
        text: '200, 250 mm',
      },
    ];
    expect(measurements[0]).toEqual(expected);
  });
});
