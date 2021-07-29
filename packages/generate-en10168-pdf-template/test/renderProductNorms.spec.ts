import { certificate, defaultSchemaUrl } from './constants';
import { getTranslations } from './getTranslations';
import { productNorms } from '../src/lib/createProductDescription';
import { Translate } from '../src/lib/translate';
import { Translations } from '../src/types';

describe('Product norms', () => {
  let translations: Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('works for example certificate', async () => {
    const i18n = new Translate(translations, ['EN', 'DE']);
    const norms = productNorms(certificate.Certificate.ProductDescription.B02, i18n);
    const expected = [
      [
        {
          text: 'B02 Specification of the product / Spezfikation des Erzeugnis',
          colSpan: 4,
          style: 'tableHeader',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'Steel designation / Stahlbezeichnung',
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
          text: 'Product norm / Product Norm',
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
          text: 'Mass norm / Mass Norm',
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
          text: 'Material norm / Material Norm',
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
    const i18n = new Translate(translations, ['EN', 'DE']);
    const norms = productNorms(normsInput, i18n);
    expect(norms[0]).toEqual([
      { text: 'B02 Specification of the product / Spezfikation des Erzeugnis', colSpan: 4, style: 'tableHeader' },
      {},
      {},
      {},
    ]);
  });

  it('correctly renders for many values', async () => {
    const i18n = new Translate(translations, ['EN', 'DE']);
    const norms = productNorms(normsInput, i18n);
    expect(norms[2]).toEqual([
      { text: 'Mass norm / Mass Norm', colSpan: 3, style: 'caption' },
      {},
      {},
      { text: 'EN 10219-1:2006, EN 10220', style: 'p' },
    ]);
  });

  // eslint-disable-next-line quotes
  it("doesn't render norms that are not included", async () => {
    const i18n = new Translate(translations, ['EN', 'DE']);
    const norms = productNorms(normsInput, i18n);
    expect(norms.length).toEqual(4);
  });
});
