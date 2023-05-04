import axios, { AxiosRequestConfig } from 'axios';
import Debug from 'debug';
import * as fs from 'fs';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import NodeCache from 'node-cache';
import { Readable } from 'stream';
import { promisify } from 'util';

import type {
  ExternalStandards,
  ExternalStandardsTranslations,
  Languages,
  SchemaConfig,
  Translations,
} from '@s1seven/schema-tools-types';

import { getRefSchemaUrl } from './helpers';

const debug = Debug('schema-tools-utils');

export const cache = new NodeCache({
  stdTTL: 60 * 60,
  checkperiod: 600,
  maxKeys: 200,
});

export const axiosInstance = axios.create({
  timeout: 8000,
  httpAgent: new HttpAgent({ keepAlive: true }),
  httpsAgent: new HttpsAgent({ keepAlive: true }),
  maxRedirects: 10,
  maxContentLength: 50 * 1000 * 1000,
});

export function readDir(path: string): Promise<string[]> {
  return promisify(fs.readdir)(path);
}

export function readFile(path: string, encoding?: BufferEncoding) {
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

export function translationsArrayToObject(translationsArray: { [x: string]: Record<string, unknown> }[]): {
  [x: string]: Record<string, unknown>;
} {
  return translationsArray.reduce((acc, translation) => {
    const [key] = Object.keys(translation);
    acc[key] = translation[key];
    return acc;
  }, {});
}

async function getTranslation(
  schemaConfig: SchemaConfig,
  fileName: `${string}.json`,
): Promise<{ result?: Record<string, unknown>; error?: Error }> {
  const filePath = getRefSchemaUrl(schemaConfig, fileName).href;
  try {
    const result = await loadExternalFile(filePath, 'json');
    return { result };
  } catch (error: any) {
    debug(error);
    return { error };
  }
}

export async function getTranslations<L extends string = Languages>(
  certificateLanguages: L[],
  schemaConfig: SchemaConfig,
): Promise<Translations> {
  const errors = [];
  const translationsArray = await Promise.all(
    certificateLanguages.map(async (lang) => {
      const { result, error } = await getTranslation(schemaConfig, `${lang}.json`);
      if (error) {
        errors.push(lang);
        return null;
      }
      return { [lang]: result };
    }),
  );

  if (errors.length) {
    throw new Error(`these languages have errors: ${errors.join(', ')}`);
  }

  return translationsArrayToObject(translationsArray);
}

export async function getExtraTranslations<L extends string = Languages>(
  certificateLanguages: L[],
  schemaConfig: SchemaConfig,
  externalStandards: ExternalStandards[],
): Promise<ExternalStandardsTranslations> {
  const errors = [];
  const externalStandardsArray = await Promise.all(
    externalStandards.map(async (externalStandard) => {
      const translationsArray = await Promise.all(
        certificateLanguages.map(async (lang) => {
          const { result, error } = await getTranslation(schemaConfig, `${externalStandard}/${lang}.json`);
          if (error) {
            errors.push(`${externalStandard} - ${lang}`);
            return null;
          }
          return { [lang]: result };
        }),
      );

      if (errors.length) {
        throw new Error(`these languages have errors: ${errors.join(', ')}`);
      }

      return { [externalStandard]: translationsArrayToObject(translationsArray) };
    }),
  );

  return translationsArrayToObject(externalStandardsArray);
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
      // TODO: allow custom request timeout
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
