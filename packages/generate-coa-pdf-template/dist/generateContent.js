var t = require('process'),
  e = require('buffer');
function r(t, e, r, n) {
  Object.defineProperty(t, e, { get: r, set: n, enumerable: !0, configurable: !0 });
}
var n =
  'undefined' != typeof globalThis
    ? globalThis
    : 'undefined' != typeof self
    ? self
    : 'undefined' != typeof window
    ? window
    : 'undefined' != typeof global
    ? global
    : {};
function o(t, e) {
  return (
    Object.keys(e).forEach(function (r) {
      'default' === r ||
        '__esModule' === r ||
        t.hasOwnProperty(r) ||
        Object.defineProperty(t, r, {
          enumerable: !0,
          get: function () {
            return e[r];
          },
        });
    }),
    t
  );
}
function a(t) {
  return t && t.__esModule ? t.default : t;
}
var i = {},
  s = {},
  c = n.parcelRequire4666;
null == c &&
  (((c = function (t) {
    if (t in i) return i[t].exports;
    if (t in s) {
      var e = s[t];
      delete s[t];
      var r = { id: t, exports: {} };
      return (i[t] = r), e.call(r.exports, r, r.exports), r.exports;
    }
    var n = new Error("Cannot find module '" + t + "'");
    throw ((n.code = 'MODULE_NOT_FOUND'), n);
  }).register = function (t, e) {
    s[t] = e;
  }),
  (n.parcelRequire4666 = c)),
  c.register('jP9NU', function (t, e) {
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
      (t.exports.fillTableRow = function t(e, r, n = {}) {
        return e.length === r ? e : (e.push(n), t(e, r, n));
      });
    function r(t, e = 'EN') {
      const r = new Date(t);
      return new Intl.DateTimeFormat(e, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(r);
    }
    function n(t, e = 'EN') {
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
      (t.exports.computeTextStyle = function (t, e, o) {
        return 'Date' === e
          ? r(t, o)
          : 'Array' === e && Array.isArray(t)
          ? t.join(', ')
          : 'Number' === e && 'number' == typeof t
          ? n(t, o)
          : 'Number' !== e || 'string' != typeof t || Number.isNaN(Number(t))
          ? t
          : n(t, o);
      }),
      (t.exports.localizeValue = function (t, e, o = 'EN') {
        let a;
        switch (e) {
          case 'number':
            a = n(Number(t));
            break;
          case 'date':
          case 'date-time':
            a = r(t, o);
            break;
          default:
            a = t;
        }
        return a;
      }),
      (t.exports.localizeDate = r),
      (t.exports.localizeNumber = n),
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
  c.register('dhNUM', function (t, e) {
    'use strict';
    Object.defineProperty(t.exports, '__esModule', { value: !0 }), (t.exports.Translate = void 0);
    t.exports.Translate = class {
      constructor(t, e, r = ['EN']) {
        (this.translations = t), (this.extraTranslations = e), (this.languages = r);
      }
      getField(t, e, r) {
        const n = this.translations;
        return 'object' == typeof n && t in n && e in n[t] && r in n[t][e] ? n[t][e][r] : '';
      }
      getTranslation(t, e) {
        return this.languages.map((r) => this.getField(r, t, e)).join(' / ');
      }
      translate(t, e) {
        return 'certificateFields' === e ? `${t} ${this.getTranslation(e, t)}` : this.getTranslation(e, t);
      }
      extraTranslate(t, e, r, n) {
        return this.getExtraTranslation(t, e, r, n);
      }
      getExtraTranslation(t, e, r, n) {
        const o = this.languages.map((o) => this.getExtraField(t, o, e, r) || n);
        return o[0] === o[1] ? o[0] : o.join(' / ');
      }
      getExtraField(t, e, r, n) {
        const o = this.extraTranslations;
        return t && 'object' == typeof o && e in o[t] && r in o[t][e] && n in o[t][e][r] ? o[t][e][r][n] : '';
      }
    };
  }),
  c.register('dxg0O', function (t, e) {
    'use strict';
    Object.defineProperty(t.exports, '__esModule', { value: !0 });
  }),
  c.register('iPBDe', function (t, e) {
    'use strict';
    function r(t) {
      return (r =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            })(t);
    }
    Object.defineProperty(t.exports, '__esModule', { value: !0 }),
      (t.exports.default = function (t) {
        if (!('string' == typeof t || t instanceof String)) {
          var e = r(t);
          throw (
            (null === t ? (e = 'null') : 'object' === e && (e = t.constructor.name),
            new TypeError('Expected a string but received a '.concat(e)))
          );
        }
      }),
      (t.exports = t.exports.default),
      (t.exports.default = t.exports.default);
  }),
  c.register('kdFId', function (t, e) {
    'use strict';
    Object.defineProperty(t.exports, '__esModule', { value: !0 }),
      (t.exports.default = function (t, e) {
        (0, r.default)(t),
          (e = (0, n.default)(e, a)).allow_trailing_dot &&
            '.' === t[t.length - 1] &&
            (t = t.substring(0, t.length - 1));
        !0 === e.allow_wildcard && 0 === t.indexOf('*.') && (t = t.substring(2));
        var o = t.split('.'),
          i = o[o.length - 1];
        if (e.require_tld) {
          if (o.length < 2) return !1;
          if (!/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(i)) return !1;
          if (/\s/.test(i)) return !1;
        }
        return (
          !(!e.allow_numeric_tld && /^\d+$/.test(i)) &&
          o.every(function (t) {
            return (
              !(t.length > 63) &&
              !!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(t) &&
              !/[\uff01-\uff5e]/.test(t) &&
              !/^-|-$/.test(t) &&
              !(!e.allow_underscores && /_/.test(t))
            );
          })
        );
      });
    var r = o(c('iPBDe')),
      n = o(c('bhfRL'));
    function o(t) {
      return t && t.__esModule ? t : { default: t };
    }
    var a = {
      require_tld: !0,
      allow_underscores: !1,
      allow_trailing_dot: !1,
      allow_numeric_tld: !1,
      allow_wildcard: !1,
    };
    (t.exports = t.exports.default), (t.exports.default = t.exports.default);
  }),
  c.register('bhfRL', function (t, e) {
    'use strict';
    Object.defineProperty(t.exports, '__esModule', { value: !0 }),
      (t.exports.default = function () {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          e = arguments.length > 1 ? arguments[1] : void 0;
        for (var r in e) void 0 === t[r] && (t[r] = e[r]);
        return t;
      }),
      (t.exports = t.exports.default),
      (t.exports.default = t.exports.default);
  }),
  c.register('exkk0', function (t, e) {
    'use strict';
    Object.defineProperty(t.exports, '__esModule', { value: !0 }),
      (t.exports.default = function t(e) {
        var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '';
        if (((0, n.default)(e), !(r = String(r)))) return t(e, 4) || t(e, 6);
        if ('4' === r) {
          if (!i.test(e)) return !1;
          var o = e.split('.').sort(function (t, e) {
            return t - e;
          });
          return o[3] <= 255;
        }
        return '6' === r && !!u.test(e);
      });
    var r,
      n = (r = c('iPBDe')) && r.__esModule ? r : { default: r };
    var o = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])',
      a = '('.concat(o, '[.]){3}').concat(o),
      i = new RegExp('^'.concat(a, '$')),
      s = '(?:[0-9a-fA-F]{1,4})',
      u = new RegExp(
        '^(' +
          '(?:'.concat(s, ':){7}(?:').concat(s, '|:)|') +
          '(?:'.concat(s, ':){6}(?:').concat(a, '|:').concat(s, '|:)|') +
          '(?:'.concat(s, ':){5}(?::').concat(a, '|(:').concat(s, '){1,2}|:)|') +
          '(?:'.concat(s, ':){4}(?:(:').concat(s, '){0,1}:').concat(a, '|(:').concat(s, '){1,3}|:)|') +
          '(?:'.concat(s, ':){3}(?:(:').concat(s, '){0,2}:').concat(a, '|(:').concat(s, '){1,4}|:)|') +
          '(?:'.concat(s, ':){2}(?:(:').concat(s, '){0,3}:').concat(a, '|(:').concat(s, '){1,5}|:)|') +
          '(?:'.concat(s, ':){1}(?:(:').concat(s, '){0,4}:').concat(a, '|(:').concat(s, '){1,6}|:)|') +
          '(?::((?::'.concat(s, '){0,5}:').concat(a, '|(?::').concat(s, '){1,7}|:))') +
          ')(%[0-9a-zA-Z-.:]{1,})?$',
      );
    (t.exports = t.exports.default), (t.exports.default = t.exports.default);
  }),
  r(module.exports, 'createHeader', () => qt),
  r(module.exports, 'createReceivers', () => Kt),
  r(module.exports, 'createGeneralInfo', () => Gt),
  r(module.exports, 'createBusinessReferences', () => Qt),
  r(module.exports, 'createProductDescription', () => Zt),
  r(module.exports, 'createInspection', () => Jt),
  r(module.exports, 'createAnalysis', () => Yt),
  r(module.exports, 'createDeclarationOfConformity', () => Xt),
  r(module.exports, 'createContacts', () => te),
  r(module.exports, 'createAttachments', () => ee),
  r(module.exports, 'generateContent', () => re);
var u = {},
  l =
    (u && u.__createBinding) ||
    (Object.create
      ? function (t, e, r, n) {
          void 0 === n && (n = r),
            Object.defineProperty(t, n, {
              enumerable: !0,
              get: function () {
                return e[r];
              },
            });
        }
      : function (t, e, r, n) {
          void 0 === n && (n = r), (t[n] = e[r]);
        }),
  p =
    (u && u.__exportStar) ||
    function (t, e) {
      for (var r in t) 'default' === r || Object.prototype.hasOwnProperty.call(e, r) || l(e, t, r);
    };
Object.defineProperty(u, '__esModule', { value: !0 }), p(c('jP9NU'), u), p(c('dhNUM'), u), p(c('dxg0O'), u);
var f,
  d = {},
  y =
    (d && d.__decorate) ||
    function (t, e, r, n) {
      var o,
        a = arguments.length,
        i = a < 3 ? e : null === n ? (n = Object.getOwnPropertyDescriptor(e, r)) : n;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) i = Reflect.decorate(t, e, r, n);
      else
        for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
      return a > 3 && i && Object.defineProperty(e, r, i), i;
    },
  h =
    (d && d.__metadata) ||
    function (t, e) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata) return Reflect.metadata(t, e);
    };
