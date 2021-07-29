export type PartyRole =
  | 'Certifier'
  | 'Customer'
  | 'InspectionParty'
  | 'Manufacturer'
  | 'Processor'
  | 'Recipient'
  | 'Requester'
  | 'Supplier'
  | 'TestLab';
/**
 * Additional Properties Name/ValueArray not covered by standard references
 */
export type AddProperties = {
  Name?: string;
  Value?: string[];
  [k: string]: any;
}[];
/**
 * List of applicable standards
 */
export type NormativeRef = string[];
export type SnStructure = {
  FinishedCustSn?: string;
  FinishedProdSn?: string;
  MaterialSupplierSn?: string;
  MaterialProdSn?: string;
  [k: string]: any;
}[];
/**
 * Typically technical Properties Name/ValueArray not covered by standard references
 */
export type TechnicalProperties = {
  Name?: string;
  Value?:
    | number
    | string
    | [number]
    | [number, number]
    | [string]
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]
    | [string, string, string, string, string]
    | [string, string, string, string, string, string];
  /**
   * To be defined - this should be physical metric units which are typical in materials science, enum will be long
   */
  Unit?: string;
  /**
   * ValueType may be used by applications for further processing, validations
   */
  ValueType?: 'Integer' | 'Float' | 'Time' | 'DateRange' | 'NumberRange' | 'TimeRange' | 'String';
}[];

/**
 * electronicCertificateOfConformity
 */
export interface ECoC {
  /**
   * Issuer's Identifier
   */
  Id?: string;
  /**
   * UUID according RFC4122 for unique company independent COC reference
   */
  Uuid?: string;
  /**
   * URL for future usage (e.g Download-Link) or Link to public WebService
   */
  URL?: string;
  /**
   * Url-link to schema the json is based upon - same value as $id of schema
   */
  RefSchemaUrl: string;
  EcocData:
    | {
        DataLevel?: 'A';
        [k: string]: any;
      }
    | {
        DataLevel?: 'B';
        Data: HigherDataLevel;
        [k: string]: any;
      }
    | {
        DataLevel?: 'C';
        Data: HigherDataLevel;
        Results: Results;
        [k: string]: any;
      };
  Declaration?: {
    DateOfIssue?: string;
    Concessions?: string[];
    Remarks?: string[];
    ConformityStatus?: 'True' | 'False' | 'WithConcessions';
    Signature?: {
      SignerName?: string;
      SignerPosition?: string;
      PartyRefOfSigner?: string;
      SignatureStamp?: string;
      SignatureDate?: string;
      [k: string]: any;
    };
    CocConfirmationText?: [string, ...string[]];
    [k: string]: any;
  };
  Attachment?: Attachment;
}
export interface HigherDataLevel {
  /**
   * Product: CoC acc. ISO17050 | Material: DIN EN 10204 | LabTest: Exchange of Lab-Certificates
   */
  EcocType?:
    | 'Product'
    | 'Process'
    | 'MaterialCertificate2.1'
    | 'MaterialCertificate2.2'
    | 'MaterialCertificate3.1'
    | 'MaterialCertificate3.2'
    | 'LabTest';
  /**
   * Parties and partners envolved in CoC
   */
  Parties?: [Party, ...Party[]];
  /**
   * References to Business Case
   */
  BusinessRef?: {
    StandardReferences?: Reference[];
    AdditionalReferences?: AddProperties;
  };
  NormativeRef?: NormativeRef;
  /**
   * Designates the parts/material/latest this document is assigned to
   */
  ObjectOfDeclaration?: [Object, ...Object[]];
}
export interface Party {
  /**
   * For ease of reference in object of declaration
   */
  PartyNo?: number;
  PartyName: string;
  PartyIdentifier?: [CompanyIdentifier, ...CompanyIdentifier[]];
  PartyAddress: Address;
  PartyRole?: PartyRole;
  AdditionalPartyProperties?: AddProperties;
}
/**
 * unique id for identifying party
 */
export interface CompanyIdentifier {
  NameOfIdentifier?: 'DUNS' | 'VATID' | 'CageCode' | 'CustomerNo' | 'SupplierNo';
  ValueOfIdentifier?: string;
}
export interface Address {
  StreetAddress: string;
  City: string;
  State?: string;
  PostalCode: string;
  CountryCode: string;
  AddAddressLine?: string;
}
export interface Reference {
  /**
   * Name of business case reference
   */
  Name?:
    | 'OrderNo'
    | 'OrderPosition'
    | 'DeliveryNote'
    | 'OrderDate'
    | 'CustomerOrderNo'
    | 'DeliveryDate';
  /**
   * Value of business case reference
   */
  Value?: string;
  [k: string]: any;
}
/**
 * Defines a single part, process,...
 */
