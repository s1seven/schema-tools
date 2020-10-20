"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadExternalSchema = exports.writeFile = exports.removeFile = exports.readFile = exports.readDir = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const util_1 = require("util");
function readDir(path) {
    return util_1.promisify(fs.readdir)(path);
}
exports.readDir = readDir;
function readFile(path, encoding = 'utf-8') {
    return util_1.promisify(fs.readFile)(path, encoding);
}
exports.readFile = readFile;
function removeFile(path) {
    return new Promise((resolve, reject) => fs.unlink(path, (err) => err && err.message === 'EENOENT' ? reject(err) : resolve()));
}
exports.removeFile = removeFile;
function writeFile(path, content) {
    return util_1.promisify(fs.writeFile)(path, content);
}
exports.writeFile = writeFile;
async function loadExternalSchema(path) {
    if (path.startsWith('http')) {
        const { data, status } = await axios_1.default.get(path, { responseType: 'json' });
        if (status !== 200) {
            throw new Error(`Loading error: ${status}`);
        }
        return data;
    }
    return JSON.parse(await readFile(path));
}
exports.loadExternalSchema = loadExternalSchema;
