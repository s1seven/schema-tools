import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { tableLayout } from './helpers';
import { renderMeasurement } from './measurement';
import { supplementaryInformation } from './supplementaryInformation';
import { ProductDescription, ProductShape, TableCell, TableElement } from '../types';
import { Translate } from './translate';

interface ProductNorms {
  ProductNorm?: string[];
  MaterialNorm?: string[];
  MassNorm?: string[];
  SteelDesignation?: string[];
}

export function productNorms(productNorms: ProductNorms, i18n: Translate): TableCell[][] {
  const header = [{ text: i18n.translate('B02', 'certificateFields'), colSpan: 4, style: 'tableHeader' }, {}, {}, {}];

  const aaa = Object.keys(productNorms).map((norm) => [
    { text: i18n.translate(norm, 'otherFields'), style: 'caption', colSpan: 3 },
    {},
    {},
    { text: productNorms[norm].join(', '), style: 'caption' },
  ]);

  return [header, ...aaa];
}

export function productShape(productShape: ProductShape, i18n: Translate): TableCell[][] {
  if (productShape === undefined) return [];
  const header = [{ text: i18n.translate('B09', 'certificateFields'), style: 'tableHeader', colSpan: 4 }, {}, {}, {}];

  const content = Object.keys(productShape).map((key) => [
    { text: i18n.translate(key, 'otherFields'), style: 'caption', colSpan: 3 },
    {},
    {},
    { text: productShape[key], style: 'caption' },
  ]);
  return [header, ...content];
}

export function createProductDescription(productDescription: ProductDescription, i18n: Translate): TableElement {
  const B02ProductNorms = productNorms(productDescription.B02, i18n);

  const contentToOmit = ['B01', 'B02', 'B09', 'B10', 'B11', 'B12', 'B12', 'B13', 'SupplementaryInformation'];
  const content = Object.keys(productDescription)
    .filter((element) => !contentToOmit.includes(element))
    .map((element) => [
      { text: i18n.translate(element, 'certificateFields'), style: 'tableHeader', colSpan: 3 },
      {},
      {},
      { text: productDescription[element], style: 'p' },
    ]);

  const B09productShape = productShape(productDescription.B09, i18n);
  const B10measurement = renderMeasurement(productDescription.B10, 'B10', i18n);
  const B11measurement = renderMeasurement(productDescription.B11, 'B11', i18n);
  const B12measurement = renderMeasurement(productDescription.B12, 'B12', i18n);
  const B13measurement = renderMeasurement(productDescription.B13, 'B13', i18n);

  const suppInformation = supplementaryInformation(
    productDescription.SupplementaryInformation,
    i18n,
    PRODUCT_DESCRIPTION_COLUMNS_COUNT,
  );

  return {
    style: 'table',
    id: 'ProductDescription',
    table: {
      widths: [160, '*', '*', 300],
      body: [
        [{ text: i18n.translate('ProductDescription', 'certificateGroups'), style: 'h2', colSpan: 4 }, {}, {}, {}],
        [
          { text: i18n.translate('B01', 'certificateFields'), style: 'tableHeader', colSpan: 3 },
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
        ...suppInformation,
      ],
    },
    layout: tableLayout,
  };
}
