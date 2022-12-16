export interface CoACertificateTranslations {
  Certificate: {
    Customer: string;
    Receiver: string;
    GoodsReceiver: string;
    Id: string;
    Certificate: string;
    Date: string;
    BusinessTransaction: string;
    Order: string;
    OrderId: string;
    OrderQuantity: string;
    OrderPosition: string;
    OrderDate: string;
    InternalOrderId: string;
    InternalOrderPosition: string;
    Delivery: string;
    DeliveryId: string;
    DeliveryPosition: string;
    DeliveryQuantity: string;
    DeliveryDate: string;
    Transport: string;
    GoodsReceiptId: string;
    Product: string;
    ProductName: string;
    ProductId: string;
    CustomerProductId: string;
    CustomerProductName: string;
    CountryOfOrigin: string;
    PlaceOfOrigin: string;
    FillingBatchId: string;
    FillingBatchDate: string;
    ProductionBatchId: string;
    ProductionDate: string;
    ExpirationDate: string;
    Standards: string;
    AdditionalInformation: string;
    Inspections: string;
    LotId: string;
    Property: string;
    Method: string;
    Value: string;
    Minimum: string;
    Maximum: string;
    Unit: string;
    TestConditions: string;
    DeclarationOfConformity: string;
    Contacts: string;
    ContactName: string;
    ContactRole: string;
    ContactDepartment: string;
    ContactEmail: string;
    ContactPhone: string;
    Attachments: string;
  };
}

export interface CoATranslations {
  [ln: string]: CoACertificateTranslations;
}
