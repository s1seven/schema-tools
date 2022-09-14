import 'reflect-metadata';

import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  registerDecorator,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
export { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { Type } from 'class-transformer';

export function isNotEmptyArrayOrObject(validationOptions?: ValidationOptions) {
  return function (object: EN10168SchemaCertificate | TKRSchemaCertificate, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyArrayOrObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return (
            (Array.isArray(value) && value.length > 0) || (typeof value === 'object' && Object.keys(value)?.length > 0)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return validationOptions?.each
            ? `each value in ${args.property} must be a non-empty array or object`
            : `${args.property}  must be a non-empty array or object`;
        },
      },
    });
  };
}

export interface ValidationError {
  root: string;
  path: string;
  keyword: string;
  schemaPath: string;
  expected: string;
}

export type SchemaTypes = `${SupportedSchemas}-schemas`;

export enum SupportedSchemas {
  TKR = 'tkr',
  EN10168 = 'en10168',
  'ECOC' = 'e-coc',
  COA = 'coa',
  CDN = 'cdn',
}

export const schemaToExternalStandardsMap = {
  [SupportedSchemas.COA]: ['Certificate.Analysis.PropertiesStandard'],
  [SupportedSchemas.EN10168]: [],
  [SupportedSchemas.ECOC]: [],
  [SupportedSchemas.CDN]: [],
  [SupportedSchemas.TKR]: [],
};

export interface SchemaConfig {
  baseUrl: string;
  schemaType: SchemaTypes;
  version: string;
}

export class BaseCertificateSchema {
  @IsUrl({ protocols: ['http', 'https'], require_tld: false, require_valid_protocol: true })
  RefSchemaUrl: string;

  [key: string]: any;
}

export enum CertificateDocumentMetadataState {
  DRAFT = 'draft',
  VALID = 'valid',
  CANCELLED = 'cancelled',
}

export class CertificateDocumentMetadata {
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  version?: number;

  @IsOptional()
  @IsEnum(CertificateDocumentMetadataState)
  state?: CertificateDocumentMetadataState;
}

export enum CertificateLanguages {
  CN = 'CN',
  DE = 'DE',
  EN = 'EN',
  ES = 'ES',
  FR = 'FR',
  PL = 'PL',
  RU = 'RU',
  IT = 'IT',
  TR = 'TR',
}

export type Languages = `${CertificateLanguages}`;

export interface Translation<S = string> {
  [group: string]: Record<string, S>;
}

export type Translations = {
  [ln in Languages]?: Translation;
};

export type ExternalStandards = `${ExternalStandardsEnum}`;

export enum ExternalStandardsEnum {
  CAMPUS = 'CAMPUS',
}

export type ExtraTranslation = { [Id: string]: Record<string, string> };

export type CampusTranslation = { Property: string; TestConditions: string };

export type CampusTranslations = {
  [ln in Languages]?: { [Id: string]: CampusTranslation };
};

export type ExternalStandardsTranslations = {
  [ExternalStandardsEnum.CAMPUS]?: CampusTranslations;
};

export type ExtraTranslations = {
  [key in ExternalStandardsEnum]?: ExternalStandardsTranslations[key];
};

export class EN10168SchemaCertificate {
  @IsEnum(CertificateLanguages, { each: true })
  CertificateLanguages: CertificateLanguages[];

  @IsNotEmptyObject()
  CommercialTransaction: Record<string, any>;

  @IsNotEmptyObject()
  ProductDescription: Record<string, any>;

  @IsOptional()
  @isNotEmptyArrayOrObject()
  Inspection: Record<string, any> | Record<string, any>[];

  @IsOptional()
  @IsNotEmptyObject()
  OtherTests?: Record<string, any>;

  @IsNotEmptyObject()
  Validation: Record<string, any>;
}
export class TKRSchemaCertificate {
  @IsEnum(CertificateLanguages, { each: true })
  CertificateLanguages: CertificateLanguages[];

  @IsNotEmptyObject()
  CommercialTransaction: Record<string, any>;

  @IsNotEmptyObject()
  ProductDescription: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  MaterialIdentifiers?: Record<string, any>[];

