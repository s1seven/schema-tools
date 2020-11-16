import {
  loadExternalFile,
  getCertificateLanguages,
  getTranslations,
  getSchemaConfig,
} from '@s1seven/schema-tools-utils';
import { ECoCSchema, EN10168Schema, Translations } from '@s1seven/schema-tools-types';
import htmlToPdfmake from 'html-to-pdfmake';
import jsdom from 'jsdom';
import merge from 'lodash.merge';
import Module from 'module';
import PdfPrinter from 'pdfmake';
import { Content, StyleDictionary, TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import { URL } from 'url';
import vm from 'vm';

export type GeneratePdfOptions = {
  inputType?: 'json' | 'html';
  outputType?: 'buffer' | 'stream';
  templatePath?: string;
  docDefinition?: Partial<TDocumentDefinitions>;
  fonts?: TFontDictionary;
};

const fonts = {
  Lato: {
    normal: 'node_modules/lato-font/fonts/lato-normal/lato-normal.woff',
    bold: 'node_modules/lato-font/fonts/lato-bold/lato-bold.woff',
    italics: 'node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff',
    light: 'node_modules/lato-font/fonts/lato-light/lato-light.woff',
  },
};

const generatePdfOptions: GeneratePdfOptions = {
  inputType: 'json',
  outputType: 'buffer',
};

const baseDocDefinition = (content: TDocumentDefinitions['content']): TDocumentDefinitions => ({
  pageSize: 'A4',
  pageMargins: [20, 20, 20, 40],
  content,
  defaultStyle: {
    font: 'Lato',
  },
});

async function buildModule(
  refSchemaUrl: URL,
): Promise<{ generateContent: (certificate: EN10168Schema | ECoCSchema, translations: Translations) => Content }> {
  const code = (await loadExternalFile(refSchemaUrl.href, 'text')) as string;
  const fileName = refSchemaUrl.pathname;
  const _module = new Module(fileName);
  _module.filename = fileName;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_module as any)._compile(code, fileName);
  return _module.exports;
}

async function generateInSandbox(
  certificate: EN10168Schema | ECoCSchema,
  translations: Record<string, unknown>,
): Promise<Content> {
  const refSchemaUrl = new URL(certificate.RefSchemaUrl);
  const [, schemaType, version] = refSchemaUrl.pathname.split('/');
  refSchemaUrl.pathname = `/${schemaType}/${version}/generate-pdf.min.js`;

  const { generateContent } = await buildModule(refSchemaUrl);
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

function getPdfMakeContentFromHTML(certificate: string): TDocumentDefinitions['content'] {
  const { JSDOM } = jsdom;
  const dom = new JSDOM('');
  return htmlToPdfmake(certificate, { window: dom.window });
}

async function getPdfMakeContentFromObject(
  certificate: EN10168Schema | ECoCSchema,
): Promise<TDocumentDefinitions['content']> {
  const refSchemaUrl = new URL(certificate.RefSchemaUrl);
  const schemaConfig = getSchemaConfig(refSchemaUrl);
  const certificateLanguages = getCertificateLanguages(certificate);
  const translations = certificateLanguages ? await getTranslations(certificateLanguages, schemaConfig) : {};
  return generateInSandbox(certificate, translations);
}

async function getPdfMakeStyles(certificate: EN10168Schema | ECoCSchema): Promise<StyleDictionary> {
  const refSchemaUrl = new URL(certificate.RefSchemaUrl);
  const [, schemaType, version] = refSchemaUrl.pathname.split('/');
  refSchemaUrl.pathname = `/${schemaType}/${version}/generate-pdf.styles.json`;
  return (await loadExternalFile(refSchemaUrl.href, 'json')) as StyleDictionary;
}

export async function generatePdf(
  certificateInput: Record<string, unknown> | string,
  options?: GeneratePdfOptions,
): Promise<Buffer | PDFKit.PDFDocument> {
  const opts = options ? merge(generatePdfOptions, options || {}) : generatePdfOptions;

  let pdfMakeContent: TDocumentDefinitions['content'];
  if (opts.inputType === 'html') {
    pdfMakeContent = getPdfMakeContentFromHTML(certificateInput as string);
  } else if (opts.inputType === 'json') {
    let rawCert: EN10168Schema | ECoCSchema;
    if (typeof certificateInput === 'string') {
      rawCert = (await loadExternalFile(certificateInput, 'json')) as EN10168Schema | ECoCSchema;
    } else if (typeof certificateInput === 'object') {
      rawCert = certificateInput as EN10168Schema | ECoCSchema;
    } else {
      throw new Error(`Invalid certificate type : ${typeof certificateInput}`);
    }
    pdfMakeContent = await getPdfMakeContentFromObject(rawCert as EN10168Schema | ECoCSchema);
    if (!opts.docDefinition.styles) {
      opts.docDefinition.styles = await getPdfMakeStyles(rawCert);
    }
  } else {
    throw new Error('Invalid inputType');
  }

  const docDefinition: TDocumentDefinitions = opts.docDefinition
    ? merge(opts.docDefinition, baseDocDefinition(pdfMakeContent))
    : baseDocDefinition(pdfMakeContent);

  const printer = new PdfPrinter(opts.fonts || fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  if (opts.outputType === 'stream') {
    return pdfDoc;
  } else if (opts.outputType === 'buffer') {
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
      pdfDoc.end();
    });
  }

  throw new Error('Invalid outputType');
}
