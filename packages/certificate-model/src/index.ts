import { extractEmails, PartyEmail } from '@s1seven/schema-tools-extract-emails';
import { generateHtml, GenerateHtmlOptions } from '@s1seven/schema-tools-generate-html';
import { generatePdf, GeneratePdfOptions } from '@s1seven/schema-tools-generate-pdf';
import { JSONSchema7, SchemaConfig } from '@s1seven/schema-tools-types';
import {
  castCertificate,
  getRefSchemaUrl,
  getSchemaConfig,
  getSemanticVersion,
  loadExternalFile,
  formatValidationErrors,
} from '@s1seven/schema-tools-utils';
import { setValidator, ValidateFunction } from '@s1seven/schema-tools-validate';
import Ajv from 'ajv';
import { EventEmitter } from 'events';
import cloneDeepWith from 'lodash.clonedeepwith';
import merge from 'lodash.merge';
import { URL } from 'url';

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

async function getSchema(
  options: Partial<BuildCertificateModelOptions>,
): Promise<{ schema: JSONSchema7; schemaConfig: SchemaConfig }> {
  let schema: JSONSchema7;
  let schemaConfig: SchemaConfig;
  let refSchemaUrl: URL;
  if (options.schemaConfig) {
    schemaConfig = {
      ...defaultBuildCertificateOptions,
      ...(options.schemaConfig || {}),
    } as SchemaConfig;
    schemaConfig.version = getSemanticVersion(schemaConfig.version);
    refSchemaUrl = getRefSchemaUrl(schemaConfig);
    schema = (await loadExternalFile(refSchemaUrl.href, 'json')) as JSONSchema7;
  } else if (options.schema) {
    schema = options.schema;
    refSchemaUrl = new URL(schema.$id);
    schemaConfig = getSchemaConfig(refSchemaUrl);
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

function set<T = any>(scope: CertificateModel, data: Record<string, unknown> | T, internal?: boolean) {
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

// JSONSchema7 || JSONSchema7Definition
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
    const validator2 = validator.getSchema(schema.$ref);
    if (typeof validator2.schema === 'object') {
      schema = validator2.schema;
    }
  }
  if (schema.properties) {
    return cloneDeepWith(schema.properties);
  }
  // JSONSchema7Definition[]
  const defs: any[] = schema['anyOf'] || schema['allOf'] || (root && schema['oneOf']);
  return defs
    ? defs.reduce((acc, def) => {
        acc = merge(acc, getProperties(def, validator));
        return acc;
      }, {} as Record<string, unknown>)
    : {};
}

export class CertificateModel<T = any> extends EventEmitter {
  static symbols: any;

  _validator: ValidateFunction;

  static merge(obj1: Record<string, unknown>, obj2: Record<string, unknown>) {
    return merge(obj1, obj2);
  }

  static clone(
    obj1: Record<string, unknown>,
    customizer?: (value: any, key?: string | number) => Record<string, unknown>, // eslint-disable-line no-unused-vars
  ) {
    return typeof customizer === 'function' ? cloneDeepWith(obj1, customizer) : cloneDeepWith(obj1);
  }

  static cast(data: Record<string, unknown>): CertificateInstance {
    return castCertificate(data);
  }

  static async build(options: Partial<BuildCertificateModelOptions>): Promise<typeof CertificateModel> {
    const { schema, schemaConfig } = await getSchema(options);
    const refSchemaUrl = getRefSchemaUrl(schemaConfig).href;
    const validator = await setValidator(refSchemaUrl);

    return class CertificateModel1<R = any> extends CertificateModel<R> {
      _validator = validator;

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

  constructor(data?: any, options?: Record<string, unknown>) {
    super();
    this.setListeners();
    if (data) {
      this.set(data, options || {})
        .then(() => {
          this.emit('ready');
        })
        .catch((error: Error) => {
          this.emit('error', error);
        });
    } else {
      this.emit('ready');
    }
  }

  get schema(): JSONSchema7 {
    throw new Error('Missing schema');
  }

  get schemaConfig(): SchemaConfig {
    throw new Error('Missing schema config');
  }

  get validator(): ValidateFunction {
    return this._validator;
  }

  set validator(value: ValidateFunction) {
    this._validator = value;
  }

  get schemaProperties() {
    return getProperties(this.schema);
  }

  setListeners() {
    this.on('generate-html', (options: GenerateHtmlOptions) => this.generateHtml(options));
    this.on('generate-pdf', (options: GeneratePdfOptions) => this.generatePdf(options));
    this.on(
      'set',
      (
        data: string | Record<string, unknown> | T,
        value?: any | KVCertificateModelOptions,
        options?: KVCertificateModelOptions,
      ) => this.set(data, value, options),
    );
  }

  get(name: string, options?: KVCertificateModelOptions) {
    const opts = merge(defaultKVSchemaOptions, options || {});
    return get(this, name, opts.internal);
  }

  async set(
    data: string | Record<string, unknown> | T,
    value?: any | KVCertificateModelOptions,
    options?: KVCertificateModelOptions,
  ) {
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

    if (Object.keys(data).includes('RefSchemaUrl')) {
      this.validator = await setValidator((data as any).RefSchemaUrl);
    }
    if (!opts.internal && opts.validate) {
      const dataToValidate = merge(this.toJSON(true), data);
      const res = this.validate(dataToValidate);
      if (!res.valid) {
        const validationError = res.errors
          ? formatValidationErrors(res.errors)
          : { validationError: 'Unknown validation error' };
        const error = new Error(JSON.stringify(validationError, null, 2));
        this.emit('error', error);
        throw error;
      }
    }
    set<T>(this, data as Record<string, unknown> | T, opts.internal);
    this.emit('done:set', this);
  }

  validate(data?: T): { valid: boolean; errors: Ajv.ErrorObject[] | null | undefined } {
    data = data || this.toJSON(true);
    const valid = this.validator(data) as boolean;
    return { valid, errors: this.validator.errors };
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

    return cloneDeepWith(res, (value) => (value instanceof CertificateModel ? value.toJSON(stripUndefined) : value));
  }

  async generateHtml(options?: GenerateHtmlOptions): Promise<string> {
    const result = await generateHtml(this as Record<string, unknown>, options);
    this.emit('done:generate-html', result);
    return result;
  }

  async generatePdf(options: GeneratePdfOptions): Promise<Buffer | PDFKit.PDFDocument> {
    const result = await generatePdf(this as Record<string, unknown>, {
      inputType: 'json',
      outputType: 'buffer',
      ...options,
    });
    this.emit('done:generate-pdf', result);
    return result;
  }

  async getTransactionParties(): Promise<PartyEmail[] | null> {
    return extractEmails(this as Record<string, unknown>);
  }
}
