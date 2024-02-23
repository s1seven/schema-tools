import fs from 'fs';
import Module from 'module';
import path from 'path';
import PdfPrinter from 'pdfmake';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import vm from 'vm';

import extraTranslations from '../../../fixtures/CoA/v0.2.0/extra_translations.json';
import translations from '../../../fixtures/CoA/v0.2.0/translations.json';
import certificate from '../../../fixtures/CoA/v0.2.0/valid_cert.json';
import styles from './styles';

const fonts = {
  NotoSans: {
    normal: `${__dirname}/../../fixtures/fonts/NotoSans-Regular.ttf`,
    bold: `${__dirname}/../../fixtures/fonts/NotoSans-Bold.ttf`,
    light: `${__dirname}/../../fixtures/fonts/NotoSans-Light.ttf`,
    italics: `${__dirname}/../../fixtures/fonts/NotoSans-Italic.ttf`,
  },
  NotoSansSC: {
    normal: `${__dirname}/../../fixtures/fonts/NotoSansSC-Regular.ttf`,
    bold: `${__dirname}/../../fixtures/fonts/NotoSansSC-Bold.ttf`,
    light: `${__dirname}/../../fixtures/fonts/NotoSansSC-Light.ttf`,
    italics: `${__dirname}/../../fixtures/fonts/NotoSansSC-Regular.ttf`, // SC doesn't have italic
  },
};

function buildModule(filePath: string) {
  const code = fs.readFileSync(filePath, 'utf8');
  const _module = new Module(filePath);
  _module.filename = filePath;
  _module['_compile'](code, filePath);
  return _module.exports;
}

async function generateInSandbox(certificate, translations, extraTranslations) {
  const { generateContent } = buildModule(path.resolve('./dist/generateContent.cjs'));

  const code = `(async function () {
    content = await generateContent(certificate, translations, extraTranslations);
  }())`;

  const script = new vm.Script(code);
  const context = {
    certificate,
    translations,
    extraTranslations,
    generateContent,
    content: {},
  };
  vm.createContext(context);
  await script.runInContext(context);
  const { content } = context;
  return content;
}

async function generateExample(certificate, translations, extraTranslations) {
  const printer = new PdfPrinter(fonts);

  const content = (await generateInSandbox(certificate, translations, extraTranslations)) as Content;

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [20, 20, 20, 40],
    footer: function (currentPage, pageCount) {
      return {
        text: currentPage.toString() + ' / ' + pageCount,
        style: 'footer',
        alignment: 'center',
      };
    },
    content,
    styles: styles as unknown as StyleDictionary,
    defaultStyle: {
      font: 'NotoSans',
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
  await generateExample(certificate, translations, extraTranslations);
})();
