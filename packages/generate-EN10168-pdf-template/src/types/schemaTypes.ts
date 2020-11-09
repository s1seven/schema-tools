export type CertificateLanguages = ['EN' | 'DE' | 'FR' | 'PL'] | ['EN' | 'DE' | 'FR' | 'PL', 'EN' | 'DE' | 'FR' | 'PL'];
export type ProductShape =
    | Tube
    | RectangularTube
    | QuadraticTube
    | Pipe
    | RectangularPipe
    | Coil
    | RoundBar
    | HexagonalBar
    | FlatBar
    | Other;

export interface Certificate {
    RefSchemaUrl: string;
    DocumentMetadata?: MetaData;
    Certificate: {
        CertificateLanguages: CertificateLanguages;
        CommercialTransaction: CommercialTransaction;
        ProductDescription: ProductDescription;
        Inspection: Inspection;
        OtherTests: OtherTests;
        Validation: Validation;
    };
}
export interface MetaData {
    id: string;
    version?: number;
    state?: 'draft' | 'valid' | 'cancelled';
    [k: string]: any;
}
export interface CommercialTransaction {
    /**
     * The manufacturer's works which delivers the certificate along the product
     */
    A01?: Company;
    /**
     * The type of inspection document, e.g. 'EN 10204 3.1 Certificate'
     */
    A02?: string;
    /**
     * The document number of the certifcate
     */
    A03?: string;
    /**
     * The mark of the manufacturer as base64 png file. The maximum size is <TBD>
     */
    A04?: string;
    /**
     * The originator of the document, not necessarily equal to A01
     */
    A05?: string;
    /**
     * The purchaser of the product and receiver of the certificate
     */
    A06?: Company;
    /**
     * The purchaser of the product
     */
    'A06.1'?: Company;
    /**
     * The consignee of the product
     */
    'A06.2'?: Company;
    /**
     * The receiver/consignee of the certificate
     */
    'A06.3'?: Company;
    /**
     * Purchase number
     */
    A07?: string;
    /**
     * Manufacturer's work number
     */
    A08?: string;
    /**
     * The article number used by the purchaser
     */
    A09?: string;
    SupplementaryInformation?: CommercialTransactionSupplementaryInformation;
    /**
     * The position number in the order
     */
    A97?: number;
    /**
     * A custom field for the delivery note number
     */
    A98?: string;
    /**
     * A custom field for the aviso document number
     */
    A99?: string;
}
export interface Company {
    CompanyName: string;
    Street: string;
    ZipCode: string;
    City: string;
    Country: string;
    VAT_Id?: string;
    Email: string;
    /**
     * Each entry to the array is rendered as a new line in HTML and PDF
     */
    AdditionalInformation?: string[];
    [k: string]: any;
}
export interface CommercialTransactionSupplementaryInformation {
    [k: string]: KeyValueObject;
}
/**
 * This interface was referenced by `CommercialTransactionSupplementaryInformation`'s JSON-Schema definition
 * via the `patternProperty` "A1[0-9]|A[2-8][0-9]|A[2-9][0-7]".
 *
 * This interface was referenced by `ProductDescriptionSupplementaryInformation`'s JSON-Schema definition
 * via the `patternProperty` "^B1[4-9]|^B[2-9][0-9]".
 *
 * This interface was referenced by `InspectionSupplementaryInformation`'s JSON-Schema definition
 * via the `patternProperty` "^C0[4-9]".
 *
 * This interface was referenced by `TensileTestSupplementaryInformation`'s JSON-Schema definition
 * via the `patternProperty` "^C1[4-9]|^C2[0-9]".
 *
 * This interface was referenced by `HardnessTestSupplementaryInformation`'s JSON-Schema definition
 * via the `patternProperty` "^C3[3-9]".
 *
 * This interface was referenced by `NotchedBarImpactTestSupplementaryInformation`'s JSON-Schema definition
 * via the `patternProperty` "^C4[4-9]".
 *
 * This interface was referenced by `OtherMechanicalTests`'s JSON-Schema definition
 * via the `patternProperty` "^C[5-6][0-9]".
 *
 * This interface was referenced by `ChemicalCompositionSupplementaryInformation`'s JSON-Schema definition
 * via the `patternProperty` "".
 *
 * This interface was referenced by `NonDestructiveTests`'s JSON-Schema definition
 * via the `patternProperty` "^D[0][2-9]|^D[1-4]D[0-9]".
 *
 * This interface was referenced by `OtherTestsSupplementaryInformation`'s JSON-Schema definition
 * via the `patternProperty` "^D[5-9][0-9]".
 *
 * This interface was referenced by `ValidationSupplementaryInformation`'s JSON-Schema definition
 * via the `patternProperty` "^Z0[5-9]|^Z[1-9][0-9]".
 */
