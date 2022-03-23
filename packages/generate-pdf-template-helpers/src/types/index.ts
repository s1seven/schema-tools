import { Margins, Table, TableLayout } from 'pdfmake/interfaces';

import { Languages } from '@s1seven/schema-tools-types';

export interface TableElement {
  style: string;
  table: Table;
  layout: TableLayout;
  margin?: Margins;
  id?: string;
}

export interface Translation {
  [group: string]: Record<string, string>;
}

export type Translations = {
  [ln in Languages]: Translation;
};
