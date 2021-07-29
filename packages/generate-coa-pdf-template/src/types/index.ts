import { Margins, Table, TableLayout } from 'pdfmake/interfaces';

export * from './schemaTypes';

export interface TableElement {
  style: string;
  table: Table;
  layout: TableLayout;
  margin?: Margins;
  id?: string;
}

export type TranslationGroups = 'Certificate';

export interface Translation {
  Certificate: Record<string, string>;
}

export interface Translations {
  [ln: string]: Translation;
}
