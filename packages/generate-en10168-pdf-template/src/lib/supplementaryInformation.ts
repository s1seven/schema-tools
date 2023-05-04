import type { TableCell } from 'pdfmake/interfaces';

import { createEmptyColumns, localizeValue } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import { I18N, KeyValueObject } from '../types';

export const supplementaryInformation = (
  data: { [k: string]: KeyValueObject },
  i18n: I18N,
  colSpan = 3,
): TableCell[][] => {
  const dataMapped: TableCell[][] = Object.keys(data).map((element) => {
    const { Interpretation, Key, Value, Type, Unit } = data[element];
    const emptyColumnsCount = colSpan - 3;
    const tableCells: TableCell[] = [
      { text: `${element} ${Key}`, style: 'tableHeader', colSpan: colSpan - 2 },
      {
        text: `${localizeValue(Value, Type, i18n.languages[0])} ${Unit || ''}`,
        style: 'p',
        colSpan: 1,
      },
      {
        text: Interpretation || '',
        style: 'p',
        colSpan: 1,
      },
    ];

    if (emptyColumnsCount > 0) {
      createEmptyColumns(emptyColumnsCount).forEach((col, i) => {
        tableCells.splice(1 + i, 0, col);
      });
    }
    return tableCells;
  });

  if (!dataMapped?.length) return [];
  return [
    [
      { text: i18n.translate('SupplementaryInformation', 'otherFields'), style: 'h5', colSpan },
      ...createEmptyColumns(colSpan - 1),
    ],
    ...dataMapped,
  ];
};
