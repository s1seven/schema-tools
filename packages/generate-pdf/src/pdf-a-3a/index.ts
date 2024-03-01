import { PDFDocument, PDFName } from 'pdf-lib';

import { addStructTree } from './add-struct-tree';
import { setColorProfile } from './set-color-profile';
import { addXMPMetadata } from './xmp-metadata';

export const AUTHOR = 'S1SEVEN';
export const PRODUCER = 'S1SEVEN Schema Tools';
export const COLOR_PROFILE_FILE = `${__dirname}/../../assets/color-profiles/sRGB2014.icc`;
export const DEFAULT_TITLE = 'Certificate';

export const makeA3Compliant = async (pdfDoc: PDFDocument, title = DEFAULT_TITLE): Promise<void> => {
  const today = new Date();

  // Set traditional PDF metadata fields
  pdfDoc.setTitle(title);
  pdfDoc.setAuthor(AUTHOR);
  pdfDoc.setProducer(PRODUCER);
  pdfDoc.setCreator(PRODUCER);
  pdfDoc.setCreationDate(today);
  pdfDoc.setModificationDate(today);

  addXMPMetadata(pdfDoc, {
    title,
    author: AUTHOR,
    creator: PRODUCER,
    producer: PRODUCER,
    date: today,
  });

  addMarkInfoDictionary(pdfDoc);
  addStructTree(pdfDoc);

  await setColorProfile(pdfDoc, COLOR_PROFILE_FILE);
};

export const addMarkInfoDictionary = (pdfDoc: PDFDocument): void => {
  const markInfoDict = pdfDoc.context.obj({
    Marked: true,
  });
  pdfDoc.catalog.set(PDFName.of('MarkInfo'), markInfoDict);
};
