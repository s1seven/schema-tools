import { createEmptyColumns, localizeValue, Translate } from '@s1seven/schema-tools-generate-pdf-template-helpers';
import { KeyValueObject } from '../types';
import { TableCell } from 'pdfmake/interfaces';

export const supplementaryInformation = (
  data: { [k: string]: KeyValueObject },
  i18n: Translate,
  colSpan = 3,
): TableCell[][] => {
  // TODO: to allow using intepretation in any supplementaryInformation, parent table layout will have to be adapated
  // const dataMapped: TableCell[][] = Object.keys(data).map((element) => {
  //   const { Interpretation, Key, Value, Type, Unit } = data[element];
  //   const tableCells: TableCell[] = [
  //     { text: `${element} ${Key}`, style: 'tableHeader', colSpan: colSpan - 2 },
  //     {
  //       text: `${localizeValue(Value, Type, i18n.languages[0])} ${Unit || ''}`,
  //       style: 'p',
  //       colSpan: 1,
  //     },
  //     {
  //       text: Interpretation || '',
  //       style: 'p',
  //       colSpan: 1,
  //     },
  //   ];

  //   if (colSpan - 3 > 0) {
  //     createEmptyColumns(colSpan - 3).forEach((col, i) => {
  //       tableCells.splice(1 + i, 0, col);
  //     });
  //   }
  //   return tableCells;
  // });

  const dataMapped: TableCell[][] = Object.keys(data).map((element) => {
    const { Key, Value, Type, Unit } = data[element];
    return [
      { text: `${element} ${Key}`, style: 'tableHeader', colSpan: colSpan - 1 },
      ...createEmptyColumns(colSpan - 2),
      {
        text: `${localizeValue(Value, Type, i18n.languages[0])} ${Unit || ''}`,
        style: 'p',
        colSpan: 1,
      },
    ];
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
