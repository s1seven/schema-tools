export interface ValidationError {
  root: string;
  path: string;
  keyword: string;
  schemaPath: string;
  expected: string;
}

export interface BaseCertificateSchema {
  RefSchemaUrl: string;
  [key: string]: any;
}

export interface EN10168Schema extends BaseCertificateSchema {
  DocumentMetadata?: any;
  Certificate: {
    CertificateLanguages: any;
    CommercialTransaction: any;
    ProductDescription: any;
    Inspection: any;
    OtherTests: any;
    Validation: any;
  };
}

export interface ECoCSchema extends BaseCertificateSchema {
  Id: string;
  Uuid: string;
  URL: string;
  EcocData: any;
}

export type SchemaTypes = 'en10168-schemas' | 'e-coc-schemas';
