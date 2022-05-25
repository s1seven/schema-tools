/* eslint-disable @typescript-eslint/no-var-requires */
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const Module = require('module');
const path = require('path');
const vm = require('vm');
const styles = require('./styles');
const certificate = require('../../../fixtures/CoA/v0.2.0/valid_cert.json');
const translations = require('../../../fixtures/CoA/v0.2.0/translations.json');
const extraTranslations = require('../../../fixtures/CoA/v0.2.0/extra_translations.json');

const fonts = {
  Lato: {
    normal: 'node_modules/lato-font/fonts/lato-normal/lato-normal.woff',
    bold: 'node_modules/lato-font/fonts/lato-bold/lato-bold.woff',
    italics: 'node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff',
    light: 'node_modules/lato-font/fonts/lato-light/lato-light.woff',
  },
  NotoSansSC: {
    normal: 'Noto_Sans_SC/NotoSansSC-Regular.otf',
    bold: 'Noto_Sans_SC/NotoSansSC-Bold.otf',
    italics: 'Noto_Sans_SC/NotoSansSC-Thin.otf',
    light: 'Noto_Sans_SC/NotoSansSC-Thin.otf',
  }
};

function buildModule(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const _module = new Module(filePath);
  _module.filename = filePath;
  _module._compile(code, filePath);
  return _module.exports;
}

async function generateInSandbox(certificate, translations, extraTranslations) {
  const { generateContent } = buildModule(path.resolve('./dist/generateContent.js'));

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

  const content = await generateInSandbox(certificate, translations, extraTranslations);

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [20, 20, 20, 40],
    footer: function (currentPage, pageCount) {
      return { text: currentPage.toString() + ' / ' + pageCount, style: 'footer', alignment: 'center' };
    },
    content,
    styles,
    defaultStyle: {
      font: 'NotoSansSC',
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