Object.defineProperty(d, '__esModule', { value: !0 }),
  (d.CDNSchema =
    d.CDNSchemaCertificate =
    d.CoASchema =
    d.CoASchemaCertificate =
    d.ECoCSchema =
    d.EN10168Schema =
    d.EN10168SchemaCertificate =
    d.ExternalStandardsEnum =
    d.CertificateLanguages =
    d.CertificateDocumentMetadata =
    d.CertificateDocumentMetadataState =
    d.BaseCertificateSchema =
    d.schemaToExternalStandardsMap =
    d.SupportedSchemas =
    d.isNotEmptyArrayOrObject =
      void 0),
  (function (e) {
    !(function (r) {
      var o =
          'object' == typeof n
            ? n
            : 'object' == typeof self
            ? self
            : 'object' == typeof this
            ? this
            : Function('return this;')(),
        a = i(e);
      function i(t, e) {
        return function (r, n) {
          'function' != typeof t[r] && Object.defineProperty(t, r, { configurable: !0, writable: !0, value: n }),
            e && e(r, n);
        };
      }
      void 0 === o.Reflect ? (o.Reflect = e) : (a = i(o.Reflect, a)),
        (function (e) {
          var r = Object.prototype.hasOwnProperty,
            n = 'function' == typeof Symbol,
            o = n && void 0 !== Symbol.toPrimitive ? Symbol.toPrimitive : '@@toPrimitive',
            a = n && void 0 !== Symbol.iterator ? Symbol.iterator : '@@iterator',
            i = 'function' == typeof Object.create,
            s = { __proto__: [] } instanceof Array,
            c = !i && !s,
            u = {
              create: i
                ? function () {
                    return ot(Object.create(null));
                  }
                : s
                ? function () {
                    return ot({ __proto__: null });
                  }
                : function () {
                    return ot({});
                  },
              has: c
                ? function (t, e) {
                    return r.call(t, e);
                  }
                : function (t, e) {
                    return e in t;
                  },
              get: c
                ? function (t, e) {
                    return r.call(t, e) ? t[e] : void 0;
                  }
                : function (t, e) {
                    return t[e];
                  },
            },
            l = Object.getPrototypeOf(Function),
            p = 'object' == typeof t && t.env && !1,
            f = p || 'function' != typeof Map || 'function' != typeof Map.prototype.entries ? et() : Map,
            d = p || 'function' != typeof Set || 'function' != typeof Set.prototype.entries ? rt() : Set,
            y = new (p || 'function' != typeof WeakMap ? nt() : WeakMap)();
          function h(t, e, r, n) {
            if (V(r)) {
              if (!q(t)) throw new TypeError();
              if (!K(e)) throw new TypeError();
              return A(t, e);
            }
            if (!q(t)) throw new TypeError();
            if (!$(e)) throw new TypeError();
            if (!$(n) && !V(n) && !F(n)) throw new TypeError();
            return F(n) && (n = void 0), T(t, e, (r = H(r)), n);
          }
          function v(t, e) {
            function r(r, n) {
              if (!$(r)) throw new TypeError();
              if (!V(n) && !G(n)) throw new TypeError();
              P(t, e, r, n);
            }
            return r;
          }
          function m(t, e, r, n) {
            if (!$(r)) throw new TypeError();
            return V(n) || (n = H(n)), P(t, e, r, n);
          }
          function g(t, e, r) {
            if (!$(e)) throw new TypeError();
            return V(r) || (r = H(r)), M(t, e, r);
          }
          function b(t, e, r) {
            if (!$(e)) throw new TypeError();
            return V(r) || (r = H(r)), E(t, e, r);
          }
          function x(t, e, r) {
            if (!$(e)) throw new TypeError();
            return V(r) || (r = H(r)), N(t, e, r);
          }
          function _(t, e, r) {
            if (!$(e)) throw new TypeError();
            return V(r) || (r = H(r)), I(t, e, r);
          }
          function O(t, e) {
            if (!$(t)) throw new TypeError();
            return V(e) || (e = H(e)), L(t, e);
          }
          function S(t, e) {
            if (!$(t)) throw new TypeError();
            return V(e) || (e = H(e)), j(t, e);
          }
          function C(t, e, r) {
            if (!$(e)) throw new TypeError();
            V(r) || (r = H(r));
            var n = w(e, r, !1);
            if (V(n)) return !1;
            if (!n.delete(t)) return !1;
            if (n.size > 0) return !0;
            var o = y.get(e);
            return o.delete(r), o.size > 0 || y.delete(e), !0;
          }
          function A(t, e) {
            for (var r = t.length - 1; r >= 0; --r) {
              var n = (0, t[r])(e);
              if (!V(n) && !F(n)) {
                if (!K(n)) throw new TypeError();
                e = n;
              }
            }
            return e;
          }
          function T(t, e, r, n) {
            for (var o = t.length - 1; o >= 0; --o) {
              var a = (0, t[o])(e, r, n);
              if (!V(a) && !F(a)) {
                if (!$(a)) throw new TypeError();
                n = a;
              }
            }
            return n;
          }
          function w(t, e, r) {
            var n = y.get(t);
            if (V(n)) {
              if (!r) return;
              (n = new f()), y.set(t, n);
            }
            var o = n.get(e);
            if (V(o)) {
              if (!r) return;
              (o = new f()), n.set(e, o);
            }
            return o;
          }
          function M(t, e, r) {
            if (E(t, e, r)) return !0;
            var n = tt(e);
            return !F(n) && M(t, n, r);
          }
          function E(t, e, r) {
            var n = w(e, r, !1);
            return !V(n) && B(n.has(t));
          }
          function N(t, e, r) {
            if (E(t, e, r)) return I(t, e, r);
            var n = tt(e);
            return F(n) ? void 0 : N(t, n, r);
          }
          function I(t, e, r) {
            var n = w(e, r, !1);
            if (!V(n)) return n.get(t);
          }
          function P(t, e, r, n) {
            w(r, n, !0).set(t, e);
          }
          function L(t, e) {
            var r = j(t, e),
              n = tt(t);
            if (null === n) return r;
            var o = L(n, e);
            if (o.length <= 0) return r;
            if (r.length <= 0) return o;
            for (var a = new d(), i = [], s = 0, c = r; s < c.length; s++) {
              var u = c[s];
              a.has(u) || (a.add(u), i.push(u));
            }
            for (var l = 0, p = o; l < p.length; l++) {
              u = p[l];
              a.has(u) || (a.add(u), i.push(u));
            }
            return i;
          }
          function j(t, e) {
            var r = [],
              n = w(t, e, !1);
            if (V(n)) return r;
            for (var o = Z(n.keys()), a = 0; ; ) {
              var i = Y(o);
              if (!i) return (r.length = a), r;
              var s = J(i);
              try {
                r[a] = s;
              } catch (t) {
                try {
                  X(o);
                } finally {
                  throw t;
                }
              }
              a++;
            }
          }
          function D(t) {
            if (null === t) return 1;
            switch (typeof t) {
              case 'undefined':
                return 0;
              case 'boolean':
                return 2;
              case 'string':
                return 3;
              case 'symbol':
                return 4;
              case 'number':
                return 5;
              case 'object':
                return null === t ? 1 : 6;
              default:
                return 6;
            }
          }
          function V(t) {
            return void 0 === t;
          }
          function F(t) {
            return null === t;
          }
          function k(t) {
            return 'symbol' == typeof t;
          }
          function $(t) {
            return 'object' == typeof t ? null !== t : 'function' == typeof t;
          }
          function R(t, e) {
            switch (D(t)) {
              case 0:
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                return t;
            }
            var r = 3 === e ? 'string' : 5 === e ? 'number' : 'default',
              n = Q(t, o);
            if (void 0 !== n) {
              var a = n.call(t, r);
              if ($(a)) throw new TypeError();
              return a;
            }
            return U(t, 'default' === r ? 'number' : r);
          }
          function U(t, e) {
            if ('string' === e) {
              var r = t.toString;
              if (W(r)) if (!$((o = r.call(t)))) return o;
              if (W((n = t.valueOf))) if (!$((o = n.call(t)))) return o;
            } else {
              var n;
              if (W((n = t.valueOf))) if (!$((o = n.call(t)))) return o;
              var o,
                a = t.toString;
              if (W(a)) if (!$((o = a.call(t)))) return o;
            }
            throw new TypeError();
          }
          function B(t) {
            return !!t;
          }
          function z(t) {
            return '' + t;
          }
          function H(t) {
            var e = R(t, 3);
            return k(e) ? e : z(e);
          }
          function q(t) {
            return Array.isArray
              ? Array.isArray(t)
              : t instanceof Object
              ? t instanceof Array
              : '[object Array]' === Object.prototype.toString.call(t);
          }
          function W(t) {
            return 'function' == typeof t;
          }
          function K(t) {
            return 'function' == typeof t;
          }
          function G(t) {
            switch (D(t)) {
              case 3:
              case 4:
                return !0;
              default:
                return !1;
            }
          }
          function Q(t, e) {
            var r = t[e];
            if (null != r) {
              if (!W(r)) throw new TypeError();
              return r;
            }
          }
          function Z(t) {
            var e = Q(t, a);
            if (!W(e)) throw new TypeError();
            var r = e.call(t);
            if (!$(r)) throw new TypeError();
            return r;
          }
          function J(t) {
            return t.value;
          }
          function Y(t) {
            var e = t.next();
            return !e.done && e;
          }
          function X(t) {
            var e = t.return;
            e && e.call(t);
          }
          function tt(t) {
            var e = Object.getPrototypeOf(t);
            if ('function' != typeof t || t === l) return e;
            if (e !== l) return e;
            var r = t.prototype,
              n = r && Object.getPrototypeOf(r);
            if (null == n || n === Object.prototype) return e;
            var o = n.constructor;
            return 'function' != typeof o || o === t ? e : o;
          }
          function et() {
            var t = {},
              e = [],
              r = (function () {
                function t(t, e, r) {
                  (this._index = 0), (this._keys = t), (this._values = e), (this._selector = r);
                }
                return (
                  (t.prototype['@@iterator'] = function () {
                    return this;
                  }),
                  (t.prototype[a] = function () {
                    return this;
                  }),
                  (t.prototype.next = function () {
                    var t = this._index;
                    if (t >= 0 && t < this._keys.length) {
                      var r = this._selector(this._keys[t], this._values[t]);
                      return (
                        t + 1 >= this._keys.length
                          ? ((this._index = -1), (this._keys = e), (this._values = e))
                          : this._index++,
                        { value: r, done: !1 }
                      );
                    }
                    return { value: void 0, done: !0 };
                  }),
                  (t.prototype.throw = function (t) {
                    throw (this._index >= 0 && ((this._index = -1), (this._keys = e), (this._values = e)), t);
                  }),
                  (t.prototype.return = function (t) {
                    return (
                      this._index >= 0 && ((this._index = -1), (this._keys = e), (this._values = e)),
                      { value: t, done: !0 }
                    );
                  }),
                  t
                );
              })();
            function n(t, e) {
              return t;
            }
            function o(t, e) {
              return e;
            }
            function i(t, e) {
              return [t, e];
            }
            return (function () {
              function e() {
                (this._keys = []), (this._values = []), (this._cacheKey = t), (this._cacheIndex = -2);
              }
              return (
                Object.defineProperty(e.prototype, 'size', {
                  get: function () {
                    return this._keys.length;
                  },
                  enumerable: !0,
                  configurable: !0,
                }),
                (e.prototype.has = function (t) {
                  return this._find(t, !1) >= 0;
                }),
                (e.prototype.get = function (t) {
                  var e = this._find(t, !1);
                  return e >= 0 ? this._values[e] : void 0;
                }),
                (e.prototype.set = function (t, e) {
                  var r = this._find(t, !0);
                  return (this._values[r] = e), this;
                }),
                (e.prototype.delete = function (e) {
                  var r = this._find(e, !1);
                  if (r >= 0) {
                    for (var n = this._keys.length, o = r + 1; o < n; o++)
                      (this._keys[o - 1] = this._keys[o]), (this._values[o - 1] = this._values[o]);
                    return (
                      this._keys.length--,
                      this._values.length--,
                      e === this._cacheKey && ((this._cacheKey = t), (this._cacheIndex = -2)),
                      !0
                    );
                  }
                  return !1;
                }),
                (e.prototype.clear = function () {
                  (this._keys.length = 0), (this._values.length = 0), (this._cacheKey = t), (this._cacheIndex = -2);
                }),
                (e.prototype.keys = function () {
                  return new r(this._keys, this._values, n);
                }),
                (e.prototype.values = function () {
                  return new r(this._keys, this._values, o);
                }),
                (e.prototype.entries = function () {
                  return new r(this._keys, this._values, i);
                }),
                (e.prototype['@@iterator'] = function () {
                  return this.entries();
                }),
                (e.prototype[a] = function () {
                  return this.entries();
                }),
                (e.prototype._find = function (t, e) {
                  return (
                    this._cacheKey !== t && (this._cacheIndex = this._keys.indexOf((this._cacheKey = t))),
                    this._cacheIndex < 0 &&
                      e &&
                      ((this._cacheIndex = this._keys.length), this._keys.push(t), this._values.push(void 0)),
                    this._cacheIndex
                  );
                }),
                e
              );
            })();
          }
          function rt() {
            return (function () {
              function t() {
                this._map = new f();
              }
              return (
                Object.defineProperty(t.prototype, 'size', {
                  get: function () {
                    return this._map.size;
                  },
                  enumerable: !0,
                  configurable: !0,
                }),
                (t.prototype.has = function (t) {
                  return this._map.has(t);
                }),
                (t.prototype.add = function (t) {
                  return this._map.set(t, t), this;
                }),
                (t.prototype.delete = function (t) {
                  return this._map.delete(t);
                }),
                (t.prototype.clear = function () {
                  this._map.clear();
                }),
                (t.prototype.keys = function () {
                  return this._map.keys();
                }),
                (t.prototype.values = function () {
                  return this._map.values();
                }),
                (t.prototype.entries = function () {
                  return this._map.entries();
                }),
                (t.prototype['@@iterator'] = function () {
                  return this.keys();
                }),
                (t.prototype[a] = function () {
                  return this.keys();
                }),
                t
              );
            })();
          }
          function nt() {
            var t = 16,
              e = u.create(),
              n = o();
            function o() {
              var t;
              do {
                t = '@@WeakMap@@' + c();
              } while (u.has(e, t));
              return (e[t] = !0), t;
            }
            function a(t, e) {
              if (!r.call(t, n)) {
                if (!e) return;
                Object.defineProperty(t, n, { value: u.create() });
              }
              return t[n];
            }
            function i(t, e) {
              for (var r = 0; r < e; ++r) t[r] = (255 * Math.random()) | 0;
              return t;
            }
            function s(t) {
              return 'function' == typeof Uint8Array
                ? 'undefined' != typeof crypto
                  ? crypto.getRandomValues(new Uint8Array(t))
                  : 'undefined' != typeof msCrypto
                  ? msCrypto.getRandomValues(new Uint8Array(t))
                  : i(new Uint8Array(t), t)
                : i(new Array(t), t);
            }
            function c() {
              var e = s(t);
              (e[6] = (79 & e[6]) | 64), (e[8] = (191 & e[8]) | 128);
              for (var r = '', n = 0; n < t; ++n) {
                var o = e[n];
                (4 !== n && 6 !== n && 8 !== n) || (r += '-'),
                  o < 16 && (r += '0'),
                  (r += o.toString(16).toLowerCase());
              }
              return r;
            }
            return (function () {
              function t() {
                this._key = o();
              }
              return (
                (t.prototype.has = function (t) {
                  var e = a(t, !1);
                  return void 0 !== e && u.has(e, this._key);
                }),
                (t.prototype.get = function (t) {
                  var e = a(t, !1);
                  return void 0 !== e ? u.get(e, this._key) : void 0;
                }),
                (t.prototype.set = function (t, e) {
                  return (a(t, !0)[this._key] = e), this;
                }),
                (t.prototype.delete = function (t) {
                  var e = a(t, !1);
                  return void 0 !== e && delete e[this._key];
                }),
                (t.prototype.clear = function () {
                  this._key = o();
                }),
                t
              );
            })();
          }
          function ot(t) {
            return (t.__ = void 0), delete t.__, t;
          }
          e('decorate', h),
            e('metadata', v),
            e('defineMetadata', m),
            e('hasMetadata', g),
            e('hasOwnMetadata', b),
            e('getMetadata', x),
            e('getOwnMetadata', _),
            e('getMetadataKeys', O),
            e('getOwnMetadataKeys', S),
            e('deleteMetadata', C);
        })(a);
    })();
  })(f || (f = {}));
