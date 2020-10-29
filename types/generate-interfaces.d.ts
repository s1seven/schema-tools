import { JSONSchema, Options } from 'json-schema-to-typescript';
export declare type GenerateOptions = Options;
export declare function generate(externalSchema: string | JSONSchema, interfacesPath?: string | null, options?: Partial<GenerateOptions>): Promise<string>;
