import Ajv, { ErrorObject } from 'ajv';
import {
  BaseCertificateSchema,
  JSONSchema7,
  JSONSchema7Definition,
  SchemaConfig,
  Schemas,
  SupportedSchemas,
} from '@s1seven/schema-tools-types';
import {
  castCertificate,
  formatValidationErrors,
  getRefSchemaUrl,
  getSchemaConfig,
  getSemanticVersion,
  loadExternalFile,
} from '@s1seven/schema-tools-utils';
import { extractEmails, PartyEmail } from '@s1seven/schema-tools-extract-emails';
import { setValidator, ValidateFunction } from '@s1seven/schema-tools-validate';
import addFormats from 'ajv-formats';
import cloneDeepWith from 'lodash.clonedeepwith';
import { EventEmitter } from 'events';
import merge from 'lodash.merge';
import { URL } from 'url';

export type BuildCertificateModelOptions = {
  schema?: JSONSchema7;
  schemaConfig: Partial<SchemaConfig>;
};

export type KVCertificateModelOptions = {
  validate: boolean;
  internal?: boolean;
  throwError?: boolean;
};

export type CertificateInstance = ReturnType<typeof castCertificate>['certificate'];

const defaultBuildCertificateOptions: SchemaConfig = {
  schemaType: 'en10168-schemas',
  version: 'v0.0.2',
  baseUrl: 'https://schemas.s1seven.com/',
};

const defaultKVSchemaOptions: KVCertificateModelOptions = {
  validate: true,
  internal: false,
  throwError: true,
};

export async function getSchema(
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
    const version = getSemanticVersion(schemaConfig.version);
    if (!version) {
      throw new Error(`Failed to retrieve semantic version from ${schemaConfig.version}`);
    }
    schemaConfig.version = version;
    refSchemaUrl = getRefSchemaUrl(schemaConfig);
    schema = (await loadExternalFile(refSchemaUrl.href, 'json')) as JSONSchema7;
  } else if (typeof options.schema === 'object') {
    schema = options.schema;
    if (typeof schema.$id !== 'string') {
      throw new TypeError('Schema has not valid $id property');
    }
    refSchemaUrl = new URL(schema.$id);
    schemaConfig = getSchemaConfig(refSchemaUrl);
  } else {
    throw new Error('Invalid options');
  }
  return { schema, schemaConfig };
}

function getSymbol(name: string): string {
  if (!getSymbol.cache[name]) {
    getSymbol.cache[name] = typeof Symbol !== 'undefined' ? Symbol(name) : `__${name}`;
  }
  return getSymbol.cache[name] as unknown as string;
}

getSymbol.cache = {};

function get<T extends Schemas>(scope: CertificateModel<T>, key: string, internal?: boolean) {
  if (internal) {
    key = getSymbol(key);
  }
  return scope[key];
}

// function get< K extends keyof T, T = any,>(scope: CertificateModel<T>, key: K, internal?: boolean) {
//   if (internal) {
//     key = getSymbol(key as string);
//   }
//   return scope[key];
// }

