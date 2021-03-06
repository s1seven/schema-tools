import Ajv, { ValidateFunction } from 'ajv';
import { BaseCertificateSchema, ValidationError } from '@s1seven/schema-tools-types';
import { cache, formatValidationErrors, getErrorPaths, loadExternalFile, readDir } from '@s1seven/schema-tools-utils';
import addFormats from 'ajv-formats';
import flatten from 'lodash.flatten';
import { promises as fs } from 'fs';
import groupBy from 'lodash.groupby';
import path from 'path';

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
      const stats = await fs.lstat(dirOrFile);
      if (stats.isFile()) {
        return dirOrFile;
      }

      return (await readDir(dirOrFile))
        .filter((name: string) => !ignoredPaths.includes(name) && name.endsWith('json'))
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
      data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch (error) {
      console.error(`loadLocalSchemas error for : ${filePath} `, error.message);
    }
    yield { data, filePath };
    index += 1;
  }
}

export async function setValidator(refSchemaUrl: string): Promise<ValidateFunction> {
  const schema = await loadExternalFile(refSchemaUrl, 'json');
  const ajv = new Ajv({
    loadSchema: (uri) => loadExternalFile(uri, 'json'),
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

async function validateCertificateString(
  certificates: string,
  options: ValidateOptions,
): Promise<{ [key: string]: ValidationError[] } | null> {
  const tmpErrors: ValidationError[][] = [];
  const schemaPaths = certificates.endsWith('.json')
    ? [certificates]
    : await getLocalSchemaPaths(certificates, options);
  for await (const { data, filePath } of loadLocalSchemas(schemaPaths)) {
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
