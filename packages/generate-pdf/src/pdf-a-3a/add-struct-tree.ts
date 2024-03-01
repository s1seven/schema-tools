import { PDFDocument, PDFName } from 'pdf-lib';

/**
 * Add a StructTreeRoot dictionary to the PDF document catalog.
 * @param pdfDoc the PDF document
 */
export const addStructTree = (pdfDoc: PDFDocument): void => {
  if (!pdfDoc.catalog.has(PDFName.of('StructTreeRoot'))) {
    const structTreeRootDict = pdfDoc.context.obj({
      Type: 'StructTreeRoot',
    });
    pdfDoc.catalog.set(PDFName.of('StructTreeRoot'), structTreeRootDict);
  }
};
