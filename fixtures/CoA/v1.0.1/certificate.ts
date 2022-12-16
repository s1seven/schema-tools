/**
 * For a JSON document one or two translations used in the rendering of HTML and PDF documents can be specificed.
 */
export type CertificateLanguages =
  | ['EN' | 'DE' | 'FR' | 'ES' | 'PL' | 'CN' | 'TR' | 'IT']
  | ['EN' | 'DE' | 'FR' | 'ES' | 'PL' | 'CN' | 'TR' | 'IT', 'EN' | 'DE' | 'FR' | 'ES' | 'PL' | 'CN' | 'TR' | 'IT'];
/**
 * The party manufacturing the goods and selling them to the customer.
 */
export type Company = Company1;
export type Company1 = (
  | {
      Name: string;
      [k: string]: any;
    }
  | {
      CompanyName: string;
      [k: string]: any;
    }
) & {
  /**
   * Address of the company
   */
  Street: [string] | [string, string] | [string, string, string] | string;
  [k: string]: any;
} & {
  Identifiers?:
    | {
        VAT: string;
        [k: string]: any;
      }
    | {
        DUNS: string;
        [k: string]: any;
      };
  [k: string]: any;
};
/**
 * The party buying the goods from the manufacturer.
 */
export type Company2 = Company1;
/**
 * The party receiving the certificate for the customer, e.g. a freight fowarding agent or a subsidiary of the customer.
 */
export type Company3 = Company1;
/**
 * The party receiving the goods for the customer, e.g. a freight fowarding agent or a subsidiary of the customer.
 */
export type Company4 = Company1;
export type Attachment = Attachment1;
/**
 * A general disclaimer for the entire document
 */
export type Disclaimer = string;

/**
 * Certificates of Analysis for plastics and other materials.
 */
export interface Certificate {
  RefSchemaUrl: string;
  /**
   * The certificate information object
   */
  Certificate: {
    /**
     * The languages in which the certificate should be rendered in HTML and PDF.
     */
    CertificateLanguages: CertificateLanguages;
    /**
     * The certificate identifier, usually a number.
     */
    Id: string;
    /**
     * The certificate issuing date.
     */
    Date: string;
    Standard: CertificateType;
    /**
     * Contact persons
     */
    Contacts?: Person[];
    Parties: Parties;
    BusinessTransaction: BusinessTransaction;
    Product: Product;
    /**
     * All inspections of the product.
     */
    Analysis?: {
      /**
       * The lot identifier of the inspection example.
       */
      LotId?: string;
      /**
       * The inspection properties of the certificate according to a standard. Not rendered on the certificate.
       */
      PropertiesStandard?: 'CAMPUS';
      Inspections?: [Inspection, ...Inspection[]];
      /**
       * An array of additional free text information.
       */
      AdditionalInformation?: [string, ...string[]];
      [k: string]: any;
    };
    DeclarationOfConformity: DeclarationOfConformity;
    /**
     * An optional array with data attached to the certificate in encoded form.
     */
    Attachments?: [Attachment, ...Attachment[]];
    /**
     * The logo of the manufacturer as base64 png file.
     */
    Logo: string;
    Disclaimer?: Disclaimer;
  };
}
/**
 * The type of the certificate.
 */
export interface CertificateType {
  /**
   * The standard on which the certificate is based.
   */
  Norm: string;
  /**
   * In case the standard defines categories of certificates e.g. EN 10204 3.1
   */
  Type?: string;
  [k: string]: any;
}
/**
 * A brief description of a natural person.
 */
export interface Person {
  Name: string;
  /**
   * The role of the person in the business process, e.g. 'Quality Manager' or 'Acceptance Office'
   */
  Role: string;
  /**
   * The department the person is associated with, eg. 'Factory Production Control'
   */
  Department: string;
  Email: string;
  Phone: string;
}
/**
 * The companies involved in the transaction.
 */
export interface Parties {
  Manufacturer: Company;
  Customer: Company2;
  Receiver?: Company3;
  GoodsReceiver?: Company4;
}
/**
 * References to order and delivery.
 */
export interface BusinessTransaction {
  Order: Order;
  OrderConfirmation?: OrderConfirmation;
  Delivery: Delivery;
}
/**
 * Information about the order submiited by the customer to the manufacturer.
 */
export interface Order {
  /**
   * The order identification.
   */
  Id: string;
  /**
   * The order position number.
   */
  Position?: string;
  /**
   * The date of issuing the order
   */
  Date?: string;
  /**
   * The order quantity
   */
  Quantity?: number;
  /**
   * The unit of the order quantity
   */
  QuantityUnit?: string;
  /**
   * The internal product identifer of the Customer
   */
  CustomerProductId?: string;
  /**
   * The number for the goods receipt issued by the Customer or Receiver
   */
  CustomerProductName?: string;
  /**
   * The identifier for the goods receipt issued by the Customer.
   */
  GoodsReceiptId?: string;
}
/**
 * Optional information about the order confirmation sent by the manufacturer to the customer.
 */
