import { PDFDocument } from 'pdf-lib';

import { buildCertificateSummary } from '@s1seven/schema-tools-certificate-summary';
import { Schemas } from '@s1seven/schema-tools-types';

import { attachFileToPdf } from './pdf-a-3a/attach-file-to-pdf';

export const CERTIFICATE_MIME_TYPE = 'application/json';
export const CERTIFICATE_DESCRIPTION = 'The source certificate';

export const attachCertificateToPdf = async (pdfLibDoc: PDFDocument, certificate: Schemas): Promise<void> => {
  const certificateFileName = await getAttachedCertificateFileName(certificate);
  const today = new Date();
  const fileContent = JSON.stringify(certificate, null, 2);
  await attachFileToPdf(pdfLibDoc, fileContent, certificateFileName, {
    mimeType: CERTIFICATE_MIME_TYPE,
    description: CERTIFICATE_DESCRIPTION,
    creationDate: today,
    modificationDate: today,
  });
};

export const getAttachedCertificateFileName = async (
  certificate: Schemas,
  { sectionSeparator = '-', spaceReplacer = '' } = {},
): Promise<string> => {
  const { sellerName, certificateIdentifier } = await buildCertificateSummary(certificate);
  const spacePattern = /\s/g;
  const seller = sellerName.replace(spacePattern, spaceReplacer);
  const mergedName = `${seller}${sectionSeparator}CN${sectionSeparator}${certificateIdentifier}`;
  return removeInvalidFileNameCharacters(mergedName);
};

export const removeInvalidFileNameCharacters = (filename: string, invalidCharactersRegex = /[^a-zA-Z0-9-_]/g) =>
  filename.replace(invalidCharactersRegex, '-');
