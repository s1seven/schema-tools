import type { Column, ContentCanvas, ContentColumns, ContentText } from 'pdfmake/interfaces';

import { localizeDate, TableElement, tableLayout } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import { I18N, Validation } from '../types';
import { supplementaryInformation } from './supplementaryInformation';

export function createValidation(
  validation: Validation,
  i18n: I18N,
): [ContentText, ContentCanvas, ContentColumns, TableElement] {
  const suppInformation = validation.SupplementaryInformation
    ? supplementaryInformation(validation.SupplementaryInformation, i18n, 3)
    : [[{ text: '', colSpan: 3 }, {}, {}]];

  const columns: Column[] = [
    {
      style: 'table',
      table: {
        widths: [160, '*', 180],
        body: [
          [
            {
              text: i18n.translate('Z01', 'certificateFields'),
              style: 'tableHeader',
              colSpan: 2,
            },
            {},
            {
              text: validation.Z01,
              style: 'p',
            },
          ],
          [
            {
              text: i18n.translate('Z02', 'certificateFields'),
              style: 'tableHeader',
              colSpan: 2,
            },
            {},
            {
              text: localizeDate(validation.Z02, i18n.languages[0]),
              style: 'p',
            },
          ],
          [
            {
              text: i18n.translate('Z03', 'certificateFields'),
              style: 'tableHeader',
              colSpan: 2,
            },
            {},
            {
              text: validation?.Z03,
              style: 'p',
            },
          ],
        ],
      },
      layout: tableLayout,
    },
  ];

  if (validation.Z04 && typeof validation.Z04 !== 'string') {
    const z04Column: Column = {
      width: 100,
      style: 'table',
      table: {
        body: [
          [{ image: validation.Z04.CE_Image }],
          [
            {
              text: validation.Z04.NotifiedBodyNumber,
              alignment: 'center',
              bold: true,
              style: 'caption',
            },
          ],
          [
            {
              text: validation.Z04.DoCYear,
              alignment: 'center',
              bold: true,
              style: 'caption',
            },
          ],
          [
            {
              text: validation.Z04.DoCNumber,
              alignment: 'center',
              bold: true,
              style: 'caption',
            },
          ],
        ],
      },
      layout: tableLayout,
    };
    columns.push(z04Column);
  }

  return [
    {
      text: i18n.translate('Validation', 'certificateGroups'),
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    { columns },
    {
      style: 'table',
      table: {
        widths: [160, '*', 300],
        body: suppInformation,
      },
      layout: tableLayout,
    },
  ];
}
