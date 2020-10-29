import { JSONSchema } from 'json-schema-to-typescript';
export declare type ValidateOptions = {
    ignoredPaths?: string[];
    ignoredExts?: string[];
};
export declare type ValidationError = {
    root: string;
    path: string;
    keyword: string;
    schemaPath: string;
    expected: string;
};
export declare function validate(certificates: string | JSONSchema | JSONSchema[], options?: Partial<ValidateOptions>): Promise<{
    [key: string]: ValidationError[];
}>;
