import { localizeNumber } from './helpers';
import { Translate } from './translate';
import { Measurement } from '../types';
import { TableCell } from 'pdfmake/interfaces';

export function renderMeasurement(measurement: Measurement, name: string, i18n: Translate): TableCell[][] {
  if (!measurement) return [];
  const { Property, Value, Minimum, Maximum, Unit } = measurement;
  return [
    [
      { text: `${i18n.translate(name, 'certificateFields')} ${Property ? Property : ''}`, style: 'tableHeader' },
      {},
      {},
      {
        alignment: 'justify',
        columns: [
          { text: `${localizeNumber(Value, i18n.languages[0])} ${Unit ? Unit : ''}`, style: 'p' },
          { text: `${Minimum ? `min ${localizeNumber(Minimum, i18n.languages[0])} ${Unit}` : ''}`, style: 'p' },
          { text: `${Maximum ? `max ${localizeNumber(Maximum, i18n.languages[0])} ${Unit}` : ''}`, style: 'p' },
        ],
      },
    ],
  ];
}

export function renderMeasurementArray(measurements: Measurement[], name: string, i18n: Translate): TableCell[][] {
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