var v = {};
r(v, 'getMetadataStorage', () => _), r(v, 'getFromContainer', () => L), r(v, 'registerDecorator', () => U);
var m = function (t) {
    (this.groups = []),
      (this.each = !1),
      (this.context = void 0),
      (this.type = t.type),
      (this.target = t.target),
      (this.propertyName = t.propertyName),
      (this.constraints = t.constraints),
      (this.constraintCls = t.constraintCls),
      (this.validationTypeOptions = t.validationTypeOptions),
      t.validationOptions &&
        ((this.message = t.validationOptions.message),
        (this.groups = t.validationOptions.groups),
        (this.always = t.validationOptions.always),
        (this.each = t.validationOptions.each),
        (this.context = t.validationOptions.context));
  },
  g = (function () {
    function t() {}
    return (
      (t.prototype.transform = function (t) {
        var e = [];
        return (
          Object.keys(t.properties).forEach(function (r) {
            t.properties[r].forEach(function (n) {
              var o = { message: n.message, groups: n.groups, always: n.always, each: n.each },
                a = {
                  type: n.type,
                  target: t.name,
                  propertyName: r,
                  constraints: n.constraints,
                  validationTypeOptions: n.options,
                  validationOptions: o,
                };
              e.push(new m(a));
            });
          }),
          e
        );
      }),
      t
    );
  })();
