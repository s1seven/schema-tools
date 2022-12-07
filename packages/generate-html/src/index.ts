/* eslint-disable @typescript-eslint/no-unused-vars */
import Debug from 'debug';
import { compile, RuntimeOptions, SafeString, TemplateDelegate } from 'handlebars';
import get from 'lodash.get';
import merge from 'lodash.merge';
import mjml2html from 'mjml';
import { URL } from 'url';

import {
  CertificateLanguages,
  ExternalStandards,
  ExternalStandardsEnum,
  ExternalStandardsTranslations,
  ExtraTranslations,
  PartialsMapFileName,
  SchemaConfig,
  Schemas,
  schemaToExternalStandardsMap,
  Translations,
} from '@s1seven/schema-tools-types';
import {
  getCertificateLanguages,
  getCertificateType,
  getExtraTranslations,
  getRefSchemaUrl,
  getSchemaConfig,
  getTranslations,
  loadExternalFile,
  localizeNumber,
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
  partialsMap?: Record<string, string>;
};

const debug = Debug('schema-tools-generate-html');

function languagesStringToArray(languages: string | string[]): string[] {
  return typeof languages === 'string' ? languages.split(',').map((val) => val.trim()) : languages;
}

export const handlebarsBaseOptions = (data: {
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
        const ln = languagesStringToArray(languages);
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
        const ln = languagesStringToArray(languages);
        const translations = ln.reduce((acc, curr) => {
          const translation = get(extraTranslations, [standard, curr, Id, key]) || propertyName;
          acc.push(translation);
          return acc;
        }, []);

        const [translation1, translation2] = translations;

        if (!translation2) {
          return new SafeString(translation1);
        } else {
          return new SafeString(translation1 === translation2 ? translation1 : `${translation1} / ${translation2}`);
        }
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
      localizeValue: function (value: string, type: string, locales: string | string[] = ['EN']) {
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
            result = value ? localizeNumber(value, locales) : '';
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
      localizeNumber(lvalue: number | string, locales: string | string[] = 'EN'): SafeString {
        const result = localizeNumber(lvalue, locales);
        return new SafeString(result);
      },
      get: function (object: Record<string, unknown>, path: string | string[], defaultValue = undefined) {
        path = typeof path === 'string' ? path.split(',').map((val) => val.trim()) : path;
        const result = get(object, path, defaultValue);
        return result ? new SafeString(result) : result;
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

async function populatePartialsObject(
  partialsMap: Record<string, string>,
): Promise<Record<string, TemplateDelegate<any>>> {
  const partials = {};

  for (const partial in partialsMap) {
    const loadedTemplate = await loadExternalFile(partialsMap[partial], 'text');
    partials[partial] = (ctx, opts) => compile(loadedTemplate)(ctx, opts);
  }

  return partials;
}

export async function getPartials(
  schemaConfig: SchemaConfig,
  partialsMap?: Record<string, string>,
): Promise<false | Record<string, TemplateDelegate<any>>> {
  try {
    if (partialsMap) {
      return await populatePartialsObject(partialsMap);
    }
    const partialsMapUrl = getRefSchemaUrl(schemaConfig, PartialsMapFileName).href;
    const remotePartialsMap = await loadExternalFile(partialsMapUrl, 'json');
    return await populatePartialsObject(remotePartialsMap as Record<string, string>);
  } catch (error) {
    debug(error);
    return false;
  }
}

/**
 * generateHtml
 * @param certificateInput - The certificate must be validated before being passed in
 * as it is no longer validated in generateHtml
 */
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

  const certificate = rawCert as Schemas;
  if (!options.schemaConfig) {
    const refSchemaUrl = new URL(certificate.RefSchemaUrl);
    options.schemaConfig = getSchemaConfig(refSchemaUrl);
  }

  const type = getCertificateType(options.schemaConfig);
  const certificateLanguages = getCertificateLanguages(certificate) || [CertificateLanguages.EN];

  const externalStandards: ExternalStandards[] = schemaToExternalStandardsMap[type]
    ? schemaToExternalStandardsMap[type]
        .map((schemaType) => get(certificate, schemaType, undefined))
        .filter((externalStandards) => externalStandards) || []
    : [];

  const translations = certificateLanguages?.length
    ? options.translations || (await getTranslations(certificateLanguages, options.schemaConfig))
    : {};

  const extraTranslations: ExternalStandardsTranslations = certificateLanguages?.length
    ? options.extraTranslations ||
      (await getExtraTranslations(certificateLanguages, options.schemaConfig, externalStandards))
    : {};

  const partials: false | Record<string, TemplateDelegate<any>> = await getPartials(
    options.schemaConfig,
    options.partialsMap,
  );

  options.handlebars = merge(
    options.handlebars || {},
    partials ? { partials } : {},
    handlebarsBaseOptions({ translations, extraTranslations }),
  );

  return options.templateType === 'mjml'
    ? parseMjmlTemplate(certificate, options)
    : parseHbsTemplate(certificate, options);
}
