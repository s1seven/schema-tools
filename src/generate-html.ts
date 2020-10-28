import { cast, Result } from '@restless/sanitizers';
import { compile, RuntimeOptions, SafeString } from 'handlebars';
import get from 'lodash.get';
import mjml2html from 'mjml';
import { URL } from 'url';
import { ECoCSchema, EN10168Schema } from './types';
import { loadExternalFile } from './utils';

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

export type GenerateHtmlOptions = {
  handlebars?: RuntimeOptions;
  mjml?: MJMLParsingOpts;
  templateType?: 'hbs' | 'mjml';
  schemaPath?: SchemaPath;
};

export type Translations = {
  [key: string]: any;
};

const getTranslations = async (
  certificateLanguages: string[],
  schemaPath: SchemaPath
): Promise<any> => {
  const { baseUrl, schemaType, version } = schemaPath;
  const translationsArray = await Promise.all(
    certificateLanguages.map(async (lang) => {
      const filePath = `${baseUrl}/${schemaType}/${version}/${lang}.json`;
      return { [lang]: (await loadExternalFile(filePath, 'json')) as any };
    })
  );

  return translationsArray.reduce((acc, translation) => {
    const [key] = Object.keys(translation);
    acc[key] = translation[key];
    return acc;
  }, {} as Translations);
};

const handlebarsBaseOptions = (data: {
  translations: Translations;
}): RuntimeOptions => {
  const { translations } = data;
  return {
    helpers: {
      t: function (key: string, field: string, ln: string) {
        const result = translations[ln.toUpperCase()][field][key];
        return new SafeString(result);
      },
      ifEqual: function (lvalue: any, rvalue: any, options: any) {
        return lvalue === rvalue ? options.fn(this) : options.inverse(this);
      },
      i18n: function (
        key: string,
        field: string,
        languages: string | string[]
      ) {
        const ln =
          typeof languages === 'string'
            ? languages.split(',').map((val) => val.trim())
            : languages;
        const result = ln.reduce((acc, curr) => {
          const translation = get(translations, [curr, field, key]);
          if (!acc) {
            return (acc += `${translation}`);
          }
          return (acc += ` / ${translation}`);
        }, '');
        return new SafeString(result);
      },
      in: function (key: string, values: string | string[], options: any) {
        values =
          typeof values === 'string'
            ? values.split(',').map((val) => val.trim())
            : values;
        if (values.includes(key)) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      notIn: function (key: string, values: string | string[], options: any) {
        values =
          typeof values === 'string'
            ? values.split(',').map((val) => val.trim())
            : values;
        if (!values.includes(key)) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      typeOf: function (input: any, type: string, options: any) {
        return typeof input === type ? options.fn(this) : options.inverse(this);
      },
      hasKey: function (object: object, key: string, options: any) {
        return Object.prototype.hasOwnProperty.call(object, key)
          ? options.fn(this)
          : options.inverse(this);
      },
      notEmpty: function (object: object, options: any) {
        return typeof object === 'object' && Object.keys(object).length
          ? options.fn(this)
          : options.inverse(this);
      },
    },
  };
};

const mjmlBaseOptions = (
  certificate: EN10168Schema | ECoCSchema,
  handlebarsOpts?: RuntimeOptions
) => {
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

const asEN10168Certificate = (value: any, path: string) => {
  const baseProperties = ['Certificate', 'RefSchemaUrl'];
  const isSchemaValid = baseProperties.every((prop) =>
    Object.prototype.hasOwnProperty.call(value, prop)
  );
  if (!isSchemaValid) {
    return Result.error([
      {
        path: `Invalid ${path} asEN10168Certificate`,
        expected: baseProperties.join(','),
      },
    ]);
  }
  return Result.ok(value as EN10168Schema);
};

const asECoCCertificate = (value: any, path: string) => {
  const baseProperties = ['EcocData', 'RefSchemaUrl'];
  const isSchemaValid = baseProperties.every((prop) =>
    Object.prototype.hasOwnProperty.call(value, prop)
  );
  if (!isSchemaValid) {
    return Result.error([
      {
        path: `Invalid ${path} asECoCCertificate`,
        expected: baseProperties.join(','),
      },
    ]);
  }
  return Result.ok(value as ECoCSchema);
};

function castWithoutError<T>(
  certificate: object,
  fn: (value: any, path: string) => any // eslint-disable-line no-unused-vars
) {
  try {
    return cast<T>(certificate, fn);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function castCertificate(certificate: object): EN10168Schema | ECoCSchema {
  const en10168ertificate = castWithoutError<EN10168Schema>(
    certificate,
    asEN10168Certificate
  );
  if (en10168ertificate) {
    return en10168ertificate;
  }

  const eCoCcertificate = castWithoutError<ECoCSchema>(
    certificate,
    asECoCCertificate
  );
  if (eCoCcertificate) {
    return eCoCcertificate;
  }
  throw new Error('Could not cast the certificate to the right type');
}

async function parseMjmlTemplate(
  certificate: any,
  options: GenerateHtmlOptions
): Promise<string> {
  const { baseUrl, schemaType, version } = options.schemaPath as SchemaPath;
  const templateFilePath = `${baseUrl}/${schemaType}/${version}/template.mjml`;
  const templateFile = (await loadExternalFile(
    templateFilePath,
    'text'
  )) as string;

  options.mjml = {
    ...(options.mjml || {}),
    ...mjmlBaseOptions(certificate, options.handlebars),
  };
  const result = mjml2html(templateFile, options.mjml);
  if (result.errors) {
    console.log('MJML errors :', result.errors);
  }
  return result.html;
}

async function parseHbsTemplate(
  certificate: any,
  options: GenerateHtmlOptions
): Promise<string> {
  const { baseUrl, schemaType, version } = options.schemaPath as SchemaPath;
  const templateFilePath = `${baseUrl}/${schemaType}/${version}/template.hbs`;
  const templateFile = (await loadExternalFile(
    templateFilePath,
    'text'
  )) as string;
  const template = compile<object>(templateFile);
  return template(certificate, options?.handlebars);
}

export async function generateHtml(
  certificateInput: string | object,
  options: GenerateHtmlOptions = {}
): Promise<string> {
  // TODO: handle object
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

  const translations = await getTranslations(
    certificateLanguages,
    options.schemaPath
  );

  options.handlebars = {
    ...(options.handlebars || {}),
    ...handlebarsBaseOptions({ translations }),
  };

  if (options.templateType === 'mjml') {
    return parseMjmlTemplate(certificate, options);
  }
  return parseHbsTemplate(certificate, options);
}