function b(t) {
  return null !== t && 'object' == typeof t && 'function' == typeof t.then;
}
var x = (function () {
  function t() {
    (this.validationMetadatas = []), (this.constraintMetadatas = []);
  }
  return (
    Object.defineProperty(t.prototype, 'hasValidationMetaData', {
      get: function () {
        return !!this.validationMetadatas.length;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (t.prototype.addValidationSchema = function (t) {
      var e = this;
      new g().transform(t).forEach(function (t) {
        return e.addValidationMetadata(t);
      });
    }),
    (t.prototype.addValidationMetadata = function (t) {
      this.validationMetadatas.push(t);
    }),
    (t.prototype.addConstraintMetadata = function (t) {
      this.constraintMetadatas.push(t);
    }),
    (t.prototype.groupByPropertyName = function (t) {
      var e = {};
      return (
        t.forEach(function (t) {
          e[t.propertyName] || (e[t.propertyName] = []), e[t.propertyName].push(t);
        }),
        e
      );
    }),
    (t.prototype.getTargetValidationMetadatas = function (t, e, r, n, o) {
      var a = function (t) {
          return void 0 !== t.always ? t.always : (!t.groups || !t.groups.length) && r;
        },
        i = function (t) {
          return !(!n || (o && o.length) || !t.groups || !t.groups.length);
        },
        s = this.validationMetadatas.filter(function (r) {
          return (
            (r.target === t || r.target === e) &&
            (!!a(r) ||
              (!i(r) &&
                (!(o && o.length > 0) ||
                  (r.groups &&
                    !!r.groups.find(function (t) {
                      return -1 !== o.indexOf(t);
                    })))))
          );
        }),
        c = this.validationMetadatas
          .filter(function (e) {
            return (
              'string' != typeof e.target &&
              e.target !== t &&
              (!(e.target instanceof Function) || t.prototype instanceof e.target) &&
              (!!a(e) ||
                (!i(e) &&
                  (!(o && o.length > 0) ||
                    (e.groups &&
                      !!e.groups.find(function (t) {
                        return -1 !== o.indexOf(t);
                      })))))
            );
          })
          .filter(function (t) {
            return !s.find(function (e) {
              return e.propertyName === t.propertyName && e.type === t.type;
            });
          });
      return s.concat(c);
    }),
    (t.prototype.getTargetValidatorConstraints = function (t) {
      return this.constraintMetadatas.filter(function (e) {
        return e.target === t;
      });
    }),
    t
  );
})();
function _() {
  var t =
    'undefined' != typeof globalThis
      ? globalThis
      : void 0 !== n
      ? n
      : 'undefined' != typeof window
      ? window
      : 'undefined' != typeof self
      ? self
      : void 0;
  return (
    t.classValidatorMetadataStorage || (t.classValidatorMetadataStorage = new x()), t.classValidatorMetadataStorage
  );
}
var O = {};
r(
  O,
  'Validator',
  () => I,
  (t) => (I = t),
);
var S = (function () {
    function t() {}
    return (
      (t.prototype.toString = function (t, e, r) {
        var n = this;
        void 0 === t && (t = !1), void 0 === e && (e = !1), void 0 === r && (r = '');
        var o = t ? '[1m' : '',
          a = t ? '[22m' : '',
          i = function (t) {
            return ' - property '
              .concat(o)
              .concat(r)
              .concat(t)
              .concat(a, ' has failed the following constraints: ')
              .concat(o)
              .concat(Object.keys(n.constraints).join(', '))
              .concat(a, ' \n');
          };
        if (e) {
          var s = Number.isInteger(+this.property)
            ? '['.concat(this.property, ']')
            : ''.concat(r ? '.' : '').concat(this.property);
          return this.constraints
            ? i(s)
            : this.children
            ? this.children
                .map(function (e) {
                  return e.toString(t, !0, ''.concat(r).concat(s));
                })
                .join('')
            : '';
        }
        return (
          'An instance of '
            .concat(o)
            .concat(this.target ? this.target.constructor.name : 'an object')
            .concat(a, ' has failed the validation:\n') +
          (this.constraints ? i(this.property) : '') +
          (this.children
            ? this.children
                .map(function (e) {
                  return e.toString(t, !0, n.property);
                })
                .join('')
            : '')
        );
      }),
      t
    );
  })(),
  C = (function () {
    function t() {}
    return (
      (t.isValid = function (t) {
        var e = this;
        return (
          'isValid' !== t &&
          'getMessage' !== t &&
          -1 !==
            Object.keys(this)
              .map(function (t) {
                return e[t];
              })
              .indexOf(t)
        );
      }),
      (t.CUSTOM_VALIDATION = 'customValidation'),
      (t.NESTED_VALIDATION = 'nestedValidation'),
      (t.PROMISE_VALIDATION = 'promiseValidation'),
      (t.CONDITIONAL_VALIDATION = 'conditionalValidation'),
      (t.WHITELIST = 'whitelistValidation'),
      (t.IS_DEFINED = 'isDefined'),
      t
    );
  })();
var A,
  T,
  w = (function () {
    function t() {}
    return (
      (t.replaceMessageSpecialTokens = function (t, e) {
        var r;
        return (
          t instanceof Function ? (r = t(e)) : 'string' == typeof t && (r = t),
          r &&
            Array.isArray(e.constraints) &&
            e.constraints.forEach(function (t, e) {
              r = r.replace(
                new RegExp('\\$constraint'.concat(e + 1), 'g'),
                (function (t) {
                  return Array.isArray(t) ? t.join(', ') : ''.concat(t);
                })(t),
              );
            }),
          r &&
            void 0 !== e.value &&
            null !== e.value &&
            'string' == typeof e.value &&
            (r = r.replace(/\$value/g, e.value)),
          r && (r = r.replace(/\$property/g, e.property)),
          r && (r = r.replace(/\$target/g, e.targetName)),
          r
        );
      }),
      t
    );
  })(),
  M = (function () {
    function t(t, e) {
      (this.validator = t),
        (this.validatorOptions = e),
        (this.awaitingPromises = []),
        (this.ignoreAsyncValidations = !1),
        (this.metadataStorage = _());
    }
    return (
      (t.prototype.execute = function (t, e, r) {
        var n,
          o = this;
        this.metadataStorage.hasValidationMetaData ||
          !0 !== (null === (n = this.validatorOptions) || void 0 === n ? void 0 : n.enableDebugMessages) ||
          console.warn(
            'No metadata found. There is more than once class-validator version installed probably. You need to flatten your dependencies.',
          );
        var a = this.validatorOptions ? this.validatorOptions.groups : void 0,
          i = (this.validatorOptions && this.validatorOptions.strictGroups) || !1,
          s = (this.validatorOptions && this.validatorOptions.always) || !1,
          c = this.metadataStorage.getTargetValidationMetadatas(t.constructor, e, s, i, a),
          u = this.metadataStorage.groupByPropertyName(c);
        if (this.validatorOptions && this.validatorOptions.forbidUnknownValues && !c.length) {
          var l = new S();
          return (
            (this.validatorOptions &&
              this.validatorOptions.validationError &&
              void 0 !== this.validatorOptions.validationError.target &&
              !0 !== this.validatorOptions.validationError.target) ||
              (l.target = t),
            (l.value = void 0),
            (l.property = void 0),
            (l.children = []),
            (l.constraints = { unknownValue: 'an unknown value was passed to the validate function' }),
            void r.push(l)
          );
        }
        this.validatorOptions && this.validatorOptions.whitelist && this.whitelist(t, u, r),
          Object.keys(u).forEach(function (e) {
            var n = t[e],
              a = u[e].filter(function (t) {
                return t.type === C.IS_DEFINED;
              }),
              i = u[e].filter(function (t) {
                return t.type !== C.IS_DEFINED && t.type !== C.WHITELIST;
              });
            n instanceof Promise &&
            i.find(function (t) {
              return t.type === C.PROMISE_VALIDATION;
            })
              ? o.awaitingPromises.push(
                  n.then(function (n) {
                    o.performValidations(t, n, e, a, i, r);
                  }),
                )
              : o.performValidations(t, n, e, a, i, r);
          });
      }),
      (t.prototype.whitelist = function (t, e, r) {
        var n = this,
          o = [];
        Object.keys(t).forEach(function (t) {
          (e[t] && 0 !== e[t].length) || o.push(t);
        }),
          o.length > 0 &&
            (this.validatorOptions && this.validatorOptions.forbidNonWhitelisted
              ? o.forEach(function (e) {
                  var o,
                    a = n.generateValidationError(t, t[e], e);
                  (a.constraints = (((o = {})[C.WHITELIST] = 'property '.concat(e, ' should not exist')), o)),
                    (a.children = void 0),
                    r.push(a);
                })
              : o.forEach(function (e) {
                  return delete t[e];
                }));
      }),
      (t.prototype.stripEmptyErrors = function (t) {
        var e = this;
        return t.filter(function (t) {
          if ((t.children && (t.children = e.stripEmptyErrors(t.children)), 0 === Object.keys(t.constraints).length)) {
            if (0 === t.children.length) return !1;
            delete t.constraints;
          }
          return !0;
        });
      }),
      (t.prototype.performValidations = function (t, e, r, n, o, a) {
        var i = o.filter(function (t) {
            return t.type === C.CUSTOM_VALIDATION;
          }),
          s = o.filter(function (t) {
            return t.type === C.NESTED_VALIDATION;
          }),
          c = o.filter(function (t) {
            return t.type === C.CONDITIONAL_VALIDATION;
          }),
          u = this.generateValidationError(t, e, r);
        a.push(u),
          this.conditionalValidations(t, e, c) &&
            (this.customValidations(t, e, n, u),
            this.mapContexts(t, e, n, u),
            (void 0 === e && this.validatorOptions && !0 === this.validatorOptions.skipUndefinedProperties) ||
              (null === e && this.validatorOptions && !0 === this.validatorOptions.skipNullProperties) ||
              (null == e && this.validatorOptions && !0 === this.validatorOptions.skipMissingProperties) ||
              (this.customValidations(t, e, i, u),
              this.nestedValidations(e, s, u.children),
              this.mapContexts(t, e, o, u),
              this.mapContexts(t, e, i, u)));
      }),
      (t.prototype.generateValidationError = function (t, e, r) {
        var n = new S();
        return (
          (this.validatorOptions &&
            this.validatorOptions.validationError &&
            void 0 !== this.validatorOptions.validationError.target &&
            !0 !== this.validatorOptions.validationError.target) ||
            (n.target = t),
          (this.validatorOptions &&
            this.validatorOptions.validationError &&
            void 0 !== this.validatorOptions.validationError.value &&
            !0 !== this.validatorOptions.validationError.value) ||
            (n.value = e),
          (n.property = r),
          (n.children = []),
          (n.constraints = {}),
          n
        );
      }),
      (t.prototype.conditionalValidations = function (t, e, r) {
        return r
          .map(function (r) {
            return r.constraints[0](t, e);
          })
          .reduce(function (t, e) {
            return t && e;
          }, !0);
      }),
      (t.prototype.customValidations = function (t, e, r, n) {
        var o = this;
        r.forEach(function (r) {
          o.metadataStorage.getTargetValidatorConstraints(r.constraintCls).forEach(function (a) {
            if (
              !(
                (a.async && o.ignoreAsyncValidations) ||
                (o.validatorOptions &&
                  o.validatorOptions.stopAtFirstError &&
                  Object.keys(n.constraints || {}).length > 0)
              )
            ) {
              var i = {
                targetName: t.constructor ? t.constructor.name : void 0,
                property: r.propertyName,
                object: t,
                value: e,
                constraints: r.constraints,
              };
              if (r.each && (Array.isArray(e) || e instanceof Set || e instanceof Map)) {
                var s,
                  c = ((s = e) instanceof Map ? Array.from(s.values()) : Array.isArray(s) ? s : Array.from(s)).map(
                    function (t) {
                      return a.instance.validate(t, i);
                    },
                  );
                if (
                  c.some(function (t) {
                    return b(t);
                  })
                ) {
                  var u = c.map(function (t) {
                      return b(t) ? t : Promise.resolve(t);
                    }),
                    l = Promise.all(u).then(function (i) {
                      if (
                        !i.every(function (t) {
                          return t;
                        })
                      ) {
                        var s = o.createValidationError(t, e, r, a),
                          c = s[0],
                          u = s[1];
                        (n.constraints[c] = u),
                          r.context &&
                            (n.contexts || (n.contexts = {}),
                            (n.contexts[c] = Object.assign(n.contexts[c] || {}, r.context)));
                      }
                    });
                  o.awaitingPromises.push(l);
                } else {
                  if (
                    !c.every(function (t) {
                      return t;
                    })
                  ) {
                    var p = o.createValidationError(t, e, r, a);
                    (h = p[0]), (v = p[1]);
                    n.constraints[h] = v;
                  }
                }
              } else {
                var f = a.instance.validate(e, i);
                if (b(f)) {
                  var d = f.then(function (i) {
                    if (!i) {
                      var s = o.createValidationError(t, e, r, a),
                        c = s[0],
                        u = s[1];
                      (n.constraints[c] = u),
                        r.context &&
                          (n.contexts || (n.contexts = {}),
                          (n.contexts[c] = Object.assign(n.contexts[c] || {}, r.context)));
                    }
                  });
                  o.awaitingPromises.push(d);
                } else if (!f) {
                  var y = o.createValidationError(t, e, r, a),
                    h = y[0],
                    v = y[1];
                  n.constraints[h] = v;
                }
              }
            }
          });
        });
      }),
      (t.prototype.nestedValidations = function (t, e, r) {
        var n = this;
        void 0 !== t &&
          e.forEach(function (o) {
            var a;
            if (o.type === C.NESTED_VALIDATION || o.type === C.PROMISE_VALIDATION)
              if (Array.isArray(t) || t instanceof Set || t instanceof Map)
                (t instanceof Set ? Array.from(t) : t).forEach(function (o, a) {
                  n.performValidations(t, o, a.toString(), [], e, r);
                });
              else if (t instanceof Object) {
                var i = 'string' == typeof o.target ? o.target : o.target.name;
                n.execute(t, i, r);
              } else {
                var s = new S();
                (s.value = t), (s.property = o.propertyName), (s.target = o.target);
                var c = n.createValidationError(o.target, t, o),
                  u = c[0],
                  l = c[1];
                (s.constraints = (((a = {})[u] = l), a)), r.push(s);
              }
          });
      }),
      (t.prototype.mapContexts = function (t, e, r, n) {
        var o = this;
        return r.forEach(function (t) {
          if (t.context) {
            var e = void 0;
            if (t.type === C.CUSTOM_VALIDATION) e = o.metadataStorage.getTargetValidatorConstraints(t.constraintCls)[0];
            var r = o.getConstraintType(t, e);
            n.constraints[r] &&
              (n.contexts || (n.contexts = {}), (n.contexts[r] = Object.assign(n.contexts[r] || {}, t.context)));
          }
        });
      }),
      (t.prototype.createValidationError = function (t, e, r, n) {
        var o = t.constructor ? t.constructor.name : void 0,
          a = this.getConstraintType(r, n),
          i = { targetName: o, property: r.propertyName, object: t, value: e, constraints: r.constraints },
          s = r.message || '';
        return (
          r.message ||
            (this.validatorOptions && (!this.validatorOptions || this.validatorOptions.dismissDefaultMessages)) ||
            (n && n.instance.defaultMessage instanceof Function && (s = n.instance.defaultMessage(i))),
          [a, w.replaceMessageSpecialTokens(s, i)]
        );
      }),
      (t.prototype.getConstraintType = function (t, e) {
        return e && e.name ? e.name : t.type;
      }),
      t
    );
  })(),
  E = function (t, e, r, n) {
    return new (r || (r = Promise))(function (o, a) {
      function i(t) {
        try {
          c(n.next(t));
        } catch (t) {
          a(t);
        }
      }
      function s(t) {
        try {
          c(n.throw(t));
        } catch (t) {
          a(t);
        }
      }
      function c(t) {
        var e;
        t.done
          ? o(t.value)
          : ((e = t.value),
            e instanceof r
              ? e
              : new r(function (t) {
                  t(e);
                })).then(i, s);
      }
      c((n = n.apply(t, e || [])).next());
    });
  },
  N = function (t, e) {
    var r,
      n,
      o,
      a,
      i = {
        label: 0,
        sent: function () {
          if (1 & o[0]) throw o[1];
          return o[1];
        },
        trys: [],
        ops: [],
      };
    function s(a) {
      return function (s) {
        return (function (a) {
          if (r) throw new TypeError('Generator is already executing.');
          for (; i; )
            try {
              if (
                ((r = 1),
                n &&
                  (o = 2 & a[0] ? n.return : a[0] ? n.throw || ((o = n.return) && o.call(n), 0) : n.next) &&
                  !(o = o.call(n, a[1])).done)
              )
                return o;
              switch (((n = 0), o && (a = [2 & a[0], o.value]), a[0])) {
                case 0:
                case 1:
                  o = a;
                  break;
                case 4:
                  return i.label++, { value: a[1], done: !1 };
                case 5:
                  i.label++, (n = a[1]), (a = [0]);
                  continue;
                case 7:
                  (a = i.ops.pop()), i.trys.pop();
                  continue;
                default:
                  if (!((o = i.trys), (o = o.length > 0 && o[o.length - 1]) || (6 !== a[0] && 2 !== a[0]))) {
                    i = 0;
                    continue;
                  }
                  if (3 === a[0] && (!o || (a[1] > o[0] && a[1] < o[3]))) {
                    i.label = a[1];
                    break;
                  }
                  if (6 === a[0] && i.label < o[1]) {
                    (i.label = o[1]), (o = a);
                    break;
                  }
                  if (o && i.label < o[2]) {
                    (i.label = o[2]), i.ops.push(a);
                    break;
                  }
                  o[2] && i.ops.pop(), i.trys.pop();
                  continue;
              }
              a = e.call(t, i);
            } catch (t) {
              (a = [6, t]), (n = 0);
            } finally {
              r = o = 0;
            }
          if (5 & a[0]) throw a[1];
          return { value: a[0] ? a[1] : void 0, done: !0 };
        })([a, s]);
      };
    }
    return (
      (a = { next: s(0), throw: s(1), return: s(2) }),
      'function' == typeof Symbol &&
        (a[Symbol.iterator] = function () {
          return this;
        }),
      a
    );
  },
  I = (function () {
    function t() {}
    return (
      (t.prototype.validate = function (t, e, r) {
        return this.coreValidate(t, e, r);
      }),
      (t.prototype.validateOrReject = function (t, e, r) {
        return E(this, void 0, void 0, function () {
          var n;
          return N(this, function (o) {
            switch (o.label) {
              case 0:
                return [4, this.coreValidate(t, e, r)];
              case 1:
                return (n = o.sent()).length ? [2, Promise.reject(n)] : [2];
            }
          });
        });
      }),
      (t.prototype.validateSync = function (t, e, r) {
        var n = 'string' == typeof t ? e : t,
          o = 'string' == typeof t ? t : void 0,
          a = new M(this, 'string' == typeof t ? r : e);
        a.ignoreAsyncValidations = !0;
        var i = [];
        return a.execute(n, o, i), a.stripEmptyErrors(i);
      }),
      (t.prototype.coreValidate = function (t, e, r) {
        var n = 'string' == typeof t ? e : t,
          o = 'string' == typeof t ? t : void 0,
          a = new M(this, 'string' == typeof t ? r : e),
          i = [];
        return (
          a.execute(n, o, i),
          Promise.all(a.awaitingPromises).then(function () {
            return a.stripEmptyErrors(i);
          })
        );
      }),
      t
    );
  })(),
  P = new ((function () {
    function t() {
      this.instances = [];
    }
    return (
      (t.prototype.get = function (t) {
        var e = this.instances.find(function (e) {
          return e.type === t;
        });
        return e || ((e = { type: t, object: new t() }), this.instances.push(e)), e.object;
      }),
      t
    );
  })())();
function L(t) {
  if (A)
    try {
      var e = A.get(t);
      if (e) return e;
      if (!T || !T.fallback) return e;
    } catch (t) {
      if (!T || !T.fallbackOnErrors) throw t;
    }
  return P.get(t);
}
var j = {};
function D(t) {
  return function (e, r) {
    var n = {
      type: C.CONDITIONAL_VALIDATION,
      target: e.constructor,
      propertyName: r,
      constraints: [
        function (t, e) {
          return null !== t[r] && void 0 !== t[r];
        },
      ],
      validationOptions: t,
    };
    _().addValidationMetadata(new m(n));
  };
}
function V(t, e) {
  return function (r, n) {
    var o = {
      type: C.CONDITIONAL_VALIDATION,
      target: r.constructor,
      propertyName: n,
      constraints: [t],
      validationOptions: e,
    };
    _().addValidationMetadata(new m(o));
  };
}
r(j, 'IsOptional', () => D),
  r(j, 'ValidateIf', () => V),
  r(j, 'IsUrl', () => tt),
  r(j, 'IsUUID', () => at),
  r(j, 'IsDateString', () => ft),
  r(j, 'IsNumber', () => dt),
  r(j, 'IsEnum', () => yt),
  r(j, 'IsString', () => ht),
  r(j, 'IsArray', () => vt),
  r(j, 'IsNotEmptyObject', () => gt);
var F = {};
r(
  F,
  'ValidateNested',
  () => $,
  (t) => ($ = t),
);
var k = function () {
  return (
    (k =
      Object.assign ||
      function (t) {
        for (var e, r = 1, n = arguments.length; r < n; r++)
          for (var o in (e = arguments[r])) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
        return t;
      }),
    k.apply(this, arguments)
  );
};
function $(t) {
  var e = k({}, t),
    r = e.each ? 'each value in ' : '';
  return (
    (e.message = e.message || r + 'nested property $property must be either object or array'),
    function (t, r) {
      var n = { type: C.NESTED_VALIDATION, target: t.constructor, propertyName: r, validationOptions: e };
      _().addValidationMetadata(new m(n));
    }
  );
}
var R = (function () {
  function t(t, e, r) {
    void 0 === r && (r = !1), (this.target = t), (this.name = e), (this.async = r);
  }
  return (
    Object.defineProperty(t.prototype, 'instance', {
      get: function () {
        return L(this.target);
      },
      enumerable: !1,
      configurable: !0,
    }),
    t
  );
})();
function U(t) {
  var e;
  if (t.validator instanceof Function) {
    if (((e = t.validator), L(x).getTargetValidatorConstraints(t.validator).length > 1))
      throw 'More than one implementation of ValidatorConstraintInterface found for validator on: '
        .concat(t.target.name, ':')
        .concat(t.propertyName);
  } else {
    var r = t.validator;
    (e = (function () {
      function t() {}
      return (
        (t.prototype.validate = function (t, e) {
          return r.validate(t, e);
        }),
        (t.prototype.defaultMessage = function (t) {
          return r.defaultMessage ? r.defaultMessage(t) : '';
        }),
        t
      );
    })()),
      _().addConstraintMetadata(new R(e, t.name, t.async));
  }
  var n = {
    type: t.name && C.isValid(t.name) ? t.name : C.CUSTOM_VALIDATION,
    target: t.target,
    propertyName: t.propertyName,
    validationOptions: t.options,
    constraintCls: e,
    constraints: t.constraints,
  };
  _().addValidationMetadata(new m(n));
}
function B(t, e) {
  return function (r) {
    var n = e && e.each ? 'each value in ' : '';
    return t(n, r);
  };
}
function z(t, e) {
  return function (r, n) {
    U({
      name: t.name,
      target: r.constructor,
      propertyName: n,
      options: e,
      constraints: t.constraints,
      validator: t.validator,
    });
  };
}
var H = {};
Object.defineProperty(H, '__esModule', { value: !0 }),
  (H.default = function (t, e) {
    if (((0, q.default)(t), !t || /[\s<>]/.test(t))) return !1;
    if (0 === t.indexOf('mailto:')) return !1;
    if ((e = (0, G.default)(e, J)).validate_length && t.length >= 2083) return !1;
    if (!e.allow_fragments && t.includes('#')) return !1;
    if (!e.allow_query_components && (t.includes('?') || t.includes('&'))) return !1;
    var r, n, o, a, i, s, c, u;
    if (((c = t.split('#')), (t = c.shift()), (c = t.split('?')), (t = c.shift()), (c = t.split('://')).length > 1)) {
      if (((r = c.shift().toLowerCase()), e.require_valid_protocol && -1 === e.protocols.indexOf(r))) return !1;
    } else {
      if (e.require_protocol) return !1;
      if ('//' === t.substr(0, 2)) {
        if (!e.allow_protocol_relative_urls) return !1;
        c[0] = t.substr(2);
      }
    }
    if ('' === (t = c.join('://'))) return !1;
    if (((c = t.split('/')), '' === (t = c.shift()) && !e.require_host)) return !0;
    if ((c = t.split('@')).length > 1) {
      if (e.disallow_auth) return !1;
      if ('' === c[0]) return !1;
      if ((n = c.shift()).indexOf(':') >= 0 && n.split(':').length > 2) return !1;
      var l = n.split(':'),
        p =
          ((h = 2),
          (function (t) {
            if (Array.isArray(t)) return t;
          })((y = l)) ||
            (function (t, e) {
              if ('undefined' != typeof Symbol && Symbol.iterator in Object(t)) {
                var r = [],
                  n = !0,
                  o = !1,
                  a = void 0;
                try {
                  for (
                    var i, s = t[Symbol.iterator]();
                    !(n = (i = s.next()).done) && (r.push(i.value), !e || r.length !== e);
                    n = !0
                  );
                } catch (t) {
                  (o = !0), (a = t);
                } finally {
                  try {
                    n || null == s.return || s.return();
                  } finally {
                    if (o) throw a;
                  }
                }
                return r;
              }
            })(y, h) ||
            (function (t, e) {
              if (t) {
                if ('string' == typeof t) return Z(t, e);
                var r = Object.prototype.toString.call(t).slice(8, -1);
                return (
                  'Object' === r && t.constructor && (r = t.constructor.name),
                  'Map' === r || 'Set' === r
                    ? Array.from(t)
                    : 'Arguments' === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                    ? Z(t, e)
                    : void 0
                );
              }
            })(y, h) ||
            (function () {
              throw new TypeError(
                'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
              );
            })()),
        f = p[0],
        d = p[1];
      if ('' === f && '' === d) return !1;
    }
    var y, h;
    (a = c.join('@')), (s = null), (u = null);
    var v = a.match(Y);
    v
      ? ((o = ''), (u = v[1]), (s = v[2] || null))
      : ((c = a.split(':')), (o = c.shift()), c.length && (s = c.join(':')));
    if (null !== s && s.length > 0) {
      if (((i = parseInt(s, 10)), !/^[0-9]+$/.test(s) || i <= 0 || i > 65535)) return !1;
    } else if (e.require_port) return !1;
    return e.host_whitelist
      ? X(o, e.host_whitelist)
      : !!((0, K.default)(o) || (0, W.default)(o, e) || (u && (0, K.default)(u, 6))) &&
          ((o = o || u), !e.host_blacklist || !X(o, e.host_blacklist));
  });
var q = Q(c('iPBDe')),
  W = Q(c('kdFId')),
  K = Q(c('exkk0')),
  G = Q(c('bhfRL'));
function Q(t) {
  return t && t.__esModule ? t : { default: t };
}
function Z(t, e) {
  (null == e || e > t.length) && (e = t.length);
  for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
  return n;
}
var J = {
    protocols: ['http', 'https', 'ftp'],
    require_tld: !0,
    require_protocol: !1,
    require_host: !0,
    require_port: !1,
    require_valid_protocol: !0,
    allow_underscores: !1,
    allow_trailing_dot: !1,
    allow_protocol_relative_urls: !1,
    allow_fragments: !0,
    allow_query_components: !0,
    validate_length: !0,
  },
  Y = /^\[([^\]]+)\](?::([0-9]+))?$/;
function X(t, e) {
  for (var r = 0; r < e.length; r++) {
    var n = e[r];
    if (t === n || ((o = n), '[object RegExp]' === Object.prototype.toString.call(o) && n.test(t))) return !0;
  }
  var o;
  return !1;
}
(H = H.default).default = H.default;
function tt(t, e) {
  return z(
    {
      name: 'isUrl',
      constraints: [t],
      validator: {
        validate: function (t, e) {
          return (function (t, e) {
            return 'string' == typeof t && a(H)(t, e);
          })(t, e.constraints[0]);
        },
        defaultMessage: B(function (t) {
          return t + '$property must be an URL address';
        }, e),
      },
    },
    e,
  );
}
var et = {};
Object.defineProperty(et, '__esModule', { value: !0 }),
  (et.default = function (t, e) {
    (0, nt.default)(t);
    var r = ot[[void 0, null].includes(e) ? 'all' : e];
    return !!r && r.test(t);
  });
var rt,
  nt = (rt = c('iPBDe')) && rt.__esModule ? rt : { default: rt };
var ot = {
  1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
};
(et = et.default).default = et.default;
function at(t, e) {
  return z(
    {
      name: 'isUuid',
      constraints: [t],
      validator: {
        validate: function (t, e) {
          return (function (t, e) {
            return 'string' == typeof t && a(et)(t, e);
          })(t, e.constraints[0]);
        },
        defaultMessage: B(function (t) {
          return t + '$property must be a UUID';
        }, e),
      },
    },
    e,
  );
}
var it = {};
Object.defineProperty(it, '__esModule', { value: !0 }),
  (it.default = function (t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    (0, st.default)(t);
    var r = e.strictSeparator ? ut.test(t) : ct.test(t);
    return r && e.strict ? lt(t) : r;
  });
var st = (function (t) {
  return t && t.__esModule ? t : { default: t };
})(c('iPBDe'));
var ct =
    /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,
  ut =
    /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,
  lt = function (t) {
    var e = t.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);
    if (e) {
      var r = Number(e[1]),
        n = Number(e[2]);
      return (r % 4 == 0 && r % 100 != 0) || r % 400 == 0 ? n <= 366 : n <= 365;
    }
    var o = t.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number),
      a = o[1],
      i = o[2],
      s = o[3],
      c = i ? '0'.concat(i).slice(-2) : i,
      u = s ? '0'.concat(s).slice(-2) : s,
      l = new Date(
        ''
          .concat(a, '-')
          .concat(c || '01', '-')
          .concat(u || '01'),
      );
    return !i || !s || (l.getUTCFullYear() === a && l.getUTCMonth() + 1 === i && l.getUTCDate() === s);
  };
