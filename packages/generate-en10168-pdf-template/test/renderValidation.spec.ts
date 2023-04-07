import { createValidation } from '../src/lib/createValidation';
import { EN10168Translations } from '../src/types';
import { certificate, defaultSchemaUrl } from './constants';
import { getI18N, getTranslations } from './getTranslations';

describe('Rendering validation section', () => {
  let translations: EN10168Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders Validation without suppInformation', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const validation = createValidation(certificate.Certificate.Validation as any, i18n);

    expect(validation[0]).toEqual({
      margin: [0, 0, 0, 4],
      style: 'h2',
      text: [
        {
          font: undefined,
          text: 'Validation / ',
        },
        {
          font: undefined,
          text: 'Bestätigungen',
        },
      ],
    });

    expect((validation[2].columns as any)[0].table).toEqual({
      body: [
        [
          {
            colSpan: 2,
            style: 'tableHeader',
            text: [
              {
                text: 'Z01 ',
              },
              {
                font: undefined,
                text: 'Statement of compliance / ',
              },
              {
                font: undefined,
                text: 'Konformitätserklärung',
              },
            ],
          },
          {},
          {
            style: 'p',
            text: 'We hereby certify, that the material described above has been tested and complies with the terms of the order. This certificate has been created by a data processing system and does not contain a personal signature but the name and the offical address of the appointet department.',
          },
        ],
        [
          {
            colSpan: 2,
            style: 'tableHeader',
            text: [
              {
                text: 'Z02 ',
              },
              {
                font: undefined,
                text: 'Date of issue and validation / ',
              },
              {
                font: undefined,
                text: 'Datum der Ausstellung und Bestätigung',
              },
            ],
          },
          {},
          {
            style: 'p',
            text: '10/23/2018',
          },
        ],
        [
          {
            colSpan: 2,
            style: 'tableHeader',
            text: [
              {
                text: 'Z03 ',
              },
              {
                font: undefined,
                text: 'Stamp of the inspection representative / ',
              },
              {
                font: undefined,
                text: 'Stempel des/der Abnahmebeauftragten',
              },
            ],
          },
          {},
          {
            style: 'p',
            text: 'Mr. Super Inspector',
          },
        ],
      ],
      widths: [160, '*', 180],
    });
  });
});
