import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { fillTableRow } from './helpers';
import { Translate } from './translate';

interface ProductNorms {
  ProductNorm?: string[];
  MaterialNorm?: string[];
  MassNorm?: string[];
  SteelDesignation?: string[];
}

export function productNorms(productNorms: ProductNorms, i18n: Translate) {
  const header = [{ text: i18n.translate('B02', 'certificateFields'), colSpan: 4, style: 'tableHeader' }, {}, {}, {}];
  const keys = Object.keys(productNorms).map((key) => ({ text: i18n.translate(key, 'otherFields'), style: 'p' }));
  const values = Object.values(productNorms).map((value) => value.map((el) => ({ text: el, style: 'p' })));

  return [
    header,
    fillTableRow(keys, PRODUCT_DESCRIPTION_COLUMNS_COUNT),
    fillTableRow(values, PRODUCT_DESCRIPTION_COLUMNS_COUNT),
  ];
}
