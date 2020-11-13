import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';
import { productNorms } from '../src/lib/productNorms';
const defaultSchemaUrl = certificate.RefSchemaUrl || 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Product norms', () => {
  it('works for example certificate', async () => {
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
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
          style: 'tableHeader',
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
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
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
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const norms = productNorms(normsInput, i18n);
    expect(norms[2]).toEqual([
      { text: 'Mass norm / Mass Norm', colSpan: 3, style: 'tableHeader' },
      {},
      {},
      { text: 'EN 10219-1:2006, EN 10220', style: 'p' },
    ]);
  });
  it("doesn't render norms that are not included", async () => {
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const norms = productNorms(normsInput, i18n);
    expect(norms.length).toEqual(4);
  });
});
