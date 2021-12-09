/* eslint-disable sonarjs/no-duplicate-string */
import { TableElement, Translate, Translations } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import {
  renderChemicalComposition,
  renderHardnessTest,
  renderNotchedBarImpactTest,
  renderTensileTest,
} from '../src/lib/createInspection';
import { certificate, defaultSchemaUrl } from './constants';
import { getTranslations } from './getTranslations';

describe('Rendering inspection section', () => {
  let translations: Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders TensileTest', () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);
    const tensileTest = renderTensileTest(certificate.Certificate.Inspection.TensileTest as any, i18n);
    expect(tensileTest[3].table).toEqual({
      body: [
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
            colSpan: 2,
            style: 'tableHeader',
            text: 'C14 Re/Rm',
          },
          {},
          {
            colSpan: 1,
            style: 'p',
            text: '0.83 ',
          },
          {
            colSpan: 1,
            style: 'p',
            text: '',
          },
        ],
        [
          {
            colSpan: 2,
            style: 'tableHeader',
            text: 'C15 Sample Identifier',
          },
          {},
          {
            colSpan: 1,
            style: 'p',
            text: '10001011/175508 ',
          },
          {
            colSpan: 1,
            style: 'p',
            text: '',
          },
        ],
      ],
      widths: [160, '*', 160, 130],
    });
    expect(tensileTest[2].table).toEqual({
      body: [
        [{}, {}, {}, {}],
        [
          {
            style: 'tableHeader',
            text: 'C11 Yield or proof strength / Streck- oder Dehngrenze Streckgrenze ReH/RP0,2',
          },
          {},
          {},
          {
            alignment: 'justify',
            columns: [
              {
                style: 'p',
                text: '377.12 MPa',
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
            text: 'C12 Tensile strength / Zugfestigkeit Zugfestigkeit Rm',
          },
          {},
          {},
          {
            alignment: 'justify',
            columns: [
              {
                style: 'p',
                text: '456.18 MPa',
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
            text: 'C13 Elongation after fracture / Bruchdehnung Bruchdehnung A5/A80',
          },
          {},
          {},
          {
            alignment: 'justify',
            columns: [
              {
                style: 'p',
                text: '29.7 %',
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
    //
    const hardnessTest = renderHardnessTest(HardnessTest, i18n);
    expect(hardnessTest[3].table).toEqual({
      body: [
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
            colSpan: 2,
            style: 'tableHeader',
            text: 'C33 key',
          },
          {},
          {
            colSpan: 1,
            style: 'p',
            text: 'C33 Value ',
          },
          {
            colSpan: 1,
            style: 'p',
            text: '',
          },
        ],
      ],
      widths: [160, '*', 160, 130],
    });
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
      ],
      widths: [160, '*', '*', 300],
    });
  });

  it('correctly renders NotchedBarImpact', () => {
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);
    const notchedBarImpactTest = renderNotchedBarImpactTest(
      certificate.Certificate.Inspection.NotchedBarImpactTest as any,
      i18n,
    );
    expect(notchedBarImpactTest[3].table).toEqual({
      body: [
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
            colSpan: 2,
            style: 'tableHeader',
            text: 'C44 Sample Identifier',
          },
          {},
          {
            colSpan: 1,
            style: 'p',
            text: '10001011/175508 ',
          },
          {
            colSpan: 1,
            style: 'p',
            text: '',
          },
        ],
      ],
      widths: [160, '*', 160, 130],
    });

    expect(notchedBarImpactTest[2].table).toEqual({
      body: [
        [
          {
            style: 'tableHeader',
            text: 'C40 Type of test piece / Probenform',
          },
          {},
          {},
          {
            style: 'p',
            text: '0001 längs',
          },
        ],
        [
          {
            style: 'tableHeader',
            text: 'C41 Width of test piece / Probenbreite Width',
          },
          {},
          {},
          {
            alignment: 'justify',
            columns: [
              {
                style: 'p',
                text: '5 mm',
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
            text: 'C42 Individual values / Einzelwerte',
          },
          {},
          {},
          {
            style: 'p',
            text: '71.2, 84.2, 85.2 J',
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
                text: '80.3 J',
              },
              {
                style: 'p',
                text: 'min 78.5 J',
              },
              {
                style: 'p',
                text: 'max 90.6 J',
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
          { text: 'C85', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C86', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'C92', style: 'p', margin: [-2, 2, -2, 2] },
        ],
        [
          { text: 'Symbol', style: 'p' },
          { text: 'C', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Si', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Mn', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'P', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'S', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Al', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Cr', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Ni', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Mo', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Cu', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'V', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'Ti', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'N', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'B', style: 'p', margin: [-2, 2, -2, 2] },
          { text: 'CEV', style: 'p', margin: [-2, 2, -2, 2] },
        ],
        [
          { text: 'Actual [%]', style: 'p' },
          { text: '0.15', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.005', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '1', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.014', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.007', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.041', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.02', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.009', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.002', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.01', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.002', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.001', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.0047', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.00001', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.3227', style: 'caption', margin: [-2, 2, -2, 2] },
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
