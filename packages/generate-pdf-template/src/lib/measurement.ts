import { Translate } from '../../utils/translate';
import { Measurement } from '../types';


export function measurement(measurement, name: string) {
  if (measurement === undefined) return []
  const { Property, Value, Minimum, Maximum, Unit } = measurement;
  const keys = [{text: `${name} ${Property}`, style:'p'}, {text: 'Minimum', style:'p'}, {text: 'Value', style:'p'}, {text: 'Maximum', style:'p'}];
  const values = [{text: Unit, style:'p'}, {text: Minimum, style:'p'}, {text: Value, style:'p'},{text: Maximum, style:'p'}];
  return [keys, values];
}