(it = it.default).default = it.default;
function pt(t, e) {
  return 'string' == typeof t && a(it)(t, e);
}
function ft(t, e) {
  return z(
    {
      name: 'isDateString',
      constraints: [t],
      validator: {
        validate: function (t, e) {
          return (function (t, e) {
            return pt(t, e);
          })(t);
        },
        defaultMessage: B(function (t) {
          return t + '$property must be a valid ISO 8601 date string';
        }, e),
      },
    },
    e,
  );
}
function dt(t, e) {
  return (
    void 0 === t && (t = {}),
    z(
      {
        name: 'isNumber',
        constraints: [t],
        validator: {
          validate: function (t, e) {
            return (function (t, e) {
              if ((void 0 === e && (e = {}), 'number' != typeof t)) return !1;
              if (t === 1 / 0 || t === -1 / 0) return e.allowInfinity;
              if (Number.isNaN(t)) return e.allowNaN;
              if (void 0 !== e.maxDecimalPlaces) {
                var r = 0;
                if ((t % 1 != 0 && (r = t.toString().split('.')[1].length), r > e.maxDecimalPlaces)) return !1;
              }
              return Number.isFinite(t);
            })(t, e.constraints[0]);
          },
          defaultMessage: B(function (t) {
            return t + '$property must be a number conforming to the specified constraints';
          }, e),
        },
      },
      e,
    )
  );
}
function yt(t, e) {
  return z(
    {
      name: 'isEnum',
      constraints: [t],
      validator: {
        validate: function (t, e) {
          return (function (t, e) {
            return (
              Object.keys(e)
                .map(function (t) {
                  return e[t];
                })
                .indexOf(t) >= 0
            );
          })(t, e.constraints[0]);
        },
        defaultMessage: B(function (t) {
          return t + '$property must be a valid enum value';
        }, e),
      },
    },
    e,
  );
}
function ht(t) {
  return z(
    {
      name: 'isString',
      validator: {
        validate: function (t, e) {
          return (function (t) {
            return t instanceof String || 'string' == typeof t;
          })(t);
        },
        defaultMessage: B(function (t) {
          return t + '$property must be a string';
        }, t),
      },
    },
    t,
  );
}
function vt(t) {
  return z(
    {
      name: 'isArray',
      validator: {
        validate: function (t, e) {
          return (function (t) {
            return Array.isArray(t);
          })(t);
        },
        defaultMessage: B(function (t) {
          return t + '$property must be an array';
        }, t),
      },
    },
    t,
  );
}
function mt(t) {
  return null != t && ('object' == typeof t || 'function' == typeof t) && !Array.isArray(t);
}
function gt(t, e) {
  return z(
    {
      name: 'isNotEmptyObject',
      constraints: [t],
      validator: {
        validate: function (t, e) {
          return (function (t, e) {
            if (!mt(t)) return !1;
            if (!0 === (null == e ? void 0 : e.nullable))
              return !Object.values(t).every(function (t) {
                return null == t;
              });
            for (var r in t) if (t.hasOwnProperty(r)) return !0;
            return !1;
          })(t, e.constraints[0]);
        },
        defaultMessage: B(function (t) {
          return t + '$property must be a non-empty object';
        }, e),
      },
    },
    e,
  );
}
o(j, F), o(v, O), o(v, j);
r(
  {},
  'ClassTransformer',
  () => Lt,
  (t) => (Lt = t),
);
var bt,
  xt = {};
r(
  xt,
  'TransformOperationExecutor',
  () => Nt,
  (t) => (Nt = t),
),
  (function (t) {
    (t[(t.PLAIN_TO_CLASS = 0)] = 'PLAIN_TO_CLASS'),
      (t[(t.CLASS_TO_PLAIN = 1)] = 'CLASS_TO_PLAIN'),
      (t[(t.CLASS_TO_CLASS = 2)] = 'CLASS_TO_CLASS');
  })(bt || (bt = {}));
