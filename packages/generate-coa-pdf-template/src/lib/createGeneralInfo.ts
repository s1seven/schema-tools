import { Certificate, TableElement } from '../types';
import { ContentCanvas, ContentText, TableCell } from 'pdfmake/interfaces';
import { localizeDate, tableLayout } from './helpers';
import { Translate } from './translate';

export function createGeneralInfo(
  certificate: Certificate,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement] {
  const contentBody: TableCell[] = [
    { text: i18n.translate('Id', 'Certificate'), style: 'tableHeader' },
    { text: certificate.Certificate.Id, style: 'p' },
    { text: i18n.translate('Date', 'Certificate'), style: 'tableHeader' },
    { text: localizeDate(certificate.Certificate.Date), style: 'p' },
  ];

  return [
    {
      text: `${i18n.translate('Name', 'Certificate')}  ${certificate.Certificate.Type}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      table: {
        widths: [150, 90, 100, 150],
        body: [contentBody],
      },
      layout: tableLayout,
    },
  ];
}
