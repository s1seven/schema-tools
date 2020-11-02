import { cast, Result } from '@restless/sanitizers';
import axios from 'axios';
import * as fs from 'fs';
import NodeCache from 'node-cache';
import { Readable } from 'stream';
import { promisify } from 'util';
import { ECoCSchema, EN10168Schema } from './types';

export const cache = new NodeCache({
  stdTTL: 60 * 60,
  checkperiod: 600,
  maxKeys: 200,
});

export function readDir(path: string) {
  return promisify(fs.readdir)(path);
}

export function readFile(path: string, encoding: string | null) {
  return promisify(fs.readFile)(path, encoding);
}

export function statFile(path: string) {
  return promisify(fs.stat)(path);
}

export function removeFile(path: string) {
  return new Promise((resolve, reject) =>
    fs.unlink(path, (err) =>
      err && err.message === 'EENOENT' ? reject(err) : resolve()
    )
  );
}

export function writeFile(path: string, content: string) {
  return promisify(fs.writeFile)(path, content);
}

export type ExternalFile = ReturnType<typeof loadExternalFile>;

// TODO: add options as fourth arg, with encoding and other stream options ?
export async function loadExternalFile(
  filePath: string,
  type: 'json' | 'text' | 'arraybuffer' | 'stream' = 'json',
  useCache: boolean = true
): Promise<object | string | Readable | undefined> {
  let result: object | string | Readable | undefined = useCache
    ? cache.get(filePath)
    : undefined;

  if (result) {
    return result;
  }

  if (filePath.startsWith('http')) {
    const { data, status } = await axios.get(filePath, { responseType: type });
    if (status !== 200) {
      throw new Error(`Loading error: ${status}`);
    }
    result = data;
  } else {
    // filePath = path.resolve(filePath);
    const stats = await statFile(filePath);
    if (!stats.isFile()) {
      throw new Error(`Loading error: ${filePath} is not a file`);
    }
    switch (type) {
      case 'json':
        result = JSON.parse(
          (await readFile(filePath, 'utf8')) as string
        ) as object;
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
    cache.set(filePath, result);
  }
  return result;
}

export function asEN10168Certificate(value: any, path: string) {
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
}

export function asECoCCertificate(value: any, path: string) {
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
}

export function castWithoutError<T>(
  certificate: object,
  fn: (value: any, path: string) => any // eslint-disable-line no-unused-vars
) {
  try {
    return cast<T>(certificate, fn);
  } catch (error) {
    return null;
  }
}

export function castCertificate(
  certificate: object
): EN10168Schema | ECoCSchema {
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