var _t = new ((function () {
  function t() {
    (this._typeMetadatas = new Map()),
      (this._transformMetadatas = new Map()),
      (this._exposeMetadatas = new Map()),
      (this._excludeMetadatas = new Map()),
      (this._ancestorsMap = new Map());
  }
  return (
    (t.prototype.addTypeMetadata = function (t) {
      this._typeMetadatas.has(t.target) || this._typeMetadatas.set(t.target, new Map()),
        this._typeMetadatas.get(t.target).set(t.propertyName, t);
    }),
    (t.prototype.addTransformMetadata = function (t) {
      this._transformMetadatas.has(t.target) || this._transformMetadatas.set(t.target, new Map()),
        this._transformMetadatas.get(t.target).has(t.propertyName) ||
          this._transformMetadatas.get(t.target).set(t.propertyName, []),
        this._transformMetadatas.get(t.target).get(t.propertyName).push(t);
    }),
    (t.prototype.addExposeMetadata = function (t) {
      this._exposeMetadatas.has(t.target) || this._exposeMetadatas.set(t.target, new Map()),
        this._exposeMetadatas.get(t.target).set(t.propertyName, t);
    }),
    (t.prototype.addExcludeMetadata = function (t) {
      this._excludeMetadatas.has(t.target) || this._excludeMetadatas.set(t.target, new Map()),
        this._excludeMetadatas.get(t.target).set(t.propertyName, t);
    }),
    (t.prototype.findTransformMetadatas = function (t, e, r) {
      return this.findMetadatas(this._transformMetadatas, t, e).filter(function (t) {
        return (
          !t.options ||
          (!0 === t.options.toClassOnly && !0 === t.options.toPlainOnly) ||
          (!0 === t.options.toClassOnly
            ? r === bt.CLASS_TO_CLASS || r === bt.PLAIN_TO_CLASS
            : !0 !== t.options.toPlainOnly || r === bt.CLASS_TO_PLAIN)
        );
      });
    }),
    (t.prototype.findExcludeMetadata = function (t, e) {
      return this.findMetadata(this._excludeMetadatas, t, e);
    }),
    (t.prototype.findExposeMetadata = function (t, e) {
      return this.findMetadata(this._exposeMetadatas, t, e);
    }),
    (t.prototype.findExposeMetadataByCustomName = function (t, e) {
      return this.getExposedMetadatas(t).find(function (t) {
        return t.options && t.options.name === e;
      });
    }),
    (t.prototype.findTypeMetadata = function (t, e) {
      return this.findMetadata(this._typeMetadatas, t, e);
    }),
    (t.prototype.getStrategy = function (t) {
      var e = this._excludeMetadatas.get(t),
        r = e && e.get(void 0),
        n = this._exposeMetadatas.get(t),
        o = n && n.get(void 0);
      return (r && o) || (!r && !o) ? 'none' : r ? 'excludeAll' : 'exposeAll';
    }),
    (t.prototype.getExposedMetadatas = function (t) {
      return this.getMetadata(this._exposeMetadatas, t);
    }),
    (t.prototype.getExcludedMetadatas = function (t) {
      return this.getMetadata(this._excludeMetadatas, t);
    }),
    (t.prototype.getExposedProperties = function (t, e) {
      return this.getExposedMetadatas(t)
        .filter(function (t) {
          return (
            !t.options ||
            (!0 === t.options.toClassOnly && !0 === t.options.toPlainOnly) ||
            (!0 === t.options.toClassOnly
              ? e === bt.CLASS_TO_CLASS || e === bt.PLAIN_TO_CLASS
              : !0 !== t.options.toPlainOnly || e === bt.CLASS_TO_PLAIN)
          );
        })
        .map(function (t) {
          return t.propertyName;
        });
    }),
    (t.prototype.getExcludedProperties = function (t, e) {
      return this.getExcludedMetadatas(t)
        .filter(function (t) {
          return (
            !t.options ||
            (!0 === t.options.toClassOnly && !0 === t.options.toPlainOnly) ||
            (!0 === t.options.toClassOnly
              ? e === bt.CLASS_TO_CLASS || e === bt.PLAIN_TO_CLASS
              : !0 !== t.options.toPlainOnly || e === bt.CLASS_TO_PLAIN)
          );
        })
        .map(function (t) {
          return t.propertyName;
        });
    }),
    (t.prototype.clear = function () {
      this._typeMetadatas.clear(),
        this._exposeMetadatas.clear(),
        this._excludeMetadatas.clear(),
        this._ancestorsMap.clear();
    }),
    (t.prototype.getMetadata = function (t, e) {
      var r,
        n = t.get(e);
      n &&
        (r = Array.from(n.values()).filter(function (t) {
          return void 0 !== t.propertyName;
        }));
      for (var o = [], a = 0, i = this.getAncestors(e); a < i.length; a++) {
        var s = i[a],
          c = t.get(s);
        if (c) {
          var u = Array.from(c.values()).filter(function (t) {
            return void 0 !== t.propertyName;
          });
          o.push.apply(o, u);
        }
      }
      return o.concat(r || []);
    }),
    (t.prototype.findMetadata = function (t, e, r) {
      var n = t.get(e);
      if (n) {
        var o = n.get(r);
        if (o) return o;
      }
      for (var a = 0, i = this.getAncestors(e); a < i.length; a++) {
        var s = i[a],
          c = t.get(s);
        if (c) {
          var u = c.get(r);
          if (u) return u;
        }
      }
    }),
    (t.prototype.findMetadatas = function (t, e, r) {
      var n,
        o = t.get(e);
      o && (n = o.get(r));
      for (var a = [], i = 0, s = this.getAncestors(e); i < s.length; i++) {
        var c = s[i],
          u = t.get(c);
        u && u.has(r) && a.push.apply(a, u.get(r));
      }
      return a
        .slice()
        .reverse()
        .concat((n || []).slice().reverse());
    }),
    (t.prototype.getAncestors = function (t) {
      if (!t) return [];
      if (!this._ancestorsMap.has(t)) {
        for (
          var e = [], r = Object.getPrototypeOf(t.prototype.constructor);
          void 0 !== r.prototype;
          r = Object.getPrototypeOf(r.prototype.constructor)
        )
          e.push(r);
        this._ancestorsMap.set(t, e);
      }
      return this._ancestorsMap.get(t);
    }),
    t
  );
})())();
var Ot = e.Buffer,
  St = function (t, e, r) {
    if (r || 2 === arguments.length)
      for (var n, o = 0, a = e.length; o < a; o++)
        (!n && o in e) || (n || (n = Array.prototype.slice.call(e, 0, o)), (n[o] = e[o]));
    return t.concat(n || Array.prototype.slice.call(e));
  };
var Ct,
  At,
  Tt,
  wt,
  Mt,
  Et,
  Nt = (function () {
    function t(t, e) {
      (this.transformationType = t), (this.options = e), (this.recursionStack = new Set());
    }
    return (
      (t.prototype.transform = function (t, e, r, o, a, i) {
        var s,
          c = this;
        if ((void 0 === i && (i = 0), Array.isArray(e) || e instanceof Set)) {
          var u =
            o && this.transformationType === bt.PLAIN_TO_CLASS
              ? (function (t) {
                  var e = new t();
                  return e instanceof Set || 'push' in e ? e : [];
                })(o)
              : [];
          return (
            e.forEach(function (e, n) {
              var o = t ? t[n] : void 0;
              if (c.options.enableCircularCheck && c.isCircular(e))
                c.transformationType === bt.CLASS_TO_CLASS && (u instanceof Set ? u.add(e) : u.push(e));
              else {
                var a = void 0;
                if (
                  'function' != typeof r &&
                  r &&
                  r.options &&
                  r.options.discriminator &&
                  r.options.discriminator.property &&
                  r.options.discriminator.subTypes
                ) {
                  if (c.transformationType === bt.PLAIN_TO_CLASS) {
                    a = r.options.discriminator.subTypes.find(function (t) {
                      return t.name === e[r.options.discriminator.property];
                    });
                    var s = { newObject: u, object: e, property: void 0 },
                      l = r.typeFunction(s);
                    (a = void 0 === a ? l : a.value),
                      r.options.keepDiscriminatorProperty || delete e[r.options.discriminator.property];
                  }
                  c.transformationType === bt.CLASS_TO_CLASS && (a = e.constructor),
                    c.transformationType === bt.CLASS_TO_PLAIN &&
                      (e[r.options.discriminator.property] = r.options.discriminator.subTypes.find(function (t) {
                        return t.value === e.constructor;
                      }).name);
                } else a = r;
                var p = c.transform(o, e, a, void 0, e instanceof Map, i + 1);
                u instanceof Set ? u.add(p) : u.push(p);
              }
            }),
            u
          );
        }
        if (r !== String || a) {
          if (r !== Number || a) {
            if (r !== Boolean || a) {
              if ((r === Date || e instanceof Date) && !a)
                return e instanceof Date ? new Date(e.valueOf()) : null == e ? e : new Date(e);
              if (
                ('undefined' != typeof globalThis
                  ? globalThis
                  : void 0 !== n
                  ? n
                  : 'undefined' != typeof window
                  ? window
                  : 'undefined' != typeof self
                  ? self
                  : void 0
                ).Buffer &&
                (r === Ot || e instanceof Ot) &&
                !a
              )
                return null == e ? e : Ot.from(e);
              if (null === (s = e) || 'object' != typeof s || 'function' != typeof s.then || a) {
                if (a || null === e || 'object' != typeof e || 'function' != typeof e.then) {
                  if ('object' == typeof e && null !== e) {
                    r ||
                      e.constructor === Object ||
                      ((Array.isArray(e) || e.constructor !== Array) && (r = e.constructor)),
                      !r && t && (r = t.constructor),
                      this.options.enableCircularCheck && this.recursionStack.add(e);
                    var l = this.getKeys(r, e, a),
                      p = t || {};
                    t ||
                      (this.transformationType !== bt.PLAIN_TO_CLASS &&
                        this.transformationType !== bt.CLASS_TO_CLASS) ||
                      (p = a ? new Map() : r ? new r() : {});
                    for (
                      var f = function (n) {
                          if ('__proto__' === n || 'constructor' === n) return 'continue';
                          var o = n,
                            s = n,
                            c = n;
                          if (!d.options.ignoreDecorators && r)
                            if (d.transformationType === bt.PLAIN_TO_CLASS)
                              (u = _t.findExposeMetadataByCustomName(r, n)) &&
                                ((c = u.propertyName), (s = u.propertyName));
                            else if (
                              d.transformationType === bt.CLASS_TO_PLAIN ||
                              d.transformationType === bt.CLASS_TO_CLASS
                            ) {
                              var u;
                              (u = _t.findExposeMetadata(r, n)) && u.options && u.options.name && (s = u.options.name);
                            }
                          var l = void 0;
                          l =
                            d.transformationType === bt.PLAIN_TO_CLASS
                              ? e[o]
                              : e instanceof Map
                              ? e.get(o)
                              : e[o] instanceof Function
                              ? e[o]()
                              : e[o];
                          var f = void 0,
                            y = l instanceof Map;
                          if (r && a) f = r;
                          else if (r) {
                            var h = _t.findTypeMetadata(r, c);
                            if (h) {
                              var v = { newObject: p, object: e, property: c },
                                m = h.typeFunction ? h.typeFunction(v) : h.reflectedType;
                              h.options &&
                              h.options.discriminator &&
                              h.options.discriminator.property &&
                              h.options.discriminator.subTypes
                                ? e[o] instanceof Array
                                  ? (f = h)
                                  : (d.transformationType === bt.PLAIN_TO_CLASS &&
                                      ((f =
                                        void 0 ===
                                        (f = h.options.discriminator.subTypes.find(function (t) {
                                          if (l && l instanceof Object && (h.options.discriminator.property in l))
                                            return t.name === l[h.options.discriminator.property];
                                        }))
                                          ? m
                                          : f.value),
                                      h.options.keepDiscriminatorProperty ||
                                        (l &&
                                          l instanceof Object &&
                                          (h.options.discriminator.property in l) &&
                                          delete l[h.options.discriminator.property])),
                                    d.transformationType === bt.CLASS_TO_CLASS && (f = l.constructor),
                                    d.transformationType === bt.CLASS_TO_PLAIN &&
                                      l &&
                                      (l[h.options.discriminator.property] = h.options.discriminator.subTypes.find(
                                        function (t) {
                                          return t.value === l.constructor;
                                        },
                                      ).name))
                                : (f = m),
                                (y = y || h.reflectedType === Map);
                            } else if (d.options.targetMaps)
                              d.options.targetMaps
                                .filter(function (t) {
                                  return t.target === r && !!t.properties[c];
                                })
                                .forEach(function (t) {
                                  return (f = t.properties[c]);
                                });
                            else if (d.options.enableImplicitConversion && d.transformationType === bt.PLAIN_TO_CLASS) {
                              var g = Reflect.getMetadata('design:type', r.prototype, c);
                              g && (f = g);
                            }
                          }
                          var b = Array.isArray(e[o]) ? d.getReflectedType(r, c) : void 0,
                            x = t ? t[o] : void 0;
                          if (p.constructor.prototype) {
                            var _ = Object.getOwnPropertyDescriptor(p.constructor.prototype, s);
                            if (
                              (d.transformationType === bt.PLAIN_TO_CLASS ||
                                d.transformationType === bt.CLASS_TO_CLASS) &&
                              ((_ && !_.set) || p[s] instanceof Function)
                            )
                              return 'continue';
                          }
                          if (d.options.enableCircularCheck && d.isCircular(l)) {
                            if (d.transformationType === bt.CLASS_TO_CLASS) {
                              S = l;
                              (void 0 !== (S = d.applyCustomTransformations(S, r, n, e, d.transformationType)) ||
                                d.options.exposeUnsetFields) &&
                                (p instanceof Map ? p.set(s, S) : (p[s] = S));
                            }
                          } else {
                            var O = d.transformationType === bt.PLAIN_TO_CLASS ? s : n,
                              S = void 0;
                            d.transformationType === bt.CLASS_TO_PLAIN
                              ? ((S = e[O]),
                                (S = d.applyCustomTransformations(S, r, O, e, d.transformationType)),
                                (S = e[O] === S ? l : S),
                                (S = d.transform(x, S, f, b, y, i + 1)))
                              : void 0 === l && d.options.exposeDefaultValues
                              ? (S = p[s])
                              : ((S = d.transform(x, l, f, b, y, i + 1)),
                                (S = d.applyCustomTransformations(S, r, O, e, d.transformationType))),
                              (void 0 !== S || d.options.exposeUnsetFields) &&
                                (p instanceof Map ? p.set(s, S) : (p[s] = S));
                          }
                        },
                        d = this,
                        y = 0,
                        h = l;
                      y < h.length;
                      y++
                    ) {
                      f(h[y]);
                    }
                    return this.options.enableCircularCheck && this.recursionStack.delete(e), p;
                  }
                  return e;
                }
                return e;
              }
              return new Promise(function (t, n) {
                e.then(function (e) {
                  return t(c.transform(void 0, e, r, void 0, void 0, i + 1));
                }, n);
              });
            }
            return null == e ? e : Boolean(e);
          }
          return null == e ? e : Number(e);
        }
        return null == e ? e : String(e);
      }),
      (t.prototype.applyCustomTransformations = function (t, e, r, n, o) {
        var a = this,
          i = _t.findTransformMetadatas(e, r, this.transformationType);
        return (
          void 0 !== this.options.version &&
            (i = i.filter(function (t) {
              return !t.options || a.checkVersion(t.options.since, t.options.until);
            })),
          (i =
            this.options.groups && this.options.groups.length
              ? i.filter(function (t) {
                  return !t.options || a.checkGroups(t.options.groups);
                })
              : i.filter(function (t) {
                  return !t.options || !t.options.groups || !t.options.groups.length;
                })).forEach(function (e) {
            t = e.transformFn({ value: t, key: r, obj: n, type: o, options: a.options });
          }),
          t
        );
      }),
      (t.prototype.isCircular = function (t) {
        return this.recursionStack.has(t);
      }),
      (t.prototype.getReflectedType = function (t, e) {
        if (t) {
          var r = _t.findTypeMetadata(t, e);
          return r ? r.reflectedType : void 0;
        }
      }),
      (t.prototype.getKeys = function (t, e, r) {
        var n = this,
          o = _t.getStrategy(t);
        'none' === o && (o = this.options.strategy || 'exposeAll');
        var a = [];
        if ((('exposeAll' === o || r) && (a = e instanceof Map ? Array.from(e.keys()) : Object.keys(e)), r)) return a;
        if (this.options.ignoreDecorators && this.options.excludeExtraneousValues && t) {
          var i = _t.getExposedProperties(t, this.transformationType),
            s = _t.getExcludedProperties(t, this.transformationType);
          a = St(St([], i, !0), s, !0);
        }
        if (!this.options.ignoreDecorators && t) {
          i = _t.getExposedProperties(t, this.transformationType);
          this.transformationType === bt.PLAIN_TO_CLASS &&
            (i = i.map(function (e) {
              var r = _t.findExposeMetadata(t, e);
              return r && r.options && r.options.name ? r.options.name : e;
            })),
            (a = this.options.excludeExtraneousValues ? i : a.concat(i));
          var c = _t.getExcludedProperties(t, this.transformationType);
          c.length > 0 &&
            (a = a.filter(function (t) {
              return !c.includes(t);
            })),
            void 0 !== this.options.version &&
              (a = a.filter(function (e) {
                var r = _t.findExposeMetadata(t, e);
                return !r || !r.options || n.checkVersion(r.options.since, r.options.until);
              })),
            (a =
              this.options.groups && this.options.groups.length
                ? a.filter(function (e) {
                    var r = _t.findExposeMetadata(t, e);
                    return !r || !r.options || n.checkGroups(r.options.groups);
                  })
                : a.filter(function (e) {
                    var r = _t.findExposeMetadata(t, e);
                    return !(r && r.options && r.options.groups && r.options.groups.length);
                  }));
        }
        return (
          this.options.excludePrefixes &&
            this.options.excludePrefixes.length &&
            (a = a.filter(function (t) {
              return n.options.excludePrefixes.every(function (e) {
                return t.substr(0, e.length) !== e;
              });
            })),
          (a = a.filter(function (t, e, r) {
            return r.indexOf(t) === e;
          }))
        );
      }),
      (t.prototype.checkVersion = function (t, e) {
        var r = !0;
        return r && t && (r = this.options.version >= t), r && e && (r = this.options.version < e), r;
      }),
      (t.prototype.checkGroups = function (t) {
        return (
          !t ||
          this.options.groups.some(function (e) {
            return t.includes(e);
          })
        );
      }),
      t
    );
  })(),
  It = {
    enableCircularCheck: !1,
    enableImplicitConversion: !1,
    excludeExtraneousValues: !1,
    excludePrefixes: void 0,
    exposeDefaultValues: !1,
    exposeUnsetFields: !0,
    groups: void 0,
    ignoreDecorators: !1,
    strategy: void 0,
    targetMaps: void 0,
    version: void 0,
  },
  Pt = function () {
    return (
      (Pt =
        Object.assign ||
        function (t) {
          for (var e, r = 1, n = arguments.length; r < n; r++)
            for (var o in (e = arguments[r])) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          return t;
        }),
      Pt.apply(this, arguments)
    );
  },
  Lt = (function () {
    function t() {}
    return (
      (t.prototype.instanceToPlain = function (t, e) {
        return new xt.TransformOperationExecutor(bt.CLASS_TO_PLAIN, Pt(Pt({}, It), e)).transform(
          void 0,
          t,
          void 0,
          void 0,
          void 0,
          void 0,
        );
      }),
      (t.prototype.classToPlainFromExist = function (t, e, r) {
        return new xt.TransformOperationExecutor(bt.CLASS_TO_PLAIN, Pt(Pt({}, It), r)).transform(
          e,
          t,
          void 0,
          void 0,
          void 0,
          void 0,
        );
      }),
      (t.prototype.plainToInstance = function (t, e, r) {
        return new xt.TransformOperationExecutor(bt.PLAIN_TO_CLASS, Pt(Pt({}, It), r)).transform(
          void 0,
          e,
          t,
          void 0,
          void 0,
          void 0,
        );
      }),
      (t.prototype.plainToClassFromExist = function (t, e, r) {
        return new xt.TransformOperationExecutor(bt.PLAIN_TO_CLASS, Pt(Pt({}, It), r)).transform(
          t,
          e,
          void 0,
          void 0,
          void 0,
          void 0,
        );
      }),
      (t.prototype.instanceToInstance = function (t, e) {
        return new xt.TransformOperationExecutor(bt.CLASS_TO_CLASS, Pt(Pt({}, It), e)).transform(
          void 0,
          t,
          void 0,
          void 0,
          void 0,
          void 0,
        );
      }),
      (t.prototype.classToClassFromExist = function (t, e, r) {
        return new xt.TransformOperationExecutor(bt.CLASS_TO_CLASS, Pt(Pt({}, It), r)).transform(
          e,
          t,
          void 0,
          void 0,
          void 0,
          void 0,
        );
      }),
      (t.prototype.serialize = function (t, e) {
        return JSON.stringify(this.instanceToPlain(t, e));
      }),
      (t.prototype.deserialize = function (t, e, r) {
        var n = JSON.parse(e);
        return this.plainToInstance(t, n, r);
      }),
      (t.prototype.deserializeArray = function (t, e, r) {
        var n = JSON.parse(e);
        return this.plainToInstance(t, n, r);
      }),
      t
    );
  })();
