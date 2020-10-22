import axios from 'axios';
import * as fs from 'fs';
import { Readable } from 'stream';
import { promisify } from 'util';

export function readDir(path: string) {
  return promisify(fs.readdir)(path);
}

export function readFile(path: string, encoding = 'utf-8') {
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
  type: 'json' | 'text' | 'stream' = 'json'
): Promise<object | string | Readable> {
  if (path.startsWith('http')) {
    const { data, status } = await axios.get(path, { responseType: type });
    if (status !== 200) {
      throw new Error(`Loading error: ${status}`);
    }
    return data;
  } else {
    const stats = await statFile(path);
    if (!stats.isFile()) {
      throw new Error(`Loading error: ${path} is not a file`);
    }
    if (type === 'json') {
      return JSON.parse(await readFile(path));
    } else if (type === 'stream') {
      return fs.createReadStream(path);
    }
    return readFile(path);
  }
}