export interface KeyValueObject {
    Key: string;
    Value?: string;
    Unit?: string;
    Interpretation?: string;
}
export interface ProductDescription {
    /**
     * The product
     */
    B01: string;
    B02: {
        /**
         * The product norm designation
         */
        ProductNorm?: string[];
        /**
         * The material norm(s)
         */
        MaterialNorm?: string[];
        /**
         * The mass norm(s)
         */
        MassNorm?: string[];
        /**
         * The steel designation(s)
         */
        SteelDesignation?: string[];
    };
    /**
     * Any supplemantary requirements
     */
    B03?: string;
    /**
     * The delivery conditions for the product
     */
    B04?: string;
    /**
     * Reference heat treatment of samples
     */
    B05?: string;
    /**
     * Marking of the product
     */
    B06?: string;
    /**
     * Identification of the product, usually batch, charge or lot number
     */
    B07: string;
    /**
     * Number of pieces of the product.
     */
    B08: number;
    /**
     * Product type and its describing dimensional parameters
     */
    B09?: ProductShape;
    /**
     * Product dimensions - length of the product
     */
    B10?: number;
    /**
     * Product dimensions
     */
    B11?: number;
    /**
     * Theoretical mass
     */
    B12?: number;
    /**
     * Actual mass
     */
    B13?: number;
    SupplementaryInformation?: ProductDescriptionSupplementaryInformation;
}
export interface Tube {
    Form: string;
    OuterDiameter: number;
    WallThickness: number;
}
export interface RectangularTube {
    Form: string;
    Width: number;
    Height: number;
    WallThickness: number;
}
export interface QuadraticTube {
    Form: string;
    SideLength: number;
    WallThickness: number;
}
export interface Pipe {
    Form: string;
    SideLength: number;
    WallThickness: number;
}
export interface RectangularPipe {
    Form: string;
    Width: number;
    Height: number;
    WallThickness: number;
    [k: string]: any;
}
export interface Coil {
    Form: string;
    Width: number;
    WallThickness: number;
    [k: string]: any;
}
export interface RoundBar {
    Form: string;
    Diameter: number;
}
export interface HexagonalBar {
    Form: string;
    Diameter: number;
}
export interface FlatBar {
    Form: string;
    Width: number;
    Thickness: number;
}
export interface Other {
    Form: string;
    Description: string;
}
export interface ProductDescriptionSupplementaryInformation {
    [k: string]: KeyValueObject;
}
export interface Inspection {
    /**
     * Heat or melt number defining the chemical properties
     */
    C00: string;
    /**
     * Location of the sample
     */
    C01?: string;
    /**
     * Direction of the test pieces
     */
    C02?: string;
    /**
     * Test temperature
     */
    C03?: string;
    SupplementaryInformation?: InspectionSupplementaryInformation;
    TensileTest?: TensileTest;
    HardnessTest?: HardnessTest;
    NotchedBarImpactTest?: NotchedBarImpactTest;
    OtherMechanicalTests?: OtherMechanicalTests;
    ChemicalComposition: ChemicalComposition;
}
export interface InspectionSupplementaryInformation {
    [k: string]: KeyValueObject;
}
export interface TensileTest {
    /**
     * Shape of the test piece
     */
    C10?: string;
    /**
     * Yield or proof strength
     */
    C11?: Measurement;
    /**
     * Tensile strength
     */
    C12?: Measurement;
    /**
     * Elongation after fracture
     */
    C13?: Measurement;
    SupplementaryInformation?: TensileTestSupplementaryInformation;
    [k: string]: any;
}
/**
 * Measured Values in a structured fashion for easy processing and rendering of data
 */
