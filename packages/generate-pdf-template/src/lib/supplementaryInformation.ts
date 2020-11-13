import { CommercialTransactionSupplementaryInformation, TableCell } from '../types';
import { createEmptyColumns } from './helpers';
import { Translate } from './translate';

export const supplementaryInformation = (
  data: CommercialTransactionSupplementaryInformation,
  i18n: Translate,
  colSpan = 3,
): TableCell[][] => {
  const dataMapped = Object.keys(data).map((element) => [
    { text: data[element].Key, style: 'tableHeader', colSpan: colSpan - 1 },
    ...createEmptyColumns(colSpan - 2),
    { text: `${data[element].Value} ${data[element].Unit ? data[element].Unit : ''}`, style: 'p', colSpan: 1 },
  ]);

  if (dataMapped.length === 0) return [];
  return [
    [
      { text: i18n.translate('SupplementaryInformation', 'otherFields'), style: 'h5', colSpan },
      ...createEmptyColumns(colSpan - 1),
    ],
    ...dataMapped,
  ];
};