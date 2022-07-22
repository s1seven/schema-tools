var t,
  e,
  a,
  l,
  n =
    'undefined' != typeof globalThis
      ? globalThis
      : 'undefined' != typeof self
      ? self
      : 'undefined' != typeof window
      ? window
      : 'undefined' != typeof global
      ? global
      : {},
  r = {},
  i = {},
  s = n.parcelRequire2357;
null == s &&
  (((s = function (t) {
    if (t in r) return r[t].exports;
    if (t in i) {
      var e = i[t];
      delete i[t];
      var a = { id: t, exports: {} };
      return (r[t] = a), e.call(a.exports, a, a.exports), a.exports;
    }
    var l = new Error("Cannot find module '" + t + "'");
    throw ((l.code = 'MODULE_NOT_FOUND'), l);
  }).register = function (t, e) {
    i[t] = e;
  }),
  (n.parcelRequire2357 = s)),
  s.register('4xQFW', function (t, e) {
    'use strict';
    Object.defineProperty(t.exports, '__esModule', { value: !0 }),
      (t.exports.enumFromString =
        t.exports.createFooter =
        t.exports.localizeNumber =
        t.exports.localizeDate =
        t.exports.localizeValue =
        t.exports.computeTextStyle =
        t.exports.tableLayout =
        t.exports.createEmptyColumns =
        t.exports.fillTableRow =
          void 0),
      (t.exports.fillTableRow = function t(e, a, l = {}) {
        return e.length === a ? e : (e.push(l), t(e, a, l));
      });
    function a(t, e = 'EN') {
      const a = new Date(t);
      return new Intl.DateTimeFormat(e, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(a);
    }
    function l(t, e = 'EN') {
      return (
        'string' == typeof t && (t = Number(t)), new Intl.NumberFormat(e, { maximumSignificantDigits: 6 }).format(t)
      );
    }
    (t.exports.createEmptyColumns = (t) => Array(t).fill({})),
      (t.exports.tableLayout = {
        hLineWidth: function () {
          return 0;
        },
        vLineWidth: function () {
          return 0;
        },
      }),
      (t.exports.computeTextStyle = function (t, e, n) {
        return 'Date' === e
          ? a(t, n)
          : 'Array' === e && Array.isArray(t)
          ? t.join(', ')
          : 'Number' === e && 'number' == typeof t
          ? l(t, n)
          : 'Number' !== e || 'string' != typeof t || Number.isNaN(Number(t))
          ? t
          : l(t, n);
      }),
      (t.exports.localizeValue = function (t, e, n = 'EN') {
        let r;
        switch (e) {
          case 'number':
            r = l(Number(t));
            break;
          case 'date':
          case 'date-time':
            r = a(t, n);
            break;
          default:
            r = t;
        }
        return r;
      }),
      (t.exports.localizeDate = a),
      (t.exports.localizeNumber = l),
      (t.exports.createFooter = function (e) {
        return {
          style: 'table',
          margin: [0, 50, 0, 0],
          table: {
            widths: [280, 250],
            body: [
              [
                {
                  text: [
                    { text: 'Powered by ', style: 'small', margin: [0, 0, 0, 0] },
                    {
                      text: 's1seven.com',
                      style: 'small',
                      color: 'blue',
                      margin: [0, 0, 0, 0],
                      decoration: 'underline',
                      link: 'https://s1seven.com',
                    },
                  ],
                },
                { text: e, style: 'small', color: '#D3D3D3', margin: [0, 0, 0, 0], alignment: 'right' },
              ],
            ],
          },
          layout: t.exports.tableLayout,
        };
      }),
      (t.exports.enumFromString = function (t, e) {
        return Object.values(t).includes(e) ? e : void 0;
      });
  }),
  s.register('4yuQp', function (t, e) {
    'use strict';
    Object.defineProperty(t.exports, '__esModule', { value: !0 }), (t.exports.Translate = void 0);
    t.exports.Translate = class {
      constructor(t, e, a = ['EN']) {
        (this.translations = t), (this.extraTranslations = e), (this.languages = a);
      }
      getField(t, e, a) {
        const l = this.translations;
        return 'object' == typeof l && t in l && e in l[t] && a in l[t][e] ? l[t][e][a] : '';
      }
      getTranslation(t, e) {
        return this.languages.map((a) => this.getField(a, t, e)).join(' / ');
      }
      translate(t, e) {
        return 'certificateFields' === e ? `${t} ${this.getTranslation(e, t)}` : this.getTranslation(e, t);
      }
      extraTranslate(t, e, a, l) {
        return this.getExtraTranslation(t, e, a, l);
      }
      getExtraTranslation(t, e, a, l) {
        const n = this.languages.map((n) => this.getExtraField(t, n, e, a) || l);
        return n[0] === n[1] ? n[0] : n.join(' / ');
      }
      getExtraField(t, e, a, l) {
        const n = this.extraTranslations;
        return t && 'object' == typeof n && e in n[t] && a in n[t][e] && l in n[t][e][a] ? n[t][e][a][l] : '';
      }
    };
  }),
  s.register('6Elkl', function (t, e) {
    'use strict';
    Object.defineProperty(t.exports, '__esModule', { value: !0 });
  }),
  (t = module.exports),
  (e = 'generateContent'),
  (a = () => g),
  Object.defineProperty(t, e, { get: a, set: l, enumerable: !0, configurable: !0 });
var o = {},
  c =
    (o && o.__createBinding) ||
    (Object.create
      ? function (t, e, a, l) {
          void 0 === l && (l = a),
            Object.defineProperty(t, l, {
              enumerable: !0,
              get: function () {
                return e[a];
              },
            });
        }
      : function (t, e, a, l) {
          void 0 === l && (l = a), (t[l] = e[a]);
        }),
  y =
    (o && o.__exportStar) ||
    function (t, e) {
      for (var a in t) 'default' === a || Object.prototype.hasOwnProperty.call(e, a) || c(e, t, a);
    };
Object.defineProperty(o, '__esModule', { value: !0 }), y(s('4xQFW'), o), y(s('4yuQp'), o), y(s('6Elkl'), o);
const u = (t, e, a = 3) => {
  const l = Object.keys(t).map((l) => {
    const { Interpretation: n, Key: r, Value: i, Type: s, Unit: c } = t[l],
      y = a - 3,
      u = [
        { text: `${l} ${r}`, style: 'tableHeader', colSpan: a - 2 },
        { text: `${o.localizeValue(i, s, e.languages[0])} ${c || ''}`, style: 'p', colSpan: 1 },
        { text: n || '', style: 'p', colSpan: 1 },
      ];
    return (
      y > 0 &&
        o.createEmptyColumns(y).forEach((t, e) => {
          u.splice(1 + e, 0, t);
        }),
      u
    );
  });
  return l?.length
    ? [
        [
          { text: e.translate('SupplementaryInformation', 'otherFields'), style: 'h5', colSpan: a },
          ...o.createEmptyColumns(a - 1),
        ],
        ...l,
      ]
    : [];
};
function p(t, e, a) {
  if (!t) return [];
  const { Property: l, Value: n, Minimum: r, Maximum: i, Unit: s } = t;
  return [
    [
      { text: `${a.translate(e, 'certificateFields')} ${l || ''}`, style: 'tableHeader' },
      {},
      {},
      {
        alignment: 'justify',
        columns: [
          { text: `${o.localizeNumber(n, a.languages[0])} ${s || ''}`, style: 'p' },
          { text: r ? `min ${o.localizeNumber(r, a.languages[0])} ${s}` : '', style: 'p' },
          { text: i ? `max ${o.localizeNumber(i, a.languages[0])} ${s}` : '', style: 'p' },
        ],
      },
    ],
  ];
}
function m(t, e, a) {
  return t?.length
    ? [
        [
          { text: a.translate(e, 'certificateFields'), style: 'tableHeader' },
          {},
          {},
          {
            text: `${t.map(({ Value: t }) => o.localizeNumber(t, a.languages[0])).join(', ')} ${t[0]?.Unit || ''}`,
            style: 'p',
          },
        ],
      ]
    : [];
}
function d(t, e) {
  const a = ['C00', 'C01', 'C02', 'C03'],
    l = Object.keys(t)
      .filter((e) => a.includes(e) && t[e])
      .map((a) => [
        { text: e.translate(a, 'certificateFields'), style: 'tableHeader', colSpan: 3 },
        {},
        {},
        { text: t[a], style: 'p' },
      ]),
    n = t.SupplementaryInformation ? u(t.SupplementaryInformation, e, 4) : [],
    r = t.TensileTest
      ? (function (t, e) {
          const a = t.C10
              ? [
                  { text: e.translate('C10', 'certificateFields'), style: 'tableHeader' },
                  {},
                  {},
                  { text: t.C10, style: 'p' },
                ]
              : o.createEmptyColumns(4),
            l = ['C11', 'C12', 'C13'].filter((e) => t[e]).map((a) => p(t[a], a, e)[0] || []),
            n = t.SupplementaryInformation
              ? u(t.SupplementaryInformation, e, 4)
              : [[{ text: '', colSpan: 4 }, {}, {}, {}]];
          return [
            { text: e.translate('TensileTest', 'otherFields'), style: 'h4' },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
            {
              style: 'table',
              id: 'TensileTest',
              table: { widths: [160, '*', '*', 300], body: [a, ...l] },
              layout: o.tableLayout,
            },
            {
              style: 'table',
              id: 'TensileTest',
              table: { widths: [160, '*', 160, 130], body: n },
              layout: o.tableLayout,
            },
          ];
        })(t.TensileTest, e)
      : [],
    i = t.HardnessTest
      ? (function (t, e) {
          const a = t.C30
              ? [
                  { text: e.translate('C30', 'certificateFields'), style: 'tableHeader' },
                  {},
                  {},
                  { text: t.C30, style: 'p' },
                ]
              : o.createEmptyColumns(4),
            l = t.C31 ? m(t.C31, 'C31', e) : [],
            n = t.C32 ? p(t.C32, 'C32', e) : [],
            r = t.SupplementaryInformation
              ? u(t.SupplementaryInformation, e, 4)
              : [[{ text: '', colSpan: 4 }, {}, {}, {}]];
          return [
            { text: e.translate('HardnessTest', 'otherFields'), style: 'h4' },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
            { style: 'table', table: { widths: [160, '*', '*', 300], body: [a, ...l, ...n] }, layout: o.tableLayout },
            { style: 'table', table: { widths: [160, '*', 160, 130], body: r }, layout: o.tableLayout },
          ];
        })(t.HardnessTest, e)
      : [],
    s = t.NotchedBarImpactTest
      ? (function (t, e) {
          const a = t.C40
              ? [
                  { text: e.translate('C40', 'certificateFields'), style: 'tableHeader' },
                  {},
                  {},
                  { text: t.C40, style: 'p' },
                ]
              : o.createEmptyColumns(4),
            l = t.C41 ? p(t.C41, 'C41', e) : [],
            n = t.C42 ? m(t.C42, 'C42', e) : [],
            r = t.C43 ? p(t.C43, 'C43', e) : [],
            i = t.SupplementaryInformation
              ? u(t.SupplementaryInformation, e, 4)
              : [[{ text: '', colSpan: 4 }, {}, {}, {}]];
          return [
            { text: e.translate('NotchedBarImpactTest', 'otherFields'), style: 'h4' },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
            {
              style: 'table',
              table: { widths: [160, '*', '*', 300], body: [a, ...l, ...n, ...r] },
              layout: o.tableLayout,
            },
            { style: 'table', table: { widths: [160, '*', 160, 130], body: i }, layout: o.tableLayout },
          ];
        })(t.NotchedBarImpactTest, e)
      : [],
    c = t.OtherMechanicalTests
      ? (function (t, e) {
          const a = Object.keys(t).map((e) => [
            { text: `${e} ${t[e].Key}`, style: 'p' },
            {},
            {},
            { text: t[e].Value || '', style: 'p' },
          ]);
          return [
            { text: e.translate('OtherMechanicalTests', 'otherFields'), style: 'h4' },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
            { style: 'table', table: { widths: [160, '*', '*', 300], body: a }, layout: o.tableLayout },
          ];
        })(t.OtherMechanicalTests, e)
      : [],
    y = t.ChemicalComposition
      ? (function (t, e) {
          const a = t.C70
              ? [
                  { text: e.translate('C70', 'certificateFields'), style: 'tableHeader' },
                  {},
                  {},
                  { text: t.C70, style: 'p' },
                ]
              : o.createEmptyColumns(4),
            l = (function (t, e, a = 15) {
              const l = Object.keys(t)
                  .filter((t) => 'C70' !== t && 'SupplementaryInformation' !== t)
                  .map((e) => ({ key: e, value: t[e] })),
                n = new Array(Math.ceil(l.length / a)).fill('').map(() => l.splice(0, a)),
                r = [-2, 2, -2, 2];
              return n.map((t) => {
                const a = [
                  [{ text: '', style: 'p' }, ...t.map((t) => ({ text: t.key, style: 'p', margin: r }))],
                  [{ text: 'Symbol', style: 'p' }, ...t.map((t) => ({ text: t.value.Symbol, style: 'p', margin: r }))],
                  [
                    { text: 'Actual [%]', style: 'p' },
                    ...t.map((t) => ({
                      text: o.localizeNumber(t.value.Actual, e.languages[0]),
                      style: 'caption',
                      margin: r,
                    })),
                  ],
                ];
                if (t.some((t) => Object.prototype.hasOwnProperty.call(t.value, 'Minimum'))) {
                  const l = [
                    { text: 'Minimum', style: 'p' },
                    ...t.map((t) => ({
                      text: t.value?.Minimum ? o.localizeNumber(t.value.Minimum, e.languages[0]) : '',
                      style: 'caption',
                      margin: r,
                    })),
                  ];
                  a.push(l);
                }
                if (t.some((t) => Object.prototype.hasOwnProperty.call(t.value, 'Maximum'))) {
                  const l = [
                    { text: 'Maximun', style: 'p' },
                    ...t.map((t) => ({
                      text: t.value?.Maximum ? o.localizeNumber(t.value.Maximum, e.languages[0]) : '',
                      style: 'caption',
                      margin: r,
                    })),
                  ];
                  a.push(l);
                }
                return {
                  style: 'table',
                  table: { widths: new Array(t.length + 1).fill('').map((t, e) => (0 === e ? 45 : 25)), body: a },
                  layout: o.tableLayout,
                };
              });
            })(t, e),
            n = t.SupplementaryInformation
              ? u(t.SupplementaryInformation, e, 4)
              : [[{ text: '', colSpan: 4 }, {}, {}, {}]];
          return [
            { text: e.translate('ChemicalComposition', 'otherFields'), style: 'h4' },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
            { style: 'table', table: { widths: [160, '*', '*', 300], body: [a] }, layout: o.tableLayout },
            ...l,
            { style: 'table', table: { widths: [160, '*', 160, 130], body: n }, layout: o.tableLayout },
          ];
        })(t.ChemicalComposition, e)
      : [];
  return [
    { text: `${e.translate('Inspection', 'certificateGroups')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    { id: 'Inspection', style: 'table', table: { widths: [160, '*', '*', 300], body: l }, layout: o.tableLayout },
    n.length > 0 ? { style: 'table', table: { widths: [160, '*', 160, 130], body: n }, layout: o.tableLayout } : {},
    ...r,
    ...i,
    ...s,
    ...c,
    ...y,
  ];
}
const b = (t, e, a, l = 4) => {
  const n = Object.keys(t).map((a) => {
    const { Interpretation: n, Key: r, Value: i, Type: s, Unit: c } = t[a];
    return [
      { text: `${a} ${r}`, style: 'tableHeader', colSpan: l - 2 },
      ...o.createEmptyColumns(l - 3),
      { text: `${o.localizeValue(i, s, e.languages[0])} ${c || ''}`, style: 'p', colSpan: 1 },
      { text: n || '', style: 'p', colSpan: 1 },
    ];
  });
  return n?.length
    ? [
        { text: e.translate(a, 'otherFields'), style: 'h4' },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 0.5 }] },
        { style: 'table', table: { widths: [160, '*', 160, 130], body: n }, layout: o.tableLayout },
      ]
    : [];
};
function x(t, e) {
  const a = (function (t, e) {
      return [
        [{ text: e.translate('B02', 'certificateFields'), colSpan: 4, style: 'tableHeader' }, {}, {}, {}],
        ...Object.keys(t).map((a) => [
          { text: e.translate(a, 'otherFields'), style: 'caption', colSpan: 3 },
          {},
          {},
          { text: t[a].join(', '), style: 'p' },
        ]),
      ];
    })(t.B02, e),
    l = ['B01', 'B02', 'B09', 'B10', 'B11', 'B12', 'B12', 'B13', 'SupplementaryInformation'],
    n = Object.keys(t)
      .filter((t) => !l.includes(t))
      .map((a) => [
        { text: e.translate(a, 'certificateFields'), style: 'tableHeader', colSpan: 3 },
        {},
        {},
        { text: t[a], style: 'p' },
      ]),
    r = (function (t, e) {
      return t
        ? [
            [{ text: e.translate('B09', 'certificateFields'), style: 'tableHeader', colSpan: 4 }, {}, {}, {}],
            ...Object.keys(t)
              .filter((t) => 'unit' !== t.toLowerCase())
              .map((a) => [
                { text: e.translate(a, 'otherFields'), style: 'caption', colSpan: 3 },
                {},
                {},
                { text: 'Form' === a ? e.translate(t[a], 'otherFields') : `${t[a]} ${t.Unit || ''}`, style: 'p' },
              ]),
          ]
        : [];
    })(t.B09, e),
    i = p(t.B10, 'B10', e),
    s = p(t.B11, 'B11', e),
    c = p(t.B12, 'B12', e),
    y = p(t.B13, 'B13', e),
    m = t.SupplementaryInformation ? u(t.SupplementaryInformation, e, 4) : o.createEmptyColumns(4);
  return [
    { text: `${e.translate('ProductDescription', 'certificateGroups')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      id: 'ProductDescription',
      table: {
        widths: [160, '*', '*', 300],
        body: [
          [
            { text: e.translate('B01', 'certificateFields'), style: 'tableHeader', colSpan: 3 },
            {},
            {},
            { text: t.B01, style: 'p' },
          ],
          ...a,
          ...n,
          ...r,
          ...i,
          ...s,
          ...c,
          ...y,
        ],
      },
      layout: o.tableLayout,
    },
    {
      style: 'table',
      id: 'ProductDescription',
      table: { widths: [160, '*', 160, 130], body: m },
      layout: o.tableLayout,
    },
  ];
}
function f(t) {
  return [[t.slice(0, 3)], [o.fillTableRow([...t.slice(3, t.length)], 3, '')]];
}
function h(t, e) {
  const [a, l] = (function (t, e) {
    const a = t.A04 ? [[{ text: e.translate('A04', 'certificateFields'), style: 'tableHeader' }]] : [],
      l = t.A04 ? [[{ image: t.A04, width: 150 }]] : [],
      n = ['A01', 'A06', 'A06.1', 'A06.2', 'A06.3'],
      r = Object.keys(t).filter((t) => n.includes(t));
    return [
      [...a, ...r.map((t) => [{ text: e.translate(t, 'certificateFields'), style: 'tableHeader' }])],
      [
        ...l,
        ...r.map((e) => [
          { text: t[e].CompanyName, style: 'p' },
          { text: t[e].Street, style: 'p' },
          { text: `${t[e].City},${t[e].ZipCode},${t[e].Country}`, style: 'p' },
          { text: t[e]?.VAT_Id || '', style: 'p' },
          { text: t[e].Email, style: 'p' },
        ]),
      ],
    ];
  })(t, e);
  if (a?.length <= 3) {
    return {
      style: 'table',
      table: { widths: [200, 150, 150], body: [o.fillTableRow(a, 3, ''), o.fillTableRow(l, 3, '')] },
      layout: o.tableLayout,
    };
  }
  const n = f(a),
    r = f(l);
  return {
    style: 'table',
    table: { widths: [200, 150, 150], body: [...n[0], ...r[0], ...n[1], ...r[1]] },
    layout: o.tableLayout,
  };
}
function g(t, e) {
  const a = new o.Translate(e, {}, t.Certificate.CertificateLanguages),
    l = h(t.Certificate.CommercialTransaction, a),
    n = (function (t, e) {
      const a = ['A01', 'A04', 'A06', 'A06.1', 'A06.2', 'A06.3', 'SupplementaryInformation'],
        l = Object.keys(t)
          .filter((t) => !a.includes(t))
          .map((a) => [
            { text: e.translate(a, 'certificateFields'), style: 'tableHeader', colSpan: 3 },
            {},
            {},
            { text: t[a], style: 'p' },
          ]),
        n = t.SupplementaryInformation ? u(t.SupplementaryInformation, e, 4) : o.createEmptyColumns(4);
      return [
        { text: `${e.translate('CommercialTransaction', 'certificateGroups')}`, style: 'h2', margin: [0, 0, 0, 4] },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
        {
          style: 'table',
          id: 'CommercialTransaction',
          table: { widths: [160, '*', '*', 300], body: l },
          layout: o.tableLayout,
        },
        { style: 'table', table: { widths: [160, '*', 160, 130], body: n }, layout: o.tableLayout },
      ];
    })(t.Certificate.CommercialTransaction, a),
    r = x(t.Certificate.ProductDescription, a),
    i = (function (t, e) {
      const a = [];
      if (Array.isArray(t))
        t.forEach((t) => {
          const l = d(t, e);
          a.push(...l);
        });
      else {
        const l = d(t, e);
        a.push(...l);
      }
      return a;
    })(t.Certificate.Inspection, a),
    s = (function (t, e) {
      if (!t)
        return [
          {
            style: 'table',
            id: 'OtherTests',
            table: { widths: [160, '*', '*', 300], body: [o.createEmptyColumns(4)] },
            layout: o.tableLayout,
          },
        ];
      const a = t.D01
          ? [
              { text: e.translate('D01', 'certificateFields'), style: 'tableHeader', colSpan: 3 },
              {},
              {},
              { text: t.D01, style: 'p' },
            ]
          : o.createEmptyColumns(4),
        l = t.NonDestructiveTests ? b(t.NonDestructiveTests, e, 'NonDestructiveTests', 4) : [],
        n = t.OtherProductTests ? b(t.OtherProductTests, e, 'OtherProductTests', 4) : [];
      return [
        { text: `${e.translate('OtherTests', 'certificateGroups')}`, style: 'h2', margin: [0, 0, 0, 4] },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
        { style: 'table', id: 'OtherTests', table: { widths: [160, '*', '*', 300], body: [a] }, layout: o.tableLayout },
        ...l,
        ...n,
      ];
    })(t.Certificate.OtherTests, a),
    c = (function (t, e) {
      const a = t.SupplementaryInformation ? u(t.SupplementaryInformation, e, 3) : [[{ text: '', colSpan: 3 }, {}, {}]],
        l = [
          {
            style: 'table',
            table: {
              widths: [160, '*', 180],
              body: [
                [
                  { text: e.translate('Z01', 'certificateFields'), style: 'tableHeader', colSpan: 2 },
                  {},
                  { text: t.Z01, style: 'p' },
                ],
                [
                  { text: e.translate('Z02', 'certificateFields'), style: 'tableHeader', colSpan: 2 },
                  {},
                  { text: o.localizeDate(t.Z02, e.languages[0]), style: 'p' },
                ],
                [
                  { text: e.translate('Z03', 'certificateFields'), style: 'tableHeader', colSpan: 2 },
                  {},
                  { text: t?.Z03, style: 'p' },
                ],
              ],
            },
            layout: o.tableLayout,
          },
        ];
      if (t.Z04) {
        const e = {
          width: 100,
          style: 'table',
          table: {
            body: [
              [{ image: t.Z04.CE_Image }],
              [{ text: t.Z04.NotifiedBodyNumber, alignment: 'center', bold: !0, style: 'caption' }],
              [{ text: t.Z04.DoCYear, alignment: 'center', bold: !0, style: 'caption' }],
              [{ text: t.Z04.DoCNumber, alignment: 'center', bold: !0, style: 'caption' }],
            ],
          },
          layout: o.tableLayout,
        };
        l.push(e);
      }
      return [
        { text: `${e.translate('Validation', 'certificateGroups')}`, style: 'h2', margin: [0, 0, 0, 4] },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
        { columns: l },
        { style: 'table', table: { widths: [160, '*', 300], body: a }, layout: o.tableLayout },
      ];
    })(t.Certificate.Validation, a);
  return [l, ...n, ...r, ...i, ...s, ...c, o.createFooter(t.RefSchemaUrl)];
}
