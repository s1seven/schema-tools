/**
 * The
 */
export type CertificateLanguages =
  | ['EN' | 'DE' | 'FR' | 'ES' | 'PL' | 'CN']
  | ['EN' | 'DE' | 'FR' | 'ES' | 'PL' | 'CN', 'EN' | 'DE' | 'FR' | 'ES' | 'PL' | 'CN'];
/**
 * The type of EN 10204 certificate
 */
export type Types = '2.1' | '2.2' | '3.1' | '3.2';

/**
 * Certificates of Analysis for plastics and other materials.
 */
export interface Certificate {
  /**
   * The URL linking to the JSON schema version the certificate JSON is based on.
   */
  RefSchemaUrl: string;
  Certificate: {
    CertificateLanguages: CertificateLanguages;
    /**
     * The certificate identifier, usually a number.
     */
    Id: string;
    /**
     * The issuing date
     */
    Date: string;
    Type?: Types;
    /**
     * Contact persons
     */
    Contacts?: Person[];
    Parties: Parties;
    BusinessTransaction: BusinessTransaction;
    Product: Product;
    /**
     * An array with all inspections of the product.
     */
    Analysis: {
      Inspections?: [Inspection, ...Inspection[]];
      /**
       * An array of additional free text information.
       */
      AdditionalInformation?: string[];
      [k: string]: any;
    };
    DeclarationOfConformity: DeclarationOfConformity;
    /**
     * An optional array with data attached to the certificate in encoded form.
     */
    Attachments?: Attachment[];
    /**
     * The logo of the manufacturer as base64 png file. The maximum size is <TBD>
     */
    Logo?: string;
  };
}
/**
 * A brief description of a natural person.
 */
export interface Person {
  Name?: string;
  /**
   * The role of the person in the business process, e.g. 'Quality Manager' or 'Acceptance Office'
   */
  Role?: string;
  /**
   * The department the person is associated with, eg. 'Factory Production Control'
   */
  Department?: string;
  Email?: string;
  Phone?: string;
  Fax?: string;
}
/**
 * The companies involved in the transaction
 */
export interface Parties {
  Manufacturer: Company;
  Customer: Company1;
  ConsigneeOfGoods?: Company2;
  ConsigneeOfCertificate?: Company3;
}
/**
 * The party manufacturing the goods and selling them to the customer.
 */
export interface Company {
  Name: string;
  Street: string;
  ZipCode: string;
  City: string;
  /**
   * The two-letter ISO country code according https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2.
   */
  Country: string;
  Email: string;
  Identifier: Identifier;
  /**
   * An array of additional free text information on the company.
   */
  AdditionalInformation?: string[];
  [k: string]: any;
}
/**
 * One or more unique company identifiers.
 */
export interface Identifier {
  /**
   * This is the unique number that identifies a taxable person (business) or non-taxable legal entity that is registered for VAT, see https://ec.europa.eu/taxation_customs/business/vat/eu-vat-rules-topic/vat-identification-numbers_en
   */
  VAT: string;
  /**
   * The Dun & Bradstreet D‑U‑N‑S Number is a unique nine-digit identifier for businesses, https://www.dnb.com/duns-number.html
   */
  DUNS?: string;
  /**
   * The Commercial and Government Entity Code (short CAG), is a unique identifier assigned to suppliers to various government or defense agencies, https://en.wikipedia.org/wiki/Commercial_and_Government_Entity_code
   */
  CageCode?: string;
}
/**
 * The party buying the goods from the manufacturer.
 */
export interface Company1 {
  Name: string;
  Street: string;
  ZipCode: string;
  City: string;
  /**
   * The two-letter ISO country code according https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2.
   */
  Country: string;
  Email: string;
  Identifier: Identifier;
  /**
   * An array of additional free text information on the company.
   */
  AdditionalInformation?: string[];
  [k: string]: any;
}
/**
 * The party receiving the goods for the customer, e.g. freight fowarding agent.
 */
