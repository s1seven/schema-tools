import type { Margins, Table, TableLayout } from 'pdfmake/interfaces';

export interface TableElement {
  style: string;
  table: Table;
  layout: TableLayout;
  margin?: Margins;
  id?: string;
}
