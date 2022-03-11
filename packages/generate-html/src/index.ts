/* eslint-disable @typescript-eslint/no-unused-vars */
import { compile, RuntimeOptions, SafeString } from 'handlebars';
import get from 'lodash.get';
import merge from 'lodash.merge';
import mjml2html from 'mjml';
import { URL } from 'url';

import {
  ExternalStandards,
  ExternalStandardsEnum,
  ExternalStandardsTranslations,
  ExtraTranslations,
  SchemaConfig,
  Schemas,
  schemaToExternalStandardsMap,
  Translations,
} from '@s1seven/schema-tools-types';
import {
  castCertificate,
  getCertificateLanguages,
  getExtraTranslations,
  getRefSchemaUrl,
  getSchemaConfig,
  getTranslations,
  loadExternalFile,
} from '@s1seven/schema-tools-utils';

interface MJMLParsingOpts {
  fonts?: { [key: string]: string };
  keepComments?: boolean;
  beautify?: boolean;
  minify?: boolean;
  validationLevel?: 'strict' | 'soft' | 'skip';
  filePath?: string;
}

export type GenerateHtmlOptions = {
  handlebars?: RuntimeOptions;
  mjml?: MJMLParsingOpts;
  templateType?: 'hbs' | 'mjml';
  schemaConfig?: SchemaConfig;
  templatePath?: string;
  translations?: Translations;
  extraTranslations?: ExtraTranslations;
};

const handlebarsBaseOptions = (data: {
  translations: Translations;
  extraTranslations: ExternalStandardsTranslations;
}): RuntimeOptions => {
  const { translations, extraTranslations } = data;
  return {
    helpers: {
      t: function (key: string, field: string, ln: string) {
        const result = get(translations, [ln.toUpperCase(), field, key]);
        return new SafeString(result);
      },
      i18n: function (key: string, field: string, languages: string | string[]) {
        const ln = typeof languages === 'string' ? languages.split(',').map((val) => val.trim()) : languages;
        const result = ln.reduce((acc, curr) => {
          const translation = get(translations, [curr, field, key]);
          return !acc ? (acc += `${translation}`) : (acc += ` / ${translation}`);
        }, '');
        return new SafeString(result);
      },
      extraI18n: function (
        standard: ExternalStandardsEnum,
        languages: string | string[],
        Id: string,
        key: string,
        propertyName = '',
      ) {
        const ln = typeof languages === 'string' ? languages.split(',').map((val) => val.trim()) : languages;
        const translations = ln.reduce((acc, curr) => {
          const translation = get(extraTranslations, [standard, curr, Id, key]) || propertyName;
          acc.push(translation);
          return acc;
        }, []);

        const [translation1, translation2] = translations;
        return new SafeString(translation1 === translation2 ? translation1 : `${translation1} / ${translation2}`);
      },
      ifEqual: function (lvalue: unknown, rvalue: unknown, options: any) {
        return lvalue === rvalue ? options.fn(this) : options.inverse(this);
      },
      in: function (key: string, values: string | string[], options: any) {
        values = typeof values === 'string' ? values.split(',').map((val) => val.trim()) : values;
        return values.includes(key) ? options.fn(this) : options.inverse(this);
      },
      notIn: function (key: string, values: string | string[], options: any) {
        values = typeof values === 'string' ? values.split(',').map((val) => val.trim()) : values;
        return !values.includes(key) ? options.fn(this) : options.inverse(this);
      },
      typeOf: function (input: unknown, type: string, options: any) {
        return typeof input === type ? options.fn(this) : options.inverse(this);
      },
      hasKey: function (object: Record<string, unknown>, key: string, options: any) {
        return Object.prototype.hasOwnProperty.call(object, key) ? options.fn(this) : options.inverse(this);
      },
      some: function (array: unknown[], path: string, options: any) {
        return array.some((el) => get(el, path, null)) ? options.fn(this) : options.inverse(this);
      },
      notEmpty: function (object: Record<string, unknown>, options: any) {
        return typeof object === 'object' && Object.keys(object).length ? options.fn(this) : options.inverse(this);
      },
      join: function (lvalue: any[], separator = ', ', property?: string) {
        const result = property ? lvalue.map((val) => val[property]).join(separator) : lvalue.join(separator);
        return new SafeString(result);
      },
      joinAndLocalizeNumber: function (lvalue: any[], separator = ', ', locales = ['EN'], property = '') {
        const localizeNumber = (val: any) => {
          return val ? new Intl.NumberFormat(locales, { maximumSignificantDigits: 6 }).format(val) : '';
        };
        const result = property
          ? lvalue.map((val) => localizeNumber(val[property])).join(separator)
          : lvalue.map((val) => localizeNumber(val)).join(separator);

        return new SafeString(result);
      },
      localizeValue: function (value: string, type: string, locales = ['EN']) {
        let result: any;

        const localizeDate = () => {
          return new Intl.DateTimeFormat(locales, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }).format(new Date(value));
        };

        switch (type) {
          case 'number':
            result = value ? new Intl.NumberFormat(locales, { maximumSignificantDigits: 6 }).format(Number(value)) : '';
            break;
          case 'date':
            result = localizeDate();
            break;
          case 'date-time':
            result = localizeDate();
            break;
          default:
            result = value;
        }
        return new SafeString(result);
      },
      localizeDate: function (lvalue: string | number | Date, locales: string | string[] = 'EN') {
        const event = new Date(lvalue);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        };
        const result = new Intl.DateTimeFormat(locales, options).format(event);
        return new SafeString(result);
      },
      localizeNumber: function (lvalue: number, locales: string | string[] = 'EN') {
        const result = lvalue ? new Intl.NumberFormat(locales, { maximumSignificantDigits: 6 }).format(lvalue) : '';
        return new SafeString(result);
      },
      get: function (object: Record<string, unknown>, path: string | string[]) {
        path = typeof path === 'string' ? path.split(',').map((val) => val.trim()) : path;
        const result = get(object, path);
        return new SafeString(result);
      },
      chunk: function (
        elements: Record<string, unknown>[],
        chunkSize = 15,
        filter?: string | string[],
        filterOut?: boolean,
      ) {
        filter = typeof filter === 'string' ? filter.split(',').map((val) => val.trim()) : filter;
        const filteredElements = Object.keys(elements)
          .filter((element) => (filterOut ? !filter.includes(element) : filter.includes(element)))
          .map((el) => ({ key: el, value: elements[el] }));

        return new Array(Math.ceil(filteredElements.length / chunkSize))
          .fill('')
          .map(() => filteredElements.splice(0, chunkSize));
      },
    },
  };
};

