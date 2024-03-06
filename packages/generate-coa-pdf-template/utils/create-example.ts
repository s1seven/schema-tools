/* eslint-disable no-console */
import fs from 'node:fs';
import Module from 'node:module';
import path from 'node:path';
import { performance, PerformanceObserver } from 'node:perf_hooks';
import { finished } from 'node:stream/promises';
import vm from 'node:vm';
import PdfPrinter from 'pdfmake';
import type { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';

import type { ExtraTranslations, Translations } from '@s1seven/schema-tools-types';

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

async function generateContentInSandbox(
  certificate: object,
  translations: Translations,
  extraTranslations: ExtraTranslations,
) {
  const { generateContent } = buildModule(
    path.resolve(`${__dirname}/../../../dist/packages/generate-coa-pdf-template/generateContent.cjs`),
  );
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

async function print(content: Content) {
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

  const printer = new PdfPrinter(fonts);
  return printer.createPdfKitDocument(docDefinition);
}

async function store(pdfDoc: PDFKit.PDFDocument) {
  const writable = fs.createWriteStream('utils/generating.pdf');
  pdfDoc.pipe(writable);
  pdfDoc.end();
  await finished(writable);
}

function getHeapUsage() {
  const usage = process.memoryUsage();
  return Math.round((usage.heapUsed / 1024 / 1024) * 100) / 100;
}

async function generateExample(certificate: object, translations: Translations, extraTranslations: ExtraTranslations) {
  performance.mark('generateExampleStart');

  const content = (await performance.timerify(generateContentInSandbox)(
    certificate,
    translations,
    extraTranslations,
  )) as Content;
  console.log('generateContentInSandbox', { heapUsed: getHeapUsage() });

  const pdfDoc = await performance.timerify(print)(content);
  console.log('print', { heapUsed: getHeapUsage() });

  await performance.timerify(store)(pdfDoc);
  console.log('store', { heapUsed: getHeapUsage() });

  performance.mark('generateExampleEnd');
  performance.measure('total', 'generateExampleStart', 'generateExampleEnd');
}

(async function () {
  const obs = new PerformanceObserver((items) => {
    for (const item of items.getEntries()) {
      console.log(item.name, { duration: item.duration, startTime: item.startTime });
    }
  });
  obs.observe({ entryTypes: ['measure', 'function'] });

  console.log('before', { heapUsed: getHeapUsage() });
  console.profile('generate-en10168-example-pdf');
  await generateExample(certificate, translations, extraTranslations);
  console.log('after', { heapUsed: getHeapUsage() });
  console.profile('generate-en10168-example-pdf');
})();
