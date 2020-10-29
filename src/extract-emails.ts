import { ECoCSchema, EN10168Schema } from './types';
import {
  loadExternalFile,
  castWithoutError,
  asEN10168Certificate,
  asECoCCertificate,
} from './utils';

export interface PartyEmail {
  emails: string[];
  role: string;
  name: string;
  purchaseOrderNumber?: string;
  purchaseOrderPosition?: string;
}

const en10168CompanyRole = {
  ['A01']: 'Seller',
  ['A06']: 'Buyer',
  ['A06.1']: 'Buyer',
  ['A06.2']: 'Consignee',
  ['A06.3']: 'Consignee of certificate',
};

function extractEmailsFromEN10168(certificate: EN10168Schema): PartyEmail[] {
  if (!certificate?.Certificate?.CommercialTransaction) {
    return [];
  }
  const validKeys = Object.keys(en10168CompanyRole);
  const purchaseOrderNumber =
    certificate.Certificate.CommercialTransaction['A07'];
  const purchaseOrderPosition =
    certificate.Certificate.CommercialTransaction['A97'];

  return Object.entries(certificate.Certificate.CommercialTransaction)
    .map(([key, value]) => {
      if (validKeys.includes(key)) {
        const company = value as any;
        return {
          emails: [company.Email],
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

  return certificate.EcocData.Data.Parties.map((party) => {
    const emailProp = party?.AdditionalPartyProperties?.find(
      (property) => property?.Name.toLowerCase() === 'email'
    );
    return emailProp?.Value
      ? {
          name: party.PartyName,
          role: party.PartyRole,
          emails: emailProp.Value,
        }
      : null;
  }).filter((partyEmail) => partyEmail !== null);
}

export async function extractEmails(
  certificateInput: string | object
): Promise<PartyEmail[] | null> {
  let rawCert: any;
  if (typeof certificateInput === 'string') {
    rawCert = (await loadExternalFile(certificateInput, 'json')) as any;
  } else if (typeof certificateInput === 'object') {
    rawCert = certificateInput;
  } else {
    throw new Error(`Invalid input type : ${typeof certificateInput}`);
  }

  const en10168ertificate = castWithoutError<EN10168Schema>(
    rawCert,
    asEN10168Certificate
  );

  if (en10168ertificate) {
    return extractEmailsFromEN10168(en10168ertificate);
  }

  const eCoCCertificate = castWithoutError<ECoCSchema>(
    rawCert,
    asECoCCertificate
  );
  if (eCoCCertificate) {
    return extractEmailsFromECoC(eCoCCertificate);
  }

  return null;
}
