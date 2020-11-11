import { supplementaryInformation } from './supplementaryInformation';
import { CommercialTransaction } from '../types';
import { Translate } from './translate';

export function createCommercialTransaction(commercialTransaction: CommercialTransaction, i18n: Translate) {
  const contentToOmit = ['A01', 'A04', 'A06', 'A06.1', 'A06.2', 'A06.3', 'SupplementaryInformation'];
  const content = Object.keys(commercialTransaction)
    .filter((element) => !contentToOmit.includes(element))
    .map((element) => [
      { text: i18n.translate(element, 'certificateFields'), style: 'tableHeader', colSpan: 2 },
      {},
      { text: commercialTransaction[element], style: 'p' },
    ]);

  const suppInformation = supplementaryInformation(commercialTransaction.SupplementaryInformation, i18n);

  return {
    content: [
      {
        style: 'table',
        table: {
          widths: [150, 100, 200],
          body: [
            [{ text: i18n.translate('CommercialTransaction', 'certificateGroups'), style: 'h2', colSpan: 3 }, {}, {}],
            ...content,
            ...suppInformation,
          ],
        },
        layout: {
          hLineWidth: function () {
            return 0;
          },
          vLineWidth: function () {
            return 0;
          },
          hLineColor: function () {
            return 'gray';
          },
          vLineColor: function () {
            return 'gray';
          },
        },
      },
    ],
  };
}
