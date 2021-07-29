import {
  renderChemicalComposition,
  renderHardnessTest,
  renderNotchedBarImpactTest,
  renderTensileTest,
} from '../src/lib/createInspection';
import { TableElement, Translations } from '../src/types';
import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';
import { defaultSchemaUrl } from './constants';
import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';

describe('Rendering inspection section', () => {
  let translations: Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders TensileTest', () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);
    const tensileTest = renderTensileTest(certificate.Certificate.Inspection.TensileTest, i18n);
    expect(tensileTest[2].table).toEqual({
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
            text: 'C14 Test no.',
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
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);
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
          Key: 'key',
        },
      },
    };
    const hardnessTest = renderHardnessTest(HardnessTest, i18n);
    expect(hardnessTest[2].table).toEqual({
      body: [
        [
          {
            style: 'tableHeader',
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
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);
    const notchedBarImpactTest = renderNotchedBarImpactTest(
      certificate.Certificate.Inspection.NotchedBarImpactTest,
      i18n,
    );
    expect(notchedBarImpactTest[2].table).toEqual({
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
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);
    const chemicalComposition = renderChemicalComposition(certificate.Certificate.Inspection.ChemicalComposition, i18n);
    // console.log(JSON.stringify(chemicalComposition[3]));

    expect((chemicalComposition[3] as TableElement).table).toEqual({
      widths: [45, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
      body: [
        [
          { text: '', style: 'p' },
          { text: 'C71', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C72', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C73', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C74', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C75', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C76', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C77', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C78', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C79', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C80', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C81', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C82', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C83', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C85', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C86', style: 'p', margin: [-2, 2, -2, 2] },
        ],
        [
          { text: 'Symbol', style: 'p' },
          { text: 'C', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Mn', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Si', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'S', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'P', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Al', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Cr', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Ni', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Cu', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Mo', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'V', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Nb', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'B', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'N', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'As', style: 'p', margin: [-2, 2, -2, 2] },
        ],
        [
          { text: 'Actual [%]', style: 'p' },
          { text: '1.7', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '1.06', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.03', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.005', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.012', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.022', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.06', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.04', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.14', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.01', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.001', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.001', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.0003', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.009', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.005', style: 'caption', margin: [-2, 2, -2, 2] },
        ],
      ],
    });
    // expect((chemicalComposition[4] as TableElement).table).toEqual({
    //   widths: [160, '*', '*', 300],
    //   body: [
    //     [{ text: 'Supplementary information / Ergänzende Angaben', style: 'h5', colSpan: 4 }, {}, {}, {}],
    //     [{ text: 'C110 Bq/kg', style: 'tableHeader', colSpan: 3 }, {}, {}, { text: '<100 ', style: 'p', colSpan: 1 }],
    //   ],
    // });
  });
});
