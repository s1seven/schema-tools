import { ECoCSchema, EN10168Schema } from '@s1seven/schema-tools-types';
import { loadExternalFile, castCertificate } from '@s1seven/schema-tools-utils';
import { compile, RuntimeOptions, SafeString } from 'handlebars';
import get from 'lodash.get';
import merge from 'lodash.merge';
import mjml2html from 'mjml';
import { URL } from 'url';

interface MJMLParsingOpts {
  fonts?: { [key: string]: string };
  keepComments?: boolean;
  beautify?: boolean;
  minify?: boolean;
  validationLevel?: 'strict' | 'soft' | 'skip';
  filePath?: string;
}

export type SchemaPath = {
  baseUrl: string;
  schemaType: string;
  version: string;
};

export type Translations = {
  [key: string]: any;
};

export type GenerateHtmlOptions = {
  handlebars?: RuntimeOptions;
  mjml?: MJMLParsingOpts;
  templateType?: 'hbs' | 'mjml';
  schemaPath?: SchemaPath;
  templatePath?: string;
  translations?: Translations;
};

const getTranslations = async (certificateLanguages: string[], schemaPath: SchemaPath): Promise<Translations> => {
  const { baseUrl, schemaType, version } = schemaPath;
  const translationsArray = await Promise.all(
    certificateLanguages.map(async (lang) => {
      const filePath = `${baseUrl}/${schemaType}/${version}/${lang}.json`;
      return { [lang]: (await loadExternalFile(filePath, 'json')) as any };
    }),
  );

  return translationsArray.reduce((acc, translation) => {
    const [key] = Object.keys(translation);
    acc[key] = translation[key];
    return acc;
  }, {});
};

// TODOS: add helper to parse KeyValueObject by its type property
// Add helper for date localisation .toLocaleDateString(CertificateLanguages[0])
// number localisation with .toLocaleString(CertificateLanguages[0])

const handlebarsBaseOptions = (data: { translations: Translations }): RuntimeOptions => {
  const { translations } = data;
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
          if (!acc) {
            return (acc += `${translation}`);
          }
          return (acc += ` / ${translation}`);
        }, '');
        return new SafeString(result);
      },
      ifEqual: function (lvalue: unknown, rvalue: unknown, options: any) {
        return lvalue === rvalue ? options.fn(this) : options.inverse(this);
      },
      in: function (key: string, values: string | string[], options: any) {
        values = typeof values === 'string' ? values.split(',').map((val) => val.trim()) : values;
        if (values.includes(key)) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      notIn: function (key: string, values: string | string[], options: any) {
        values = typeof values === 'string' ? values.split(',').map((val) => val.trim()) : values;
        if (!values.includes(key)) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      typeOf: function (input: unknown, type: string, options: any) {
        return typeof input === type ? options.fn(this) : options.inverse(this);
      },
      hasKey: function (object: Record<string, unknown>, key: string, options: any) {
        return Object.prototype.hasOwnProperty.call(object, key) ? options.fn(this) : options.inverse(this);
      },
      notEmpty: function (object: Record<string, unknown>, options: any) {
        return typeof object === 'object' && Object.keys(object).length ? options.fn(this) : options.inverse(this);
      },
      join: function (lvalue: any[], separator = ', ', property?: string) {
        const result = property ? lvalue.map((val) => val[property]).join(separator) : lvalue.join(separator);
        return new SafeString(result);
      },
      localiseDate: function (lvalue: string | number | Date, locales: string | string[] = 'EN') {
        const event = new Date(lvalue);
        const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        };
        const result = new Intl.DateTimeFormat(locales, options).format(event);
        return new SafeString(result);
      },
      localiseNumber: function (lvalue: number, locales: string | string[] = 'EN') {
        const result = new Intl.NumberFormat(locales).format(lvalue);
        return new SafeString(result);
      },
      get: function (object: Record<string, unknown>, path: string | string[]) {
        path = typeof path === 'string' ? path.split(',').map((val) => val.trim()) : path;
        const result = get(object, path);
        return new SafeString(result);
      },
    },
  };
};

const mjmlBaseOptions = (certificate: EN10168Schema | ECoCSchema, handlebarsOpts?: RuntimeOptions) => {
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

function getCertificateLanguages(certificate: EN10168Schema | ECoCSchema) {
  if ((certificate as EN10168Schema)?.Certificate?.CertificateLanguages) {
    return (certificate as EN10168Schema)?.Certificate?.CertificateLanguages;
  }
  return ['EN'];
}

async function parseMjmlTemplate(certificate: any, options: GenerateHtmlOptions): Promise<string> {
  const { baseUrl, schemaType, version } = options.schemaPath as SchemaPath;
  const templateFilePath = options.templatePath || `${baseUrl}/${schemaType}/${version}/template.mjml`;
  const templateFile = (await loadExternalFile(templateFilePath, 'text')) as string;

  options.mjml = merge(options.mjml || {}, mjmlBaseOptions(certificate, options.handlebars));

  const result = mjml2html(templateFile, options.mjml);
  if (result.errors) {
    console.log('MJML errors :', result.errors);
  }
  return result.html;
}

async function parseHbsTemplate(certificate: any, options: GenerateHtmlOptions): Promise<string> {
  const { baseUrl, schemaType, version } = options.schemaPath as SchemaPath;
  const templateFilePath = options.templatePath || `${baseUrl}/${schemaType}/${version}/template.hbs`;
  const templateFile = (await loadExternalFile(templateFilePath, 'text')) as string;
  const template = compile<Record<string, unknown>>(templateFile);
  return template(certificate, options?.handlebars);
}

export async function generateHtml(
  certificateInput: string | Record<string, unknown>,
  options: GenerateHtmlOptions = {},
): Promise<string> {
  let rawCert: any;
  if (typeof certificateInput === 'string') {
    rawCert = (await loadExternalFile(certificateInput, 'json')) as any;
  } else if (typeof certificateInput === 'object') {
    rawCert = certificateInput;
  } else {
    throw new Error(`Invalid input type : ${typeof certificateInput}`);
  }

  const certificate = castCertificate(rawCert);
  const certificateLanguages = getCertificateLanguages(certificate);

  if (!options.schemaPath) {
    const refSchemaUrl = new URL(certificate.RefSchemaUrl);
    const baseUrl = refSchemaUrl.origin;
    const [, schemaType, version] = refSchemaUrl.pathname.split('/');
    options.schemaPath = { baseUrl, schemaType, version };
  }

  const translations = options.translations || (await getTranslations(certificateLanguages, options.schemaPath));

  options.handlebars = merge(options.handlebars || {}, handlebarsBaseOptions({ translations }));

  if (options.templateType === 'mjml') {
    return parseMjmlTemplate(certificate, options);
  }
  return parseHbsTemplate(certificate, options);
}
