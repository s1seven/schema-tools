import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';
import { getTranslations } from './getTranslations';
import { productNorms } from '../src/lib/createProductDescription';
import { Translate } from '../src/lib/translate';

const defaultSchemaUrl = certificate.RefSchemaUrl || 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Product norms', () => {
  let translations: Record<string, unknown>;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('works for example certificate', async () => {
    const i18n = new Translate(translations);
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
        { text: 'S355J2H', style: 'p' },
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
    const i18n = new Translate(translations);
    const norms = productNorms(normsInput, i18n);
    expect(norms[0]).toEqual([
      { text: 'B02 Specification of the product / Spezfikation des Erzeugnis', colSpan: 4, style: 'tableHeader' },
      {},
      {},
      {},
    ]);
  });

  it('correctly renders for many values', async () => {
    const i18n = new Translate(translations);
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
    const i18n = new Translate(translations);
    const norms = productNorms(normsInput, i18n);
    expect(norms.length).toEqual(4);
  });
});
