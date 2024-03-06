import { createHash } from 'crypto';
import { fromBuffer } from 'pdf2pic';

export const PDF_2_PIC_OPTIONS = {
  density: 100,
  width: 600,
  height: 600,
};

export const PDF_2_PIC_PAGES = 1;

/**
 * Convert a PDF buffer to a hash by converting it to an image and hashing the image.
 * Note: Make sure ImageMagick is installed on your system
 *       MacOs: brew install graphicsmagick
 *       Linux: sudo apt-get install graphicsmagick
 * @param pdfBuffer The PDF buffer to convert
 * @returns The hash of the PDF buffer
 */
export const pdfBufferToHash = async (pdfBuffer: Buffer): Promise<string> => {
  const expectedPDF = await fromBuffer(pdfBuffer, PDF_2_PIC_OPTIONS)(PDF_2_PIC_PAGES, { responseType: 'base64' });
  return createHash('sha256')
    .update(expectedPDF.base64 as string)
    .digest('hex');
};
