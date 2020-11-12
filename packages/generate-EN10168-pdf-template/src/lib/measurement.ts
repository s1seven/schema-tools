import { Measurement, TableCell } from '../types';
import { Translate } from './translate';

export function measurement(measurement: Measurement, name: string, i18n: Translate): TableCell[][] {
  if (measurement === undefined) return [];
  const { Property, Value, Minimum, Maximum, Unit } = measurement;
  return [
    [
      { text: `${i18n.translate(name, 'certificateFields')} ${Property ? Property : ''}`, style: 'tableHeader' },
      {},
      {},
      {
        aling: 'justify',
        columns: [
          { text: `${Value} ${Unit ? Unit : ''}` },
          { text: `${Minimum ? `min ${Minimum} ${Unit}` : ''}` },
          { text: `${Maximum ? `max ${Maximum} ${Unit}` : ''}` },
        ],
      },
    ],
  ];
}
