import { extractEmails, PartyEmail } from '@s1seven/schema-tools-extract-emails';
import { generateHtml, GenerateHtmlOptions } from '@s1seven/schema-tools-generate-html';
import { SchemaTypes, JSONSchema7 } from '@s1seven/schema-tools-types';
import {
  getSemanticVersion,
  loadExternalFile,
  formatValidationErrors,
  castCertificate,
} from '@s1seven/schema-tools-utils';
import Ajv from 'ajv';
import { EventEmitter } from 'events';
import cloneDeepWith from 'lodash.clonedeepwith';
import merge from 'lodash.merge';
import { URL } from 'url';

export type SchemaConfig = {
  schemaType: SchemaTypes;
  version: string;
  baseUrl: string;
};

export type BuildCertificateModelOptions = {
  schema?: JSONSchema7;
  schemaConfig: Partial<SchemaConfig>;
};

export type KVCertificateModelOptions = {
  validate: boolean;
  internal: boolean;
};

export type CertificateInstance = ReturnType<typeof castCertificate>;

const defaultBuildCertificateOptions: SchemaConfig = {
  schemaType: 'en10168-schemas',
  version: 'v0.0.2',
  baseUrl: 'https://schemas.en10204.io/',
};

const defaultKVSchemaOptions: KVCertificateModelOptions = {
  validate: true,
  internal: false,
};

function getRefSchemaUrl(opts: SchemaConfig): URL {
  const { baseUrl, schemaType, version } = opts;
  const refSchemaUrl = new URL(baseUrl);
  refSchemaUrl.pathname = `${schemaType.toLowerCase()}/v${version}/schema.json`;
  return refSchemaUrl;
}

async function loadSchema(options: SchemaConfig): Promise<JSONSchema7> {
  const opts = {
    ...defaultBuildCertificateOptions,
    ...(options || {}),
  } as SchemaConfig;
  const url = getRefSchemaUrl(opts).href;
  return (await loadExternalFile(url, 'json')) as JSONSchema7;
}

async function getSchema(
  options: Partial<BuildCertificateModelOptions>,
): Promise<{ schema: JSONSchema7; schemaConfig: SchemaConfig }> {
  let schema: JSONSchema7;
  let schemaConfig: SchemaConfig;

  if (options.schemaConfig) {
    schemaConfig = {
      ...defaultBuildCertificateOptions,
      ...(options.schemaConfig || {}),
    } as SchemaConfig;
    schemaConfig.version = getSemanticVersion(schemaConfig.version);
    schema = await loadSchema(schemaConfig);
  } else if (options.schema) {
    schema = options.schema;
    const refSchemaUrl = new URL(schema.$id);
    const baseUrl = refSchemaUrl.origin;
    const [, schemaType, version] = refSchemaUrl.pathname.split('/').map((val, index) => {
      if (index === 2) {
        return getSemanticVersion(val);
      }
      return val;
    }) as [any, SchemaTypes, string];
    schemaConfig = { baseUrl, schemaType, version };
  } else {
    throw new Error('Invalid options');
  }

  return { schema, schemaConfig };
}

function getSymbol(name: string) {
  if (!getSymbol.cache[name]) {
    getSymbol.cache[name] = typeof Symbol !== 'undefined' ? Symbol(name) : `__${name}`;
  }
  return getSymbol.cache[name];
}

getSymbol.cache = {};

function get(scope: CertificateModel, key: string, internal?: boolean) {
  if (internal) {
    key = getSymbol(key);
  }
  return scope[key];
}

function set<T = any>(scope: CertificateModel, data: object | T, internal?: boolean) {
  Object.keys(data).forEach((key) => {
    const ok = key;
    if (internal) {
      key = getSymbol(key);
    }
    if (scope[key] !== data[ok]) {
      scope[key] = data[ok];
    }
  });
}

function getProperties(schema: any, validator?: Ajv.Ajv) {
  const root = !validator;
  if (root || !validator) {
    const ajv = new Ajv();
    validator = ajv.addSchema(schema, '');
  }
  if (schema.definitions) {
    for (const key in schema.definitions) {
      validator.addSchema(schema.definitions[key], `#/definitions/${key}`);
    }
  }
  if (schema.$ref) {
    schema = validator.getSchema(schema.$ref);
  }
  if (schema.properties) {
    return cloneDeepWith(schema.properties);
  }
  let res = {};
  const defs = schema['anyOf'] || schema['allOf'] || (root && schema['oneOf']);
  if (defs) {
    defs.forEach((def) => {
      res = merge(res, getProperties(def, validator));
    });
  }
  return res;
}

