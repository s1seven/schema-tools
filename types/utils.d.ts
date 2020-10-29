/// <reference types="node" />
import * as fs from 'fs';
import NodeCache from 'node-cache';
import { Readable } from 'stream';
import { ECoCSchema, EN10168Schema } from './types';
export declare const cache: NodeCache;
export declare function readDir(path: string): Promise<string[]>;
export declare function readFile(path: string, encoding: string | null): Promise<string | Buffer>;
export declare function statFile(path: string): Promise<fs.Stats>;
export declare function removeFile(path: string): Promise<unknown>;
export declare function writeFile(path: string, content: string): Promise<void>;
export declare type ExternalFile = ReturnType<typeof loadExternalFile>;
export declare function loadExternalFile(filePath: string, type?: 'json' | 'text' | 'arraybuffer' | 'stream', useCache?: boolean): Promise<object | string | Readable | undefined>;
export declare function asEN10168Certificate(value: any, path: string): {
    error: {
        path: string;
        expected: string;
    }[];
} | {
    ok: EN10168Schema;
};
export declare function asECoCCertificate(value: any, path: string): {
    error: {
        path: string;
        expected: string;
    }[];
} | {
    ok: ECoCSchema;
};
export declare function castWithoutError<T>(certificate: object, fn: (value: any, path: string) => any): T | null;
export declare function castCertificate(certificate: object): EN10168Schema | ECoCSchema;
