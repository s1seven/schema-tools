import fs from 'fs';
import path from 'path';

export const fileExists = (x?: string): boolean => {
  return x && typeof x === 'string' && fs.existsSync(path.resolve(x));
};

export const isHttpPath = (x?: string): x is `http:${string}` | `https:${string}` => {
  return x && typeof x === 'string' && x.startsWith('http');
};

export const normalizePath = (x?: string): string => {
  if (!x) {
    return undefined;
  }
  if (!isHttpPath(x) && !fileExists(x)) {
    throw new Error(`Path ${x} does not exist.`);
  }
  return isHttpPath(x) ? x : path.resolve(x);
};
