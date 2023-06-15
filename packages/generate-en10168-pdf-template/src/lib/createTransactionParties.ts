import { fillTableRow, TableElement, tableLayout } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import { CommercialTransaction, I18N } from '../types';
import { TRANSACTION_COLUMNS_COUNT } from './constants';

function separateCommercialParties(commercialTransaction: CommercialTransaction, i18n: I18N) {
  const initKeys = commercialTransaction['A04']
    ? [
        [
          {
            text: i18n.translate('A04', 'certificateFields'),
            style: 'tableHeader',
          },
        ],
      ]
    : [];
  const initValues = commercialTransaction['A04'] ? [[{ image: commercialTransaction.A04, width: 150 }]] : [];

  type FilteredKeys = keyof Pick<CommercialTransaction, 'A01' | 'A06' | 'A06.1' | 'A06.2' | 'A06.3'>;
  const filteredKeys: FilteredKeys[] = ['A01', 'A06', 'A06.1', 'A06.2', 'A06.3'];
  const commercialTransactionParties = Object.keys(commercialTransaction).filter((element) =>
    filteredKeys.includes(element as FilteredKeys),
  ) as FilteredKeys[];

  const keys = commercialTransactionParties.map((element) => [
    {
      text: i18n.translate(element, 'certificateFields'),
      style: 'tableHeader',
    },
  ]);
  const values = commercialTransactionParties.map((element) =>
    [
      {
        text: commercialTransaction[element].CompanyName || commercialTransaction[element].Name,
        style: 'p',
      },
      Array.isArray(commercialTransaction[element].Street)
        ? commercialTransaction[element].Street.map((street) => ({
            text: street,
            style: 'p',
          }))
        : { text: commercialTransaction[element].Street, style: 'p' },
      {
        text: `${commercialTransaction[element].City},${commercialTransaction[element].ZipCode},${commercialTransaction[element].Country}`,
        style: 'p',
      },
      commercialTransaction[element].Email ? { text: commercialTransaction[element].Email, style: 'p' } : undefined,
    ].filter(Boolean),
  );

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

export function createTransactionParties(commercialTransaction: CommercialTransaction, i18n: I18N): TableElement {
  const [keys, values] = separateCommercialParties(commercialTransaction, i18n);
  if (keys?.length <= TRANSACTION_COLUMNS_COUNT) {
    const contentBody = [
      fillTableRow(keys, TRANSACTION_COLUMNS_COUNT, ''),
      fillTableRow(values, TRANSACTION_COLUMNS_COUNT, ''),
    ];
    return {
      style: 'table',
      table: {
        widths: [200, 150, 150],
        body: contentBody,
      },
      layout: tableLayout,
    };
  }
  const finalKeys = splitIfTooLong(keys);
  const finalValues = splitIfTooLong(values);
  const contentBody = [...finalKeys[0], ...finalValues[0], ...finalKeys[1], ...finalValues[1]];

  return {
    style: 'table',
    table: {
      widths: [200, 150, 150],
      body: contentBody,
    },
    layout: tableLayout,
  };
}
