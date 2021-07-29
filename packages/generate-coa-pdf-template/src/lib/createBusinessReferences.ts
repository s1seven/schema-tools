import { BusinessTransaction, TableElement } from '../types';
import { ContentCanvas, ContentText, TableCell } from 'pdfmake/interfaces';
import { localizeDate, tableLayout } from './helpers';
import { Translate } from './translate';

export function createBusinessReferences(
  reference: BusinessTransaction,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement] {
  const { Delivery, Order } = reference;
  const firstRow: TableCell[] = [
    { text: i18n.translate('Order', 'Certificate'), colSpan: 2, style: 'tableHeader' },
    {},
    { text: i18n.translate('Delivery', 'Certificate'), colSpan: 2, style: 'tableHeader' },
    {},
  ];
  const numberRow: TableCell[] = [
    { text: i18n.translate('OrderNumber', 'Certificate'), style: 'tableHeader' },
    { text: Order.Number, style: 'p' },
    { text: i18n.translate('DeliveryNumber', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.Number, style: 'p' },
  ];

  const positionRow: TableCell[] = [
    { text: i18n.translate('OrderPosition', 'Certificate'), style: 'tableHeader' },
    { text: Order.Position, style: 'p' },
    { text: i18n.translate('DeliveryPosition', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.Position, style: 'p' },
  ];

  const quantityRow: TableCell[] = [
    { text: i18n.translate('OrderQuantity', 'Certificate'), style: 'tableHeader' },
    { text: Order.QuantityUnit, style: 'p' },
    { text: i18n.translate('DeliveryQuantity', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.QuantityUnit, style: 'p' },
  ];

  const dateRow: TableCell[] = [
    { text: i18n.translate('OrderDate', 'Certificate'), style: 'tableHeader' },
    { text: Order.Date ? localizeDate(Order.Date) : '', style: 'p' },
    { text: i18n.translate('DeliveryDate', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.Date ? localizeDate(Delivery.Date) : '', style: 'p' },
  ];

  const fifthRow: TableCell[] = [
    { text: i18n.translate('InternalOrderNumber', 'Certificate'), style: 'tableHeader' },
    { text: Order.InternalOrderNumber, style: 'p' },
    { text: i18n.translate('Transport', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.Transport, style: 'p' },
  ];

  const sixthRow: TableCell[] = [
    { text: i18n.translate('InternalOrderPosition', 'Certificate'), style: 'tableHeader' },
    { text: Order.InternalOrderPosition, style: 'p' },
    { text: i18n.translate('GoodsReceiptNumber', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.GoodsReceiptNumber, style: 'p' },
  ];

  return [
    {
      text: `${i18n.translate('BusinessTransaction', 'Certificate')}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      table: {
        widths: [150, 90, 100, 150],
        body: [firstRow, numberRow, positionRow, quantityRow, dateRow, fifthRow, sixthRow],
      },
      layout: tableLayout,
    },
  ];
}
