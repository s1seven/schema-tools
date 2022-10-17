import { CoASchema, ECoCSchema, EN10168Schema, SupportedSchemas } from '@s1seven/schema-tools-types';
import { castCertificate, loadExternalFile } from '@s1seven/schema-tools-utils';

export interface PartyEmail {
  emails: string[];
  role: SenderRoles | ReceiverRoles;
  name: string;
  vatId?: string;
  dunsId?: string;
}

export enum SenderRoles {
  Supplier = 'Supplier',
  Manufacturer = 'Manufacturer',
  Seller = 'Seller',
}

export enum ReceiverRoles {
  Customer = 'Customer',
  Recipient = 'Recipient',
  Receiver = 'Receiver',
  Buyer = 'Buyer',
  ProductConsignee = 'ProductConsignee',
  CertificateConsignee = 'CertificateConsignee',
  TestLab = 'TestLab',
}

export const SENDER_ROLES = Object.values(SenderRoles);
export const RECEIVER_ROLES = Object.values(ReceiverRoles);

export function getSender(parties: PartyEmail[] = [], role?: SenderRoles): PartyEmail | null {
  return (
    parties.find((party) =>
      role ? role.toLowerCase() === party?.role?.toLowerCase() : SENDER_ROLES.includes(party?.role as SenderRoles),
    ) || null
  );
}

export function getSenders(parties: PartyEmail[] = []): PartyEmail[] | null {
  const senders = parties.filter((party) => SENDER_ROLES.includes(party?.role as SenderRoles));
  return senders.length ? senders : null;
}

export function getReceiver(parties: PartyEmail[] = [], role?: ReceiverRoles): PartyEmail | null {
  return (
    parties.find((party) =>
      role ? role.toLowerCase() === party?.role?.toLowerCase() : RECEIVER_ROLES.includes(party?.role as ReceiverRoles),
    ) || null
  );
}

export function getReceivers(parties: PartyEmail[] = []): PartyEmail[] | null {
  const receivers = parties.filter((party) => RECEIVER_ROLES.includes(party?.role as ReceiverRoles));
  return receivers.length ? receivers : null;
}

export function extractPartiesFromEN10168(certificate: EN10168Schema): PartyEmail[] {
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

  return Object.entries(CommercialTransaction)
    .map(([key, company]: [string, any]) => {
      // we keep compatability with previous versions by checking for both options
      if (validKeys.includes(key) && company) {
        return {
          emails: company.Email ? [company.Email] : [],
          vatId: company?.Identifiers?.VAT || company.VAT_Id || undefined,
          dunsId: company?.Identifiers?.DUNS || company.DUNS || undefined,
          name: company.CompanyName || company.Name,
          role: en10168CompanyRole[key],
        };
      }
      return null;
    })
    .filter((partyEmail) => partyEmail !== null) as PartyEmail[];
}

export function extractPartiesFromECoC(certificate: ECoCSchema): PartyEmail[] {
  if (!certificate.EcocData?.Data?.Parties) {
    return [];
  }

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
          emails: emailProp?.Value || [],
          vatId: vatIdProp?.ValueOfIdentifier,
        }
      : null;
  }).filter((partyEmail) => partyEmail !== null);
}

export function extractPartiesFromCoA(certificate: CoASchema): PartyEmail[] {
  if (!certificate.Certificate.Parties) {
    return [];
  }

  const Parties = certificate.Certificate.Parties;
  const coaCompanyRole = {
    ['Manufacturer']: SenderRoles.Manufacturer,
    ['Customer']: ReceiverRoles.Customer,
    ['ConsigneeOfCertificate']: ReceiverRoles.CertificateConsignee,
    ['Receiver']: ReceiverRoles.Receiver,
  };
  const validKeys = Object.keys(coaCompanyRole);
  return Object.entries(Parties)
    .map(([key, company]: [string, any]) => {
      if (validKeys.includes(key) && company) {
        // Checks for both options to maintain compatability with older versions
        return {
          emails: company.Email ? [company.Email] : [],
          vatId: company?.Identifiers?.VAT || company?.Identifier?.VAT || undefined,
          dunsId: company?.Identifiers?.DUNS || company?.Identifier?.DUNS || undefined,
          name: company.Name || company.CompanyName,
          role: coaCompanyRole[key],
        };
      }
      return null;
    })
    .filter((partyEmail) => partyEmail !== null) as PartyEmail[];
}

/**
 * @deprecated since version 0.2.0
 */
export async function extractEmails(certificateInput: string | Record<string, unknown>): Promise<PartyEmail[] | null> {
  return extractParties(certificateInput);
}

export async function extractParties(certificateInput: string | Record<string, unknown>): Promise<PartyEmail[] | null> {
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
      return extractPartiesFromEN10168(certificate as EN10168Schema);
    case SupportedSchemas.ECOC:
      return extractPartiesFromECoC(certificate as ECoCSchema);
    case SupportedSchemas.COA:
      return extractPartiesFromCoA(certificate as CoASchema);
    default:
      return null;
  }
}
