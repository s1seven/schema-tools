import { Translate } from './translate';
import { TableCell } from '../types';

interface ProductNorms {
  ProductNorm?: string[];
  MaterialNorm?: string[];
  MassNorm?: string[];
  SteelDesignation?: string[];
}

export function productNorms(productNorms: ProductNorms, i18n: Translate): TableCell[][] {
  const header = [{ text: i18n.translate('B02', 'certificateFields'), colSpan: 4, style: 'tableHeader' }, {}, {}, {}];

  const aaa = Object.keys(productNorms).map((norm) => [
    { text: i18n.translate(norm, 'otherFields'), style: 'tableHeader', colSpan: 3 },
    {},
    {},
    { text: productNorms[norm].join(', '), style: 'p' },
  ]);

  return [header, ...aaa];
}
