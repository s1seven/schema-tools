import { tableLayout } from './helpers';
import { supplementaryInformation } from './supplementaryInformation';
import { CommercialTransaction, TableElement } from '../types';
import { Translate } from './translate';

export function createCommercialTransaction(
  commercialTransaction: CommercialTransaction,
  i18n: Translate,
): TableElement {
  const contentToOmit = ['A01', 'A04', 'A06', 'A06.1', 'A06.2', 'A06.3', 'SupplementaryInformation'];
  const content = Object.keys(commercialTransaction)
    .filter((element) => !contentToOmit.includes(element))
    .map((element) => [
      { text: i18n.translate(element, 'certificateFields'), style: 'tableHeader', colSpan: 2 },
      {},
      { text: commercialTransaction[element], style: 'p' },
    ]);

  const suppInformation = commercialTransaction.SupplementaryInformation
    ? supplementaryInformation(commercialTransaction.SupplementaryInformation, i18n)
    : [];

  return {
    style: 'table',
    table: {
      widths: [140, 100, 200],
      body: [
        [{ text: i18n.translate('CommercialTransaction', 'certificateGroups'), style: 'h2', colSpan: 3 }, {}, {}],
        ...content,
        ...suppInformation,
      ],
    },
    layout: tableLayout,
  };
}
