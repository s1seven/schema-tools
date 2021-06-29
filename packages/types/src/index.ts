import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
/* eslint-disable @typescript-eslint/no-explicit-any */
export { JSONSchema7, JSONSchema7Definition } from 'json-schema';

export type SchemaTypes = 'en10168-schemas' | 'e-coc-schemas' | 'coa-schemas' | 'cdn-schemas';

export class BaseCertificateSchema {
  @IsUrl({ protocols: ['http', 'https'], require_tld: false, require_protocol: true })
  RefSchemaUrl: string;

  [key: string]: any;
}

export enum CertificateDocumentMetadataState {
  DRAFT = 'draft',
  VALID = 'valid',
  CANCELLED = 'cancelled',
}

export class CertificateDocumentMetadata {
  id: string;
  version?: number;
  state?: CertificateDocumentMetadataState;
}

export type Languages = 'EN' | 'DE' | 'FR' | 'PL' | 'RU';

export type Translations = {
  [key in Languages]?: Record<string, any>;
};

export enum CertificateLanguages {
  EN = 'EN',
  DE = 'DE',
  FR = 'FR',
  PL = 'PL',
  RU = 'RU',
}

export class EN10168SchemaCertificate {
  @IsEnum(CertificateLanguages, { each: true })
  CertificateLanguages: CertificateLanguages[];

  @IsNotEmptyObject()
  CommercialTransaction: Record<string, any>;

  @IsNotEmptyObject()
  ProductDescription: Record<string, any>;

  @IsNotEmptyObject()
  Inspection: Record<string, any>;

  @IsNotEmptyObject()
  OtherTests: Record<string, any>;

  @IsNotEmptyObject()
  Validation: Record<string, any>;
}

export class EN10168Schema extends BaseCertificateSchema {
  @IsOptional()
  @IsEnum(CertificateDocumentMetadata)
  DocumentMetadata?: CertificateDocumentMetadata;

  @Type(() => EN10168SchemaCertificate)
  @ValidateNested()
  Certificate: EN10168SchemaCertificate;
}

export class ECoCSchema extends BaseCertificateSchema {
  @IsString()
  Id: string;

  @IsUUID()
  Uuid: string;

  @IsUrl()
  URL: string;

  @IsNotEmptyObject()
  EcocData: Record<string, any>;
}

export class CoASchemaCertificate {
  @IsEnum(CertificateLanguages, { each: true })
  CertificateLanguages: CertificateLanguages[];

  @IsString()
  Number: string;

  @IsDateString()
  Date: string;

  @IsOptional()
  @IsString()
  Type?: string;

  @IsOptional()
  @IsArray()
  Contacts?: any;

  @IsNotEmptyObject()
  Parties: Record<string, any>;

  @IsNotEmptyObject()
  BusinessReferences: Record<string, any>;

  @IsNotEmptyObject()
  Product: Record<string, any>;

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
  @IsEnum(CertificateDocumentMetadata)
  DocumentMetadata?: CertificateDocumentMetadata;

  @Type(() => CoASchemaCertificate)
  @ValidateNested()
  Certificate: CoASchemaCertificate;
}

export class CDNSchemaCertificate {
  @IsEnum(CertificateLanguages, { each: true })
  CertificateLanguages: CertificateLanguages[];

  @IsNotEmptyObject()
  Parties: Record<string, any>;

  @IsNotEmptyObject()
  BusinessReferences: Record<string, any>;

  @IsNotEmptyObject()
  Product: Record<string, any>;

  @IsArray()
  Certificates: Record<string, any>[];
}
export class CDNSchema extends BaseCertificateSchema {
  @IsOptional()
  @IsEnum(CertificateDocumentMetadata)
  DocumentMetadata?: CertificateDocumentMetadata;

  @Type(() => CDNSchemaCertificate)
  @ValidateNested()
  CertificateDeliveryNote: CDNSchemaCertificate;
}

export interface ValidationError {
  root: string;
  path: string;
  keyword: string;
  schemaPath: string;
  expected: string;
}

export interface SchemaConfig {
  baseUrl: string;
  schemaType: SchemaTypes;
  version: string;
}
