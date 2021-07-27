import * as fs from 'fs';
import axios, { AxiosRequestConfig } from 'axios';
import {
  CDNSchema,
  CertificateLanguages,
  CoASchema,
  ECoCSchema,
  EN10168Schema,
  SchemaConfig,
  Schemas,
  SchemaTypes,
  SupportedSchemas,
  Translations,
  ValidationError,
} from '@s1seven/schema-tools-types';
import type { ErrorObject } from 'ajv';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import NodeCache from 'node-cache';
import { plainToClass } from 'class-transformer';
import { promisify } from 'util';
import { Readable } from 'stream';
import semver from 'semver-lite';
import { URL } from 'url';
import { validateSync } from 'class-validator';

export const cache = new NodeCache({
  stdTTL: 60 * 60,
  checkperiod: 600,
  maxKeys: 200,
});

export const axiosInstance = axios.create({
  timeout: 60000,
  httpAgent: new HttpAgent({ keepAlive: true }),
  httpsAgent: new HttpsAgent({ keepAlive: true }),
  maxRedirects: 10,
  maxContentLength: 50 * 1000 * 1000,
});

export function readDir(path: string): Promise<string[]> {
  return promisify(fs.readdir)(path);
}

export function readFile(path: string, encoding: string | null): Promise<string | Buffer> {
  return promisify(fs.readFile)(path, encoding);
}

export function statFile(path: string): Promise<fs.Stats | fs.BigIntStats> {
  return promisify(fs.stat)(path);
}

export function removeFile(path: string): Promise<void> {
  return new Promise((resolve, reject) =>
    fs.unlink(path, (err) => (err && err.message === 'EENOENT' ? reject(err) : resolve())),
  );
}

export function writeFile(path: string, content: string): Promise<void> {
  return promisify(fs.writeFile)(path, content);
}

export function getErrorPaths(filePath?: string): { path: string; root: string } {
  if (typeof filePath == 'string') {
    const filePathParts = filePath.split('/');
    return {
      path: filePathParts[filePathParts.length - 1],
      root: filePathParts[filePathParts.length - 2],
    };
  }
  return {
    path: '',
    root: '',
  };
}

export function formatValidationErrors(
  errors: ErrorObject<string, Record<string, any>, unknown>[] = [],
  validationFilePath?: string,
): ValidationError[] {
  const paths = getErrorPaths(validationFilePath);
  return errors.map((error) => ({
    root: paths.root,
    path: `${paths.path}${error.instancePath}`,
    keyword: error.keyword || '',
    schemaPath: error.schemaPath || '',
    expected: error.message || '',
  }));
}

export function getSemanticVersion(rawVersion: string): string | null {
  return semver.instance(rawVersion).version;
}

export function getRefSchemaUrl(opts: SchemaConfig, filename = 'schema.json'): URL {
  const { baseUrl, schemaType, version } = opts;
  const refSchemaUrl = new URL(baseUrl);
  refSchemaUrl.pathname = `${schemaType.toLowerCase()}/v${version}/${filename}`;
  return refSchemaUrl;
}

export function getSchemaConfig(refSchemaUrl: URL): SchemaConfig {
  const baseUrl = refSchemaUrl.origin;
  const [, schemaType, version] = refSchemaUrl.pathname.split('/').map((val, index) => {
    if (index === 2) {
      return getSemanticVersion(val);
    }
    return val;
  }) as [string, SchemaTypes, string];
  return { baseUrl, schemaType, version };
}

export function getCertificateLanguages(certificate: Schemas): CertificateLanguages[] | null {
  return certificate?.Certificate?.CertificateLanguages || null;
}

export async function getTranslations(
  certificateLanguages: string[],
  schemaConfig: SchemaConfig,
): Promise<Translations> {
  const errors = [];
  const translationsArray = await Promise.all(
    certificateLanguages.map(async (lang) => {
      const filePath = getRefSchemaUrl(schemaConfig, `${lang}.json`).href;
      try {
        return { [lang]: (await loadExternalFile(filePath, 'json')) as any };
      } catch (error) {
        errors.push(lang);
        return null;
      }
    }),
  );

  if (errors.length) {
    throw new Error(`these languages have errors: ${errors.join(', ')}`);
  }

  return translationsArray.reduce((acc, translation) => {
    const [key] = Object.keys(translation);
    acc[key] = translation[key];
    return acc;
  }, {});
}

