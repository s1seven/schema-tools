import { compile, JSONSchema, Options } from 'json-schema-to-typescript';
import { removeFile, writeFile } from './utils';

export type GenerateOptions = Options;

let baseOptions: GenerateOptions = {
  bannerComment: '',
  cwd: process.cwd(),
  declareExternallyReferenced: true,
  enableConstEnums: false,
  ignoreMinAndMaxItems: false,
  unknownAny: false,
  unreachableDefinitions: false,
  strictIndexSignatures: false,
  style: {
    bracketSpacing: true,
    printWidth: 120,
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
  },
  $refOptions: {},
};

export async function generate(
  schema: JSONSchema,
  interfacesPath: string,
  options?: GenerateOptions
): Promise<void> {
  baseOptions = options ? { ...baseOptions, ...options } : baseOptions;
  await removeFile(interfacesPath);
  const interfaces = await compile(schema, 'Certificate', baseOptions);
  await writeFile(interfacesPath, interfaces);
}
