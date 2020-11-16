import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { createEmptyColumns, localizeValue, tableLayout } from './helpers';
import { NonDestructiveTests, OtherProductTests, OtherTests, TableCell, TableElement } from '../types';
import { Translate } from './translate';

export function createOtherTests(otherTests: OtherTests, i18n: Translate): TableElement {
  const D01 = [
    { text: i18n.translate('D01', 'certificateFields'), style: 'tableHeader', colSpan: 3 },
    {},
    {},
    { text: otherTests.D01, style: 'p' },
  ];

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

  return {
    style: 'table',
    id: 'ProductDescription',
    table: {
      widths: [160, '*', '*', 300],
      body: [
        [{ text: i18n.translate('OtherTests', 'certificateGroups'), style: 'h2', colSpan: 4 }, {}, {}, {}],
        D01,
        ...nonDestructiveTests,
        ...otherProductTests,
      ],
    },
    layout: tableLayout,
  };
}

const renderKVObjectTests = (
  data: OtherProductTests | NonDestructiveTests,
  i18n: Translate,
  testName: 'OtherProductTests' | 'NonDestructiveTests',
  colSpan = 3,
): TableCell[][] => {
  const dataMapped = Object.keys(data).map((element) => [
    { text: `${element} ${data[element].Key}`, style: 'tableHeader', colSpan: colSpan - 1 },
    ...createEmptyColumns(colSpan - 2),
    {
      text: `${localizeValue(data[element].Value, data[element].Type, i18n.languages)} ${
        data[element].Unit ? data[element].Unit : ''
      }`,
      style: 'p',
      colSpan: 1,
    },
  ]);

  if (dataMapped.length === 0) return [];
  return [
    [{ text: i18n.translate(testName, 'otherFields'), style: 'h4', colSpan }, ...createEmptyColumns(colSpan - 1)],
    ...dataMapped,
  ];
};