export type ExternalFile = ReturnType<typeof loadExternalFile>;

export function loadExternalFile(filePath: string): Promise<Record<string, unknown>>;
export function loadExternalFile(filePath: string, type: 'json', useCache?: boolean): Promise<Record<string, unknown>>;
export function loadExternalFile(filePath: string, type: 'text', useCache?: boolean): Promise<string>;
export function loadExternalFile(filePath: string, type: 'arraybuffer', useCache?: boolean): Promise<Buffer>;
export function loadExternalFile(filePath: string, type: 'stream', useCache?: boolean): Promise<Readable>;

export async function loadExternalFile(
  filePath: string,
  type: 'json' | 'text' | 'arraybuffer' | 'stream' = 'json',
  useCache = true,
): Promise<Record<string, unknown> | string | Buffer | Readable | undefined> {
  const cacheKey = `${filePath}-${type}`;
  let result: Record<string, unknown> | string | Buffer | Readable | undefined =
    useCache && type !== 'stream' ? cache.get(cacheKey) : undefined;

  if (result) {
    return result;
  }

  if (filePath.startsWith('http')) {
    const options: AxiosRequestConfig = {
      responseType: type,
    };
    const { data } = await axiosInstance.get(filePath, options);
    result = data;
  } else {
    const stats = await statFile(filePath);
    if (!stats.isFile()) {
      throw new Error(`Loading error: ${filePath} is not a file`);
    }
    switch (type) {
      case 'json':
        result = JSON.parse((await readFile(filePath, 'utf8')) as string);
        break;
      case 'text':
        result = await readFile(filePath, 'utf-8');
        break;
      case 'arraybuffer':
        result = await readFile(filePath, null);
        break;
      default:
        result = fs.createReadStream(filePath);
    }
  }
  if (useCache && type !== 'stream') {
    cache.set(cacheKey, result);
  }
  return result;
}

function preValidateCertificate<T extends Schemas>(certificate: T, throwError?: boolean): T {
  const errors = validateSync(certificate, {});
  if (errors?.length) {
    if (throwError) {
      throw new Error(JSON.stringify(errors, null, 2));
    } else {
      return null;
    }
  }
  return certificate;
}

export function asEN10168Certificate(value: unknown, throwError?: boolean): EN10168Schema {
  const certificate = plainToClass(EN10168Schema, value, { enableImplicitConversion: true, exposeDefaultValues: true });
  return preValidateCertificate(certificate, throwError);
}

export function asECoCCertificate(value: unknown, throwError?: boolean): ECoCSchema {
  const certificate = plainToClass(ECoCSchema, value, { enableImplicitConversion: true, exposeDefaultValues: true });
  return preValidateCertificate(certificate, throwError);
}

export function asCoACertificate(value: unknown, throwError?: boolean): CoASchema {
  const certificate = plainToClass(CoASchema, value, { enableImplicitConversion: true, exposeDefaultValues: true });
  return preValidateCertificate(certificate, throwError);
}

export function asCDNCertificate(value: unknown, throwError?: boolean): CDNSchema {
  const certificate = plainToClass(CDNSchema, value, { enableImplicitConversion: true, exposeDefaultValues: true });
  return preValidateCertificate(certificate, throwError);
}

export const castCertificatesMap = {
  [SupportedSchemas.EN10168]: asEN10168Certificate,
  [SupportedSchemas.ECOC]: asECoCCertificate,
  [SupportedSchemas.COA]: asCoACertificate,
  [SupportedSchemas.CDN]: asCDNCertificate,
};

export function castCertificate(certificate: Record<string, unknown>): {
  certificate: Schemas;
  type: SupportedSchemas;
} {
  let validCertificate: Schemas;
  const supportedSchemas = Object.values(SupportedSchemas);
  for (const supportedSchema of supportedSchemas) {
    validCertificate = castCertificatesMap[supportedSchema](certificate);
    if (validCertificate) {
      return { certificate: validCertificate, type: supportedSchema };
    }
  }
  throw new Error('Could not cast the certificate to the right type');
}
