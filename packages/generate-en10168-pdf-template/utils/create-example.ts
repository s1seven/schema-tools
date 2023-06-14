import fs from 'fs';
import Module from 'module';
import path from 'path';
import PdfPrinter from 'pdfmake';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import vm from 'vm';

import translations from '../../../fixtures/EN10168/v0.1.0/translations.json';
import certificate from '../../../fixtures/EN10168/v0.1.0/valid_cert.json';
import styles from './styles';

const fonts = {
  Lato: {
    normal: `${__dirname}/../../../node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
    bold: `${__dirname}/../../../node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
    italics: `${__dirname}/../../../node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
    light: `${__dirname}/../../../node_modules/lato-font/fonts/lato-light/lato-light.woff`,
  },
};

function buildModule(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const _module = new Module(filePath);
  _module.filename = filePath;
  _module['_compile'](code, filePath);
  return _module.exports;
}

async function generateInSandbox(certificate, translations) {
  const { generateContent } = buildModule(path.resolve('./dist/generateContent.cjs'));

  const code = `(async function () {
    content = await generateContent(certificate, translations);
  }())`;

  const script = new vm.Script(code);
  const context = {
    certificate,
    translations,
    generateContent,
    content: {},
  };
  vm.createContext(context);
  await script.runInContext(context);
  const { content } = context;
  return content;
}

async function generateExample(certificate, translations) {
  const printer = new PdfPrinter(fonts);
  const content = (await generateInSandbox(certificate, translations)) as Content;

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [20, 20, 20, 40],
    footer: function (currentPage, pageCount) {
      return { text: currentPage.toString() + ' / ' + pageCount, style: 'footer', alignment: 'center' };
    },
    content,
    styles: styles as unknown as StyleDictionary,
    defaultStyle: {
      font: 'Lato',
      fontSize: 10,
    },
    // pageBreakBefore: function (currentNode) {
    //   const mainSections = ['ProductDescription', 'Inspection'];
    //   return mainSections.includes(currentNode.id);
    // },
  };
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('utils/generating.pdf'));
  pdfDoc.end();
}

(async function () {
  await generateExample(certificate, translations);
})();
