import type { ContentCanvas, ContentText, TableCell } from 'pdfmake/interfaces';

import { createEmptyColumns, TableElement, tableLayout } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import { EN10168CertificateTranslations, I18N, ProductDescription, ProductShape } from '../types';
import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { renderMeasurement } from './measurement';
import { supplementaryInformation } from './supplementaryInformation';

interface ProductNorms {
  ProductNorm?: string[];
  MaterialNorm?: string[];
  MassNorm?: string[];
  SteelDesignation?: string[];
}

export function productNorms(productNorms: ProductNorms, i18n: I18N): TableCell[][] {
  const header = [
    {
      text: i18n.translate('B02', 'certificateFields'),
      colSpan: 4,
      style: 'tableHeader',
    },
    {},
    {},
    {},
  ];
  const content = Object.keys(productNorms).map((norm: keyof ProductNorms) => [
    { text: i18n.translate(norm, 'otherFields'), style: 'caption', colSpan: 3 },
    {},
    {},
    { text: productNorms[norm].join(', '), style: 'p' },
  ]);
  return [header, ...content];
}

export function productShape(productShape: ProductShape, i18n: I18N): TableCell[][] {
  if (!productShape) return [];
  const header = [
    {
      text: i18n.translate('B09', 'certificateFields'),
      style: 'tableHeader',
      colSpan: 4,
    },
    {},
    {},
    {},
  ];
  const content = Object.keys(productShape)
    .filter((key) => key.toLowerCase() !== 'unit')
    .map((key: keyof ProductShape) => [
      {
        text: i18n.translate(key, 'otherFields'),
        style: 'caption',
        colSpan: 3,
      },
      {},
      {},
      {
        text:
          key === 'Form'
            ? i18n.translate(productShape[key], 'otherFields')
            : `${productShape[key]} ${productShape['Unit'] || ''}`,
        style: 'p',
      },
    ]);
  return [header, ...content];
}

export function createProductDescription(
  productDescription: ProductDescription,
  i18n: I18N,
): [ContentText, ContentCanvas, TableElement, TableElement] {
  if (typeof productDescription.B02 === 'string') {
    return null;
  }
  type KeysToOmit = keyof Pick<
    ProductDescription,
    'B01' | 'B02' | 'B09' | 'B10' | 'B11' | 'B12' | 'B12' | 'B13' | 'SupplementaryInformation'
  >;
  const B02ProductNorms = productNorms(productDescription.B02, i18n);
  const contentToOmit: KeysToOmit[] = [
    'B01',
    'B02',
    'B09',
    'B10',
    'B11',
    'B12',
    'B12',
    'B13',
    'SupplementaryInformation',
  ];
  const content = Object.keys(productDescription)
    .filter((element: keyof ProductDescription) => !contentToOmit.includes(element as KeysToOmit))
    .map((element: keyof Omit<ProductDescription, KeysToOmit>) => [
      {
        text: i18n.translate(element as keyof EN10168CertificateTranslations['certificateFields'], 'certificateFields'),
        style: 'tableHeader',
        colSpan: 3,
      },
      {},
      {},
      { text: productDescription[element], style: 'p' },
    ]);

  const B09productShape = productShape(productDescription.B09, i18n);
  const B10measurement = renderMeasurement(productDescription.B10, 'B10', i18n);
  const B11measurement = renderMeasurement(productDescription.B11, 'B11', i18n);
  const B12measurement = renderMeasurement(productDescription.B12, 'B12', i18n);
  const B13measurement = renderMeasurement(productDescription.B13, 'B13', i18n);
  const suppInformation = productDescription.SupplementaryInformation
    ? supplementaryInformation(productDescription.SupplementaryInformation, i18n, PRODUCT_DESCRIPTION_COLUMNS_COUNT)
    : createEmptyColumns(PRODUCT_DESCRIPTION_COLUMNS_COUNT);

  return [
    {
      text: i18n.translate('ProductDescription', 'certificateGroups'),
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      id: 'ProductDescription',
      table: {
        widths: [160, '*', '*', 300],
        body: [
          [
            {
              text: i18n.translate('B01', 'certificateFields'),
              style: 'tableHeader',
              colSpan: 3,
            },
            {},
            {},
            { text: productDescription.B01, style: 'p' },
          ],
          ...B02ProductNorms,
          ...content,
          ...B09productShape,
          ...B10measurement,
          ...B11measurement,
          ...B12measurement,
          ...B13measurement,
        ],
      },
      layout: tableLayout,
    },
    {
      style: 'table',
      id: 'ProductDescription',
      table: {
        widths: [160, '*', 160, 130],
        body: suppInformation,
      },
      layout: tableLayout,
    },
  ];
}
