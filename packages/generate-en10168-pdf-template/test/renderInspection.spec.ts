/* eslint-disable sonarjs/no-duplicate-string */
import { TableElement } from '@s1seven/schema-tools-generate-pdf-template-helpers';

import {
  createInspection,
  renderChemicalComposition,
  renderHardnessTest,
  renderNotchedBarImpactTest,
  renderOtherMechanicalTests,
  renderTensileTest,
} from '../src/lib/createInspection';
import { EN10168Translations, Inspection } from '../src/types';
import { defaultSchemaUrl } from './constants';
import { getI18N, getTranslations } from './getTranslations';

describe('Rendering inspection section', () => {
  let translations: EN10168Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('correctly renders TensileTest', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const tensileTest = renderTensileTest(
      {
        C11: {
          Property: 'Streckgrenze ReH/RP0,2',
          Value: 377.12,
          Unit: 'MPa',
        },
        C12: {
          Property: 'Zugfestigkeit Rm',
          Value: 456.18,
          Unit: 'MPa',
        },
        C13: {
          Property: 'Bruchdehnung A5/A80',
          Value: 29.7,
          Unit: '%',
        },
        SupplementaryInformation: {
          C14: {
            Key: 'Re/Rm',
            Value: '0.83',
            Type: 'number',
          },
          C15: {
            Key: 'Sample Identifier',
            Value: '10001011/175508',
            Type: 'string',
          },
        },
      },
      i18n,
    );
    expect(tensileTest[3].table).toEqual({
      body: [
        [
          {
            colSpan: 4,
            style: 'h5',
            text: [
              {
                font: undefined,
                text: 'Supplementary information',
              },
              { font: undefined, text: ' / ' },
              {
                font: undefined,
                text: 'Ergänzende Angaben',
              },
            ],
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
            text: [
              {
                text: [
                  {
                    text: 'C11 ',
                  },
                  {
                    font: undefined,
                    text: 'Yield or proof strength',
                  },
                  { font: undefined, text: ' / ' },
                  {
                    font: undefined,
                    text: 'Streck- oder Dehngrenze',
                  },
                ],
              },
              {
                text: ' Streckgrenze ReH/RP0,2',
              },
            ],
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
            text: [
              {
                text: [
                  {
                    text: 'C12 ',
                  },
                  {
                    font: undefined,
                    text: 'Tensile strength',
                  },
                  { font: undefined, text: ' / ' },
                  {
                    font: undefined,
                    text: 'Zugfestigkeit',
                  },
                ],
              },
              {
                text: ' Zugfestigkeit Rm',
              },
            ],
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
            text: [
              {
                text: [
                  {
                    text: 'C13 ',
                  },
                  {
                    font: undefined,
                    text: 'Elongation after fracture',
                  },
                  { font: undefined, text: ' / ' },
                  {
                    font: undefined,
                    text: 'Bruchdehnung',
                  },
                ],
              },
              {
                text: ' Bruchdehnung A5/A80',
              },
            ],
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

  it('correctly renders inpection object passed in an array', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const inspectionArray: [Inspection] = [
      {
        C00: 'Charge Chemical Analysis',
        ChemicalComposition: {
          C70: 'Y',
          C71: {
            Actual: '0.15',
            Symbol: 'C',
          },
          C72: {
            Actual: '0.005',
            Symbol: 'Si',
          },
          C73: {
            Actual: '1.000',
            Symbol: 'Mn',
          },
          C74: {
            Actual: '0.014',
            Symbol: 'P',
          },
          C75: {
            Actual: '0.007',
            Symbol: 'S',
          },
          C76: {
            Actual: '0.041',
            Symbol: 'Al',
          },
          C77: {
            Actual: '0.02',
            Symbol: 'Cr',
          },
          C78: {
            Actual: '0.009',
            Symbol: 'Ni',
          },
          C79: {
            Actual: '0.002',
            Symbol: 'Mo',
          },
          C80: {
            Actual: '0.01',
            Symbol: 'Cu',
          },
          C81: {
            Actual: '0.002',
            Symbol: 'V',
          },
          C82: {
            Actual: '0.001',
            Symbol: 'Ti',
          },
          C85: {
            Actual: '0.0047',
            Symbol: 'N',
          },
          C86: {
            Actual: '0.00001',
            Symbol: 'B',
          },
          C92: {
            Actual: '0.3227',
            Symbol: 'CEV',
          },
        },
      },
    ];
    const inspectionContent = createInspection(inspectionArray, i18n);
    expect(inspectionContent[0]).toEqual({
      text: [
        {
          font: undefined,
          text: 'Inspection',
        },
        { font: undefined, text: ' / ' },
        {
          font: undefined,
          text: 'Angaben zur Probenentnahme und Prüfung',
        },
      ],
      style: 'h2',
      margin: [0, 0, 0, 4],
    });
    expect(inspectionContent[1]).toEqual({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }],
    });
  });

  it('correctly renders HardnessTest', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
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
            text: [
              {
                font: undefined,
                text: 'Supplementary information',
              },
              { font: undefined, text: ' / ' },
              {
                font: undefined,
                text: 'Ergänzende Angaben',
              },
            ],
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
            text: [
              {
                text: 'C30 ',
              },
              {
                font: undefined,
                text: 'Method of test',
              },
              { font: undefined, text: ' / ' },
              {
                font: undefined,
                text: 'Prüfverfahren',
              },
            ],
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
            text: [
              {
                text: 'C31 ',
              },

              {
                font: undefined,
                text: 'Individual values',
              },
              { font: undefined, text: ' / ' },
              {
                font: undefined,
                text: 'Einzelwerte',
              },
            ],
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
            text: [
              {
                text: [
                  {
                    text: 'C32 ',
                  },
                  {
                    font: undefined,
                    text: 'Mean value',
                  },
                  { font: undefined, text: ' / ' },
                  {
                    font: undefined,
                    text: 'Mittelwert',
                  },
                ],
              },
              {
                text: ' Length',
              },
            ],
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

  it('correctly renders HardnessTest when SupplementaryInformation is not present', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
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
    };
    //
    const hardnessTest = renderHardnessTest(HardnessTest, i18n);
    expect(hardnessTest[3].table).toEqual({
      body: [
        [
          {
            colSpan: 4,
            text: '',
          },
          {},
          {},
          {},
        ],
      ],
      widths: [160, '*', 160, 130],
    });
    expect(hardnessTest[2].table).toEqual({
      body: [
        [
          {
            style: 'tableHeader',
            text: [
              {
                text: 'C30 ',
              },
              {
                font: undefined,
                text: 'Method of test',
              },
              { font: undefined, text: ' / ' },
              {
                font: undefined,
                text: 'Prüfverfahren',
              },
            ],
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
            text: [
              {
                text: 'C31 ',
              },
              {
                font: undefined,
                text: 'Individual values',
              },
              { font: undefined, text: ' / ' },
              {
                font: undefined,
                text: 'Einzelwerte',
              },
            ],
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
            text: [
              {
                text: [
                  {
                    text: 'C32 ',
                  },
                  {
                    font: undefined,
                    text: 'Mean value',
                  },
                  { font: undefined, text: ' / ' },
                  {
                    font: undefined,
                    text: 'Mittelwert',
                  },
                ],
              },
              {
                text: ' Length',
              },
            ],
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

  it('correctly handles inspection being undefined', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    //
    const inspectionRender = createInspection(undefined, i18n);
    expect(inspectionRender[0]).toHaveProperty('style', 'table');
    expect(inspectionRender[0]).toHaveProperty('id', 'Inspection');
    expect(inspectionRender[0]).toHaveProperty('table');
    expect(inspectionRender[0]).toHaveProperty('layout');
    expect(inspectionRender.length).toBe(1);
  });

  it('correctly renders NotchedBarImpact', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const notchedBarImpactTest = renderNotchedBarImpactTest(
      {
        C40: '0001 längs',
        C41: {
          Property: 'Width',
          Value: 5,
          Unit: 'mm',
        },
        C42: [
          {
            Value: 71.2,
            Unit: 'J',
          },
          {
            Value: 84.2,
            Unit: 'J',
          },
          {
            Value: 85.2,
            Unit: 'J',
          },
        ],
        C43: {
          Value: 80.3,
          Unit: 'J',
          Minimum: 78.5,
          Maximum: 90.6,
        },
        SupplementaryInformation: {
          C44: {
            Key: 'Sample Identifier',
            Value: '10001011/175508',
            Type: 'string',
          },
        },
      },
      i18n,
    );
    expect(notchedBarImpactTest[3].table).toEqual({
      body: [
        [
          {
            colSpan: 4,
            style: 'h5',
            text: [
              {
                font: undefined,
                text: 'Supplementary information',
              },
              { font: undefined, text: ' / ' },
              {
                font: undefined,
                text: 'Ergänzende Angaben',
              },
            ],
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
            text: [
              {
                text: 'C40 ',
              },

              {
                font: undefined,
                text: 'Type of test piece',
              },
              { font: undefined, text: ' / ' },
              {
                font: undefined,
                text: 'Probenform',
              },
            ],
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
            text: [
              {
                text: [
                  {
                    text: 'C41 ',
                  },
                  {
                    font: undefined,
                    text: 'Width of test piece',
                  },
                  { font: undefined, text: ' / ' },
                  {
                    font: undefined,
                    text: 'Probenbreite',
                  },
                ],
              },
              {
                text: ' Width',
              },
            ],
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
            text: [
              {
                text: 'C42 ',
              },
              {
                font: undefined,
                text: 'Individual values',
              },
              { font: undefined, text: ' / ' },
              {
                font: undefined,
                text: 'Einzelwerte',
              },
            ],
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
            text: [
              {
                text: [
                  {
                    text: 'C43 ',
                  },
                  {
                    font: undefined,
                    text: 'Mean value',
                  },
                  { font: undefined, text: ' / ' },
                  {
                    font: undefined,
                    text: 'Mittelwert',
                  },
                ],
              },
              {
                text: ' ',
              },
            ],
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

  it('correctly renders OtherMechanicalTests with Unit', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const otherMechanicalTests = renderOtherMechanicalTests(
      {
        C50: {
          Key: 'Verfestigungsversuch',
          Value: '0.223',
          Unit: 'n-Wert',
          Type: 'number',
        },
      },
      i18n,
    );
    expect(otherMechanicalTests[2].table).toEqual({
      widths: [160, '*', '*', 300],
      body: [[{ text: 'C50 Verfestigungsversuch', style: 'p' }, {}, {}, { text: '0.223 n-Wert', style: 'p' }]],
    });
  });

  it('correctly renders OtherMechanicalTests without Unit', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const otherMechanicalTests = renderOtherMechanicalTests(
      {
        C50: {
          Key: 'Verfestigungsversuch',
          Value: '0.223',
          Type: 'number',
        },
      },
      i18n,
    );
    expect(otherMechanicalTests[2].table).toEqual({
      widths: [160, '*', '*', 300],
      body: [[{ text: 'C50 Verfestigungsversuch', style: 'p' }, {}, {}, { text: '0.223 ', style: 'p' }]],
    });
  });

  it('correctly renders ChemicalComposition', () => {
    const i18n = getI18N(translations, ['EN', 'DE']);
    const chemicalComposition = renderChemicalComposition(
      {
        C71: {
          Actual: '0.15',
          Symbol: 'C',
        },
        C72: {
          Actual: '0.005',
          Symbol: 'Si',
        },
        C73: {
          Actual: '1.000',
          Symbol: 'Mn',
        },
        C74: {
          Actual: '0.014',
          Symbol: 'P',
        },
        C75: {
          Actual: '0.007',
          Symbol: 'S',
        },
        C76: {
          Actual: '0.041',
          Symbol: 'Al',
        },
        C77: {
          Actual: '0.02',
          Symbol: 'Cr',
        },
        C78: {
          Actual: '0.009',
          Symbol: 'Ni',
        },
        C79: {
          Actual: '0.002',
          Symbol: 'Mo',
        },
        C80: {
          Actual: '0.01',
          Symbol: 'Cu',
        },
        C81: {
          Actual: '0.002',
          Symbol: 'V',
        },
        C82: {
          Actual: '0.001',
          Symbol: 'Ti',
        },
        C85: {
          Actual: '0.0047',
          Symbol: 'N',
        },
        C86: {
          Actual: '0.0001',
          Symbol: 'B',
        },
        C92: {
          Actual: '0.3227',
          Symbol: 'CEV',
        },
      },
      i18n,
    );

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
          { text: '1.000', style: 'caption', margin: [-2, 2, -2, 2] },
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
          { text: '0.0001', style: 'caption', margin: [-2, 2, -2, 2] },
          { text: '0.3227', style: 'caption', margin: [-2, 2, -2, 2] },
        ],
      ],
    });
  });
});
