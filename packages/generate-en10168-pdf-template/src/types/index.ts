import type { ContentCanvas, ContentText } from 'pdfmake/interfaces';

import type { TableElement, Translate } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import type { EN10168Translations } from './translations';

export * from './schemaTypes';
export { EN10168CertificateTranslations, EN10168Translations } from './translations';

export type I18N = Translate<EN10168Translations>;

export type InspectionUnionType = (TableElement | ContentText | ContentCanvas)[];