export interface OrderConfirmation {
  /**
   * The identifier of the order confirmation.
   */
  Id: string;
  /**
   * The date of order confirmation issuance.
   */
  Date?: string;
}
/**
 * The information from the delivery note.
 */
export interface Delivery {
  /**
   * The identifier of the delivery note.
   */
  Id: string;
  /**
   * The position on the delivery note.
   */
  Position?: string;
  /**
   * The date of issuing the delivery note.
   */
  Date?: string;
  /**
   * The shipped quantity.
   */
  Quantity: number;
  /**
   * The unit of the shipped quantity.
   */
  QuantityUnit: string;
  /**
   * The internal order number issued at the manufacturer.
   */
  InternalOrderId?: string;
  /**
   * The position on the internal order issued at the manufacturer.
   */
  InternalOrderPosition?: string;
  /**
   * A reference to the transport, e.g. the license plates of trucks or container numbers
   */
  Transport?: string[];
}
/**
 * The product description
 */
export interface Product {
  /**
   * The number of the product at the manufacturer.
   */
  Id?: string;
  /**
   * The name of the product as given by the manufacturer, the trade name.
   */
  Name: string;
  /**
   * The two-letter ISO country code of the country in which the product was manufactured.
   */
  CountryOfOrigin?: string;
  /**
   * The location of the plant in which the product was manufactured.
   */
  PlaceOfOrigin?: string;
  /**
   * The identifer of the batch/lot/charge of filling into transport.
   */
  FillingBatchId: string;
  /**
   * The date of filling into transport container.
   */
  FillingBatchDate?: string;
  /**
   * The production batch identifer.
   */
  ProductionBatchId?: string;
  /**
   * The day on which the product was manufactured.
   */
  ProductionDate?: string;
  /**
   * The list of standards to which the product conforms.
   */
  Standards?: [string, ...string[]];
  /**
   * The day on which the product becomes unusable.
   */
  ExpirationDate?: string;
  /**
   * An array of additional free text information on the product.
   */
  AdditionalInformation?: [string, ...string[]];
}
/**
 * A structure to specify any kind of measurements. It follows the structure as defined by CAMPUS (https://www.campusplastics.com)
 */
export interface Inspection {
  /**
   * The identifier of the property according to the definition provided in 'PropertiesStandard'. Used for mapping of translations of `Property`.
   */
  PropertyId?: string;
  /**
   * The property measured.
   */
  Property: string;
  /**
   * The reference to the definition of the method such as EN, ISO or factory standards.
   */
  Method: string;
  /**
   * A measured or calculated Value (e.g. mean of individual measurements).
   */
  Value: string;
  /**
   * The data type of the measured value.
   */
  ValueType: 'string' | 'number' | 'date' | 'date-time' | 'boolean';
  /**
   * The lower limit according the specification. If a numeric value and not provided it can be 0 or -∞.
   */
  Minimum?: string;
  /**
   * The upper limit according the specification. If a numeric value and not provided it can be ∞.
   */
  Maximum?: string;
  /**
   * The unit of the value.
   */
  Unit?: string;
  /**
   * A description of the conditions under which the test was executed.
   */
  TestConditions?: string;
}
/**
 * The statements declaring confirmity and optional CE
 */
export interface DeclarationOfConformity {
  /**
   * The statement declaring conformity
   */
  Declaration: string;
  CE?: CEMarking;
}
/**
 * For products which require CE marking.
 */
export interface CEMarking {
  /**
   * The CE image as base64 encoded png file. A default with size 90x65 is provided by example
   */
  CE_Image: string;
  /**
   * The identification number of the Notified body. Refer to https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=CELEX:31993L0068:en:HTML and https://ec.europa.eu/growth/tools-databases/nando/index.cfm?fuseaction=notifiedbody.main
   */
  NotifiedBodyNumber: string;
  /**
   * The year when the declaration of conformance was issued
   */
  YearDocumentIssued: string;
  /**
   * The declaration of conformance document number
   */
  DocumentNumber: string;
}
/**
 * Additional data in any kind of format attached to JSON document.
 */
export interface Attachment1 {
  Hash: Hash;
  /**
   * The name of the file.
   */
  FileName: string;
  /**
   * The MIME/Type of the data file.
   */
  'MIME-Type': string;
  /**
   * The format in which the hash value is encoded.
   */
  Encoding: string;
  /**
   * The data encoded as defined in `Encoding`
   */
  Data: string;
}
/**
 * The hash of unencoded data file.
 */
export interface Hash {
  /**
   * The algorithm selected to calculate the hash value.
   */
  Algorithm: 'SHA256' | 'SHA3-256';
  /**
   * The format in which the hash value is encoded.
   */
  Encoding: 'base64' | 'hex';
  /**
   * The hash value.
   */
  Value: string;
  [k: string]: any;
}
