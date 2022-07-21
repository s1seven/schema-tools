import { ContentCanvas, ContentText } from 'pdfmake/interfaces';

import { TableElement } from '@s1seven/schema-tools-generate-pdf-template-helpers';
import { Translate } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import { EN10168Translations } from './translations';

export * from './schemaTypes';
export * from './translations';

export type I18N = Translate<EN10168Translations>;

export type InspectionUnionType = (TableElement | ContentText | ContentCanvas)[];
