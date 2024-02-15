import { AttachmentOptions, PDFDocument } from 'pdf-lib';

/**
 * Attaches a file to a PDF document. The file can be viewed and downloaded in advanced PDF viewers like Adobe Acrobat Reader.
 * @param pdfBuffer - The buffer of the PDF to which the file will be attached.
 * @param fileContent - The content of the file to attach.
 * @param fileName - The name of the file to attach.
 * @param options - The options for the attachment, including mimeType, description, creationDate, and modificationDate.
 * @returns A Promise that resolves with a Buffer of the updated PDF document.
 */
export const attachFileToPdf = async (
  pdfBuffer: Buffer,
  fileContent: string,
  fileName: string,
  options: AttachmentOptions,
): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const encodedFileContent = Buffer.from(fileContent).toString('base64');
  await pdfDoc.attach(encodedFileContent, fileName, options);
  const uint8Array = await pdfDoc.save();
  return Buffer.from(uint8Array);
};
