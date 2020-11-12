const { loadExternalFile } = require('@s1seven/schema-tools-utils');
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const styles = require('./styles');
const certificate = require('../../../fixtures/EN10168/v0.0.2/valid_cert.json');

const fonts = {
  Lato: {
    normal: 'node_modules/lato-font/fonts/lato-normal/lato-normal.woff',
    bold: 'node_modules/lato-font/fonts/lato-bold/lato-bold.woff',
    italics: 'node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff',
    light: 'node_modules/lato-font/fonts/lato-light/lato-light.woff',
  },
};

function buildModule(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const _module = new module.constructor();
  _module.filename = filePath;
  _module._compile(code, filePath);
  return _module.exports;
}

async function generateInSandbox(certificate, translations) {
  const { generateContent } = buildModule(path.resolve('./dist/generateContent.js'));

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

  const content = await generateInSandbox(certificate, translations);

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [20, 20, 20, 40],
    footer: function (currentPage, pageCount) {
      return { text: currentPage.toString() + ' / ' + pageCount, style: 'footer', alignment: 'center' };
    },
    content,
    styles,
    defaultStyle: {
      font: 'Lato',
      fontSize: 10,
    },
  };
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('utils/generating.pdf'));
  pdfDoc.end();
}

async function getTranslations(certificateLanguages, refSchemaUrl) {
  const translationsArray = await Promise.all(
    certificateLanguages.map(async (lang) => {
      const filePath = refSchemaUrl.replace('schema.json', `${lang}.json`);
      return { [lang]: await loadExternalFile(filePath, 'json') };
    }),
  );

  return translationsArray.reduce((acc, translation) => {
    const [key] = Object.keys(translation);
    acc[key] = translation[key];
    return acc;
  }, {});
}

(async function () {
  const translations = await getTranslations(certificate.Certificate.CertificateLanguages, certificate.RefSchemaUrl);
  await generateExample(certificate, translations);
})();
