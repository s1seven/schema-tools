import { compile, JSONSchema, Options } from 'json-schema-to-typescript';
import { removeFile, writeFile } from './utils';

let baseOptions: Options = {
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
  options: Options = {} as Options
): Promise<void> {
  baseOptions = { ...baseOptions, ...options };
  await removeFile(interfacesPath);
  const interfaces = await compile(schema, 'Certificate', baseOptions);
  await writeFile(interfacesPath, interfaces);
}
