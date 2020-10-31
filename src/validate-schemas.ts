import Ajv from 'ajv';
import { JSONSchema } from 'json-schema-to-typescript';
import flatten from 'lodash.flatten';
import groupBy from 'lodash.groupBy';
import path from 'path';
import { BaseCertificateSchema, ValidationError } from './types';
import {
  cache,
  formatValidationErrors,
  getErrorPaths,
  loadExternalFile,
  readDir,
  readFile,
} from './utils';

export type ValidateOptions = {
  ignoredPaths?: string[];
  ignoredExts?: string[];
};

let validateOptions: ValidateOptions = {
  ignoredPaths: [
    '.DS_Store',
    '.git',
    '.gitignore',
    'node_modules',
    'package.json',
    'package-lock.json',
  ],
  ignoredExts: ['ts', 'js', 'md'],
};

async function getLocalSchemaPaths(localSchemasDir: string): Promise<string[]> {
  const { ignoredPaths = [], ignoredExts = [] } = validateOptions;
  const directories = (await readDir(localSchemasDir))
    .filter(
      (name) =>
        !ignoredPaths.includes(name) &&
        ignoredExts.every((ext) => !name.endsWith(ext))
    )
    .map((dir) => path.resolve(localSchemasDir, dir));

  const subDirectories = await Promise.all(
    directories.map(async (dir) => {
      return (await readDir(dir))
        .filter((name) => name.endsWith('json'))
        .map((name) => path.resolve(localSchemasDir, dir, name));
    })
  );

  return flatten(subDirectories)
    .filter((name) => !!name)
    .sort();
}

async function* loadLocalSchemas(
  paths: string[]
): AsyncIterable<{ data: BaseCertificateSchema; filePath: string }> {
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

async function setValidator(
  refSchemaUrl: string
): Promise<Ajv.ValidateFunction> {
  const schema: JSONSchema = (await loadExternalFile(
    refSchemaUrl,
    'json'
  )) as object;
  const ajv = new Ajv({
    loadSchema: async (uri) => (await loadExternalFile(uri, 'json')) as object,
  });
  const validator = await ajv.compileAsync(schema);
  const cacheKey = `validator-${refSchemaUrl}`;
  cache.set(cacheKey, validator);
  return validator;
}

function getValidator(refSchemaUrl: string): Ajv.ValidateFunction | undefined {
  const cacheKey = `validator-${refSchemaUrl}`;
  return cache.get<Ajv.ValidateFunction>(cacheKey);
}

async function validateCertificate(
  certificate: any,
  filePath?: string
): Promise<ValidationError[]> {
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
    const validateSchema =
      getValidator(certificate.RefSchemaUrl) ||
      (await setValidator(certificate.RefSchemaUrl));
    const isSchemaValid = validateSchema(certificate);
    if (!isSchemaValid) {
      errors = formatValidationErrors(validateSchema.errors || [], filePath);
    }
  }

  return errors;
}

export async function validate(
  certificates: string | JSONSchema | JSONSchema[],
  options?: Partial<ValidateOptions>
): Promise<{ [key: string]: ValidationError[] }> {
  validateOptions = options
    ? { ...validateOptions, ...options }
    : validateOptions;

  if (typeof certificates === 'string') {
    const errors: ValidationError[][] = [];

    const schemaPaths = certificates.endsWith('.json')
      ? [certificates]
      : await getLocalSchemaPaths(certificates);

    for await (const { data, filePath } of loadLocalSchemas(schemaPaths)) {
      const error = await validateCertificate(data, filePath);
      errors.push(error);
    }
    return groupBy(flatten(errors), (error) => error.root);
  } else if (
    certificates instanceof Array &&
    typeof certificates === 'object'
  ) {
    const tmpErrors = await Promise.all(
      certificates.map(async (certificate) =>
        validateCertificate(certificate, certificate.RefSchemaUrl)
      )
    );
    return groupBy(flatten(tmpErrors), (error) => error.root);
  } else if (typeof certificates === 'object') {
    const error = await validateCertificate(
      certificates,
      certificates.RefSchemaUrl
    );
    return groupBy(error, (err) => err.root);
  }
  throw new Error('Invalid schemas input');
}
