import { castCertificate, loadExternalFile } from '@s1seven/schema-tools-utils';
import { CoASchema, ECoCSchema, EN10168Schema, SupportedSchemas } from '@s1seven/schema-tools-types';

export interface PartyEmail {
  emails: string[];
  role: SenderRoles | ReceiverRoles;
  name: string;
  vatId: string;
  purchaseOrderNumber?: string;
  purchaseOrderPosition?: string;
}

export enum SenderRoles {
  Supplier = 'Supplier',
  Manufacturer = 'Manufacturer',
  Seller = 'Seller',
}

export enum ReceiverRoles {
  Customer = 'Customer',
  Recipient = 'Recipient',
  Buyer = 'Buyer',
  ProductConsignee = 'ProductConsignee',
  CertificateConsignee = 'CertificateConsignee',
  TestLab = 'TestLab',
}

export const SENDER_ROLES = Object.values(SenderRoles);
export const RECEIVER_ROLES = Object.values(ReceiverRoles);

export function getSender(parties: PartyEmail[], role?: SenderRoles): PartyEmail | null {
  return (
    parties.find((party) =>
      role ? role.toLowerCase() === party.role.toLowerCase() : SENDER_ROLES.includes(party.role as SenderRoles),
    ) || null
  );
}

export function getSenders(parties: PartyEmail[]): PartyEmail[] | null {
  const senders = parties.filter((party) => SENDER_ROLES.includes(party.role as SenderRoles));
  return senders.length ? senders : null;
}

export function getReceiver(parties: PartyEmail[], role?: ReceiverRoles): PartyEmail | null {
  return (
    parties.find((party) =>
      role ? role.toLowerCase() === party.role.toLowerCase() : RECEIVER_ROLES.includes(party.role as ReceiverRoles),
    ) || null
  );
}

export function getReceivers(parties: PartyEmail[]): PartyEmail[] | null {
  const receivers = parties.filter((party) => RECEIVER_ROLES.includes(party.role as ReceiverRoles));
  return receivers.length ? receivers : null;
}

function extractEmailsFromEN10168(certificate: EN10168Schema): PartyEmail[] {
  if (!certificate?.Certificate?.CommercialTransaction) {
    return [];
  }
  const en10168CompanyRole = {
    ['A01']: SenderRoles.Seller,
    ['A06']: ReceiverRoles.Buyer,
    ['A06.1']: ReceiverRoles.Buyer,
    ['A06.2']: ReceiverRoles.ProductConsignee,
    ['A06.3']: ReceiverRoles.CertificateConsignee,
  };
  const { CommercialTransaction } = certificate.Certificate;
  const validKeys = Object.keys(en10168CompanyRole);
  const purchaseOrderNumber = CommercialTransaction['A07'];
  const purchaseOrderPosition = Object.prototype.hasOwnProperty.call(CommercialTransaction, 'A97')
    ? CommercialTransaction['A97'].toString()
    : '';

  return Object.entries(CommercialTransaction)
    .map(([key, company]: [string, any]) => {
      if (validKeys.includes(key)) {
        return {
          emails: [company.Email],
          vatId: company.VAT_Id,
          name: company.CompanyName,
          role: en10168CompanyRole[key],
          purchaseOrderNumber,
          purchaseOrderPosition,
        };
      }
      return null;
    })
    .filter((partyEmail) => partyEmail !== null) as PartyEmail[];
}

function extractEmailsFromECoC(certificate: ECoCSchema): PartyEmail[] {
  if (!certificate.EcocData?.Data?.Parties) {
    return [];
  }

  const purchaseOrderNumber = certificate.EcocData?.BusinessReference?.StandardReferences.find(
    (ref) => ref?.name === 'OrderNo',
  )?.Value;
  const purchaseOrderPosition = certificate.EcocData?.BusinessReference?.StandardReferences.find(
    (ref) => ref?.name === 'OrderPos',
  )?.Value;

  return certificate.EcocData.Data.Parties.map((party) => {
    const emailProp = party?.AdditionalPartyProperties?.find(
      (property: { Name: string; Value: string }) => property?.Name.toLowerCase() === 'email',
    );
    const vatIdProp = party?.PartyIdentifier?.find(
      (property: { NameOfIdentifier: string; ValueOfIdentifier: string }) =>
        property?.NameOfIdentifier.toLowerCase() === 'vatid',
    );
    return vatIdProp?.ValueOfIdentifier
      ? {
          name: party.PartyName,
          role: party.PartyRole,
          emails: emailProp?.Value || null,
          vatId: vatIdProp?.ValueOfIdentifier,
          purchaseOrderNumber,
          purchaseOrderPosition,
        }
      : null;
  }).filter((partyEmail) => partyEmail !== null);
}

function extractEmailsFromCoA(certificate: CoASchema): PartyEmail[] {
  if (!certificate.Certificate.Parties) {
    return [];
  }

  const Order = certificate.Certificate.BusinessReferences?.Order;
  const Parties = certificate.Certificate.Parties;
  const purchaseOrderNumber = Order?.Number;
  const purchaseOrderPosition = Order?.Position;
  const coaCompanyRole = {
    ['Manufacturer']: SenderRoles.Manufacturer,
    ['Customer']: ReceiverRoles.Customer,
    ['ConsigneeOfCertificate']: ReceiverRoles.CertificateConsignee,
  };
  // console.log(certificate.Certificate.Parties);

  const validKeys = Object.keys(coaCompanyRole);
  return Object.entries(Parties)
    .map(([key, company]: [string, any]) => {
      if (validKeys.includes(key)) {
        return {
          emails: [company.Email],
          vatId: company.Identifier.VAT,
          name: company.Name || company.CompanyName,
          role: coaCompanyRole[key],
          purchaseOrderNumber,
          purchaseOrderPosition,
        };
      }
      return null;
    })
    .filter((partyEmail) => partyEmail !== null) as PartyEmail[];
}

export async function extractEmails(certificateInput: string | Record<string, unknown>): Promise<PartyEmail[] | null> {
  let rawCert: any;
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
      return extractEmailsFromEN10168(certificate as EN10168Schema);
    case SupportedSchemas.ECOC:
      return extractEmailsFromECoC(certificate as ECoCSchema);
    case SupportedSchemas.COA:
      return extractEmailsFromCoA(certificate as CoASchema);
    default:
      return null;
  }
}
