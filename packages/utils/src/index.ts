import { cast, Result, Sanitizer, SanitizerFailure } from '@restless/sanitizers';
import { ECoCSchema, EN10168Schema } from '@s1seven/schema-tools-types';
import axios from 'axios';
import * as fs from 'fs';
import NodeCache from 'node-cache';
import { Readable } from 'stream';
import { promisify } from 'util';

export const cache = new NodeCache({
  stdTTL: 60 * 60,
  checkperiod: 600,
  maxKeys: 200,
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

export type ExternalFile = ReturnType<typeof loadExternalFile>;

// TODO: add options as fourth arg, with encoding and other stream options ?
export async function loadExternalFile(
  filePath: string,
  type: 'json' | 'text' | 'arraybuffer' | 'stream' = 'json',
  useCache = true,
): Promise<Record<string, unknown> | string | Buffer | Readable | undefined> {
  let result: Record<string, unknown> | string | Buffer | Readable | undefined = useCache
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
        result = JSON.parse((await readFile(filePath, 'utf8')) as string) as Record<string, unknown>;
        break;
      case 'text':
        result = (await readFile(filePath, 'utf-8')) as string;
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

export function asEN10168Certificate<EN10168Schema>(
  value: unknown,
  path: string,
): Result<SanitizerFailure[], EN10168Schema> {
  const baseProperties = ['Certificate', 'RefSchemaUrl'];
  const isSchemaValid = baseProperties.every((prop) => Object.prototype.hasOwnProperty.call(value, prop));
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asECoCCertificate<ECoCSchema>(value: unknown, path: string): Result<SanitizerFailure[], ECoCSchema> {
  const baseProperties = ['EcocData', 'RefSchemaUrl'];
  const isSchemaValid = baseProperties.every((prop) => Object.prototype.hasOwnProperty.call(value, prop));
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

export function castWithoutError<T>(certificate: Record<string, unknown>, fn: Sanitizer<T>): T {
  try {
    return cast<T>(certificate, fn);
  } catch (error) {
    return null;
  }
}

export function castCertificate(certificate: Record<string, unknown>): EN10168Schema | ECoCSchema {
  const en10168ertificate = castWithoutError<EN10168Schema>(certificate, asEN10168Certificate);
  if (en10168ertificate) {
    return en10168ertificate;
  }

  const eCoCcertificate = castWithoutError<ECoCSchema>(certificate, asECoCCertificate);
  if (eCoCcertificate) {
    return eCoCcertificate;
  }
  throw new Error('Could not cast the certificate to the right type');
}
