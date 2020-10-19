import Ajv, { ErrorObject } from 'ajv';
import axios from 'axios';
import flatten from 'lodash.flatten';
import groupBy from 'lodash.groupBy';
import path from 'path';
import { loadExternalSchema, readDir, readFile } from './utils';

export type ValidateOptions = {
  ignoredPaths?: string[];
  ignoredExts?: string[];
};

export type ValidationError = {
  root: string;
  path: string;
  keyword: string;
  schemaPath: string;
  expected: string;
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
  const directories = (await readDir(localSchemasDir)).filter(
    (name) =>
      !ignoredPaths.includes(name) &&
      ignoredExts.every((ext) => !name.endsWith(ext))
  );
  const subDirectories = await Promise.all(
    directories.map(async (dir) => {
      return (await readDir(dir))
        .filter((name) => name.endsWith('json'))
        .map((name) => `${localSchemasDir}/${dir}/${name}`);
    })
  );
  return flatten(subDirectories)
    .filter((name) => !!name)
    .sort();
}

async function* loadLocalSchemas(
  paths: string[]
): AsyncIterable<{ data: object; filePath: string }> {
  let index = 0;
  while (index < paths.length) {
    const filePath = paths[index];
    let data = {};
    try {
      data = JSON.parse(await readFile(filePath));
    } catch (error) {
      console.error(`loadLocalSchemas error for : ${filePath} `, error.message);
    }

    yield { data, filePath };
    index += 1;
  }
}

function formatErrors(
  validationFilePath: string,
  errors: ErrorObject[] = []
): ValidationError[] {
  const [root, filePath] = validationFilePath
    .replace(`${__dirname}/`, '')
    .split('/');
  return errors.map((error) => ({
    root,
    path: `${filePath}${error.dataPath}`,
    keyword: error.keyword || '',
    schemaPath: error.schemaPath || '',
    expected: error.message || '',
  }));
}

async function loadSchema(filePath: string): Promise<object> {
  const { data, status } = await axios.get(filePath, { responseType: 'json' });
  if (status !== 200) {
    throw new Error(`Loading error for ${filePath} : ${status}`);
  }
  return data;
}

export async function validate(
  externalSchemaPath: string,
  localSchemasDir: string,
  options: ValidateOptions = {}
): Promise<{ [key: string]: ValidationError[] }> {
  validateOptions = { ...validateOptions, ...options };
  const errors: ValidationError[][] = [];
  const schema = await loadExternalSchema(externalSchemaPath);
  const ajv = new Ajv({ loadSchema });
  const validateSchema = await ajv.compileAsync(schema);
  const schemaPaths = localSchemasDir.endsWith('.json')
    ? [localSchemasDir]
    : await getLocalSchemaPaths(localSchemasDir);

  for await (const { data, filePath } of loadLocalSchemas(schemaPaths)) {
    const isSchemaValid = validateSchema(data);
    if (!isSchemaValid) {
      const error = formatErrors(filePath, validateSchema.errors || []);
      errors.push(error);
    }
  }

  return groupBy(flatten(errors), (error) => error.root);
}
