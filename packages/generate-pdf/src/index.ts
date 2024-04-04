import { cloneDeep } from 'lodash';
import clone from 'lodash.clone';
import get from 'lodash.get';
import merge from 'lodash.merge';
import { PDFDocument } from 'pdf-lib';
import PdfPrinter from 'pdfmake';
import { Content, StyleDictionary, TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import vm from 'vm';

import {
  ExternalStandards,
  ExtraTranslations,
  LanguageFontMap,
  Schemas,
  schemaToExternalStandardsMap,
  Translations,
} from '@s1seven/schema-tools-types';
import {
  getCertificateLanguages,
  getCertificateType,
  getExtraTranslations,
  getSchemaConfig,
  getTranslations,
  loadExternalFile,
} from '@s1seven/schema-tools-utils';

import { attachCertificateToPdf } from './attach-certificate-to-pdf';
import { buildModule } from './build-module';
import { makeA3Compliant } from './pdf-a-3a';

export interface GeneratePdfOptions {
  generatorPath?: string;
  docDefinition?: Partial<TDocumentDefinitions>;
  fonts?: TFontDictionary;
  translations?: Translations;
  extraTranslations?: ExtraTranslations;
  languageFontMap?: LanguageFontMap;
  attachCertificate?: boolean;
  a3Compliant?: boolean;
  title?: string;
}

const baseDocDefinition = (content: TDocumentDefinitions['content']): TDocumentDefinitions => ({
  pageSize: 'A4',
  pageMargins: [20, 20, 20, 40],
  content,
  defaultStyle: {
    font: 'NotoSans',
  },
  permissions: {
    modifying: false,
  },
});

const defaultFonts: TFontDictionary = {
  NotoSans: {
    normal: `${__dirname}/../assets/fonts/NotoSans-Regular.ttf`,
    bold: `${__dirname}/../assets/fonts/NotoSans-Bold.ttf`,
    italics: `${__dirname}/../assets/fonts/NotoSans-Italic.ttf`,
  },
};

/**
 * Generate a PDF document from a certificate object
 * @param certificate The certificate object
 * @param options Options for generating the PDF
 * @returns A promise that resolves to a buffer containing the PDF document
 */
export async function generatePdf(certificate: Schemas | string, options: GeneratePdfOptions = {}): Promise<Buffer> {
  const jsonCertificate =
    typeof certificate === 'string' ? ((await loadExternalFile(certificate, 'json')) as Schemas) : certificate;

  options.fonts ??= defaultFonts;

  const certificateCloneForPdfMake = cloneDeep(jsonCertificate);
  const pdfMakeContent = await buildPdfContent(certificateCloneForPdfMake, options);
  const docDefinition: TDocumentDefinitions = merge(
    baseDocDefinition(pdfMakeContent),
    clone(options.docDefinition ?? {}),
  );

  const printer = new PdfPrinter(options.fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const pdfBuffer = await pdfDocToBuffer(pdfDoc);

  const { attachCertificate, a3Compliant } = options;
  if (!attachCertificate && !a3Compliant) return pdfBuffer;

  const pdfLibDoc = await PDFDocument.load(pdfBuffer);
  if (attachCertificate) await attachCertificateToPdf(pdfLibDoc, jsonCertificate);
  if (a3Compliant) await makeA3Compliant(pdfLibDoc, options.title);
  const uint8Array = await pdfLibDoc.save();
  return Buffer.from(uint8Array);
}

export const pdfDocToBuffer = (doc: PDFKit.PDFDocument) =>
  new Promise<Buffer>((resolve, reject) => {
    let buffer: Buffer = Buffer.alloc(0);
    doc.on('data', (data) => {
      buffer = Buffer.concat([buffer, data], buffer.length + data.length);
    });
    doc.on('end', () => resolve(buffer));
    doc.on('error', reject);
    doc.end();
  });

async function getPdfMakeContentFromObject(
  certificate: Schemas,
  generatorPath: string = null,
  translations?: Translations,
  extraTranslations?: ExtraTranslations,
  languageFontMap?: LanguageFontMap,
): Promise<TDocumentDefinitions['content']> {
  const refSchemaUrl = new URL(certificate.RefSchemaUrl);
  const schemaConfig = getSchemaConfig(refSchemaUrl);
  const certificateLanguages = getCertificateLanguages(certificate);

  const type = getCertificateType(schemaConfig);
  const externalStandards: ExternalStandards[] =
    schemaToExternalStandardsMap[type]
      ?.map((schemaType: keyof Schemas) => get(certificate, schemaType, undefined))
      .filter(Boolean) ?? [];

  if (!extraTranslations && certificateLanguages.length && externalStandards?.length) {
    extraTranslations = await getExtraTranslations(certificateLanguages, schemaConfig, externalStandards);
  }

  if (!translations && certificateLanguages.length) {
    translations = await getTranslations(certificateLanguages, schemaConfig);
  }

  return generateInSandbox(certificate, translations ?? {}, generatorPath, extraTranslations, languageFontMap);
}

function getPdfMakeStyles(certificate: Schemas): Promise<StyleDictionary> {
  const refSchemaUrl = new URL(certificate.RefSchemaUrl);
  const [, schemaType, version] = refSchemaUrl.pathname.split('/');
  refSchemaUrl.pathname = `/${schemaType}/${version}/generate-pdf.styles.json`;
  return loadExternalFile(refSchemaUrl.href, 'json') as Promise<StyleDictionary>;
}

async function buildPdfContent(
  certificate: Schemas,
  options: GeneratePdfOptions,
): Promise<TDocumentDefinitions['content']> {
  const pdfMakeContent = await getPdfMakeContentFromObject(
    certificate,
    options.generatorPath,
    options.translations,
    options.extraTranslations,
    options.languageFontMap,
  );
  if (!options.docDefinition?.styles) {
    const styles = await getPdfMakeStyles(certificate);
    if (!options.docDefinition) {
      options.docDefinition = { styles };
    } else {
      options.docDefinition.styles = styles;
    }
  }
  return pdfMakeContent;
}

export async function generateInSandbox(
  certificate: Schemas,
  translations: Record<string, unknown>,
  generatorPath?: string,
  extraTranslations?: ExtraTranslations,
  languageFontMap?: LanguageFontMap,
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
  const code = `
  (async function () {
    if (extraTranslations && Object.keys(extraTranslations).length) {
      content = await generateContent(certificate, translations, extraTranslations, languageFontMap);
    } else {
      content = await generateContent(certificate, translations, languageFontMap);
    }
  }())`;

  const script = new vm.Script(code);
  const context = {
    certificate,
    extraTranslations,
    translations,
    languageFontMap,
    generateContent,
    content: [] as Content[],
  };
  vm.createContext(context, {
    origin: 'generate-pdf',
    codeGeneration: { strings: false, wasm: false },
  });
  // for some reason runInContext runs slower than runInNewContext (by 30% !)
  await script.runInNewContext(context, { timeout: 5000, displayErrors: true });
  const { content } = context;
  return content;
}
