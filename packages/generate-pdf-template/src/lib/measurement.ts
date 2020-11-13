import { Measurement, TableCell } from '../types';
import { Translate } from './translate';

export function renderMeasurement(measurement: Measurement, name: string, i18n: Translate): TableCell[][] {
  if (measurement === undefined) return [];
  const { Property, Value, Minimum, Maximum, Unit } = measurement;
  return [
    [
      { text: `${i18n.translate(name, 'certificateFields')} ${Property ? Property : ''}`, style: 'tableHeader' },
      {},
      {},
      {
        alignment: 'justify',
        columns: [
          { text: `${Value} ${Unit ? Unit : ''}`, style: 'p' },
          { text: `${Minimum ? `min ${Minimum} ${Unit}` : ''}`, style: 'p' },
          { text: `${Maximum ? `max ${Maximum} ${Unit}` : ''}`, style: 'p' },
        ],
      },
    ],
  ];
}

export function renderMeasurementArray(measurements: Measurement[], name: string, i18n: Translate): TableCell[][] {
  if (measurements === undefined) return [];
  return [
    [
      { text: i18n.translate(name, 'certificateFields'), style: 'tableHeader' },
      {},
      {},
      {
        text: `${measurements.map(({ Value }) => Value).join(', ')} ${measurements[0]?.Unit || ''}`,
        style: 'p',
      },
    ],
  ];
}
