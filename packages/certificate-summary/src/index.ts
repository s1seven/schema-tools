import {
  extractPartiesFromCoA,
  extractPartiesFromECoC,
  extractPartiesFromEN10168,
  getReceivers,
  getSenders,
  PartyEmail,
} from '@s1seven/schema-tools-extract-emails';
import {
  CoASchema,
  EcocData,
  ECoCSchema,
  EN10168Schema,
  Materials,
  SummaryQuantity,
  SupportedSchemas,
} from '@s1seven/schema-tools-types';
import { castCertificate, loadExternalFile } from '@s1seven/schema-tools-utils';

export interface CertificateSummary {
  certificateIdentifier: string;
  sellerName: string;
  buyerName: string;
  productDescription: string;
  purchaseDeliveryNumber?: string;
  purchaseDeliveryPosition?: string;
  purchaseOrderNumber?: string;
  purchaseOrderPosition?: string;
  quantity?: SummaryQuantity[] | SummaryQuantity[][];
  material: Materials;
}

function getFirstPartyName(parties: PartyEmail[]): string {
  return parties?.length ? parties[0]?.name : '';
}

function extractSummaryFromEN10168(certificate: EN10168Schema): CertificateSummary | null {
  if (!certificate?.Certificate?.CommercialTransaction) {
    return null;
  }
  const parties = extractPartiesFromEN10168(certificate);
  const senders = getSenders(parties);
  const receivers = getReceivers(parties);
  const { CommercialTransaction, ProductDescription } = certificate.Certificate;
  const purchaseOrderNumber = CommercialTransaction['A07'];
  const purchaseOrderPosition = Object.prototype.hasOwnProperty.call(CommercialTransaction, 'A97')
    ? CommercialTransaction['A97'].toString()
    : '';

  const purchaseDeliveryNumber = Object.prototype.hasOwnProperty.call(CommercialTransaction, 'A98')
    ? CommercialTransaction['A98'].toString()
    : '';

  const quantity: SummaryQuantity[] = Object.prototype.hasOwnProperty.call(ProductDescription, 'B13')
    ? [
        {
          value: ProductDescription['B13']['Value'],
          unit: ProductDescription['B13']['Unit'],
        },
      ]
    : [];

  return {
    certificateIdentifier: certificate.Certificate.CommercialTransaction.A03,
    sellerName: getFirstPartyName(senders),
    buyerName: getFirstPartyName(receivers),
    productDescription: certificate.Certificate.ProductDescription?.B01,
    purchaseDeliveryNumber,
    purchaseDeliveryPosition: undefined,
    purchaseOrderNumber,
    purchaseOrderPosition,
    quantity,
    material: Materials.Ferrous,
  };
}

function extractSummaryFromECoC(certificate: ECoCSchema): CertificateSummary | null {
  if (!certificate.EcocData?.Data?.Parties) {
    return null;
  }
  const parties = extractPartiesFromECoC(certificate);
  const senders = getSenders(parties);
  const receivers = getReceivers(parties);
  const StandardReferences = certificate.EcocData?.BusinessReference?.StandardReferences;
  const purchaseOrderNumber = StandardReferences?.find((ref) => ref?.name === 'OrderNo')?.Value;
  const purchaseOrderPosition = StandardReferences?.find((ref) => ref?.name === 'OrderPos')?.Value;
  const purchaseDeliveryNumber = StandardReferences?.find((ref) => ref?.name === 'DeliveryNote')?.Value;

  const ecocData = certificate.EcocData as EcocData;
  const quantity =
    ecocData?.Data?.ObjectOfDeclaration?.reduce<SummaryQuantity[][]>((acc, ObjectOfDeclaration) => {
      return [
        ...acc,
        ObjectOfDeclaration.Quantities.map<SummaryQuantity>((quantityObj) => {
          const { Amount: value, Unit: unit } = quantityObj;
          return { value, unit };
        }),
      ];
    }, []) || [];

  return {
    certificateIdentifier: certificate.Id,
    sellerName: getFirstPartyName(senders),
    buyerName: getFirstPartyName(receivers),
    productDescription: undefined,
    purchaseDeliveryNumber,
    purchaseDeliveryPosition: undefined,
    purchaseOrderNumber,
    purchaseOrderPosition,
    quantity,
    material: Materials.NonFerrous,
  };
}

function extractSummaryFromCoA(certificate: CoASchema): CertificateSummary | null {
  if (!certificate.Certificate.Parties) {
    return null;
  }
  const parties = extractPartiesFromCoA(certificate);
  const senders = getSenders(parties);
  const receivers = getReceivers(parties);
  const Order = certificate.Certificate.BusinessTransaction?.Order || certificate.Certificate.BusinessReferences?.Order;
  // BusinessReferences was removed in https://github.com/material-identity/CoA-schemas/commit/9f98f316d0c921c11ff728761b1b9f40d1e45ef7
  // It's here for backwards compatibility
  const Delivery =
    certificate.Certificate.BusinessTransaction?.Delivery || certificate.Certificate.BusinessReferences?.Delivery;
  const purchaseOrderNumber = Order?.Number || Order?.Id;
  const purchaseOrderPosition = Order?.Position;
  const purchaseDeliveryNumber = Delivery?.Number || Delivery?.Id;
  const purchaseDeliveryPosition = Delivery?.Position;
  const quantity = [{ unit: Delivery?.QuantityUnit, value: Delivery?.Quantity }];
  return {
    certificateIdentifier: certificate.Certificate.Id,
    sellerName: getFirstPartyName(senders),
    buyerName: getFirstPartyName(receivers),
    productDescription: certificate.Certificate.Product?.Name,
    purchaseDeliveryNumber,
    purchaseDeliveryPosition,
    purchaseOrderNumber,
    purchaseOrderPosition,
    quantity,
    material: Materials.Chemical,
  };
}

export async function buildCertificateSummary(
  certificateInput: string | Record<string, unknown>,
): Promise<CertificateSummary | null> {
  let rawCert: Record<string, unknown>;
  if (typeof certificateInput === 'string') {
    rawCert = await loadExternalFile(certificateInput, 'json');
  } else if (typeof certificateInput === 'object') {
    rawCert = certificateInput;
  } else {
    throw new Error(`Invalid input type : ${typeof certificateInput}`);
  }

  const { certificate, type } = castCertificate(rawCert);
  switch (type) {
    case SupportedSchemas.EN10168:
      return extractSummaryFromEN10168(certificate as EN10168Schema);
    case SupportedSchemas.ECOC:
      return extractSummaryFromECoC(certificate as ECoCSchema);
    case SupportedSchemas.COA:
      return extractSummaryFromCoA(certificate as CoASchema);
    default:
      return null;
  }
}
