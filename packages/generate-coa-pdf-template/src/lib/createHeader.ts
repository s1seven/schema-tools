import { Parties, TableElement } from '../types';
import { TableCell } from 'pdfmake/interfaces';
import { tableLayout } from './helpers';

function createManufacturerHeader(parties: Parties, logo: string): TableCell[][] {
  const manufacturerLogo: TableCell[] = logo ? [{ image: logo, width: 150 }] : [];
  const { Manufacturer } = parties;
  const manufacturerInfo: TableCell[] = [
    { text: Manufacturer.Name, style: 'h4' },
    { text: Manufacturer.Street, style: 'p' },
    {
      text: `${Manufacturer.City},${Manufacturer.ZipCode},${Manufacturer.Country}`,
      style: 'p',
    },
    // { text: commercialTransaction[element]?.VAT_Id || '', style: 'p' },
    { text: Manufacturer.Email, style: 'p' },
  ];

  return [manufacturerLogo, manufacturerInfo];
}

export function createHeader(parties: Parties, logo: string): TableElement {
  const values = createManufacturerHeader(parties, logo);

  return {
    style: 'table',
    table: {
      widths: [250, 300],
      body: [values],
    },
    layout: tableLayout,
  };
}
