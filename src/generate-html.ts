import { cast, Result } from '@restless/sanitizers';
import { compile, RuntimeOptions } from 'handlebars';
import mjml2html from 'mjml';
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

export type GenerateHtmlOptions = {
  handlebars?: RuntimeOptions;
  mjml?: MJMLParsingOpts;
  useMjml?: boolean;
};

export enum Languages {
  EN = 'EN',
  DE = 'DE',
  PL = 'PL',
  FR = 'FR',
}

export type Translations = {
  [key in Languages]?: any;
};

const getTranslations = async (
  certificateLanguages: (string | Languages)[],
  schemaType: string,
  version: string
): Promise<Translations> => {
  return Object.entries(
    await Promise.all(
      certificateLanguages.map(async (lang: string) => {
        const filePath = `baseUrl/${schemaType}/${version}/${lang}.json`;
        return { [lang]: await loadExternalFile(filePath, 'json') };
      })
    )
  ).reduce((acc, [key, value]) => {
    acc[key] = value;
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
        return new Handlebars.SafeString(result);
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
          if (!acc) {
            return (acc += `${translations[curr][field][key]}`);
          }
          return (acc += ` / ${translations[curr][field][key]}`);
        }, '');
        return new Handlebars.SafeString(result);
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
        return object.hasOwnProperty(key)
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
        const template = Handlebars.compile(data);
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
  const baseProperties = ['DocumentMetadata', 'Certificate', 'RefSchemaUrl'];
  const isSchemaValid = baseProperties.every((prop) =>
    value.hasOwnProperty(prop)
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
  const baseProperties = ['Id', 'Uuid', 'Uuid', 'EcocData', 'RefSchemaUrl'];
  const isSchemaValid = baseProperties.every((prop) =>
    value.hasOwnProperty(prop)
  );
  if (!isSchemaValid) {
    return Result.error([
      {
        path: `Invalid  ${path} asECoCCertificate`,
        expected: baseProperties.join(','),
      },
    ]);
  }
  return Result.ok(value as ECoCSchema);
};

function castCertificate(certificate: object): EN10168Schema | ECoCSchema {
  const en10168ertificate = cast(certificate, asEN10168Certificate);
  if (en10168ertificate) {
    return en10168ertificate;
  }
  const eCoCcertificate = cast(certificate, asECoCCertificate);
  if (eCoCcertificate) {
    return eCoCcertificate;
  }
  throw new Error('Could not cast the certificate to the right type');
}

export async function generateHtml(
  certificateInput: string | object,
  options: GenerateHtmlOptions = {}
): Promise<string> {
  // TODO: handle object
  let rawCert: any;
  if (typeof certificateInput === 'string') {
    rawCert = (await loadExternalFile(certificateInput, 'json')) as any;
    if (!rawCert.RefSchemaUrl) {
      throw new Error('Missing RefSchemaUrl in loaded schema');
    }
  } else if (typeof certificateInput === 'object') {
    rawCert = certificateInput;
  } else {
    throw new Error(`Invalid input type : ${typeof certificateInput}`);
  }

  const certificate = castCertificate(rawCert);

  const certificateLanguages = getCertificateLanguages(certificate);
  const [baseUrl, schemaType, version] = certificate.RefSchemaUrl.split('/');

  const translations = await getTranslations(
    certificateLanguages,
    schemaType,
    version
  );

  options.handlebars = {
    ...(options.handlebars || {}),
    ...handlebarsBaseOptions({ translations }),
  };

  if (options.useMjml) {
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
  } else {
    const templateFilePath = `${baseUrl}/${schemaType}/${version}/template.hbs`;
    const templateFile = (await loadExternalFile(
      templateFilePath,
      'text'
    )) as string;
    const template = compile<object>(templateFile);
    return template(certificate, options?.handlebars);
  }
}
