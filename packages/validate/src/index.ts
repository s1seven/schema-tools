import { BaseCertificateSchema, ValidationError } from '@s1seven/schema-tools-types';
import {
  cache,
  formatValidationErrors,
  getErrorPaths,
  loadExternalFile,
  readDir,
  readFile,
} from '@s1seven/schema-tools-utils';
import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import flatten from 'lodash.flatten';
import groupBy from 'lodash.groupby';
import path from 'path';
import fs from 'fs';

export type ValidateOptions = {
  ignoredPaths?: string[];
  ignoredExts?: string[];
};

export { ValidateFunction } from 'ajv';

const validateOptions: ValidateOptions = {
  ignoredPaths: ['.DS_Store', '.git', '.gitignore', 'node_modules', 'package.json', 'package-lock.json'],
  ignoredExts: ['ts', 'js', 'md'],
};

async function getLocalSchemaPaths(localSchemasDir: string, options: ValidateOptions): Promise<string[]> {
  const { ignoredPaths = [], ignoredExts = [] } = options;
  const dirsAndFiles = (await readDir(localSchemasDir))
    .filter((name: string) => !ignoredPaths.includes(name) && ignoredExts.every((ext) => !name.endsWith(ext)))
    .map((dir: string) => path.resolve(localSchemasDir, dir));

  const subDirectories = await Promise.all(
    dirsAndFiles.map(async (dirOrFile) => {
      const isFile = fs.lstatSync(dirOrFile).isFile();
      if (isFile) {
        return dirOrFile;
      }

      return (await readDir(dirOrFile))
        .filter((name: string) => name.endsWith('json'))
        .map((name: string) => path.resolve(localSchemasDir, dirOrFile, name));
    }),
  );

  return flatten(subDirectories)
    .filter((name) => !!name)
    .sort();
}

async function* loadLocalSchemas(paths: string[]): AsyncIterable<{ data: BaseCertificateSchema; filePath: string }> {
  let index = 0;
  while (index < paths.length) {
    const filePath = paths[index];
    let data = {} as BaseCertificateSchema;
    try {
      data = JSON.parse((await readFile(filePath, 'utf8')) as string);
    } catch (error) {
      console.error(`loadLocalSchemas error for : ${filePath} `, error.message);
    }
    yield { data, filePath };
    index += 1;
  }
}

export async function setValidator(refSchemaUrl: string): Promise<ValidateFunction> {
  const schema: Record<string, unknown> = (await loadExternalFile(refSchemaUrl, 'json')) as Record<string, unknown>;
  const ajv = new Ajv({
    loadSchema: async (uri) => (await loadExternalFile(uri, 'json')) as Record<string, unknown>,
    strict: false,
    allErrors: true,
  });
  addFormats(ajv);
  const validator = await ajv.compileAsync(schema);
  const cacheKey = `validator-${refSchemaUrl}`;
  cache.set(cacheKey, validator);
  return validator;
}

export function getValidator(refSchemaUrl: string): ValidateFunction | undefined {
  const cacheKey = `validator-${refSchemaUrl}`;
  return cache.get<ValidateFunction>(cacheKey);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function validateCertificate(certificate: Record<string, any>, filePath?: string): Promise<ValidationError[]> {
  let errors: ValidationError[] = [];
  if (!certificate?.RefSchemaUrl) {
    const paths = getErrorPaths(filePath);
    errors = [
      {
        root: paths.root,
        path: paths.path,
        keyword: '',
        schemaPath: '',
        expected: 'Missing RefSchemaUrl in loaded schema',
      },
    ];
  } else {
    const validateSchema = getValidator(certificate.RefSchemaUrl) || (await setValidator(certificate.RefSchemaUrl));
    const isSchemaValid = validateSchema(certificate);
    if (!isSchemaValid) {
      errors = formatValidationErrors(validateSchema.errors || [], filePath);
    }
  }

  return errors;
}

export async function validate(
  certificates: string | Record<string, any> | Record<string, any>[], // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: Partial<ValidateOptions>,
): Promise<{ [key: string]: ValidationError[] }> {
  const opts = options ? { ...validateOptions, ...(options || {}) } : validateOptions;

  if (typeof certificates === 'string') {
    const errors: ValidationError[][] = [];
    const schemaPaths = certificates.endsWith('.json') ? [certificates] : await getLocalSchemaPaths(certificates, opts);

    for await (const { data, filePath } of loadLocalSchemas(schemaPaths)) {
      const error = await validateCertificate(data, filePath);
      errors.push(error);
    }
    return groupBy(flatten(errors), (error) => error.root);
  } else if (certificates instanceof Array && typeof certificates === 'object') {
    const tmpErrors = await Promise.all(
      certificates.map(async (certificate) => validateCertificate(certificate, certificate.RefSchemaUrl)),
    );
    return groupBy(flatten(tmpErrors), (error) => error.root);
  } else if (typeof certificates === 'object') {
    const error = await validateCertificate(certificates, certificates.RefSchemaUrl);
    return groupBy(error, (err) => err.root);
  }
  throw new Error('Invalid schemas input');
}
