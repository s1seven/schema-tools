import 'reflect-metadata';

import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
/* eslint-disable @typescript-eslint/no-explicit-any */
export { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { Type } from 'class-transformer';

export interface ValidationError {
  root: string;
  path: string;
  keyword: string;
  schemaPath: string;
  expected: string;
}

export type SchemaTypes = `${SupportedSchemas}-schemas`;

export enum SupportedSchemas {
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

  @IsNotEmptyObject()
  Inspection: Record<string, any>;

  @IsOptional()
  @IsNotEmptyObject()
  OtherTests?: Record<string, any>;

  @IsNotEmptyObject()
  Validation: Record<string, any>;
}

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

export type Schemas = EN10168Schema | CoASchema | CDNSchema | ECoCSchema;
