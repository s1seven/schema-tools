# `@s1seven/certificate-summary`

Build certificate summary by retrieving general common properties such as:

| Field              | CoA                                         |                EN10168                | E-CoC                                                  |
| ------------------ | ------------------------------------------- | :-----------------------------------: | ------------------------------------------------------ |
| CertificateNumber  | Id                                          |       CommercialTransaction.A03       | Id                                                     |
| SellerName         | Parties.Manufacturer.Name                   | CommercialTransaction.A01.CompanyName | EcocData.Data.Parties[].PartyName (based on PartyRole) |
| BuyerName          | Parties.Customer.Name                       | CommercialTransaction.A06.CompanyName | EcocData.Data.Parties[].PartyName (based on PartyRole) |
| ProductDescription | Product.Name                                |        ProductDescription.B01         | ?                                                      |
| DeliveryNumber     | BusinessTransaction.Delivery.(Number or Id) |       CommercialTransaction.A98       | BusinessRef.StandardReferences[].DeliveryNote          |
| DeliveryPosition   | BusinessTransaction.Delivery.Position       |                   ?                   | ?                                                      |
| OrderNumber        | BusinessTransaction.Order.(Number or Id)    |       CommercialTransaction.A07       | BusinessRef.StandardReferences[].OrderNo               |
| OrderPosition      | BusinessTransaction.Order.Position          |       CommercialTransaction.A97       | BusinessRef.StandardReferences[].OrderPosition         |

## Usage

```

```

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build certificate-summary` to build the library.

## Running unit tests

Run `nx test certificate-summary` to execute the unit tests via [Jest](https://jestjs.io).
