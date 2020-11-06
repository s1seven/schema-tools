import { loadExternalFile } from '@s1seven/schema-tools-utils';
import merge from 'lodash.merge';
import htmlToPdfmake from 'html-to-pdfmake';
import jsdom from 'jsdom';
import PdfPrinter from 'pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
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
    const [, schemaType, version] = refSchemaUrl.pathname.split('/');
    refSchemaUrl.pathname = `/${schemaType}/${version}/pdf_make_content.js`;
    const schemaRepoCode = (await loadExternalFile(refSchemaUrl.href, 'text')) as string;

    // TODO: Will need adaption and getTransalations
    const code = `${schemaRepoCode}
    content = Generate(certificate);`;

    const script = new vm.Script(code);
    const context = {
      certificate: rawCert,
      content: {} as TDocumentDefinitions['content'],
    };
    vm.createContext(context);
    script.runInContext(context);

    console.log(context.content);
    pdfMakeContent = context.content;
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
