import {CommercialTransaction} from '../types'
import {Translate} from '../../utils/translate';

function separateCommercialParties(commercialTransaction: CommercialTransaction, i18n: Translate) {
  const initKeys = commercialTransaction['A04'] !== undefined ? [[{ text: i18n.translate('A04', 'certificateFields'), style: 'h3' }]] : [];
  const initValues = commercialTransaction['A04'] !== undefined ? [[{ image: commercialTransaction.A04, width: 150 }]] : [];

  const commercialTransactionParties = Object.keys(commercialTransaction).filter(element => ['A01', 'A06', 'A06.1', 'A06.2', 'A06.3'].includes(element));

  const keys = commercialTransactionParties.map(element => [{ text: i18n.translate(element, 'certificateFields'), style: 'h3' }]);
  const values = commercialTransactionParties.map(element =>
    [{ text: commercialTransaction[element].CompanyName, style: 'p' }, { text: commercialTransaction[element].Street, style: 'p' },
    {
      text: `${commercialTransaction[element].City},${commercialTransaction[element].ZipCode},${commercialTransaction[element].Country}`,
      style: 'p'
    }, { text: commercialTransaction[element].VAT_Id, style: 'p' }, { text: commercialTransaction[element].Email, style: 'p' }]
  );

  return [[...initKeys, ...keys], [...initValues, ...values]];
}

function fillTableRow(arr) {
  if (arr.length === 3){
    return arr;
  } else {
    arr.push('');
    return fillTableRow(arr);
  }
};

function splitIfTooLong<T>(arr: T[]): T[][] | (T |string)[][][] {
  return [[arr.slice(0, 3)], [fillTableRow([...arr.slice(3, arr.length)])]];
}

export function createTransactionParties(commercialTransaction: CommercialTransaction, i18n: Translate) {
  const [keys, values] = separateCommercialParties(commercialTransaction, i18n);
  if (keys.length <= 3) return [fillTableRow(keys), fillTableRow(values)];
  const finalKeys = splitIfTooLong(keys);
  const finalValues = splitIfTooLong(values);
  return [...finalKeys[0], ...finalValues[0], ...finalKeys[1], ...finalValues[1]];
}
