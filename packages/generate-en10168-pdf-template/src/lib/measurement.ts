import { TableCell } from 'pdfmake/interfaces';

import { localizeNumber } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import { EN10168CertificateTranslations, I18N, Measurement } from '../types';

export function renderMeasurement(
  measurement: Measurement,
  name: keyof EN10168CertificateTranslations['certificateFields'],
  i18n: I18N,
): TableCell[][] {
  if (!measurement) return [];
  const { Property, Value, Minimum, Maximum, Unit } = measurement;
  return [
    [
      {
        text: [{ text: i18n.translate(name, 'certificateFields') }, { text: ` ${Property || ''}` }],
        style: 'tableHeader',
      },
      {},
      {},
      {
        alignment: 'justify',
        columns: [
          { text: `${localizeNumber(Value, i18n.languages[0])} ${Unit ? Unit : ''}`, style: 'p' },
          { text: Minimum ? `min ${localizeNumber(Minimum, i18n.languages[0])} ${Unit}` : '', style: 'p' },
          { text: Maximum ? `max ${localizeNumber(Maximum, i18n.languages[0])} ${Unit}` : '', style: 'p' },
        ],
      },
    ],
  ];
}

export function renderMeasurementArray(
  measurements: Measurement[],
  name: keyof EN10168CertificateTranslations['certificateFields'],
  i18n: I18N,
): TableCell[][] {
  if (!measurements?.length) return [];
  return [
    [
      { text: i18n.translate(name, 'certificateFields'), style: 'tableHeader' },
      {},
      {},
      {
        text: `${measurements.map(({ Value }) => localizeNumber(Value, i18n.languages[0])).join(', ')} ${
          measurements[0]?.Unit || ''
        }`,
        style: 'p',
      },
    ],
  ];
}