export interface Object {
  /**
   * unique id for further reference purposes
   */
  ObjectId?: string;
  ObjectName?: string;
  /**
   * Either Material, Part, Assembly, Test,..
   */
  ObjectType?:
    | 'Assembly'
    | 'ExternalProcess'
    | 'InternalProcess'
    | 'Material'
    | 'MaterialTest'
    | 'Part'
    | 'RelatedPart'
    | 'StandardPart'
    | 'Other';
  Quantities?: Quantity[];
  Dimensions?: Dimension[];
  NormativeRef?: NormativeRef;
  SerialNr?: SnStructure;
  /**
   * UUID of CoC valid for this object
   */
  RefCoC?: {
    RefCocId?: string;
    /**
     * Url to referenced Document (e.g. for Download)
     */
    RefUrl?: string;
    SubDocument?: Attachment;
  };
  /**
   * referenced to party in party-Structure
   */
  PartyRefId?: number;
  /**
   * reference to ObjectId of related item
   */
  ReferencedObjects?: number[];
  ObjectProperties?: {
    Name?:
      | 'PartNo'
      | 'BatchNo'
      | 'DrawingNo'
      | 'CastNo'
      | 'PackageNo'
      | 'OrderConfPosition'
      | 'Material'
      | 'Form'
      | 'Temper'
      | 'Other';
    Value?: string[];
    [k: string]: any;
  }[];
  AdditionalObjectProperties?: TechnicalProperties;
  additionalObjects?: Object;
}
export interface Quantity {
  Amount?: number;
  /**
   * Abbreviation of Unit according to https://www.doa.la.gov/osp/Vendorcenter/publications/unitofmeasurecodes.pdf
   */
  Unit?: string;
  [k: string]: any;
}
export interface Dimension {
  Direction?: 'Length' | 'Width' | 'Height';
  DimValue?: number;
  DimUnit?: string;
  [k: string]: any;
}
export interface Attachment {
  FileName?: string;
  /**
   * MimeType according to IETF's RFC 6838.
   */
  FileType?: string;
  Encoding?: 'base64';
  /**
   * File content encoded according RFC 2548 - Base64
   */
  Data?: string;
  /**
   * chacksum/Hash algorithm
   */
  HashAlgorithm?: 'SHA1' | 'MD5';
  HashValue?: string;
  [k: string]: any;
}
export interface Results {
  MaterialCertification?: {
    NameOfTest?: string;
    TestStandardOrMethod?: string;
    NumberOfTests?: number;
    RefObjectIDs?: string[];
    SampleNumber?: string;
    SamplePositionAcrossWidth?: string;
    SamplePositionAlongLength?: string;
    SamplePositionThroughThickness?: string;
    TestOK?: boolean;
    TestValues?: {
      ValueName?: string;
      Unit?: string;
      TypeOfValue?: string;
      SpecMin?: string;
      SpecMax?: string;
      ActualFrom?: string;
      ActualTo?: string;
      [k: string]: any;
    }[];
    Document?: {
      FileName?: string;
      /**
       * MimeType according to IETF's RFC 6838.
       */
      FileType?: string;
      Encoding?: 'base64';
      /**
       * File content encoded according RFC 2548 - Base64
       */
      Data?: string;
      /**
       * chacksum/Hash algorithm
       */
      HashAlgorithm?: 'SHA1' | 'MD5';
      HashValue?: string;
      [k: string]: any;
    };
    [k: string]: any;
  }[];
  ChemicalAnalysis?: [
    {
      /**
       * Heat number of initial melt
       */
      Heat?: string;
      /**
       * Sample no. or any type of identification of the sample
       */
      Sample?: string;
      /**
       * If the sample is taken from a specific area of the test piece, e.g. top or bottom
       */
      Location?: string;
      /**
       * Share of element
       */
      Values: [
        {
          /**
           * The symbol of the element
           */
          Symbol: string;
          /**
           * The measured part of the element as absolute number.
           */
          ActualFrom: number;
          /**
           * The measured part of the element as absolute number.
           */
          ActualTo?: number;
          /**
           * The minimum if defined by the product specification, otherwise the element must not provided.
           */
          Minimum?: number;
          /**
           * The maximum as defined by the product specification.
           */
          Maximum?: number;
          /**
           * The technology (or norm) used, e.g. COM, XRF, OES etc.
           */
          TestMethod?: string;
        },
        ...{
          /**
           * The symbol of the element
           */
          Symbol: string;
          /**
           * The measured part of the element as absolute number.
           */
          ActualFrom: number;
          /**
           * The measured part of the element as absolute number.
           */
          ActualTo?: number;
          /**
           * The minimum if defined by the product specification, otherwise the element must not provided.
           */
          Minimum?: number;
          /**
           * The maximum as defined by the product specification.
           */
          Maximum?: number;
          /**
           * The technology (or norm) used, e.g. COM, XRF, OES etc.
           */
          TestMethod?: string;
        }[]
      ];
      /**
       * The standard/norm the test was conducted in accordance to
       */
      Standards?: string[];
    },
    ...{
      /**
       * Heat number of initial melt
       */
      Heat?: string;
      /**
       * Sample no. or any type of identification of the sample
       */
      Sample?: string;
      /**
       * If the sample is taken from a specific area of the test piece, e.g. top or bottom
       */
      Location?: string;
      /**
       * Share of element
       */
      Values: [
        {
          /**
           * The symbol of the element
           */
          Symbol: string;
          /**
           * The measured part of the element as absolute number.
           */
          ActualFrom: number;
          /**
           * The measured part of the element as absolute number.
           */
          ActualTo?: number;
          /**
           * The minimum if defined by the product specification, otherwise the element must not provided.
           */
          Minimum?: number;
          /**
           * The maximum as defined by the product specification.
           */
          Maximum?: number;
          /**
           * The technology (or norm) used, e.g. COM, XRF, OES etc.
           */
          TestMethod?: string;
        },
        ...{
          /**
           * The symbol of the element
           */
          Symbol: string;
          /**
           * The measured part of the element as absolute number.
           */
          ActualFrom: number;
          /**
           * The measured part of the element as absolute number.
           */
          ActualTo?: number;
          /**
           * The minimum if defined by the product specification, otherwise the element must not provided.
           */
          Minimum?: number;
          /**
           * The maximum as defined by the product specification.
           */
          Maximum?: number;
          /**
           * The technology (or norm) used, e.g. COM, XRF, OES etc.
           */
          TestMethod?: string;
        }[]
      ];
      /**
       * The standard/norm the test was conducted in accordance to
       */
      Standards?: string[];
    }[]
  ];
  [k: string]: any;
}
