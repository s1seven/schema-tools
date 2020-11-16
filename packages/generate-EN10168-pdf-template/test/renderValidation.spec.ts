import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';
import { createValidation } from '../src/lib/createValidation';

const defaultSchemaUrl = 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Rendering validation section', () => {
  let translations: Record<string, unknown>;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders Validation without suppInformation', () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE });
    const validation = createValidation(certificate.Certificate.Validation, i18n);

    expect(validation[0].table).toEqual({
      body: [
        [
          {
            colSpan: 3,
            style: 'h2',
            text: 'Validation / Bestätigungen',
          },
          {},
          {},
        ],
      ],
      widths: [160, '*', 300],
    });

    expect((validation[1].columns as any)[0].table).toEqual({
      body: [
        [
          {
            colSpan: 2,
            style: 'tableHeader',
            text: 'Z01 Statement of compliance / Konformitätserklärung',
          },
          {},
          {
            style: 'p',
            text: 'The producer guarantees that delivered goods are in accordance with the conditions of the order.',
          },
        ],
        [
          {
            colSpan: 2,
            style: 'tableHeader',
            text: 'Z02 Date of issue and validation / Datum der Ausstellung und Bestätigung',
          },
          {},
          {
            style: 'p',
            text: 'Friday, 4/26/2019',
          },
        ],
        [
          {
            colSpan: 2,
            style: 'tableHeader',
            text: 'Z03 Stamp of the inspection representative / Stempel des/der Abnahmebeauftragten',
          },
          {},
          {
            style: 'p',
            text: 'Konrad ANDRECKI',
          },
        ],
      ],
      widths: [160, '*', 180],
    });
  });
});
