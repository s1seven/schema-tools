import { Table, TableLayout } from 'pdfmake/interfaces';

export * from 'pdfmake/interfaces';
export * from './schemaTypes';

export interface TableElement {
  style: string;
  table: Table;
  layout: TableLayout;
  id?: string;
}
