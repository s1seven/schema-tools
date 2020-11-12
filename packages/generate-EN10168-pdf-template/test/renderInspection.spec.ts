import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';
import { renderChemicalComposition } from '../src/lib/helpers';

const defaultSchemaUrl = 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Rendering inspection section', () => {
  let translations: Record<string, unknown>;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders ChemicalComposition', async () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE });
    const chemicalComposition = renderChemicalComposition(certificate.Certificate.Inspection.ChemicalComposition, i18n);
    expect(chemicalComposition.table).toEqual({
      body: [
        [
          {
            text: '',
            style: ' caption',
          },
          {
            text: 'C71',
            style: 'caption',
          },
          {
            text: 'C72',
            style: 'caption',
          },
          {
            text: 'C73',
            style: 'caption',
          },
          {
            text: 'C74',
            style: 'caption',
          },
          {
            text: 'C75',
            style: 'caption',
          },
          {
            text: 'C76',
            style: 'caption',
          },
          {
            text: 'C77',
            style: 'caption',
          },
          {
            text: 'C78',
            style: 'caption',
          },
          {
            text: 'C79',
            style: 'caption',
          },
          {
            text: 'C80',
            style: 'caption',
          },
          {
            text: 'C81',
            style: 'caption',
          },
          {
            text: 'C82',
            style: 'caption',
          },
          {
            text: 'C83',
            style: 'caption',
          },
          {
            text: 'C85',
            style: 'caption',
          },
          {
            text: 'C86',
            style: 'caption',
          },
          {
            text: 'C87',
            style: 'caption',
          },
          {
            text: 'C88',
            style: 'caption',
          },
          {
            text: 'C92',
            style: 'caption',
          },
        ],
        [
          {
            text: 'Symbol',
            style: 'caption',
          },
          {
            text: 'C',
            style: 'caption',
          },
          {
            text: 'Mn',
            style: 'caption',
          },
          {
            text: 'Si',
            style: 'caption',
          },
          {
            text: 'S',
            style: 'caption',
          },
          {
            text: 'P',
            style: 'caption',
          },
          {
            text: 'Al',
            style: 'caption',
          },
          {
            text: 'Cr',
            style: 'caption',
          },
          {
            text: 'Ni',
            style: 'caption',
          },
          {
            text: 'Cu',
            style: 'caption',
          },
          {
            text: 'Mo',
            style: 'caption',
          },
          {
            text: 'V',
            style: 'caption',
          },
          {
            text: 'Nb',
            style: 'caption',
          },
          {
            text: 'B',
            style: 'caption',
          },
          {
            text: 'N',
            style: 'caption',
          },
          {
            text: 'As',
            style: 'caption',
          },
          {
            text: 'Sn',
            style: 'caption',
          },
          {
            text: 'Ti',
            style: 'caption',
          },
          {
            text: 'CEV',
            style: 'caption',
          },
        ],
        [
          {
            text: 'Actual',
            style: 'caption',
          },
          {
            text: 0.017,
            style: 'small',
          },
          {
            text: 0.0106,
            style: 'small',
          },
          {
            text: 0.0003,
            style: 'small',
          },
          {
            text: 0.00005,
            style: 'small',
          },
          {
            text: 0.00012,
            style: 'small',
          },
          {
            text: 0.00022,
            style: 'small',
          },
          {
            text: 0.0006,
            style: 'small',
          },
          {
            text: 0.0004,
            style: 'small',
          },
          {
            text: 0.0014,
            style: 'small',
          },
          {
            text: 0.0001,
            style: 'small',
          },
          {
            text: 0.00001,
            style: 'small',
          },
          {
            text: 0.00001,
            style: 'small',
          },
          {
            text: 0.000003,
            style: 'small',
          },
          {
            text: 0.00009,
            style: 'small',
          },
          {
            text: 0.00005,
            style: 'small',
          },
          {
            text: 0.000012,
            style: 'small',
          },
          {
            text: 0.000015,
            style: 'small',
          },
          {
            text: 0.042,
            style: 'small',
          },
        ],
        [
          {
            text: 'Supplementary information / Ergänzende Angaben',
            style: 'h4',
            colSpan: 19,
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
        ],
        [
          {
            text: 'Bq/kg',
            style: 'tableHeader',
            colSpan: 17,
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {
            text: '<100 ',
            style: 'p',
            colSpan: 2,
          },
        ],
      ],
    });
  });
});
