import { Margins, Table, TableLayout } from 'pdfmake/interfaces';

export interface TableElement {
  style: string;
  table: Table;
  layout: TableLayout;
  margin?: Margins;
  id?: string;
}

export interface Translation {
  [group: string]: string | Record<string, string>;
}

export interface Translations {
  [ln: string]: Translation;
}
