import PdfPrinter from 'pdfmake';
import * as fs from 'fs';

import { Translate } from './translate'

import { styles } from './styles';

import {generateContent} from '../dist/generateContent';

const fonts = {
  Lato: {
    normal: 'utils/fonts/Lato-Regular.ttf',
    bold: 'utils/fonts/Lato-Bold.ttf',
    light: 'utils/fonts/Lato-Light.ttf',
  }
}
export function generateExample(certificate, i18n) {
  const printer = new PdfPrinter(fonts);

  const content = generateContent(certificate, i18n);

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [20, 20, 20, 40],
    footer: function (currentPage: number, pageCount: number) { return { text: currentPage.toString() + ' / ' + pageCount, style: 'footer', alignment: 'center' } },
    content: [
      ...content,
    ],
    styles: styles
  };
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('utils/generating.pdf'));
  pdfDoc.end();
}

import certificate from '../test/testingCertificate.json';
// @ts-ignore
const i18n: Translate = new Translate(certificate.Certificate.CertificateLanguages);
generateExample(certificate, i18n);