function jt(t, e) {
  return (
    void 0 === e && (e = {}),
    function (r, n) {
      var o = Reflect.getMetadata('design:type', r, n);
      _t.addTypeMetadata({ target: r.constructor, propertyName: n, reflectedType: o, typeFunction: t, options: e });
    }
  );
}
function Dt(t) {
  return function (e, r) {
    U({
      name: 'isNotEmptyArrayOrObject',
      target: e.constructor,
      propertyName: r,
      options: t,
      validator: {
        validate(t) {
          var e;
          return (
            (Array.isArray(t) && t.length > 0) ||
            ('object' == typeof t && (null === (e = Object.keys(t)) || void 0 === e ? void 0 : e.length) > 0)
          );
        },
        defaultMessage: (e) =>
          (null == t ? void 0 : t.each)
            ? `each value in ${e.property} must be a non-empty array or object`
            : `${e.property}  must be a non-empty array or object`,
      },
    });
  };
}
(d.isNotEmptyArrayOrObject = Dt),
  ((At = Ct = d.SupportedSchemas || (d.SupportedSchemas = {})).EN10168 = 'en10168'),
  (At.ECOC = 'e-coc'),
  (At.COA = 'coa'),
  (At.CDN = 'cdn'),
  (d.schemaToExternalStandardsMap = {
    [Ct.COA]: ['Certificate.Analysis.PropertiesStandard'],
    [Ct.EN10168]: [],
    [Ct.ECOC]: [],
    [Ct.CDN]: [],
  });
class Vt {}
y(
  [tt({ protocols: ['http', 'https'], require_tld: !1, require_valid_protocol: !0 }), h('design:type', String)],
  Vt.prototype,
  'RefSchemaUrl',
  void 0,
),
  (d.BaseCertificateSchema = Vt),
  ((wt = Tt = d.CertificateDocumentMetadataState || (d.CertificateDocumentMetadataState = {})).DRAFT = 'draft'),
  (wt.VALID = 'valid'),
  (wt.CANCELLED = 'cancelled');
class Ft {}
y([ht(), h('design:type', String)], Ft.prototype, 'id', void 0),
  y([D(), dt(), h('design:type', Number)], Ft.prototype, 'version', void 0),
  y([D(), yt(Tt), h('design:type', String)], Ft.prototype, 'state', void 0),
  (d.CertificateDocumentMetadata = Ft),
  ((Et = Mt = d.CertificateLanguages || (d.CertificateLanguages = {})).CN = 'CN'),
  (Et.DE = 'DE'),
  (Et.EN = 'EN'),
  (Et.ES = 'ES'),
  (Et.FR = 'FR'),
  (Et.PL = 'PL'),
  (Et.RU = 'RU'),
  (Et.IT = 'IT'),
  (Et.TR = 'TR'),
  ((d.ExternalStandardsEnum || (d.ExternalStandardsEnum = {})).CAMPUS = 'CAMPUS');
class kt {}
y([yt(Mt, { each: !0 }), h('design:type', Array)], kt.prototype, 'CertificateLanguages', void 0),
  y([gt(), h('design:type', Object)], kt.prototype, 'CommercialTransaction', void 0),
  y([gt(), h('design:type', Object)], kt.prototype, 'ProductDescription', void 0),
  y([D(), Dt(), h('design:type', Object)], kt.prototype, 'Inspection', void 0),
  y([D(), gt(), h('design:type', Object)], kt.prototype, 'OtherTests', void 0),
  y([gt(), h('design:type', Object)], kt.prototype, 'Validation', void 0),
  (d.EN10168SchemaCertificate = kt);
class $t extends Vt {}
y([D(), jt(() => Ft), gt(), (0, F.ValidateNested)(), h('design:type', Ft)], $t.prototype, 'DocumentMetadata', void 0),
  y([gt(), jt(() => kt), (0, F.ValidateNested)(), h('design:type', kt)], $t.prototype, 'Certificate', void 0),
  (d.EN10168Schema = $t);
class Rt extends Vt {}
y([ht(), h('design:type', String)], Rt.prototype, 'Id', void 0),
  y([at(), h('design:type', String)], Rt.prototype, 'Uuid', void 0),
  y([D(), ht(), h('design:type', String)], Rt.prototype, 'URL', void 0),
  y([gt(), h('design:type', Object)], Rt.prototype, 'EcocData', void 0),
  (d.ECoCSchema = Rt);
class Ut {}
y([yt(Mt, { each: !0 }), h('design:type', Array)], Ut.prototype, 'CertificateLanguages', void 0),
  y([ht(), h('design:type', String)], Ut.prototype, 'Id', void 0),
  y([ft(), h('design:type', String)], Ut.prototype, 'Date', void 0),
  y([D(), ht(), h('design:type', String)], Ut.prototype, 'Type', void 0),
  y([D(), gt(), h('design:type', Object)], Ut.prototype, 'Standards', void 0),
  y([D(), vt(), h('design:type', Object)], Ut.prototype, 'Contacts', void 0),
  y([gt(), h('design:type', Object)], Ut.prototype, 'Parties', void 0),
  y(
    [V((t) => void 0 === t.BusinessTransaction), gt(), h('design:type', Object)],
    Ut.prototype,
    'BusinessReferences',
    void 0,
  ),
  y(
    [V((t) => void 0 === t.BusinessReferences), gt(), h('design:type', Object)],
    Ut.prototype,
    'BusinessTransaction',
    void 0,
  ),
  y([gt(), h('design:type', Object)], Ut.prototype, 'Product', void 0),
  y([V((t) => void 0 === t.Analysis), vt(), h('design:type', Object)], Ut.prototype, 'Inspections', void 0),
  y([V((t) => void 0 === t.Inspections), gt(), h('design:type', Object)], Ut.prototype, 'Analysis', void 0),
  y([gt(), h('design:type', Object)], Ut.prototype, 'DeclarationOfConformity', void 0),
  y([D(), vt(), h('design:type', Object)], Ut.prototype, 'Attachments', void 0),
  (d.CoASchemaCertificate = Ut);
class Bt extends Vt {}
y([D(), jt(() => Ft), gt(), (0, F.ValidateNested)(), h('design:type', Ft)], Bt.prototype, 'DocumentMetadata', void 0),
  y([gt(), jt(() => Ut), (0, F.ValidateNested)(), h('design:type', Ut)], Bt.prototype, 'Certificate', void 0),
  (d.CoASchema = Bt);
