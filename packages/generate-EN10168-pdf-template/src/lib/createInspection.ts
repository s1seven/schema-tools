import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { supplementaryInformation } from './supplementaryInformation';
import { Content, Inspection, TableElement } from '../types';
import { Translate } from './translate';
import { tableLayout } from './tableLayout';
import { renderChemicalComposition } from './helpers';

export function createInspection(inspection: Inspection, i18n: Translate): (TableElement | Content)[] {
  const contentToRender = ['C00', 'C01', 'C02', 'C03'];
  const content = Object.keys(inspection)
    .filter((element) => contentToRender.includes(element))
    .map((element) => [
      { text: i18n.translate(element, 'certificateFields'), style: 'tableHeader', colSpan: 3 },
      {},
      {},
      { text: inspection[element], style: 'p' },
    ]);

  const suppInformation = inspection.SupplementaryInformation
    ? supplementaryInformation(inspection.SupplementaryInformation, i18n, PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : [];

  // TODO: TensileTest, HardnessTest, NotchedBarImpactTest, OtherMechanicalTests

  const chemicalComposition = inspection.ChemicalComposition
    ? renderChemicalComposition(inspection.ChemicalComposition, i18n)
    : ({} as TableElement);

  return [
    {
      style: 'table',
      table: {
        widths: [150, '*', '*', 300],
        body: [
          [{ text: i18n.translate('Inspection', 'certificateGroups'), style: 'h2', colSpan: 4 }, {}, {}, {}],
          ...content,
          ...suppInformation,
        ],
      },
      layout: tableLayout,
    },
    { text: i18n.translate('ChemicalComposition', 'otherFields'), style: 'h3' },
    chemicalComposition,
  ];
}
