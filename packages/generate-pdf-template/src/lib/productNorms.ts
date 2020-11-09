import { Translate } from '../../utils/translate';

interface ProductNorms {
  ProductNorm?: string[];
  MaterialNorm?: string[];
  MassNorm?: string[];
  SteelDesignation?: string[];
}

function fillTableRow(arr) {
  if (arr.length === 4) {
    return arr;
  } else {
    arr.push({});
    return fillTableRow(arr);
  }
};

export function productNorms(productNorms: ProductNorms, i18n: Translate) {
  const header = [{ text: i18n.translate('B02', 'certificateFields'), colSpan: 4, style: 'p' }, {}, {}, {}]
  const keys = Object.keys(productNorms).map(key => { return { text: i18n.translate(key, 'otherFields'), style: 'p' } });
  const values = Object.values(productNorms).map(value => value.map(el => { return { text: el, style: 'p' } }));

  return [header, fillTableRow(keys), fillTableRow(values)];
};