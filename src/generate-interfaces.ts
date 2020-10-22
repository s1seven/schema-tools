import { compile, JSONSchema, Options } from 'json-schema-to-typescript';
import { loadExternalFile, removeFile, writeFile } from './utils';

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
  externalSchema: string | JSONSchema,
  interfacesPath?: string | null,
  options?: Partial<GenerateOptions>
): Promise<string> {
  baseOptions = options ? { ...baseOptions, ...options } : baseOptions;

  const schema: JSONSchema =
    typeof externalSchema === 'string'
      ? ((await loadExternalFile(externalSchema as string, 'json')) as object)
      : externalSchema;

  if (typeof interfacesPath === 'string') {
    await removeFile(interfacesPath);
  }
  const interfaces = await compile(schema, 'Certificate', baseOptions);
  if (typeof interfacesPath === 'string') {
    await writeFile(interfacesPath, interfaces);
  }
  return interfaces;
}
