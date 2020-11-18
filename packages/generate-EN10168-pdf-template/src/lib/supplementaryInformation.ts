import { createEmptyColumns, localizeValue } from './helpers';
import { Translate } from './translate';
import { CommercialTransactionSupplementaryInformation, TableCell } from '../types';

export const supplementaryInformation = (
  data: CommercialTransactionSupplementaryInformation,
  i18n: Translate,
  colSpan = 3,
): TableCell[][] => {
  const dataMapped = Object.keys(data).map((element) => [
    { text: `${element} ${data[element].Key}`, style: 'tableHeader', colSpan: colSpan - 1 },
    ...createEmptyColumns(colSpan - 2),
    {
      text: `${localizeValue(data[element].Value, data[element].Type, i18n.languages[0])} ${data[element].Unit || ''}`,
      style: 'p',
      colSpan: 1,
    },
  ]);

  if (!dataMapped?.length) return [];
  return [
    [
      { text: i18n.translate('SupplementaryInformation', 'otherFields'), style: 'h5', colSpan },
      ...createEmptyColumns(colSpan - 1),
    ],
    ...dataMapped,
  ];
};