export interface Measurement {
    /**
     * The property measured
     */
    Property?: string;
    /**
     * A measured or calculated Value (e.g. mean of individual measurements).
     */
    Value: number;
    /**
     * The lower limit according product specification. If not provided it is 0.
     */
    Minimum?: number;
    /**
     * The upper limit according product specification. If not provided it is ∞.
     */
    Maximum?: number;
    /**
     * The Unit of Value.
     */
    Unit?: string;
}
export interface TensileTestSupplementaryInformation {
    [k: string]: KeyValueObject;
}
export interface HardnessTest {
    /**
     * Method of test
     */
    C30?: string;
    /**
     * The individual values measured
     */
    C31?: Measurement[];
    /**
     * The average value of the individual values measured
     */
    C32?: Measurement;
    SupplementaryInformation?: HardnessTestSupplementaryInformation;
    [k: string]: any;
}
export interface HardnessTestSupplementaryInformation {
    [k: string]: KeyValueObject;
}
export interface NotchedBarImpactTest {
    /**
     * Type of test piece
     */
    C40?: string;
    /**
     * Width of test piece
     */
    C41?: string;
    /**
     * Individual values
     */
    C42?: Measurement[];
    /**
     * Mean value
     */
    C43?: Measurement;
    SupplementaryInformation?: NotchedBarImpactTestSupplementaryInformation;
    [k: string]: any;
}
export interface NotchedBarImpactTestSupplementaryInformation {
    [k: string]: KeyValueObject;
}
export interface OtherMechanicalTests {
    [k: string]: KeyValueObject;
}
export interface ChemicalComposition {
    /**
     * The metallurgic process, which is restricted to 2 types: Y = Basic oxygen process, E = Electric furnace
     */
    C70?: 'Y' | 'E';
    /**
     * Share of element
     */
    C71?: ChemicalElement;
    /**
     * Share of element
     */
    C72?: ChemicalElement;
    /**
     * Share of element
     */
    C73?: ChemicalElement;
    /**
     * Share of element
     */
    C74?: ChemicalElement;
    /**
     * Share of element
     */
    C75?: ChemicalElement;
    /**
     * Share of element
     */
    C76?: ChemicalElement;
    /**
     * Share of element
     */
    C77?: ChemicalElement;
    /**
     * Share of element
     */
    C78?: ChemicalElement;
    /**
     * Share of element
     */
    C79?: ChemicalElement;
    /**
     * Share of element
     */
    C80?: ChemicalElement;
    /**
     * Share of element
     */
    C81?: ChemicalElement;
    /**
     * Share of element
     */
    C82?: ChemicalElement;
    /**
     * Share of element
     */
    C83?: ChemicalElement;
    /**
     * Share of element
     */
    C84?: ChemicalElement;
    /**
     * Share of element
     */
    C85?: ChemicalElement;
    /**
     * Share of element
     */
    C86?: ChemicalElement;
    /**
     * Share of element
     */
    C87?: ChemicalElement;
    /**
     * Share of element
     */
    C88?: ChemicalElement;
    /**
     * Share of element
     */
    C89?: ChemicalElement;
    /**
     * Share of element
     */
    C90?: ChemicalElement;
    /**
     * Share of element
     */
    C91?: ChemicalElement;
    /**
     * Share of element
     */
    C92?: ChemicalElement;
    /**
     * Share of element
     */
    C93?: ChemicalElement;
    /**
     * Share of element
     */
    C94?: ChemicalElement;
    /**
     * Share of element
     */
    C95?: ChemicalElement;
    /**
     * Share of element
     */
    C96?: ChemicalElement;
    /**
     * Share of element
     */
    C97?: ChemicalElement;
    /**
     * Share of element
     */
    C98?: ChemicalElement;
    /**
     * Share of element
     */
    C99?: ChemicalElement;
    /**
     * Share of element
     */
    C100?: ChemicalElement;
    /**
     * Share of element
     */
    C101?: ChemicalElement;
    /**
     * Share of element
     */
    C102?: ChemicalElement;
    /**
     * Share of element
     */
    C103?: ChemicalElement;
    /**
     * Share of element
     */
    C104?: ChemicalElement;
    /**
     * Share of element
     */
    C105?: ChemicalElement;
    /**
     * Share of element
     */
    C106?: ChemicalElement;
    /**
     * Share of element
     */
    C107?: ChemicalElement;
    /**
     * Share of element
     */
    C108?: ChemicalElement;
    /**
     * Share of element
     */
    C109?: ChemicalElement;
    SupplementaryInformation?: ChemicalCompositionSupplementaryInformation;
}
/**
 * The chemical elements of the product.
 */
export interface ChemicalElement {
    /**
     * The symbol of the element
     */
    Symbol: string;
    /**
     * The measured part of the element as absolute number.
     */
    Actual: number;
    /**
     * The minimum if defined by the product specification, otherwise the element must not provided.
     */
    Minimum?: number;
    /**
     * The maximum as defined by the product specification.
     */
    Maximum?: number;
}
export interface ChemicalCompositionSupplementaryInformation {
    [k: string]: KeyValueObject;
}
export interface OtherTests {
    /**
     * Marking and identification, surface appearance, shape and dimensional properties
     */
    D01?: string;
    NonDestructiveTests?: NonDestructiveTests;
    SupplementaryInformation?: OtherTestsSupplementaryInformation;
}
export interface NonDestructiveTests {}
export interface OtherTestsSupplementaryInformation {
    [k: string]: KeyValueObject;
}
export interface Validation {
    /**
     * Statement of compliance
     */
    Z01: string;
    /**
     * Date of issue and validation
     */
    Z02: string;
    /**
     * Stamp of the inspection representative
     */
    Z03?: string;
    /**
     * CE marking
     */
    Z04: {
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
        [k: string]: any;
    };
    SupplementaryInformation?: ValidationSupplementaryInformation;
}
export interface ValidationSupplementaryInformation {
    [k: string]: KeyValueObject;
}
