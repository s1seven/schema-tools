import { CommercialTransaction } from '../types';
import { TRANSACTION_COLUMNS_COUNT } from './constants';
import { fillTableRow } from './helpers';
import { Translate } from './translate';

function separateCommercialParties(commercialTransaction: CommercialTransaction, i18n: Translate) {
  const initKeys =
    commercialTransaction['A04'] !== undefined
      ? [[{ text: i18n.translate('A04', 'certificateFields'), style: 'tableHeader' }]]
      : [];
  const initValues =
    commercialTransaction['A04'] !== undefined ? [[{ image: commercialTransaction.A04, width: 150 }]] : [];

  const commercialTransactionParties = Object.keys(commercialTransaction).filter((element) =>
    ['A01', 'A06', 'A06.1', 'A06.2', 'A06.3'].includes(element),
  );

  const keys = commercialTransactionParties.map((element) => [
    { text: i18n.translate(element, 'certificateFields'), style: 'tableHeader' },
  ]);
  const values = commercialTransactionParties.map((element) => [
    { text: commercialTransaction[element].CompanyName, style: 'p' },
    { text: commercialTransaction[element].Street, style: 'p' },
    {
      text: `${commercialTransaction[element].City},${commercialTransaction[element].ZipCode},${commercialTransaction[element].Country}`,
      style: 'p',
    },
    { text: commercialTransaction[element].VAT_Id, style: 'p' },
    { text: commercialTransaction[element].Email, style: 'p' },
  ]);

  return [
    [...initKeys, ...keys],
    [...initValues, ...values],
  ];
}

function splitIfTooLong<T>(arr: T[]): T[][] | (T | string)[][][] {
  return [
    [arr.slice(0, TRANSACTION_COLUMNS_COUNT)],
    [fillTableRow([...arr.slice(TRANSACTION_COLUMNS_COUNT, arr.length)], TRANSACTION_COLUMNS_COUNT, '')],
  ];
}

export function createTransactionParties(commercialTransaction: CommercialTransaction, i18n: Translate) {
  const [keys, values] = separateCommercialParties(commercialTransaction, i18n);
  if (keys.length <= TRANSACTION_COLUMNS_COUNT) {
    const contentBody = [
      fillTableRow(keys, TRANSACTION_COLUMNS_COUNT, ''), 
      fillTableRow(values, TRANSACTION_COLUMNS_COUNT, ''),
    ];
    return {
      content: [
        {
          style: 'table',
          table: {
            widths: [200, 150, 150],
            body: contentBody,
          },
          layout: {
            hLineWidth: function () {
              return 0;
            },
            vLineWidth: function () {
              return 0;
            },
          },
        },
      ],
    };
  }
  const finalKeys = splitIfTooLong(keys);
  const finalValues = splitIfTooLong(values);
  const contentBody = [...finalKeys[0], ...finalValues[0], ...finalKeys[1], ...finalValues[1]];

  return {
    content: [
      {
        style: 'table',
        table: {
          widths: [200, 150, 150],
          body: contentBody,
        },
        layout: {
          hLineWidth: function () {
            return 0;
          },
          vLineWidth: function () {
            return 0;
          },
        },
      },
    ],
  };
}
