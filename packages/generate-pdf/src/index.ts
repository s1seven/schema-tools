import {
  loadExternalFile,
  getCertificateLanguages,
  getTranslations,
  getSchemaConfig,
} from '@s1seven/schema-tools-utils';
import { BaseCertificateSchema, Translations } from '@s1seven/schema-tools-types';
import merge from 'lodash.merge';
import htmlToPdfmake from 'html-to-pdfmake';
import jsdom from 'jsdom';
import Module from 'module';
import PdfPrinter from 'pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import { URL } from 'url';
import vm from 'vm';

export type GeneratePdfOptions = {
  inputType?: 'html' | 'json';
  outputType?: 'buffer' | 'stream';
  templatePath?: string;
  docDefinition?: TDocumentDefinitions;
  fonts?: TFontDictionary;
};

const baseDocDefinition = (pdfMakeContent: TDocumentDefinitions['content']): TDocumentDefinitions => ({
  pageSize: 'A4',
  pageMargins: [20, 20, 20, 40],
  content: [pdfMakeContent],
});

async function buildModule(
  refSchemaUrl: string,
): Promise<{ generateContent: (certificate: BaseCertificateSchema, translations: Translations) => Content }> {
  const code = (await loadExternalFile(refSchemaUrl, 'text')) as string;
  const _module = new Module(refSchemaUrl);
  _module.filename = refSchemaUrl;
  (_module as any)._compile(code, refSchemaUrl);
  return _module.exports;
}

async function generateInSandbox(
  certificate: BaseCertificateSchema,
  translations: Record<string, unknown>,
): Promise<Content> {
  const refSchemaUrl = new URL(certificate.RefSchemaUrl);
  const [, schemaType, version] = refSchemaUrl.pathname.split('/');
  refSchemaUrl.pathname = `/${schemaType}/${version}/generate-pdf.min.js`;

  const { generateContent } = await buildModule(refSchemaUrl.href);
  const code = `(async function () {
    content = await generateContent(certificate, translations);
  }())`;

  const script = new vm.Script(code);
  const context = {
    certificate,
    translations,
    generateContent,
    content: [] as Content,
  };
  vm.createContext(context);
  await script.runInContext(context);
  const { content } = context;
  return content;
}

export async function generatePdf(
  certificateInput: string | Record<string, unknown>,
  options: GeneratePdfOptions = { inputType: 'html', outputType: 'buffer' },
): Promise<Buffer | PDFKit.PDFDocument> {
  let rawCert: any;
  if (typeof certificateInput === 'string') {
    rawCert = (await loadExternalFile(certificateInput, 'json')) as any;
  } else if (typeof certificateInput === 'object') {
    rawCert = certificateInput;
  } else {
    throw new Error(`Invalid input type : ${typeof certificateInput}`);
  }

  let pdfMakeContent: TDocumentDefinitions['content'];
  if (options.inputType === 'html') {
    const { JSDOM } = jsdom;
    const dom = new JSDOM('');
    pdfMakeContent = htmlToPdfmake(rawCert, { window: dom.window });
  } else if (options.inputType === 'json') {
    const refSchemaUrl = new URL(rawCert.RefSchemaUrl);
    const schemaConfig = getSchemaConfig(refSchemaUrl);
    const certificateLanguages = getCertificateLanguages(rawCert);
    const translations = certificateLanguages ? await getTranslations(certificateLanguages, schemaConfig) : {};
    pdfMakeContent = await generateInSandbox(rawCert, translations);
  } else {
    throw new Error('Invalid inputType');
  }

  const docDefinition: TDocumentDefinitions = options.docDefinition
    ? merge(options.docDefinition, baseDocDefinition(pdfMakeContent))
    : baseDocDefinition(pdfMakeContent);

  // console.log('PDF generation', docDefinition);
  let pdfDoc: PDFKit.PDFDocument;
  if (options.fonts) {
    const printer = new PdfPrinter(options.fonts);
    pdfDoc = printer.createPdfKitDocument(docDefinition);
  } else {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfDoc = pdfMake.createPdf(docDefinition).getStream();
  }

  if (options.outputType === 'stream') {
    return pdfDoc;
  } else if (options.outputType === 'buffer') {
    return new Promise((resolve, reject) => {
      let buffer: Buffer = Buffer.alloc(0);
      pdfDoc.on('data', (data) => {
        buffer = Buffer.concat([buffer, data], buffer.length + data.length);
      });
      pdfDoc.on('end', () => {
        resolve(buffer);
      });
      pdfDoc.on('error', (error) => {
        reject(error);
      });
    });
  }

  throw new Error('Invalid outputType');
}