class zt {}
y([yt(Mt, { each: !0 }), h('design:type', Array)], zt.prototype, 'CertificateLanguages', void 0),
  y([gt(), h('design:type', Object)], zt.prototype, 'Parties', void 0),
  y(
    [V((t) => void 0 === t.BusinessTransaction), gt(), h('design:type', Object)],
    zt.prototype,
    'BusinessReferences',
    void 0,
  ),
  y(
    [V((t) => void 0 === t.BusinessReferences), gt(), h('design:type', Object)],
    zt.prototype,
    'BusinessTransaction',
    void 0,
  ),
  y([gt(), h('design:type', Object)], zt.prototype, 'Product', void 0),
  y([vt(), h('design:type', Array)], zt.prototype, 'Certificates', void 0),
  (d.CDNSchemaCertificate = zt);
class Ht extends Vt {}
function qt(t, e) {
  const r = (function (t, e) {
    const r = e ? [{ image: e, width: 150 }] : [],
      { Manufacturer: n } = t;
    return [
      r,
      [
        { text: n.Name, style: 'h4' },
        { text: n.AddressLine1, style: 'p' },
        { text: n.AddressLine2 || ' ', style: 'p' },
        { text: `${n.ZipCode} ${n.City}, ${n.Country}`, style: 'p' },
        { text: n.Email, style: 'p' },
      ],
    ];
  })(t, e);
  return { style: 'table', table: { widths: [250, 300], body: [r] }, layout: u.tableLayout };
}
function Wt(t) {
  return [
    { text: t.Name, style: 'h4' },
    { text: t.AddressLine1, style: 'p' },
    { text: t.AddressLine2 || ' ', style: 'p' },
    { text: `${t.ZipCode} ${t.City}, ${t.Country}`, style: 'p' },
    { text: t.Email, style: 'p' },
  ];
}
function Kt(t, e) {
  const r = ['Customer', 'Receiver'].map((t) => [
      { text: e.translate(t, 'Certificate'), style: { bold: !0, fontSize: 10, margin: [0, 4, 0, 4] } },
    ]),
    { Customer: n, Receiver: o } = t;
  return { style: 'table', table: { widths: [250, 300], body: [r, [Wt(n), o ? Wt(o) : []]] }, layout: u.tableLayout };
}
function Gt(t, e) {
  const { Standard: r } = t.Certificate,
    n = [
      { text: e.translate('Id', 'Certificate'), style: 'tableHeader' },
      { text: t.Certificate.Id, style: 'p' },
      { text: e.translate('Date', 'Certificate'), style: 'tableHeader' },
      { text: u.localizeDate(t.Certificate.Date, e.languages), style: 'p' },
    ];
  return [
    {
      text: `${e.translate('Certificate', 'Certificate')}  ${r.Norm} ${r.Type || ''}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    { style: 'table', table: { widths: [150, 90, 100, 150], body: [n] }, layout: u.tableLayout },
  ];
}
function Qt(t, e) {
  const { Delivery: r, Order: n } = t,
    o = [
      { text: e.translate('Order', 'Certificate'), colSpan: 2, style: 'h5' },
      {},
      { text: e.translate('Delivery', 'Certificate'), colSpan: 2, style: 'h5' },
      {},
    ],
    a = [
      { text: e.translate('OrderId', 'Certificate'), style: 'tableHeader' },
      { text: n.Id, style: 'p' },
      { text: e.translate('DeliveryId', 'Certificate'), style: 'tableHeader' },
      { text: r.Id, style: 'p' },
    ],
    i = [
      { text: e.translate('OrderPosition', 'Certificate'), style: 'tableHeader' },
      { text: n.Position, style: 'p' },
      { text: e.translate('DeliveryPosition', 'Certificate'), style: 'tableHeader' },
      { text: r.Position, style: 'p' },
    ],
    s = [
      { text: e.translate('OrderQuantity', 'Certificate'), style: 'tableHeader' },
      { text: n.Quantity ? `${u.localizeNumber(n.Quantity, e.languages)} ${n.QuantityUnit || ''}` : '', style: 'p' },
      { text: e.translate('DeliveryQuantity', 'Certificate'), style: 'tableHeader' },
      { text: `${u.localizeNumber(r.Quantity, e.languages)} ${r.QuantityUnit}`, style: 'p' },
    ],
    c = [
      { text: e.translate('OrderDate', 'Certificate'), style: 'tableHeader' },
      { text: n.Date ? u.localizeDate(n.Date, e.languages) : '', style: 'p' },
      { text: e.translate('DeliveryDate', 'Certificate'), style: 'tableHeader' },
      { text: r.Date ? u.localizeDate(r.Date, e.languages) : '', style: 'p' },
    ],
    l = [
      { text: e.translate('CustomerProductId', 'Certificate'), style: 'tableHeader' },
      { text: n.CustomerProductId, style: 'p' },
      { text: e.translate('InternalOrderId', 'Certificate'), style: 'tableHeader' },
      { text: r.InternalOrderId, style: 'p' },
    ],
    p = [
      { text: e.translate('CustomerProductName', 'Certificate'), style: 'tableHeader' },
      { text: n.CustomerProductName, style: 'p' },
      { text: e.translate('InternalOrderPosition', 'Certificate'), style: 'tableHeader' },
      { text: r.InternalOrderPosition, style: 'p' },
    ],
    f = [
      { text: e.translate('GoodsReceiptId', 'Certificate'), style: 'tableHeader' },
      { text: n.GoodsReceiptId, style: 'p' },
      { text: e.translate('Transport', 'Certificate'), style: 'tableHeader' },
      { text: r.Transport, style: 'p' },
    ];
  return [
    { text: `${e.translate('BusinessTransaction', 'Certificate')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    { style: 'table', table: { widths: [150, 90, 100, 150], body: [o, a, i, s, c, l, p, f] }, layout: u.tableLayout },
  ];
}
function Zt(t, e) {
  const r = [
    { name: 'Id', i18n: 'ProductId' },
    { name: 'Name', i18n: 'ProductName' },
    { name: 'CountryOfOrigin', i18n: 'CountryOfOrigin' },
    { name: 'PlaceOfOrigin', i18n: 'PlaceOfOrigin' },
    { name: 'FillingBatchId', i18n: 'FillingBatchId' },
    { name: 'FillingBatchDate', i18n: 'FillingBatchDate', format: 'Date' },
    { name: 'ProductionBatchId', i18n: 'ProductionBatchId' },
    { name: 'ProductionDate', i18n: 'ProductionDate', format: 'Date' },
    { name: 'ExpirationDate', i18n: 'ExpirationDate', format: 'Date' },
    { name: 'Standards', i18n: 'Standards', format: 'Array' },
    { name: 'AdditionalInformation', i18n: 'AdditionalInformation', format: 'Array' },
  ]
    .map((r) =>
      t[r.name]
        ? [
            { text: e.translate(r.i18n, 'Certificate'), colSpan: 2, style: 'tableHeader' },
            {},
            { text: u.computeTextStyle(t[r.name], r.format, e.languages), colSpan: 2, style: 'p' },
            {},
          ]
        : null,
    )
    .filter((t) => !!t);
  return [
    { text: `${e.translate('Product', 'Certificate')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    { style: 'table', table: { widths: [150, 90, 100, 150], body: r }, layout: u.tableLayout },
  ];
}
function Jt(t, e, r) {
  return [
    { name: 'Property' },
    { name: 'Method' },
    { name: 'Unit' },
    { name: 'Value', format: 'Number' },
    { name: 'Minimum', format: 'Number' },
    { name: 'Maximum', format: 'Number' },
    { name: 'TestConditions' },
  ].map((n) => {
    const { name: o } = n;
    return 'Property' === o || 'TestConditions' === o
      ? {
          text: u.computeTextStyle(e.extraTranslate(r, t.PropertyId, o, t[o]), n.format, e.languages),
          style: 'caption',
        }
      : { text: u.computeTextStyle(t[o], n.format, e.languages), style: 'caption' };
  });
}
function Yt(t, e) {
  const r = t.LotId
      ? [
          { text: `${e.translate('LotId', 'Certificate')}`, style: 'h5', margin: [0, 0, 0, 4] },
          {},
          { text: t.LotId, style: 'p' },
          {},
        ]
      : [],
    n = { fontSize: 8, italics: !0, margin: [0, 2, 0, 2] },
    o = [
      [
        { text: e.translate('Property', 'Certificate'), style: n },
        { text: e.translate('Method', 'Certificate'), style: n },
        { text: e.translate('Unit', 'Certificate'), style: n },
        { text: e.translate('Value', 'Certificate'), style: n },
        { text: e.translate('Minimum', 'Certificate'), style: n },
        { text: e.translate('Maximum', 'Certificate'), style: n },
        { text: e.translate('TestConditions', 'Certificate'), style: n },
      ],
    ];
  if (t.Inspections?.length) {
    const r = t.Inspections.map((r) => Jt(r, e, u.enumFromString(d.ExternalStandardsEnum, t.PropertiesStandard)));
    o.push(...r);
  }
  if (t.AdditionalInformation?.length) {
    const r = u.createEmptyColumns(6),
      n = [{ text: e.translate('AdditionalInformation', 'Certificate'), style: 'h5', colSpan: 7 }, ...r],
      a = [{ text: t.AdditionalInformation.join('\n'), style: 'p', colSpan: 7 }, ...r];
    o.push(n, a);
  }
  return [
    { text: `${e.translate('Inspections', 'Certificate')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    { style: 'table', table: { widths: [150, 90, 100, 150], body: [r] }, layout: u.tableLayout },
    { style: 'table', table: { widths: [100, 80, 50, 50, 50, 50, 120], body: o }, layout: u.tableLayout },
  ];
}
function Xt(t, e) {
  const r = [
    {
      style: 'table',
      table: { widths: [160, '*', 180], body: [[{ text: t.Declaration, style: 'p', colSpan: t.CE ? 2 : 3 }, {}]] },
      layout: u.tableLayout,
    },
  ];
  if (t.CE) {
    const { CE: e } = t,
      n = {
        width: 100,
        style: 'table',
        table: {
          body: [
            [{ image: e.CE_Image }],
            [{ text: e.NotifiedBodyNumber, alignment: 'center', bold: !0, style: 'caption' }],
            [{ text: e.YearDocumentIssued, alignment: 'center', bold: !0, style: 'caption' }],
            [{ text: e.DocumentNumber, alignment: 'center', bold: !0, style: 'caption' }],
          ],
        },
        layout: u.tableLayout,
      };
    r.push(n);
  }
  return [
    { text: `${e.translate('DeclarationOfConformity', 'Certificate')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    { columns: r },
  ];
}
function te(t, e) {
  const r = [
    [
      { text: e.translate('ContactName', 'Certificate'), style: 'tableHeader' },
      { text: e.translate('ContactRole', 'Certificate'), style: 'tableHeader' },
      { text: e.translate('ContactDepartment', 'Certificate'), style: 'tableHeader' },
      { text: e.translate('ContactEmail', 'Certificate'), style: 'tableHeader' },
      { text: e.translate('ContactPhone', 'Certificate'), style: 'tableHeader' },
    ],
    ...t.map((t) => [
      { text: t.Name, style: 'p' },
      { text: t.Role, style: 'p' },
      { text: t.Department, style: 'p' },
      { text: t.Email, style: 'p' },
      { text: t.Phone, style: 'p' },
    ]),
  ];
  return [
    { text: `${e.translate('Contacts', 'Certificate')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    { style: 'table', table: { widths: ['*', '*', '*', '*', '*'], body: r }, layout: u.tableLayout },
  ];
}
function ee(t, e) {
  const r = t.map((t) => [{ text: t.FileName, style: 'p' }]);
  return [
    { text: `${e.translate('Attachments', 'Certificate')}`, style: 'h2', margin: [0, 0, 0, 4] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    { style: 'table', table: { widths: ['*'], body: [...r] }, layout: u.tableLayout },
  ];
}
function re(t, e, r) {
  const n = new u.Translate(e, r, t.Certificate.CertificateLanguages),
    o = [
      qt(t.Certificate.Parties, t.Certificate.Logo || ''),
      Kt(t.Certificate.Parties, n),
      Gt(t, n),
      Qt(t.Certificate.BusinessTransaction, n),
      Zt(t.Certificate.Product, n),
      Yt(t.Certificate.Analysis, n),
      Xt(t.Certificate.DeclarationOfConformity, n),
    ];
  if (t.Certificate.Contacts?.length) {
    const e = te(t.Certificate.Contacts, n);
    o.push(e);
  }
  if (t.Certificate.Attachments?.length) {
    const e = ee(t.Certificate.Attachments, n);
    o.push(e);
  }
  const a = u.createFooter(t.RefSchemaUrl);
  return o.push(a), o;
}
y([D(), jt(() => Ft), gt(), (0, F.ValidateNested)(), h('design:type', Ft)], Ht.prototype, 'DocumentMetadata', void 0),
  y(
    [gt(), jt(() => zt), (0, F.ValidateNested)(), h('design:type', zt)],
    Ht.prototype,
    'CertificateDeliveryNote',
    void 0,
  ),
  (d.CDNSchema = Ht);
