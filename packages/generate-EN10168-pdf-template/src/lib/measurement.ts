import { Measurement, TableCell } from '../types';

export function measurement(measurement: Measurement, name: string): TableCell[][] {
  if (measurement === undefined) return [];
  const { Property, Value, Minimum, Maximum, Unit } = measurement;
  const keys = [
    { text: `${name} ${Property}`, style: 'tableHeader' },
    { text: 'Minimum', style: 'tableHeader' },
    { text: 'Value', style: 'tableHeader' },
    { text: 'Maximum', style: 'tableHeader' },
  ];
  const values = [
    { text: Unit, style: 'p' },
    { text: Minimum, style: 'p' },
    { text: Value, style: 'p' },
    { text: Maximum, style: 'p' },
  ];
  return [keys, values];
}
