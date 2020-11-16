import { ProductShape, TableCell } from '../types';
import { Translate } from './translate';

export function productShape(productShape: ProductShape, i18n: Translate): TableCell[][] {
  if (productShape === undefined) return [];
  const header = [{ text: i18n.translate('B09', 'certificateFields'), style: 'tableHeader', colSpan: 4 }, {}, {}, {}];

  const content = Object.keys(productShape).map((key) => [
    { text: i18n.translate(key, 'otherFields'), style: 'caption', colSpan: 3 },
    {},
    {},
    { text: productShape[key], style: 'caption' },
  ]);
  return [header, ...content];
}
