import { Content, StyleDictionary, TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import {
  getCertificateLanguages,
  getSchemaConfig,
  getTranslations,
  loadExternalFile,
} from '@s1seven/schema-tools-utils';
import { Schemas, Translations } from '@s1seven/schema-tools-types';
import htmlToPdfmake from 'html-to-pdfmake';
import jsdom from 'jsdom';
import merge from 'lodash.merge';
import Module from 'module';
import PdfPrinter from 'pdfmake';
import { URL } from 'url';
import vm from 'vm';

export { Content, StyleDictionary, TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';

export type GeneratePdfOptions = {
  inputType?: 'json' | 'html';
  outputType?: 'buffer' | 'stream';
  generatorPath?: string;
  docDefinition?: Partial<TDocumentDefinitions>;
  fonts?: TFontDictionary;
  translations?: Translations;
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

export async function buildModule(
  filePath: string,
  moduleName?: string,
): Promise<{ generateContent: (certificate: Schemas, translations: Translations) => Content[] }> {
  const code = await loadExternalFile(filePath, 'text');
  const fileName = moduleName || filePath;
  const _module = new Module(fileName);
  _module.filename = fileName;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_module as any)._compile(code, fileName);
  _module.loaded = true;
  return _module.exports;
}

export async function generateInSandbox(
  certificate: Schemas,
  translations: Record<string, unknown>,
  generatorPath?: string,
): Promise<Content[]> {
  let filePath: string;
  let moduleName: string;
  if (generatorPath) {
    filePath = generatorPath;
  } else {
    const refSchemaUrl = new URL(certificate.RefSchemaUrl);
    const [, schemaType, version] = refSchemaUrl.pathname.split('/');
    refSchemaUrl.pathname = `/${schemaType}/${version}/generate-pdf.min.js`;
    filePath = refSchemaUrl.href;
    moduleName = refSchemaUrl.pathname;
  }

  const { generateContent } = await buildModule(filePath, moduleName);
  const code = `(async function () {
    content = await generateContent(certificate, translations);
  }())`;

  const script = new vm.Script(code);
  const context = {
    certificate,
    translations,
    generateContent,
    content: [] as Content[],
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
  certificate: Schemas,
  generatorPath: string = null,
  translations: Translations = null,
): Promise<TDocumentDefinitions['content']> {
  const refSchemaUrl = new URL(certificate.RefSchemaUrl);
  const schemaConfig = getSchemaConfig(refSchemaUrl);
  const certificateLanguages = getCertificateLanguages(certificate);
  if (!translations) {
    translations = certificateLanguages?.length ? await getTranslations(certificateLanguages, schemaConfig) : {};
  }
  return generateInSandbox(certificate, translations, generatorPath);
}

function getPdfMakeStyles(certificate: Schemas): Promise<StyleDictionary> {
  const refSchemaUrl = new URL(certificate.RefSchemaUrl);
  const [, schemaType, version] = refSchemaUrl.pathname.split('/');
  refSchemaUrl.pathname = `/${schemaType}/${version}/generate-pdf.styles.json`;
  return loadExternalFile(refSchemaUrl.href, 'json') as Promise<StyleDictionary>;
}

async function buildPdfContent(
  certificateInput: Record<string, unknown> | string,
  options: GeneratePdfOptions,
): Promise<TDocumentDefinitions['content']> {
  let pdfMakeContent: TDocumentDefinitions['content'];
  if (options.inputType === 'html' && typeof certificateInput === 'string') {
    pdfMakeContent = getPdfMakeContentFromHTML(certificateInput);
  } else if (options.inputType === 'json') {
    let rawCert: Schemas;
    if (typeof certificateInput === 'string') {
      rawCert = (await loadExternalFile(certificateInput, 'json')) as Schemas;
    } else if (typeof certificateInput === 'object') {
      rawCert = certificateInput as Schemas;
    } else {
      throw new Error(`Invalid certificate type : ${typeof certificateInput}`);
    }
    pdfMakeContent = await getPdfMakeContentFromObject(rawCert, options.generatorPath, options.translations);
    if (options.docDefinition && !options.docDefinition.styles) {
      options.docDefinition.styles = await getPdfMakeStyles(rawCert);
    }
  } else {
    throw new Error('Invalid inputType');
  }
  return pdfMakeContent;
}

export async function generatePdf(
  certificateInput: Record<string, unknown> | string,
  options: {
    outputType: 'buffer';
    inputType?: 'json' | 'html';
    generatorPath?: string;
    docDefinition?: Partial<TDocumentDefinitions>;
    fonts?: TFontDictionary;
    translations?: Translations;
  },
): Promise<Buffer>;

export async function generatePdf(
  certificateInput: Record<string, unknown> | string,
  options: {
    outputType: 'stream';
    inputType?: 'json' | 'html';
    generatorPath?: string;
    docDefinition?: Partial<TDocumentDefinitions>;
    fonts?: TFontDictionary;
    translations?: Translations;
  },
): Promise<PDFKit.PDFDocument>;

export async function generatePdf(
  certificateInput: Record<string, unknown> | string,
  options?: GeneratePdfOptions,
): Promise<Buffer | PDFKit.PDFDocument> {
  const opts = options ? merge(generatePdfOptions, options || {}) : generatePdfOptions;
  const pdfMakeContent = await buildPdfContent(certificateInput, opts);

  const docDefinition: TDocumentDefinitions = opts.docDefinition
    ? merge(JSON.parse(JSON.stringify(opts.docDefinition)), baseDocDefinition(pdfMakeContent))
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
      pdfDoc.on('end', () => resolve(buffer));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }

  throw new Error('Invalid outputType');
}
