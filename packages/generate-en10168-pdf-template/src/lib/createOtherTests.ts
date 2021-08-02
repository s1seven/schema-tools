import { ContentCanvas, ContentText } from 'pdfmake/interfaces';
import {
  createEmptyColumns,
  localizeValue,
  TableElement,
  tableLayout,
  Translate,
} from '@s1seven/schema-tools-generate-pdf-template-helpers';
import { NonDestructiveTests, OtherProductTests, OtherTests } from '../types';
import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';

export function createOtherTests(
  otherTests: OtherTests,
  i18n: Translate,
): (TableElement | ContentText | ContentCanvas)[] {
  if (!otherTests) {
    return [
      {
        style: 'table',
        id: 'OtherTests',
        table: {
          widths: [160, '*', '*', 300],
          body: [createEmptyColumns(PRODUCT_DESCRIPTION_COLUMNS_COUNT)],
        },
        layout: tableLayout,
      },
    ];
  }

  const D01 = otherTests.D01
    ? [
        { text: i18n.translate('D01', 'certificateFields'), style: 'tableHeader', colSpan: 3 },
        {},
        {},
        { text: otherTests.D01, style: 'p' },
      ]
    : createEmptyColumns(PRODUCT_DESCRIPTION_COLUMNS_COUNT);

  const nonDestructiveTests = otherTests.NonDestructiveTests
    ? renderKVObjectTests(
        otherTests.NonDestructiveTests,
        i18n,
        'NonDestructiveTests',
        PRODUCT_DESCRIPTION_COLUMNS_COUNT,
      )
    : [];

  const otherProductTests = otherTests.OtherProductTests
    ? renderKVObjectTests(otherTests.OtherProductTests, i18n, 'OtherProductTests', PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : [];

  return [
    { text: `${i18n.translate('OtherTests', 'certificateGroups')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      id: 'OtherTests',
      table: {
        widths: [160, '*', '*', 300],
        body: [D01],
      },
      layout: tableLayout,
    },
    ...nonDestructiveTests,
    ...otherProductTests,
  ];
}

const renderKVObjectTests = (
  data: OtherProductTests | NonDestructiveTests,
  i18n: Translate,
  testName: 'OtherProductTests' | 'NonDestructiveTests',
  colSpan = 4,
): (ContentText | ContentCanvas | TableElement)[] => {
  const dataMapped = Object.keys(data).map((element) => [
    { text: `${element} ${data[element].Key}`, style: 'tableHeader', colSpan: colSpan - 1 },
    ...createEmptyColumns(colSpan - 2),
    {
      text: `${localizeValue(data[element].Value || '', data[element]?.Type || 'string', i18n.languages[0])} ${
        data[element]?.Unit || ''
      }`,
      style: 'p',
    },
  ]);

  return dataMapped?.length
    ? [
        { text: i18n.translate(testName, 'otherFields'), style: 'h4' },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
        {
          style: 'table',
          table: {
            widths: [160, '*', '*', 300],
            body: dataMapped,
          },
          layout: tableLayout,
        },
      ]
    : [];
};