const mjmlBaseOptions = (certificate: Schemas, handlebarsOpts?: RuntimeOptions) => {
  return {
    keepComments: true,
    preprocessors: [
      (data: string): string => {
        const template = compile(data);
        return template(certificate, handlebarsOpts);
      },
    ],
  };
};

async function parseMjmlTemplate(certificate: any, options: GenerateHtmlOptions): Promise<string> {
  const templateFilePath = options.templatePath || getRefSchemaUrl(options.schemaConfig, 'template.mjml').href;
  const templateFile = await loadExternalFile(templateFilePath, 'text');
  options.mjml = merge(options.mjml || {}, mjmlBaseOptions(certificate, options.handlebars));
  const result = mjml2html(templateFile, options.mjml);
  if (result.errors) {
    console.warn('MJML errors :', result.errors);
  }
  return result.html;
}

async function parseHbsTemplate(certificate: any, options: GenerateHtmlOptions): Promise<string> {
  const templateFilePath = options.templatePath || getRefSchemaUrl(options.schemaConfig, 'template.hbs').href;
  const templateFile = await loadExternalFile(templateFilePath, 'text');
  const template = compile<Record<string, unknown>>(templateFile);
  return template(certificate, options?.handlebars);
}

export async function generateHtml(
  certificateInput: string | Record<string, unknown>,
  options: GenerateHtmlOptions = {},
): Promise<string> {
  let rawCert: Record<string, unknown>;
  if (typeof certificateInput === 'string') {
    rawCert = await loadExternalFile(certificateInput, 'json');
  } else if (typeof certificateInput === 'object') {
    rawCert = certificateInput;
  } else {
    throw new Error(`Invalid input type : ${typeof certificateInput}`);
  }

  const { certificate, type } = castCertificate(rawCert);
  const certificateLanguages = getCertificateLanguages(certificate) || ['EN'];

  const externalStandards: ExternalStandards[] =
    schemaToExternalStandardsMap[type]
      .map((schemaType) => get(certificate, schemaType, undefined))
      .filter((externalStandards) => externalStandards) || [];

  if (!options.schemaConfig) {
    const refSchemaUrl = new URL(certificate.RefSchemaUrl);
    options.schemaConfig = getSchemaConfig(refSchemaUrl);
  }

  const translations = certificateLanguages?.length
    ? options.translations || (await getTranslations(certificateLanguages, options.schemaConfig))
    : {};

  const extraTranslations: ExternalStandardsTranslations = certificateLanguages?.length
    ? options.extraTranslations ||
      (await getExtraTranslations(certificateLanguages, options.schemaConfig, externalStandards))
    : {};

  options.handlebars = merge(options.handlebars || {}, handlebarsBaseOptions({ translations, extraTranslations }));

  return options.templateType === 'mjml'
    ? parseMjmlTemplate(certificate, options)
    : parseHbsTemplate(certificate, options);
}
