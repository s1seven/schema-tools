const { loadExternalFile } = require('@s1seven/schema-tools-utils');
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const styles = require('./styles');
const { generateContent } = require('../dist/generateContent');
const certificate = require('../../../fixtures/EN10168/v0.0.2/valid_cert.json');

const fonts = {
  Lato: {
    normal: 'utils/fonts/Lato-Light.ttf',
    bold: 'utils/fonts/Lato-Regular.ttf',
    italics: 'utils/fonts/Lato-LightItalic.ttf',
    light: 'utils/fonts/Lato-Light.ttf',
  },
};

async function generateExample(certificate, translations) {
  const printer = new PdfPrinter(fonts);
  const content = await generateContent(certificate, translations);

  // console.log(JSON.stringify(content, null, 2));

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
