import { ContentCanvas, ContentText, TableCell } from 'pdfmake/interfaces';

import {
  createEmptyColumns,
  localizeValue,
  TableElement,
  tableLayout,
} from '@s1seven/schema-tools-generate-pdf-template-helpers';

import { I18N, NonDestructiveTests, OtherProductTests, OtherTests } from '../types';
import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';

export function createOtherTests(otherTests: OtherTests, i18n: I18N): (TableElement | ContentText | ContentCanvas)[] {
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
    { text: i18n.translate('OtherTests', 'certificateGroups'), style: 'h2', margin: [0, 0, 0, 4] },
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
  i18n: I18N,
  testName: 'OtherProductTests' | 'NonDestructiveTests',
  colSpan = 4,
): (ContentText | ContentCanvas | TableElement)[] => {
  const dataMapped: TableCell[][] = Object.keys(data).map((element) => {
    const { Interpretation, Key, Value, Type, Unit } = data[element];
    return [
      { text: `${element} ${Key}`, style: 'tableHeader', colSpan: colSpan - 2 },
      ...createEmptyColumns(colSpan - 3),
      {
        text: `${localizeValue(Value, Type, i18n.languages[0])} ${Unit || ''}`,
        style: 'p',
        colSpan: 1,
      },
      {
        text: Interpretation || '',
        style: 'p',
        colSpan: 1,
      },
    ];
  });

  return dataMapped?.length
    ? [
        { text: i18n.translate(testName, 'otherFields'), style: 'h4' },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
        {
          style: 'table',
          table: {
            widths: [160, '*', 160, 130],
            body: dataMapped,
          },
          layout: tableLayout,
        },
      ]
    : [];
};
