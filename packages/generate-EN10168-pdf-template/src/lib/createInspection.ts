import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { createEmptyColumns } from './helpers';
import { renderMeasurement, renderMeasurementArray } from './measurement';
import { supplementaryInformation } from './supplementaryInformation';
import {
  ChemicalComposition,
  ChemicalElement,
  Content,
  ContentText,
  HardnessTest,
  Inspection,
  NotchedBarImpactTest,
  OtherMechanicalTests,
  TableElement,
  TensileTest,
} from '../types';
import { Translate } from './translate';
import { tableLayout } from './tableLayout';

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

  const tensileTest = inspection.TensileTest ? renderTensileTest(inspection.TensileTest, i18n) : [];
  const hardnessTest = inspection.HardnessTest ? renderHardnessTest(inspection.HardnessTest, i18n) : [];
  const notchedBarImpactTest = inspection.NotchedBarImpactTest
    ? renderNotchedBarImpactTest(inspection.NotchedBarImpactTest, i18n)
    : [];
  const otherMechanicalTests = inspection.OtherMechanicalTests
    ? renderOtherMechanicalTests(inspection.OtherMechanicalTests, i18n)
    : [];
  const chemicalComposition = inspection.ChemicalComposition
    ? renderChemicalComposition(inspection.ChemicalComposition, i18n)
    : [];

  return [
    {
      id: 'Inspection',
      style: 'table',
      table: {
        widths: [160, '*', '*', 300],
        body: [
          [{ text: i18n.translate('Inspection', 'certificateGroups'), style: 'h2', colSpan: 4 }, {}, {}, {}],
          ...content,
          ...suppInformation,
        ],
      },
      layout: tableLayout,
    },
    ...tensileTest,
    ...hardnessTest,
    ...notchedBarImpactTest,
    ...otherMechanicalTests,
    ...chemicalComposition,
  ];
}

function renderTensileTest(tensileTest: TensileTest, i18n: Translate): [ContentText, TableElement] {
  const C10 = tensileTest.C10
    ? [{ text: i18n.translate('C10', 'certificateFields'), style: 'p' }, {}, {}, { text: tensileTest.C10, style: 'p' }]
    : createEmptyColumns(4);
  const measurementKeys = ['C11', 'C12', 'C13'];
  const tableBody = measurementKeys.map((key) => {
    const r = renderMeasurement(tensileTest[key], key, i18n);
    return r[0] || [];
  });
  const suppInformation = tensileTest.SupplementaryInformation
    ? supplementaryInformation(tensileTest.SupplementaryInformation, i18n, PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : [];

  return [
    { text: i18n.translate('TensileTest', 'otherFields'), style: 'h4' },
    {
      style: 'table',
      table: {
        widths: [160, '*', '*', 300],
        body: [C10, ...tableBody, ...suppInformation],
      },
      layout: tableLayout,
    },
  ];
}

function renderHardnessTest(hardnessTest: HardnessTest, i18n: Translate): [ContentText, TableElement] {
  const C30 = hardnessTest.C30
    ? [{ text: i18n.translate('C30', 'certificateFields'), style: 'p' }, {}, {}, { text: hardnessTest.C30, style: 'p' }]
    : createEmptyColumns(4);
  const C31 = renderMeasurementArray(hardnessTest.C31, 'C31', i18n);
  const C32 = renderMeasurement(hardnessTest.C32, 'C32', i18n);
  const suppInformation = hardnessTest.SupplementaryInformation
    ? supplementaryInformation(hardnessTest.SupplementaryInformation, i18n, PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : [];

  return [
    { text: i18n.translate('HardnessTest', 'otherFields'), style: 'h4' },
    {
      style: 'table',
      table: {
        widths: [160, '*', '*', 300],
        body: [C30, ...C31, ...C32, ...suppInformation],
      },
      layout: tableLayout,
    },
  ];
}

function renderNotchedBarImpactTest(
  notchedBarImpactTest: NotchedBarImpactTest,
  i18n: Translate,
): [ContentText, TableElement] {
  const C40 = notchedBarImpactTest.C40
    ? [
        { text: i18n.translate('C40', 'certificateFields'), style: 'p' },
        {},
        {},
        { text: notchedBarImpactTest.C40, style: 'p' },
      ]
    : createEmptyColumns(4);
  const C41 = renderMeasurement(notchedBarImpactTest.C41, 'C41', i18n);
  const C42 = renderMeasurementArray(notchedBarImpactTest.C42, 'C42', i18n);
  const C43 = renderMeasurement(notchedBarImpactTest.C43, 'C43', i18n);

  const suppInformation = notchedBarImpactTest.SupplementaryInformation
    ? supplementaryInformation(notchedBarImpactTest.SupplementaryInformation, i18n, PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : [];

  return [
    { text: i18n.translate('NotchedBarImpactTest', 'otherFields'), style: 'h4' },
    {
      style: 'table',
      table: {
        widths: [160, '*', '*', 300],
        body: [C40, ...C41, ...C42, ...C43, ...suppInformation],
      },
      layout: tableLayout,
    },
  ];
}

function renderOtherMechanicalTests(
  otherMechanicalTests: OtherMechanicalTests,
  i18n: Translate,
): [ContentText, TableElement] {
  const values = Object.keys(otherMechanicalTests).map(
    (element) => [
      { text: otherMechanicalTests[element].Key, style: 'p' },
      {},
      {},
      { text: otherMechanicalTests[element].Value, style: 'p' },
    ],
    {},
  );

  return [
    { text: i18n.translate('OtherMechanicalTests', 'otherFields'), style: 'h4' },
    {
      style: 'table',
      table: {
        body: [...values],
      },
      layout: tableLayout,
    },
  ];
}

export function renderChemicalComposition(
  chemicalComposition: ChemicalComposition,
  i18n: Translate,
): [ContentText, TableElement] {
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

  return [
    { text: i18n.translate('ChemicalComposition', 'otherFields'), style: 'h4' },
    {
      style: 'table',
      table: {
        body: [...tableBody, ...suppInformation],
      },
      layout: tableLayout,
    },
  ];
}
