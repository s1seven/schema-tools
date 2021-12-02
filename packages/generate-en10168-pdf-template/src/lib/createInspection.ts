import {
  ChemicalComposition,
  ChemicalElement,
  HardnessTest,
  Inspection,
  NotchedBarImpactTest,
  OtherMechanicalTests,
  TensileTest,
} from '../types';
import { ContentCanvas, ContentText } from 'pdfmake/interfaces';
import {
  createEmptyColumns,
  localizeNumber,
  TableElement,
  tableLayout,
  Translate,
} from '@s1seven/schema-tools-generate-pdf-template-helpers';
import { renderMeasurement, renderMeasurementArray } from './measurement';
import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { supplementaryInformation } from './supplementaryInformation';

export function createInspection(
  inspection: Inspection,
  i18n: Translate,
): (TableElement | ContentText | ContentCanvas)[] {
  const contentToRender = ['C00', 'C01', 'C02', 'C03'];
  const content = Object.keys(inspection)
    .filter((element) => contentToRender.includes(element) && inspection[element])
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
    { text: `${i18n.translate('Inspection', 'certificateGroups')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      id: 'Inspection',
      style: 'table',
      table: {
        widths: [160, '*', '*', 300],
        body: content,
      },
      layout: tableLayout,
    },
    {
      style: 'table',
      table: {
        widths: [160, '*', 200, 100],
        body: suppInformation,
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

export function renderTensileTest(
  tensileTest: TensileTest,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement, TableElement] {
  const C10 = tensileTest.C10
    ? [
        { text: i18n.translate('C10', 'certificateFields'), style: 'tableHeader' },
        {},
        {},
        { text: tensileTest.C10, style: 'p' },
      ]
    : createEmptyColumns(4);
  const measurementKeys = ['C11', 'C12', 'C13'];
  const tableBody = measurementKeys
    .filter((key) => tensileTest[key])
    .map((key) => {
      const r = renderMeasurement(tensileTest[key], key, i18n);
      return r[0] || [];
    });
  const suppInformation = tensileTest.SupplementaryInformation
    ? supplementaryInformation(tensileTest.SupplementaryInformation, i18n, PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : [];

  return [
    { text: i18n.translate('TensileTest', 'otherFields'), style: 'h4' },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
    {
      style: 'table',
      id: 'TensileTest',
      table: {
        widths: [160, '*', '*', 300],
        body: [C10, ...tableBody],
      },
      layout: tableLayout,
    },
    {
      style: 'table',
      id: 'TensileTest',
      table: {
        widths: [160, '*', 200, 100],
        body: suppInformation,
      },
      layout: tableLayout,
    },
  ];
}

export function renderHardnessTest(
  hardnessTest: HardnessTest,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement, TableElement] {
  const C30 = hardnessTest.C30
    ? [
        { text: i18n.translate('C30', 'certificateFields'), style: 'tableHeader' },
        {},
        {},
        { text: hardnessTest.C30, style: 'p' },
      ]
    : createEmptyColumns(4);
  const C31 = hardnessTest.C31 ? renderMeasurementArray(hardnessTest.C31, 'C31', i18n) : [];
  const C32 = hardnessTest.C32 ? renderMeasurement(hardnessTest.C32, 'C32', i18n) : [];
  const suppInformation = hardnessTest.SupplementaryInformation
    ? supplementaryInformation(hardnessTest.SupplementaryInformation, i18n, PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : [];

  return [
    { text: i18n.translate('HardnessTest', 'otherFields'), style: 'h4' },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
    {
      style: 'table',
      table: {
        widths: [160, '*', '*', 300],
        body: [C30, ...C31, ...C32],
      },
      layout: tableLayout,
    },
    {
      style: 'table',
      table: {
        widths: [160, '*', 200, 100],
        body: suppInformation,
      },
      layout: tableLayout,
    },
  ];
}

export function renderNotchedBarImpactTest(
  notchedBarImpactTest: NotchedBarImpactTest,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement, TableElement] {
  const C40 = notchedBarImpactTest.C40
    ? [
        { text: i18n.translate('C40', 'certificateFields'), style: 'tableHeader' },
        {},
        {},
        { text: notchedBarImpactTest.C40, style: 'p' },
      ]
    : createEmptyColumns(4);
  const C41 = notchedBarImpactTest.C41 ? renderMeasurement(notchedBarImpactTest.C41, 'C41', i18n) : [];
  const C42 = notchedBarImpactTest.C42 ? renderMeasurementArray(notchedBarImpactTest.C42, 'C42', i18n) : [];
  const C43 = notchedBarImpactTest.C43 ? renderMeasurement(notchedBarImpactTest.C43, 'C43', i18n) : [];

  const suppInformation = notchedBarImpactTest.SupplementaryInformation
    ? supplementaryInformation(notchedBarImpactTest.SupplementaryInformation, i18n, PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : [];

  return [
    { text: i18n.translate('NotchedBarImpactTest', 'otherFields'), style: 'h4' },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
    {
      style: 'table',
      table: {
        widths: [160, '*', '*', 300],
        body: [C40, ...C41, ...C42, ...C43],
      },
      layout: tableLayout,
    },
    {
      style: 'table',
      table: {
        widths: [160, '*', 200, 100],
        body: suppInformation,
      },
      layout: tableLayout,
    },
  ];
}

export function renderOtherMechanicalTests(
  otherMechanicalTests: OtherMechanicalTests,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement] {
  const values = Object.keys(otherMechanicalTests).map((element) => [
    { text: `${element} ${otherMechanicalTests[element].Key}`, style: 'p' },
    {},
    {},
    { text: otherMechanicalTests[element].Value || '', style: 'p' },
  ]);

  return [
    { text: i18n.translate('OtherMechanicalTests', 'otherFields'), style: 'h4' },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
    {
      style: 'table',
      table: {
        widths: [160, '*', '*', 300],
        body: values,
      },
      layout: tableLayout,
    },
  ];
}

function createChemicalElementTables(
  chemicalComposition: ChemicalComposition,
  i18n: Translate,
  chunkSize = 15,
): TableElement[] {
  const ChemicalElements: { key: string; value: ChemicalElement }[] = Object.keys(chemicalComposition)
    .filter((element) => element !== 'C70' && element !== 'SupplementaryInformation')
    .map((el) => ({ key: el, value: chemicalComposition[el] }));

  const SplittedChemicalElements: { key: string; value: ChemicalElement }[][] = new Array(
    Math.ceil(ChemicalElements.length / chunkSize),
  )
    .fill('')
    .map(() => ChemicalElements.splice(0, chunkSize));

  const margin = [-2, 2, -2, 2];

  return SplittedChemicalElements.map((chemicalElements) => {
    const body = [
      [
        { text: '', style: 'p' },
        ...chemicalElements.map((chemicalElement) => ({
          text: chemicalElement.key,
          style: 'p',
          margin,
        })),
      ],
      [
        { text: 'Symbol', style: 'p' },
        ...chemicalElements.map((chemicalElement) => ({
          text: chemicalElement.value.Symbol,
          style: 'p',
          margin,
        })),
      ],
      [
        { text: 'Actual [%]', style: 'p' },
        ...chemicalElements.map((chemicalElement) => ({
          text: localizeNumber(chemicalElement.value.Actual, i18n.languages[0]),
          style: 'caption',
          margin,
        })),
      ],
    ];
    if (
      chemicalElements.some((chemicalElement) => Object.prototype.hasOwnProperty.call(chemicalElement.value, 'Minimum'))
    ) {
      const MinimumRow = [
        { text: 'Minimum', style: 'p' },
        ...chemicalElements.map((chemicalElement) => ({
          text: chemicalElement.value?.Minimum ? localizeNumber(chemicalElement.value.Minimum, i18n.languages[0]) : '',
          style: 'caption',
          margin,
        })),
      ];
      body.push(MinimumRow);
    }
    if (
      chemicalElements.some((chemicalElement) => Object.prototype.hasOwnProperty.call(chemicalElement.value, 'Maximum'))
    ) {
      const MaximumRow = [
        { text: 'Maximun', style: 'p' },
        ...chemicalElements.map((chemicalElement) => ({
          text: chemicalElement.value?.Maximum ? localizeNumber(chemicalElement.value.Maximum, i18n.languages[0]) : '',
          style: 'caption',
          margin,
        })),
      ];
      body.push(MaximumRow);
    }

    return {
      style: 'table',
      table: {
        widths: new Array(chemicalElements.length + 1).fill('').map((_, i) => (i === 0 ? 45 : 25)),
        body,
      },
      layout: tableLayout,
    };
  });
}

export function renderChemicalComposition(
  chemicalComposition: ChemicalComposition,
  i18n: Translate,
): (ContentText | ContentCanvas | TableElement)[] {
  const C70 = chemicalComposition.C70
    ? [
        { text: i18n.translate('C70', 'certificateFields'), style: 'tableHeader' },
        {},
        {},
        { text: chemicalComposition.C70, style: 'p' },
      ]
    : createEmptyColumns(4);

  const chemicalElements = createChemicalElementTables(chemicalComposition, i18n);

  const suppInformation = chemicalComposition.SupplementaryInformation
    ? supplementaryInformation(chemicalComposition.SupplementaryInformation, i18n, 4)
    : [[{ text: '', colSpan: 4 }, {}, {}, {}]];

  return [
    { text: i18n.translate('ChemicalComposition', 'otherFields'), style: 'h4' },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
    {
      style: 'table',
      table: {
        widths: [160, '*', '*', 300],
        body: [C70],
      },
      layout: tableLayout,
    },
    ...chemicalElements,
    {
      style: 'table',
      table: {
        widths: [160, '*', 200, 100],
        body: suppInformation,
      },
      layout: tableLayout,
    },
  ];
}
