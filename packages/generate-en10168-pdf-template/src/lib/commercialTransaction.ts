import { ContentCanvas, ContentText } from 'pdfmake/interfaces';

import { createEmptyColumns, TableElement, tableLayout } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import { CommercialTransaction, EN10168CertificateTranslations, I18N } from '../types';
import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { supplementaryInformation } from './supplementaryInformation';

export function createCommercialTransaction(
  commercialTransaction: CommercialTransaction,
  i18n: I18N,
): [ContentText, ContentCanvas, TableElement, TableElement] {
  type KeysToOmit = keyof Pick<
    CommercialTransaction,
    'A01' | 'A04' | 'A06' | 'A06.1' | 'A06.2' | 'A06.3' | 'SupplementaryInformation'
  >;
  const contentToOmit: KeysToOmit[] = ['A01', 'A04', 'A06', 'A06.1', 'A06.2', 'A06.3', 'SupplementaryInformation'];
  const content = Object.keys(commercialTransaction)
    .filter((element: keyof CommercialTransaction) => !contentToOmit.includes(element as KeysToOmit))
    .map((element: keyof Omit<CommercialTransaction, KeysToOmit>) => [
      {
        text: i18n.translate(element as keyof EN10168CertificateTranslations['certificateFields'], 'certificateFields'),
        style: 'tableHeader',
        colSpan: 3,
      },
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
