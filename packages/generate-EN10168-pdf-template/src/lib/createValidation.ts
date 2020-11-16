import { localizeDate, tableLayout } from './helpers';
import { supplementaryInformation } from './supplementaryInformation';
import { Translate } from './translate';
import { ContentColumns, TableElement, Validation } from '../types';

export function createValidation(
  validation: Validation,
  i18n: Translate,
): [TableElement, ContentColumns, TableElement] {
  const suppInformation = validation.SupplementaryInformation
    ? supplementaryInformation(validation.SupplementaryInformation, i18n, 3)
    : [[{ text: '', colSpan: 3 }, {}, {}]];

  return [
    {
      style: 'table',
      id: 'Validation',
      table: {
        widths: [160, '*', 300],
        body: [[{ text: i18n.translate('Validation', 'certificateGroups'), style: 'h2', colSpan: 3 }, {}, {}]],
      },
      layout: tableLayout,
    },
    {
      columns: [
        {
          style: 'table',
          table: {
            widths: [160, '*', 180],
            body: [
              [
                { text: i18n.translate('Z01', 'certificateFields'), style: 'tableHeader', colSpan: 2 },
                {},
                {
                  text: validation.Z01,
                  style: 'p',
                },
              ],
              [
                { text: i18n.translate('Z02', 'certificateFields'), style: 'tableHeader', colSpan: 2 },
                {},
                {
                  text: localizeDate(validation.Z02, i18n.languages[0]),
                  style: 'p',
                },
              ],
              [
                { text: i18n.translate('Z03', 'certificateFields'), style: 'tableHeader', colSpan: 2 },
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
        {
          width: 100,
          style: 'table',
          table: {
            body: [
              [{ image: validation.Z04.CE_Image }],
              [{ text: validation.Z04.NotifiedBodyNumber, alignment: 'center', bold: true, style: 'caption' }],
              [{ text: validation.Z04.DoCYear, alignment: 'center', bold: true, style: 'caption' }],
              [{ text: validation.Z04.DoCNumber, alignment: 'center', bold: true, style: 'caption' }],
            ],
          },
          layout: tableLayout,
        },
      ],
    },
    {
      style: 'table',
      table: {
        widths: [160, '*', 300],
        body: [...suppInformation],
      },
      layout: tableLayout,
    },
  ];
}
