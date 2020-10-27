import axios from 'axios';
import * as fs from 'fs';
import NodeCache from 'node-cache';
import { Readable } from 'stream';
import { promisify } from 'util';

const cache = new NodeCache({
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

// TODO: add options as 3rd arg, with encoding and other stream options
export async function loadExternalFile(
  path: string,
  type: 'json' | 'text' | 'arraybuffer' | 'stream' = 'json'
): Promise<object | string | Readable | undefined> {
  let result: object | string | Readable | undefined;
  result = cache.get(path);
  if (result) {
    return result;
  }
  if (path.startsWith('http')) {
    const { data, status } = await axios.get(path, { responseType: type });
    if (status !== 200) {
      throw new Error(`Loading error: ${status}`);
    }
    result = data;
  } else {
    const stats = await statFile(path);
    if (!stats.isFile()) {
      throw new Error(`Loading error: ${path} is not a file`);
    }
    switch (type) {
      case 'json':
        result = JSON.parse((await readFile(path, 'utf8')) as string) as object;
        break;
      case 'text':
        result = await readFile(path, 'utf-8');
        break;
      case 'arraybuffer':
        result = await readFile(path, null);
        break;
      default:
        result = fs.createReadStream(path);
    }
  }
  // if (type !== 'stream') { }
  cache.set(path, result);
  return result;
}
