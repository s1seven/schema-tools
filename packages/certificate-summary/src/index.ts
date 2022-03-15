import {
  extractPartiesFromCoA,
  extractPartiesFromECoC,
  extractPartiesFromEN10168,
  getReceivers,
  getSenders,
  PartyEmail,
} from '@s1seven/schema-tools-extract-emails';
import { CoASchema, ECoCSchema, EN10168Schema, SupportedSchemas } from '@s1seven/schema-tools-types';
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
  const { CommercialTransaction } = certificate.Certificate;
  const purchaseOrderNumber = CommercialTransaction['A07'];
  const purchaseOrderPosition = Object.prototype.hasOwnProperty.call(CommercialTransaction, 'A97')
    ? CommercialTransaction['A97'].toString()
    : '';

  const purchaseDeliveryNumber = Object.prototype.hasOwnProperty.call(CommercialTransaction, 'A98')
    ? CommercialTransaction['A98'].toString()
    : '';

  return {
    certificateIdentifier: certificate.Certificate.CommercialTransaction.A03,
    sellerName: getFirstPartyName(senders),
    buyerName: getFirstPartyName(receivers),
    productDescription: certificate.Certificate.ProductDescription?.B01,
    purchaseDeliveryNumber,
    purchaseDeliveryPosition: undefined,
    purchaseOrderNumber,
    purchaseOrderPosition,
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

  return {
    certificateIdentifier: certificate.Id,
    sellerName: getFirstPartyName(senders),
    buyerName: getFirstPartyName(receivers),
    productDescription: undefined,
    purchaseDeliveryNumber,
    purchaseDeliveryPosition: undefined,
    purchaseOrderNumber,
    purchaseOrderPosition,
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
  const Delivery =
    certificate.Certificate.BusinessTransaction?.Delivery || certificate.Certificate.BusinessReferences?.Delivery;
  const purchaseOrderNumber = Order?.Number || Order?.Id;
  const purchaseOrderPosition = Order?.Position;
  const purchaseDeliveryNumber = Delivery?.Number || Delivery?.Id;
  const purchaseDeliveryPosition = Delivery?.Position;
  return {
    certificateIdentifier: certificate.Certificate.Id,
    sellerName: getFirstPartyName(senders),
    buyerName: getFirstPartyName(receivers),
    productDescription: certificate.Certificate.Product?.Name,
    purchaseDeliveryNumber,
    purchaseDeliveryPosition,
    purchaseOrderNumber,
    purchaseOrderPosition,
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