export class CertificateModel<T = any> extends EventEmitter {
  static symbols: any;

  static merge(obj1: object, obj2: object) {
    return merge(obj1, obj2);
  }

  static clone(
    obj1: object,
    customizer?: (value: any, key?: string | number) => object, // eslint-disable-line no-unused-vars
  ) {
    return typeof customizer === 'function' ? cloneDeepWith(obj1, customizer) : cloneDeepWith(obj1);
  }

  static cast(data: object): CertificateInstance {
    return castCertificate(data);
  }

  static async build(options: Partial<BuildCertificateModelOptions>): Promise<typeof CertificateModel> {
    const { schema, schemaConfig } = await getSchema(options);
    return class CertificateModel1<R = any> extends CertificateModel<R> {
      get schema() {
        return schema;
      }
      get schemaConfig() {
        return schemaConfig;
      }
    };
  }

  static async buildInstance(
    options: Partial<BuildCertificateModelOptions>,
    data: any,
  ): Promise<CertificateModel<CertificateInstance>> {
    const NewClass = await CertificateModel.build(options);
    const certificate = CertificateModel.cast(data);
    return new NewClass<CertificateInstance>(certificate);
  }

  constructor(data?: any, options?: object) {
    super();
    this.setListeners();
    if (data) {
      this.set(data, options || {});
    }
    this.emit('ready');
  }

  get schema(): JSONSchema7 {
    throw new Error('Missing schema');
  }

  get schemaConfig(): SchemaConfig {
    throw new Error('Missing schema config');
  }

  get schemaProperties() {
    return getProperties(this.schema);
  }

  setListeners() {
    this.on('generate-html:start', (options) => this.generateHtml(options));
    this.on('generate-pdf:start', (options) => this.generatePdf(options));
    this.on('error', (error) => {
      console.error('CertificateModel', error.message || 'Unknown error');
    });
  }

  get(name: string, options?: KVCertificateModelOptions) {
    const opts = merge(defaultKVSchemaOptions, options || {});
    return get(this, name, opts.internal);
  }

  set(data: string | object | T, value?: any | KVCertificateModelOptions, options?: KVCertificateModelOptions) {
    if (typeof data === 'string') {
      return this.set(
        {
          [data]: value,
        },
        options,
      );
    }
    data = data || {};
    const opts = merge(defaultKVSchemaOptions, value || {}) as KVCertificateModelOptions;

    if (!opts.internal && opts.validate) {
      const dataToValidate = merge(this.toJSON(true), data);
      const res = this.validate(dataToValidate);
      if (!res.valid) {
        if (res.errors) {
          const errors = formatValidationErrors(res.errors);
          this.emit('error', new Error(JSON.stringify(errors, null, 2)));
          throw new Error(JSON.stringify(errors, null, 2));
        }
        this.emit('error', new Error('Validation failed'));
        throw new Error('Validation failed');
      }
    }
    set<T>(this, data, opts.internal);
  }

  validate(data?: T): { valid: boolean; errors: Ajv.ErrorObject[] | null | undefined } {
    data = data || this.toJSON(true);
    const schema = this.schema;
    const ajv = new Ajv();
    const valid = ajv.validate(schema, data) as boolean;
    return { valid, errors: ajv.errors };
  }

  toJSON(stripUndefined?: boolean): T {
    const keys = Object.keys(this.schemaProperties);
    const res = keys.reduce((acc, key) => {
      const val = this.get(key);
      if (!stripUndefined || val !== undefined) {
        acc[key] = val;
      }
      return acc;
    }, {} as T);

    return cloneDeepWith(res, (value) => {
      if (value instanceof CertificateModel) {
        return value.toJSON(stripUndefined);
      }
      return value;
    });
  }

  async generateHtml(options?: GenerateHtmlOptions): Promise<string> {
    const result = await generateHtml(this, options);
    this.emit('generate-html:end', result);
    return result;
  }

  async generatePdf(options: any): Promise<any> {
    const result = Promise.resolve(options);
    this.emit('generate-pdf:end', result);
    return result;
  }

  async getEmails(): Promise<PartyEmail[] | null> {
    return extractEmails(this);
  }
}
