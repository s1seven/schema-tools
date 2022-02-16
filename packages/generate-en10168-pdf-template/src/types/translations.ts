export interface EN10168CertificateTranslations {
  certificateFields: {
    A01: string;
    A02: string;
    A03: string;
    A04: string;
    A05: string;
    A06: string;
    'A06.1': string;
    'A06.2': string;
    'A06.3': string;
    A07: string;
    A08: string;
    A09: string;
    A97: string;
    A98: string;
    A99: string;
    B01: string;
    B02: string;
    B03: string;
    B04: string;
    B05: string;
    B06: string;
    B07: string;
    B08: string;
    B09: string;
    B10: string;
    B11: string;
    B12: string;
    B13: string;
    C00: string;
    C01: string;
    C02: string;
    C03: string;
    C10: string;
    C11: string;
    C12: string;
    C13: string;
    C30: string;
    C31: string;
    C32: string;
    C40: string;
    C41: string;
    C42: string;
    C43: string;
    C70: string;
    D01: string;
    Z01: string;
    Z02: string;
    Z03: string;
    Z04: string;
    'Z04.NotifiedBody': string;
    'Z04.DoCYear': string;
    'Z04.DoCNumber': string;
  };
  certificateGroups: {
    CommercialTransaction: string;
    ProductDescription: string;
    Inspection: string;
    OtherTests: string;
    Validation: string;
  };
  otherFields: {
    AdditionalInformation: string;
    SupplementaryInformation: string;
    TensileTest: string;
    HardnessTest: string;
    ChemicalComposition: string;
    NotchedBarImpactTest: string;
    OtherMechanicalTests: string;
    NonDestructiveTests: string;
    OtherProductTests: string;
    ProductNorm: string;
    MaterialNorm: string;
    MassNorm: string;
    SteelDesignation: string;
    Form: string;
    Tube: string;
    QuadraticTube: string;
    RectangularTube: string;
    Pipe: string;
    RectangularPipe: string;
    Coil: string;
    RoundBar: string;
    HexagonalBar: string;
    FlatBar: string;
    Validation: string;
    Other: string;
    Width: string;
    Thickness: string;
    OuterDiameter: string;
    Diameter: string;
    WallThickness: string;
    Height: string;
    SideLength: string;
    Unit: string;
  };
}

export interface EN10168Translations {
  [ln: string]: EN10168CertificateTranslations;
}