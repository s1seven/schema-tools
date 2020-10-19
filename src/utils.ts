import axios from 'axios';
import * as fs from 'fs';
import { JSONSchema } from 'json-schema-to-typescript';
import { promisify } from 'util';

export function readDir(path: string) {
  return promisify(fs.readdir)(path);
}

export function readFile(path: string, encoding = 'utf-8') {
  return promisify(fs.readFile)(path, encoding);
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

export async function loadExternalSchema(path: string): Promise<JSONSchema> {
  if (path.startsWith('http')) {
    const { data, status } = await axios.get(path, { responseType: 'json' });
    if (status !== 200) {
      throw new Error(`Loading error: ${status}`);
    }
    return data;
  }
  return JSON.parse(await readFile(path));
}
