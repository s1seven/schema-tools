import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';
import {
  renderChemicalComposition,
  renderTensileTest,
  renderHardnessTest,
  renderNotchedBarImpactTest,
} from '../src/lib/createInspection';

const defaultSchemaUrl = 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Rendering inspection section', () => {
  let translations: Record<string, unknown>;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders TensileTest', () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE });
    const tensileTest = renderTensileTest(certificate.Certificate.Inspection.TensileTest, i18n);
    expect(tensileTest[1].table).toEqual({
      body: [
        [{}, {}, {}, {}],
        [
          {
            style: 'tableHeader',
            text: 'C11 Yield or proof strength / Streck- oder Dehngrenze Re',
          },
          {},
          {},
          {
            alignment: 'justify',
            columns: [
              {
                style: 'p',
                text: '431.86 MPa',
              },
              {
                style: 'p',
                text: '',
              },
              {
                style: 'p',
                text: '',
              },
            ],
          },
        ],
        [
          {
            style: 'tableHeader',
            text: 'C12 Tensile strength / Zugfestigkeit Rm',
          },
          {},
          {},
          {
            alignment: 'justify',
            columns: [
              {
                style: 'p',
                text: '507.73 MPa',
              },
              {
                style: 'p',
                text: '',
              },
              {
                style: 'p',
                text: '',
              },
            ],
          },
        ],
        [
          {
            style: 'tableHeader',
            text: 'C13 Elongation after fracture / Bruchdehnung A',
          },
          {},
          {},
          {
            alignment: 'justify',
            columns: [
              {
                style: 'p',
                text: '28.4 %',
              },
              {
                style: 'p',
                text: '',
              },
              {
                style: 'p',
                text: '',
              },
            ],
          },
        ],
        [
          {
            colSpan: 4,
            style: 'h5',
            text: 'Supplementary information / Ergänzende Angaben',
          },
          {},
          {},
          {},
        ],
        [
          {
            colSpan: 3,
            style: 'tableHeader',
            text: 'Test no.',
          },
          {},
          {},
          {
            colSpan: 1,
            style: 'p',
            text: '1076 ',
          },
        ],
      ],
      widths: [160, '*', '*', 300],
    });
  });

  it('correctly renders HardnessTest', () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE });
    const HardnessTest = {
      C30: 'Method',
      C31: [
        {
          Value: 5,
          Unit: 'm',
          Property: 'Height',
        },
        {
          Value: 1,
          Unit: 'm',
          Property: 'Width',
        },
        {
          Value: 200,
          Unit: 'kg',
          Property: 'Mass',
        },
      ],
      C32: {
        Value: 200,
        Unit: 'mm',
        Property: 'Length',
      },
      SupplementaryInformation: {
        C33: {
          Value: 'C33 Value',
          Key: 'C33 key',
        },
      },
    };
    const hardnessTest = renderHardnessTest(HardnessTest, i18n);
    expect(hardnessTest[1].table).toEqual({
      body: [
        [
          {
            style: 'p',
            text: 'C30 Method of test / Prüfverfahren',
          },
          {},
          {},
          {
            style: 'p',
            text: 'Method',
          },
        ],
        [
          {
            style: 'tableHeader',
            text: 'C31 Individual values / Einzelwerte',
          },
          {},
          {},
          {
            alignment: 'justify',
            style: 'p',
            text: '5, 1, 200 m',
          },
        ],
        [
          {
            style: 'tableHeader',
            text: 'C32 Mean value / Mittelwert Length',
          },
          {},
          {},
          {
            alignment: 'justify',
            columns: [
              {
                style: 'p',
                text: '200 mm',
              },
              {
                style: 'p',
                text: '',
              },
              {
                style: 'p',
                text: '',
              },
            ],
          },
        ],
        [
          {
            colSpan: 4,
            style: 'h5',
            text: 'Supplementary information / Ergänzende Angaben',
          },
          {},
          {},
          {},
        ],
        [
          {
            colSpan: 3,
            style: 'tableHeader',
            text: 'C33 key',
          },
          {},
          {},
          {
            colSpan: 1,
            style: 'p',
            text: 'C33 Value ',
          },
        ],
      ],
      widths: [160, '*', '*', 300],
    });
  });

  it('correctly renders NotchedBarImpact', () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE });
    const notchedBarImpactTest = renderNotchedBarImpactTest(
      certificate.Certificate.Inspection.NotchedBarImpactTest,
      i18n,
    );
    expect(notchedBarImpactTest[1].table).toEqual({
      body: [
        [{}, {}, {}, {}],
        [
          {
            style: 'tableHeader',
            text: 'C42 Individual values / Einzelwerte',
          },
          {},
          {},
          {
            alignment: 'justify',
            style: 'p',
            text: '42, 39, 40 ',
          },
        ],
        [
          {
            style: 'tableHeader',
            text: 'C43 Mean value / Mittelwert ',
          },
          {},
          {},
          {
            alignment: 'justify',
            columns: [
              {
                style: 'p',
                text: '40 ',
              },
              {
                style: 'p',
                text: '',
              },
              {
                style: 'p',
                text: '',
              },
            ],
          },
        ],
      ],
      widths: [160, '*', '*', 300],
    });
  });

  it('correctly renders ChemicalComposition', () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE });
    const chemicalComposition = renderChemicalComposition(certificate.Certificate.Inspection.ChemicalComposition, i18n);
    expect(chemicalComposition[1].table).toEqual({
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
      ],
    });
    expect(chemicalComposition[2].table).toEqual({
      widths: [240, '*'],
      body: [
        [{ text: 'Supplementary information / Ergänzende Angaben', style: 'h5', colSpan: 2 }, {}],
        [
          { text: 'Bq/kg', style: 'tableHeader', colSpan: 1 },
          { text: '<100 ', style: 'p', colSpan: 1 },
        ],
      ],
    });
  });
});
