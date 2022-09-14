import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import {
  CDNSchema,
  CoASchema,
  ECoCSchema,
  EN10168Schema,
  Schemas,
  SupportedSchemas,
  TKRSchema,
} from '@s1seven/schema-tools-types';

function preValidateCertificate<T extends Schemas>(certificate: T, throwError?: boolean): T {
  const errors = validateSync(certificate, {
    validationError: {
      target: false,
    },
  });
  if (errors?.length) {
    if (throwError) {
      throw new Error(JSON.stringify(errors, null, 2));
    } else {
      return null;
    }
  }
  return certificate;
}

export function asEN10168Certificate(value: unknown, throwError?: boolean): EN10168Schema {
  const certificate = plainToInstance(EN10168Schema, value, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });
  return preValidateCertificate(certificate, throwError);
}

export function asTKRCertificate(value: unknown, throwError?: boolean): TKRSchema {
  const certificate = plainToInstance(TKRSchema, value, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });
  return preValidateCertificate(certificate, throwError);
}

export function asECoCCertificate(value: unknown, throwError?: boolean): ECoCSchema {
  const certificate = plainToInstance(ECoCSchema, value, { enableImplicitConversion: true, exposeDefaultValues: true });
  return preValidateCertificate(certificate, throwError);
}

export function asCoACertificate(value: unknown, throwError?: boolean): CoASchema {
  const certificate = plainToInstance(CoASchema, value, { enableImplicitConversion: true, exposeDefaultValues: true });
  return preValidateCertificate(certificate, throwError);
}

export function asCDNCertificate(value: unknown, throwError?: boolean): CDNSchema {
  const certificate = plainToInstance(CDNSchema, value, { enableImplicitConversion: true, exposeDefaultValues: true });
  return preValidateCertificate(certificate, throwError);
}

export const castCertificatesMap = {
  [SupportedSchemas.EN10168]: asEN10168Certificate,
  [SupportedSchemas.TKR]: asTKRCertificate,
  [SupportedSchemas.ECOC]: asECoCCertificate,
  [SupportedSchemas.COA]: asCoACertificate,
  [SupportedSchemas.CDN]: asCDNCertificate,
};

export function castCertificate(certificate: Record<string, unknown>): {
  certificate: Schemas;
  type: SupportedSchemas;
} {
  if (typeof certificate === 'object' && !Array.isArray(certificate) && certificate !== null) {
    let validCertificate: Schemas;
    const supportedSchemas = Object.values(SupportedSchemas);
    for (const supportedSchema of supportedSchemas) {
      validCertificate = castCertificatesMap[supportedSchema](certificate);
      if (validCertificate) {
        return { certificate: validCertificate, type: supportedSchema };
      }
    }
    throw new Error('Could not cast the certificate to the right type');
  } else {
    throw new TypeError('Certificate must be a valid object');
  }
}
