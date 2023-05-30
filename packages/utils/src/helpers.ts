import type { ErrorObject } from 'ajv';
import semver from 'semver-lite';
import { URL } from 'url';

import type {
  CertificateLanguages,
  SchemaConfig,
  Schemas,
  SchemaTypes,
  ValidationError,
} from '@s1seven/schema-tools-types';

export function localizeNumber(lvalue: number | string, locales: string | string[] = 'EN'): string {
  if (lvalue === undefined) return '';

  const options: Intl.NumberFormatOptions = {};
  if (typeof lvalue === 'string' && Number.isNaN(Number(lvalue))) {
    return lvalue;
  } else if (typeof lvalue === 'string') {
    const decimalNumbersToDisplay = lvalue.includes('.') ? lvalue.split('.').at(-1).length : 0;
    options.minimumFractionDigits = decimalNumbersToDisplay;
    lvalue = Number(lvalue);
  } else {
    options.maximumSignificantDigits = 6;
  }
  return new Intl.NumberFormat(locales, options).format(lvalue);
}

export function getErrorPaths(filePath?: string): {
  path: string;
  root: string;
} {
  if (typeof filePath == 'string') {
    const filePathParts = filePath.split('/');
    return {
      path: filePathParts[filePathParts.length - 1],
      root: filePathParts[filePathParts.length - 2],
    };
  }
  return {
    path: '',
    root: '',
  };
}

export function formatValidationErrors(
  errors: ErrorObject<string, Record<string, any>, unknown>[] = [],
  validationFilePath?: string,
): ValidationError[] {
  const paths = getErrorPaths(validationFilePath);
  return errors.map((error) => ({
    root: paths.root,
    path: `${paths.path}${error.instancePath}`,
    keyword: error.keyword || '',
    schemaPath: error.schemaPath || '',
    expected: error.message || '',
  }));
}

export function getSemanticVersion(rawVersion: string): string | null {
  try {
    const { version } = semver.instance(rawVersion);
    return version;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`getSemanticVersion error: ${rawVersion} is invalid`);
    return null;
  }
}

export function getRefSchemaUrl(opts: SchemaConfig, filename = 'schema.json'): URL {
  const { baseUrl, schemaType, version } = opts;
  const refSchemaUrl = new URL(baseUrl);
  refSchemaUrl.pathname = `${schemaType.toLowerCase()}/v${version}/${filename}`;
  return refSchemaUrl;
}

export function getSchemaConfig(refSchemaUrl: URL): SchemaConfig {
  const baseUrl = refSchemaUrl.origin;
  const [, schemaType, version] = refSchemaUrl.pathname.split('/').map((val, index) => {
    if (index === 2) {
      return getSemanticVersion(val);
    }
    return val;
  }) as [string, SchemaTypes, string];
  return { baseUrl, schemaType, version };
}

export function getCertificateLanguages(certificate: Schemas): CertificateLanguages[] | null {
  return certificate?.Certificate?.CertificateLanguages || null;
}

export function getCertificateType(schemaConfig: SchemaConfig): string {
  const { schemaType } = schemaConfig;
  return schemaType.replace('-schemas', '');
}
