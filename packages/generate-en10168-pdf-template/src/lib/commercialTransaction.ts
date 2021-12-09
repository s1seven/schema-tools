import { ContentCanvas, ContentText } from 'pdfmake/interfaces';

import {
  createEmptyColumns,
  TableElement,
  tableLayout,
  Translate,
} from '@s1seven/schema-tools-generate-pdf-template-helpers';

import { CommercialTransaction } from '../types';
import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { supplementaryInformation } from './supplementaryInformation';

export function createCommercialTransaction(
  commercialTransaction: CommercialTransaction,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement, TableElement] {
  const contentToOmit = ['A01', 'A04', 'A06', 'A06.1', 'A06.2', 'A06.3', 'SupplementaryInformation'];
  const content = Object.keys(commercialTransaction)
    .filter((element) => !contentToOmit.includes(element))
    .map((element) => [
      { text: i18n.translate(element, 'certificateFields'), style: 'tableHeader', colSpan: 3 },
      {},
      {},
      { text: commercialTransaction[element], style: 'p' },
    ]);

  const suppInformation = commercialTransaction.SupplementaryInformation
    ? supplementaryInformation(commercialTransaction.SupplementaryInformation, i18n, PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : createEmptyColumns(PRODUCT_DESCRIPTION_COLUMNS_COUNT);

  return [
    { text: `${i18n.translate('CommercialTransaction', 'certificateGroups')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      id: 'CommercialTransaction',
      table: {
        widths: [160, '*', '*', 300],
        body: content,
      },
      layout: tableLayout,
    },
    {
      style: 'table',
      table: {
        widths: [160, '*', 160, 130],
        body: suppInformation,
      },
      layout: tableLayout,
    },
  ];
}
