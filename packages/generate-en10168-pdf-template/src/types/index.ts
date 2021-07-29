import { Margins, Table, TableLayout } from 'pdfmake/interfaces';

export * from './schemaTypes';

export interface TableElement {
  style: string;
  table: Table;
  layout: TableLayout;
  margin?: Margins;
  id?: string;
}

export type TranslationGroups = 'certificateFields' | 'certificateGroups' | 'otherFields';

export interface Translation {
  certificateFields: Record<string, string>;
  certificateGroups: Record<string, string>;
  otherFields: Record<string, string>;
}

export interface Translations {
  [ln: string]: Translation;
}
