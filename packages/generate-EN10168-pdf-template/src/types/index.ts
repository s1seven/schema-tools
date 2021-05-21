import { Margins, Table, TableLayout, Content } from 'pdfmake/interfaces';

export type ContentTypes = Content;
export * from './schemaTypes';

export interface TableElement {
  style: string;
  table: Table;
  layout: TableLayout;
  margin?: Margins;
  id?: string;
}
