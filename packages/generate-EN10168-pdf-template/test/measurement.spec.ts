import { renderMeasurement, renderMeasurementArray } from '../src/lib/measurement';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';
import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';

const defaultSchemaUrl = certificate.RefSchemaUrl || 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Rendering measurement', () => {
  let translations: Record<string, unknown>;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('works for example certificate', async () => {
    const i18n = new Translate(translations);
    const measurements = renderMeasurement(certificate.Certificate.ProductDescription.B10, 'B10', i18n);
    const expected = [
      { text: 'B10 Length / Länge ', style: 'tableHeader' },
      {},
      {},
      {
        alignment: 'justify',
        columns: [
          { text: '1,200 mm', style: 'p' },
          { text: '', style: 'p' },
          { text: '', style: 'p' },
        ],
      },
    ];
    expect(measurements[0]).toEqual(expected);
  });

  it('renders correctly with Maximun, Minimum and Property', async () => {
    const i18n = new Translate(translations);
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
    const i18n = new Translate(translations);
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