  @IsOptional()
  @isNotEmptyArrayOrObject()
  ChemicalComposition?: Record<string, any> | Record<string, any>[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  Inspection?: Record<string, any>[];

  @IsNotEmptyObject()
  Validation: Record<string, any>;
}

export const PartialsMapFileName = 'partials-map.json';

export class EN10168Schema extends BaseCertificateSchema {
  @IsOptional()
  @Type(() => CertificateDocumentMetadata)
  @IsNotEmptyObject()
  @ValidateNested()
  DocumentMetadata?: CertificateDocumentMetadata;

  @IsNotEmptyObject()
  @Type(() => EN10168SchemaCertificate)
  @ValidateNested()
  Certificate: EN10168SchemaCertificate;
}
export class TKRSchema extends BaseCertificateSchema {
  @IsNotEmptyObject()
  @Type(() => TKRSchemaCertificate)
  @ValidateNested()
  Certificate: TKRSchemaCertificate;
}

export class ECoCSchema extends BaseCertificateSchema {
  @IsString()
  Id: string;

  @IsUUID()
  Uuid: string;

  @IsOptional()
  @IsString()
  URL: string;

  @IsNotEmptyObject()
  EcocData: Record<string, any>;
}

export class CoASchemaCertificate {
  @IsEnum(CertificateLanguages, { each: true })
  CertificateLanguages: CertificateLanguages[];

  @IsString()
  Id: string;

  @IsDateString()
  Date: string;

  @IsOptional()
  @IsString()
  Type?: string;

  @IsOptional()
  @IsNotEmptyObject()
  Standards?: { Type?: string; Norm: string };

  @IsOptional()
  @IsArray()
  Contacts?: any;

  @IsNotEmptyObject()
  Parties: Record<string, any>;

  @ValidateIf((o) => typeof o.BusinessTransaction === 'undefined')
  @IsNotEmptyObject()
  BusinessReferences: Record<string, any>;

  @ValidateIf((o) => typeof o.BusinessReferences === 'undefined')
  @IsNotEmptyObject()
  BusinessTransaction: Record<string, any>;

  @IsNotEmptyObject()
  Product: Record<string, any>;

  @ValidateIf((o) => typeof o.Analysis === 'undefined')
  @IsArray()
  Inspections: Record<string, any>;

  @ValidateIf((o) => typeof o.Inspections === 'undefined')
  @IsNotEmptyObject()
  Analysis: Record<string, any>;

  @IsNotEmptyObject()
  DeclarationOfConformity: Record<string, any>;

  @IsOptional()
  @IsArray()
  Attachments?: any;
}

export class CoASchema extends BaseCertificateSchema {
  @IsOptional()
  @Type(() => CertificateDocumentMetadata)
  @IsNotEmptyObject()
  @ValidateNested()
  DocumentMetadata?: CertificateDocumentMetadata;

  @IsNotEmptyObject()
  @Type(() => CoASchemaCertificate)
  @ValidateNested()
  Certificate: CoASchemaCertificate;
}

export class CDNSchemaCertificate {
  @IsEnum(CertificateLanguages, { each: true })
  CertificateLanguages: CertificateLanguages[];

  @IsNotEmptyObject()
  Parties: Record<string, any>;

  @ValidateIf((o) => typeof o.BusinessTransaction === 'undefined')
  @IsNotEmptyObject()
  BusinessReferences: Record<string, any>;

  @ValidateIf((o) => typeof o.BusinessReferences === 'undefined')
  @IsNotEmptyObject()
  BusinessTransaction: Record<string, any>;

  @IsNotEmptyObject()
  Product: Record<string, any>;

  @IsArray()
  Certificates: Record<string, any>[];
}

export class CDNSchema extends BaseCertificateSchema {
  @IsOptional()
  @Type(() => CertificateDocumentMetadata)
  @IsNotEmptyObject()
  @ValidateNested()
  DocumentMetadata?: CertificateDocumentMetadata;

  @IsNotEmptyObject()
  @Type(() => CDNSchemaCertificate)
  @ValidateNested()
  CertificateDeliveryNote: CDNSchemaCertificate;
}

export type Schemas = TKRSchema | EN10168Schema | CoASchema | CDNSchema | ECoCSchema;