export interface Company2 {
  Name: string;
  Street: string;
  ZipCode: string;
  City: string;
  /**
   * The two-letter ISO country code according https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2.
   */
  Country: string;
  Email: string;
  Identifier: Identifier;
  /**
   * An array of additional free text information on the company.
   */
  AdditionalInformation?: string[];
  [k: string]: any;
}
/**
 * The party receiving the certificates for the customer, e.g. a third party inspection service.
 */
export interface Company3 {
  Name: string;
  Street: string;
  ZipCode: string;
  City: string;
  /**
   * The two-letter ISO country code according https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2.
   */
  Country: string;
  Email: string;
  Identifier: Identifier;
  /**
   * An array of additional free text information on the company.
   */
  AdditionalInformation?: string[];
  [k: string]: any;
}
/**
 * References to order and delivery
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
   * The order number.
   */
  Number: string;
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
   * The internal order number issued at the manufacturer.
   */
  InternalOrderNumber?: string;
  /**
   * The position on the internal order issued at the manufacturer.
   */
  InternalOrderPosition?: string;
}
/**
 * Optional information about the order confirmation sent by the manufacturer to the customer.
 */
export interface OrderConfirmation {
  /**
   * The number of the order confirmation.
   */
  Number: string;
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
   * The number of the delivery note.
   */
  Number: string;
  /**
   * The date of issuing the delivery note.
   */
  Date?: string;
  /**
   * The shipped quantity.
   */
  Quantity?: number;
  /**
   * The unit of the shipped quantity.
   */
  QuantityUnit?: string;
  /**
   * The position on the delivery note.
   */
  Position?: string;
  /**
   * A reference to the transport, e.g. the license plates of trucks or container numbers
   */
  Transport?: string[];
  /**
   * The number for the goods receipt issued by the Customer or ConsigneeOfGoods
   */
  GoodsReceiptNumber?: string;
}
/**
 * The product description
 */
export interface Product {
  /**
   * The number of the product at the manufacturer.
   */
  Number?: string;
  /**
   * The name of the product as given by the manufacturer, the trade name.
   */
  Name: string;
  /**
   * The number for the product issued by the customer.
   */
  CustomerProductNumber?: string;
  /**
   * The two-letter ISO country code of the country in which the product was manufactured.
   */
  CountryOfOrigin?: string;
  /**
   * The location of the plant in which the product was manufactured.
   */
  PlaceOfOrigin?: string;
  /**
   * The number identifying the batch/lot/charge of production.
   */
  ChargeNumber: string;
  /**
   * The day on which the product was manufactured.
   */
  ProductionDate?: string;
  /**
   * The list of standards to which the product conforms.
   */
  Standards?: string[];
  /**
   * An array of additional free text information on the product.
   */
  AdditionalInformation?: string[];
}
/**
 * A structure to specify any kind of measurements as defined by https://www.campusplastics.com/campushome/coc
 */
export interface Inspection {
  /**
   * The property measured.
   */
  Property: string;
  /**
   * A subset of the property measured.
   */
  SubProperty?: string;
  /**
   * https://www.campusplastics.com defines numeric codes for properties used industry-wide
   */
  CAMPUSPropertyId?: number;
  /**
   * The symbol describing the property.
   */
  Symbol?: string;
  /**
   * The reference to the definition of the method such as EN or ISO norms.
   */
  Method: string;
  /**
   * A measured or calculated Value (e.g. mean of individual measurements).
   */
  Value: number;
  /**
   * The lower limit according the specification. If not provided it could be 0 or -∞.
   */
  Minimum?: number;
  /**
   * The upper limit according the specification. If not provided it is ∞.
   */
  Maximum?: number;
  /**
   * The unit of the value.
   */
  Unit: string;
  /**
   * Further instructions describing the exact procedure of the measurement.
   */
  SupplementaryInstructions?: string;
  /**
   * A description of the conditions under which the test was executed.
   */
  TestConditions?: string;
  /**
   * A field specifically for testing MFR to be provided in degree Celsius
   */
  Temperature?: number;
  /**
   * A field specifically for testing MFR to be provided in kg
   */
  Weight?: number;
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
 * In case the manufacturer must
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
  DoCYear: string;
  /**
   * The declaration of conformance document number
   */
  DoCNumber: string;
}
/**
 * Additional data in any kind of format attached to JSON document.
 */
export interface Attachment {
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
