import { ChemicalComposition, ChemicalElement, TableElement } from '../types';
import { supplementaryInformation } from './supplementaryInformation';
import { tableLayout } from './tableLayout';
import { Translate } from './translate';

export function fillTableRow(arr: any[], colCounts: number, fill = {}) {
  if (arr.length === colCounts) {
    return arr;
  } else {
    arr.push(fill);
    return fillTableRow(arr, colCounts);
  }
}

export function renderChemicalComposition(chemicalComposition: ChemicalComposition, i18n: Translate): TableElement {
  const ChemicalElements: { key: string; value: ChemicalElement }[] = Object.keys(chemicalComposition)
    .filter((element) => element !== 'SupplementaryInformation')
    .map((el) => ({ key: el, value: chemicalComposition[el] }));

  const tableBody = [
    [
      { text: '', style: ' caption' },
      ...ChemicalElements.map((chemicalElement) => ({ text: chemicalElement.key, style: 'caption' })),
    ],
    [
      { text: 'Symbol', style: 'caption' },
      ...ChemicalElements.map((chemicalElement) => ({ text: chemicalElement.value.Symbol, style: 'caption' })),
    ],
    [
      { text: 'Actual', style: 'caption' },
      ...ChemicalElements.map((chemicalElement) => ({ text: chemicalElement.value.Actual, style: 'small' })),
    ],
  ];

  const suppInformation = chemicalComposition.SupplementaryInformation
    ? supplementaryInformation(chemicalComposition.SupplementaryInformation, i18n, ChemicalElements.length + 1)
    : [];

  return {
    style: 'table',
    table: {
      // widths: Array(ChemicalElements.length + 1).fill(10),
      body: [...tableBody, ...suppInformation],
    },
    layout: tableLayout,
  };
}
