import { Options as AjvOptions, ValidateFunction } from 'ajv';
import Ajv2019 from 'ajv/dist/2019';
import draft7MetaSchema from 'ajv/dist/refs/json-schema-draft-07.json';
import addFormats from 'ajv-formats';
import Debug from 'debug';
import flatten from 'lodash.flatten';
import groupBy from 'lodash.groupby';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { BaseCertificateSchema, ValidationError } from '@s1seven/schema-tools-types';
import { cache, formatValidationErrors, getErrorPaths, loadExternalFile } from '@s1seven/schema-tools-utils';

export type ValidateOptions = {
  ignoredPaths?: string[];
  ignoredExts?: string[];
};

export type { ValidateFunction } from 'ajv';

const debug = Debug('schema-tools-validate');

const validateOptions: ValidateOptions = {
  ignoredPaths: ['.DS_Store', '.git', '.gitignore', 'node_modules', 'package.json', 'package-lock.json'],
  ignoredExts: ['ts', 'js', 'md'],
};

// traverse directory up to 2 levels
async function getLocalCertificatePaths(localSchemasDir: string, options: ValidateOptions): Promise<any[]> {
  const { ignoredPaths = [], ignoredExts = [] } = options;
  const dirsAndFiles = (await fs.readdir(localSchemasDir).catch(() => []))
    .filter((name: string) => !ignoredPaths.includes(name) && ignoredExts.every((ext) => !name.endsWith(ext)))
    .map((dir: string) => path.resolve(localSchemasDir, dir));

  if (!dirsAndFiles.length) {
    return [];
  }
  const subDirectories = await Promise.all(
    dirsAndFiles.map(async (dirOrFile) => {
      const stats = await fs.lstat(dirOrFile);
      if (stats.isFile()) {
        return dirOrFile;
      } else if (stats.isSymbolicLink()) {
        return undefined;
      }

      return (await fs.readdir(dirOrFile))
        .filter((name: string) => !ignoredPaths.includes(name) && name.endsWith('json'))
        .map((name: string) => path.resolve(localSchemasDir, dirOrFile, name));
    }),
  );

  return flatten(subDirectories)
    .filter((name) => !!name)
    .sort();
}

async function* loadLocalCertificates(
  paths: string[],
): AsyncIterable<{ data: BaseCertificateSchema; filePath: string }> {
  let index = 0;
  while (index < paths.length) {
    const filePath = paths[index];
    let data = {} as BaseCertificateSchema;
    try {
      data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch (error: any) {
      debug(`loadLocalCertificates error for : ${filePath} `, error?.message);
    }
    yield { data, filePath };
    index += 1;
  }
}

export async function setValidator(refSchemaUrl: string): Promise<ValidateFunction> {
  const schema = await loadExternalFile(refSchemaUrl, 'json');
  const ajvOptions: AjvOptions = {
    loadSchema: (uri) => loadExternalFile(uri, 'json'),
    discriminator: true,
    strictSchema: true,
    strictNumbers: true,
    strictRequired: true,
    // TODO: strictTypes: true,
    strictTypes: false,
    allErrors: true,
  };
  const ajv = new Ajv2019(ajvOptions);
  ajv.addKeyword('meta:license');
  ajv.addMetaSchema(draft7MetaSchema);
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

async function validateCertificateString(
  certificates: string,
  options: ValidateOptions,
): Promise<{ [key: string]: ValidationError[] } | null> {
  const tmpErrors: ValidationError[][] = [];
  const schemaPaths = certificates.endsWith('.json')
    ? [certificates]
    : await getLocalCertificatePaths(certificates, options);
  for await (const { data, filePath } of loadLocalCertificates(schemaPaths)) {
    const error = await validateCertificate(data, filePath);
    if (error.length) {
      tmpErrors.push(error);
    }
  }
  const errors = flatten(tmpErrors);
  return errors.length ? groupBy(errors, (error) => error?.root) : null;
}

async function validateCertificateArray(certificates: Record<string, any>[]) {
  const tmpErrors = await Promise.all(
    certificates.map((certificate) => validateCertificate(certificate, certificate.RefSchemaUrl)),
  );
  const errors = flatten(tmpErrors);
  return errors.length ? groupBy(errors, (error) => error?.root) : null;
}

export async function validate(
  certificates: string | Record<string, any> | Record<string, any>[], // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: Partial<ValidateOptions>,
): Promise<{ [key: string]: ValidationError[] } | null> {
  const opts = options ? { ...validateOptions, ...(options || {}) } : validateOptions;

  if (typeof certificates === 'string') {
    return validateCertificateString(certificates, opts);
  } else if (certificates instanceof Array) {
    return validateCertificateArray(certificates);
  } else if (typeof certificates === 'object') {
    const errors = await validateCertificate(certificates, certificates.RefSchemaUrl);
    return errors.length ? groupBy(errors, (err) => err?.root) : null;
  }
  throw new Error('Invalid schemas input');
}
