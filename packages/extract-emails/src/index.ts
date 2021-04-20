import { ECoCSchema, EN10168Schema } from '@s1seven/schema-tools-types';
import {
  loadExternalFile,
  castWithoutError,
  asEN10168Certificate,
  asECoCCertificate,
} from '@s1seven/schema-tools-utils';

// TODO: Add types or enums for party.role ?
export interface PartyEmail {
  emails: string[];
  role: string;
  name: string;
  vatId: string;
  purchaseOrderNumber?: string;
  purchaseOrderPosition?: string;
}

export const SENDER_ROLES = ['Supplier', 'Manufacturer', 'Seller'];
export const RECEIVER_ROLES = ['Customer', 'Recipient', 'Buyer', 'ProductConsignee', 'CertificateConsignee'];

const en10168CompanyRole = {
  ['A01']: 'Seller',
  ['A06']: 'Buyer',
  ['A06.1']: 'Buyer',
  ['A06.2']: 'ProductConsignee',
  ['A06.3']: 'CertificateConsignee',
};

export function getSender(parties: PartyEmail[], role?: string): PartyEmail | null {
  return (
    parties.find((party) =>
      role ? role.toLowerCase() === party.role.toLowerCase() : SENDER_ROLES.includes(party.role),
    ) || null
  );
}

export function getSenders(parties: PartyEmail[]): PartyEmail[] | null {
  const senders = parties.filter((party) => SENDER_ROLES.includes(party.role));
  return senders.length ? senders : null;
}

export function getReceiver(parties: PartyEmail[], role?: string): PartyEmail | null {
  return (
    parties.find((party) =>
      role ? role.toLowerCase() === party.role.toLowerCase() : RECEIVER_ROLES.includes(party.role),
    ) || null
  );
}

export function getReceivers(parties: PartyEmail[]): PartyEmail[] | null {
  const receivers = parties.filter((party) => RECEIVER_ROLES.includes(party.role));
  return receivers.length ? receivers : null;
}

function extractEmailsFromEN10168(certificate: EN10168Schema): PartyEmail[] {
  if (!certificate?.Certificate?.CommercialTransaction) {
    return [];
  }
  const { CommercialTransaction } = certificate.Certificate;
  const validKeys = Object.keys(en10168CompanyRole);
  const purchaseOrderNumber = CommercialTransaction['A07'];
  const purchaseOrderPosition = Object.prototype.hasOwnProperty.call(CommercialTransaction, 'A97')
    ? CommercialTransaction['A97'].toString()
    : '';

  return Object.entries(CommercialTransaction)
    .map(([key, value]) => {
      if (validKeys.includes(key)) {
        const company = value as any;
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

export async function extractEmails(certificateInput: string | Record<string, unknown>): Promise<PartyEmail[] | null> {
  let rawCert: any;
  if (typeof certificateInput === 'string') {
    rawCert = (await loadExternalFile(certificateInput, 'json')) as any;
  } else if (typeof certificateInput === 'object') {
    rawCert = certificateInput;
  } else {
    throw new Error(`Invalid input type : ${typeof certificateInput}`);
  }

  const en10168ertificate = castWithoutError<EN10168Schema>(rawCert, asEN10168Certificate);

  if (en10168ertificate) {
    return extractEmailsFromEN10168(en10168ertificate);
  }

  const eCoCCertificate = castWithoutError<ECoCSchema>(rawCert, asECoCCertificate);
  if (eCoCCertificate) {
    return extractEmailsFromECoC(eCoCCertificate);
  }

  return null;
}
