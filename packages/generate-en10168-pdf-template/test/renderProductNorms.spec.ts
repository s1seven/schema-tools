import { productNorms } from '../src/lib/createProductDescription';
import { EN10168Translations } from '../src/types';
import { certificate, defaultSchemaUrl } from './constants';
import { getI18N, getTranslations } from './getTranslations';

describe('Product norms', () => {
  let translations: EN10168Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('works for example certificate', async () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const norms = productNorms(certificate.Certificate.ProductDescription.B02, i18n);
    const expected = [
      [
        {
          text: [
            {
              text: 'B02 ',
            },
            {
              font: undefined,
              text: 'Specification of the product',
            },
            { font: undefined, text: ' / ' },
            {
              font: undefined,
              text: 'Spezfikation des Erzeugnis',
            },
          ],
          colSpan: 4,
          style: 'tableHeader',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: [
            {
              font: undefined,
              text: 'Steel designation',
            },
            { font: undefined, text: ' / ' },
            {
              font: undefined,
              text: 'Stahlbezeichnung',
            },
          ],
          style: 'caption',
          colSpan: 3,
        },
        {},
        {},
        { text: 'S355J2H, P355NH/TC1, E355+N', style: 'p' },
      ],
      [
        {
          colSpan: 3,
          style: 'caption',
          text: [
            {
              font: undefined,
              text: 'Product norm',
            },
            { font: undefined, text: ' / ' },
            {
              font: undefined,
              text: 'Product Norm',
            },
          ],
        },
        {},
        {},
        {
          style: 'p',
          text: 'EN 10219-1:2006',
        },
      ],
      [
        {
          colSpan: 3,
          style: 'caption',
          text: [
            {
              font: undefined,
              text: 'Mass norm',
            },
            { font: undefined, text: ' / ' },
            {
              font: undefined,
              text: 'Mass Norm',
            },
          ],
        },
        {},
        {},
        {
          style: 'p',
          text: 'EN 10220',
        },
      ],
      [
        {
          colSpan: 3,
          style: 'caption',
          text: [
            {
              font: undefined,
              text: 'Material norm',
            },
            { font: undefined, text: ' / ' },
            {
              font: undefined,
              text: 'Material Norm',
            },
          ],
        },
        {},
        {},
        {
          style: 'p',
          text: 'EN 10297-1:2003-06',
        },
      ],
    ];
    expect(norms).toEqual(expected);
  });

  const normsInput = {
    SteelDesignation: ['S355J2H'],
    MassNorm: ['EN 10219-1:2006', 'EN 10220'],
    MaterialNorm: [],
  };

  it('correctly renders header', async () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const norms = productNorms(normsInput, i18n);
    expect(norms[0]).toEqual([
      {
        colSpan: 4,
        style: 'tableHeader',
        text: [
          {
            text: 'B02 ',
          },
          {
            font: undefined,
            text: 'Specification of the product',
          },
          { font: undefined, text: ' / ' },
          {
            font: undefined,
            text: 'Spezfikation des Erzeugnis',
          },
        ],
      },
      {},
      {},
      {},
    ]);
  });

  it('correctly renders for many values', async () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const norms = productNorms(normsInput, i18n);
    expect(norms[2]).toEqual([
      {
        colSpan: 3,
        style: 'caption',
        text: [
          {
            font: undefined,
            text: 'Mass norm',
          },
          { font: undefined, text: ' / ' },
          {
            font: undefined,
            text: 'Mass Norm',
          },
        ],
      },
      {},
      {},
      { text: 'EN 10219-1:2006, EN 10220', style: 'p' },
    ]);
  });

  // eslint-disable-next-line quotes
  it("doesn't render norms that are not included", async () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const norms = productNorms(normsInput, i18n);
    expect(norms.length).toEqual(4);
  });
});