function set<T extends Schemas>(scope: CertificateModel<T>, data: Record<string, unknown> | T, internal?: boolean) {
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
function getProperties(schema: JSONSchema7, validator?: Ajv) {
  const root = !validator;
  if (root || !validator) {
    const ajv = new Ajv({
      discriminator: true,
      strictSchema: true,
      strictNumbers: true,
      strictRequired: true,
      strictTypes: true,
      allErrors: true,
    });
    addFormats(ajv);
    validator = ajv.addSchema(schema, '');
  }
  if (schema?.definitions) {
    for (const key in schema.definitions) {
      validator.addSchema(schema.definitions[key], `#/definitions/${key}`);
    }
  }
  if (schema?.$ref) {
    const validator2 = validator.getSchema(schema.$ref);
    if (typeof validator2?.schema === 'object') {
      schema = validator2.schema;
    }
  }
  if (schema?.properties) {
    return cloneDeepWith(schema.properties);
  }
  // JSONSchema7Definition[]
  const defs = schema['anyOf'] || schema['allOf'] || (root && schema['oneOf']);
  return defs
    ? (defs as JSONSchema7Definition[]).reduce((acc, def) => {
        acc = merge(acc, getProperties(def as JSONSchema7, validator));
        return acc;
      }, {} as Record<string, unknown>)
    : {};
}

export class CertificateModel<T extends Schemas> extends EventEmitter {
  static symbols: any;

  _validator: ValidateFunction = new Ajv({ strict: true }).compile({});

  static merge(obj1: Record<string, unknown>, obj2: Record<string, unknown>) {
    return merge(obj1, obj2);
  }

  static clone(
    obj1: Record<string, unknown>,
    customizer?: (value: any, key?: string | number) => Record<string, unknown>, // eslint-disable-line no-unused-vars
  ) {
    return typeof customizer === 'function' ? cloneDeepWith(obj1, customizer) : cloneDeepWith(obj1);
  }

  static cast(data: Record<string, unknown>): { type: SupportedSchemas; certificate: CertificateInstance } {
    return castCertificate(data);
  }

  static async build(options: Partial<BuildCertificateModelOptions>): Promise<typeof CertificateModel> {
    const { schema, schemaConfig } = await getSchema(options);
    const refSchemaUrl = getRefSchemaUrl(schemaConfig).href;
    const validator = await setValidator(refSchemaUrl);
    return class CertificateModelChild<R extends Schemas> extends CertificateModel<R> {
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
    const { certificate } = CertificateModel.cast(data);
    return new NewClass<CertificateInstance>(certificate);
  }

  constructor(data?: any, options?: KVCertificateModelOptions) {
    super({ captureRejections: true });
    if (data) {
      this.set(data, options || {})
        .then(() => process.nextTick(() => this.emit('ready')))
        .catch((error: Error) => process.nextTick(() => this.emit('error', error)));
    } else {
      process.nextTick(() => this.emit('ready'));
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

  getOptions(options?: KVCertificateModelOptions): KVCertificateModelOptions {
    return merge(defaultKVSchemaOptions, options || {});
  }
  // get<K extends keyof T>(name: K, options?: KVCertificateModelOptions): T[K] {
  //   const opts = merge(defaultKVSchemaOptions, options || {});
  //   return get<K, T>(this, name, opts.internal);
  // }

  get(name: string, options?: KVCertificateModelOptions) {
    const opts = this.getOptions(options);
    return get<T>(this, name, opts.internal);
  }

  // set<K extends keyof T>(data: K, value: T[K], options?: KVCertificateModelOptions): Promise<void>;
  set(data: string, value: any, options?: KVCertificateModelOptions): Promise<void>;
  set(data: Record<string, unknown>, options?: KVCertificateModelOptions): Promise<void>;
  set(data: T, options?: KVCertificateModelOptions): Promise<void>;

  async set(
    data: string | Record<string, unknown> | T,
    value?: any | KVCertificateModelOptions,
    options?: KVCertificateModelOptions,
  ): Promise<void> {
    if (typeof data === 'string') {
      return this.set({ [data]: value }, options);
    }
    data = data || {};
    const opts = this.getOptions(value || {});
    if (Object.keys(data).includes('RefSchemaUrl')) {
      this.validator = await setValidator((data as BaseCertificateSchema).RefSchemaUrl);
    }
    if (!opts.internal && opts.validate) {
      const dataToValidate = merge(this.toJSON(true), data);
      const { valid, errors } = this.validate(dataToValidate);
      if (!valid) {
        const validationError = errors
          ? formatValidationErrors(errors)
          : { validationError: 'Unknown validation error' };
        const error = new Error(JSON.stringify(validationError, null, 2));
        if (opts.throwError) {
          throw error;
        } else {
          this.emit('error', error);
        }
      }
    }
    set<T>(this, data as Record<string, unknown> | T, opts.internal);
    this.emit('done:set', this);
  }

  validate(data?: T): { valid: boolean; errors: ErrorObject[] | null | undefined } {
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
    }, {});

    return cloneDeepWith(res, (value) => (value instanceof CertificateModel ? value.toJSON(stripUndefined) : value));
  }

  getTransactionParties(): Promise<PartyEmail[] | null> {
    return extractEmails(this.toJSON() as Record<string, unknown>);
  }
}
