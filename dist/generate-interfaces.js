"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
const utils_1 = require("./utils");
let baseOptions = {
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
async function generate(schema, interfacesPath, options) {
    baseOptions = options ? { ...baseOptions, ...options } : baseOptions;
    await utils_1.removeFile(interfacesPath);
    const interfaces = await json_schema_to_typescript_1.compile(schema, 'Certificate', baseOptions);
    await utils_1.writeFile(interfacesPath, interfaces);
}
exports.generate = generate;
