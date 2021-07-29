/* eslint-disable sort-imports */
import { Company, Parties, TableElement } from '../types';
import { tableLayout } from './helpers';
import { Translate } from './translate';
import { TableCell } from 'pdfmake/interfaces';

function createPartyColumn(party: Company): TableCell[] {
  return [
    { text: party.Name, style: 'h4' },
    { text: party.Street, style: 'p' },
    {
      text: `${party.ZipCode} ${party.City} ${party.Country}`,
      style: 'p',
    },
    { text: party.Email, style: 'p' },
  ];
}

export function createReceivers(parties: Parties, i18n: Translate): TableElement {
  const keys: TableCell[][] = ['Customer', 'ConsigneeOfGoods'].map((element) => [
    { text: i18n.translate(element, 'Certificate'), style: { bold: true, fontSize: 10, margin: [0, 4, 0, 4] } },
  ]);

  const { Customer, ConsigneeOfGoods } = parties;
  const customerColumn = createPartyColumn(Customer);
  const consigneeColumn = ConsigneeOfGoods ? createPartyColumn(ConsigneeOfGoods) : [];
  const contentBody = [keys, [customerColumn, consigneeColumn]];
  return {
    style: 'table',
    table: {
      widths: [250, 300],
      body: contentBody,
    },
    layout: tableLayout,
  };
}
