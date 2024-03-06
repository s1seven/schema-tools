import { PDFDocument } from 'pdf-lib';

import { Schemas } from '@s1seven/schema-tools-types';

import { attachFileToPdf } from './pdf-a-3a/attach-file-to-pdf';

export const CERTIFICATE_FILE_NAME = 'certificate.json';
export const CERTIFICATE_MIME_TYPE = 'application/json';
export const CERTIFICATE_DESCRIPTION = 'The source certificate';

export const attachCertificateToPdf = async (pdfLibDoc: PDFDocument, certificate: Schemas): Promise<void> => {
  const today = new Date();
  const fileContent = JSON.stringify(certificate, null, 2);
  await attachFileToPdf(pdfLibDoc, fileContent, CERTIFICATE_FILE_NAME, {
    mimeType: CERTIFICATE_MIME_TYPE,
    description: CERTIFICATE_DESCRIPTION,
    creationDate: today,
    modificationDate: today,
  });
};
