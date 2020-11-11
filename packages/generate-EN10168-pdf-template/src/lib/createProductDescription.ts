import { PRODUCT_DESCRIPTION_COLUMNS_COUNT } from './constants';
import { measurement } from './measurement';
import { productNorms } from './productNorms';
import { productShape } from './productShape';
import { supplementaryInformation } from './supplementaryInformation';
import { ProductDescription } from '../types';
import { Translate } from './translate';

export function createProductDescription(productDescription: ProductDescription, i18n: Translate) {
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
  const B10measurement = measurement(productDescription.B10, 'B10');
  const B11measurement = measurement(productDescription.B11, 'B11');
  const B12measurement = measurement(productDescription.B12, 'B12');
  const B13measurement = measurement(productDescription.B13, 'B13');

  const suppInformation = supplementaryInformation(
    productDescription.SupplementaryInformation,
    i18n,
    PRODUCT_DESCRIPTION_COLUMNS_COUNT,
  );

  return {
    content: [
      {
        style: 'table',
        table: {
          widths: [150, '*', '*', 300],
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
        layout: {
          hLineWidth: function () {
            return 0;
          },
          vLineWidth: function () {
            return 0;
          },
          hLineColor: function () {
            return 'gray';
          },
          vLineColor: function () {
            return 'gray';
          },
        },
      },
    ],
  };
}
