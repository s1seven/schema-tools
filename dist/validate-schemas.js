"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ajv_1 = __importDefault(require("ajv"));
const axios_1 = __importDefault(require("axios"));
const lodash_flatten_1 = __importDefault(require("lodash.flatten"));
const lodash_groupBy_1 = __importDefault(require("lodash.groupBy"));
const utils_1 = require("./utils");
let validateOptions = {
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
async function getLocalSchemaPaths(localSchemasDir) {
    const { ignoredPaths = [], ignoredExts = [] } = validateOptions;
    const directories = (await utils_1.readDir(localSchemasDir)).filter((name) => !ignoredPaths.includes(name) &&
        ignoredExts.every((ext) => !name.endsWith(ext)));
    const subDirectories = await Promise.all(directories.map(async (dir) => {
        return (await utils_1.readDir(dir))
            .filter((name) => name.endsWith('json'))
            .map((name) => `${localSchemasDir}/${dir}/${name}`);
    }));
    return lodash_flatten_1.default(subDirectories)
        .filter((name) => !!name)
        .sort();
}
async function* loadLocalSchemas(paths) {
    let index = 0;
    while (index < paths.length) {
        const filePath = paths[index];
        let data = {};
        try {
            data = JSON.parse(await utils_1.readFile(filePath));
        }
        catch (error) {
            console.error(`loadLocalSchemas error for : ${filePath} `, error.message);
        }
        yield { data, filePath };
        index += 1;
    }
}
function formatErrors(validationFilePath, errors = []) {
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
async function loadSchema(filePath) {
    const { data, status } = await axios_1.default.get(filePath, { responseType: 'json' });
    if (status !== 200) {
        throw new Error(`Loading error for ${filePath} : ${status}`);
    }
    return data;
}
async function validate(externalSchemaPath, localSchemasDir, options = {}) {
    validateOptions = options
        ? { ...validateOptions, ...options }
        : validateOptions;
    const errors = [];
    const schema = await utils_1.loadExternalSchema(externalSchemaPath);
    const ajv = new ajv_1.default({ loadSchema });
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
    return lodash_groupBy_1.default(lodash_flatten_1.default(errors), (error) => error.root);
}
exports.validate = validate;
