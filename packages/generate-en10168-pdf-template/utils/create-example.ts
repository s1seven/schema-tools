/* eslint-disable no-console */
import fs from 'node:fs';
import Module from 'node:module';
import path from 'node:path';
import { performance, PerformanceObserver } from 'node:perf_hooks';
import { finished } from 'node:stream/promises';
import vm from 'node:vm';
import PdfPrinter from 'pdfmake';
import type { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';

import type { Translations } from '@s1seven/schema-tools-types';

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

function buildModule(filePath: string) {
  const code = fs.readFileSync(filePath, 'utf8');
  const _module = new Module(filePath);
  _module.filename = filePath;
  _module['_compile'](code, filePath);
  return _module.exports;
}

async function generateContentInSandbox(certificate: object, translations: Translations) {
  const { generateContent } = buildModule(
    path.resolve(`${__dirname}/../../../dist/packages/generate-en10168-pdf-template/generateContent.cjs`),
  );

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

async function print(content: Content) {
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

async function generateExample(certificate: object, translations: Translations) {
  performance.mark('generateExampleStart');

  const content = (await performance.timerify(generateContentInSandbox)(certificate, translations)) as Content;
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
  console.profile('generate-coa-example-pdf');
  await generateExample(certificate, translations);
  console.profileEnd('generate-coa-example-pdf');
  console.log('after', { heapUsed: getHeapUsage() });
})();
