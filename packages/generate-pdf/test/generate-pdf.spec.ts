import { createWriteStream, existsSync, readFileSync, unlinkSync } from 'fs';
import path from 'path';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import certificate from '../../../fixtures/EN10168/v0.0.2/valid_cert.json';
import { generatePdf } from '../src/index';

describe('GeneratePDF', function () {
  const fonts = {
    Lato: {
      normal: `${__dirname}/../node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
      bold: `${__dirname}/../node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
      italics: `${__dirname}/../node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
      light: `${__dirname}/../node_modules/lato-font/fonts/lato-light/lato-light.woff`,
    },
  };

  it('should render PDF certificate using certificate object and remote PDF generator script', async () => {
    certificate.RefSchemaUrl = 'https://schemas.en10204.io/en10168-schemas/v0.0.3-1/schema.json';
    const docDefinition: Partial<TDocumentDefinitions> = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 40],
      footer: function (currentPage, pageCount) {
        return { text: currentPage.toString() + ' / ' + pageCount, style: 'footer', alignment: 'center' };
      },
      defaultStyle: {
        font: 'Lato',
        fontSize: 10,
      },
    };

    const pdfDoc = (await generatePdf(certificate, {
      docDefinition,
      outputType: 'stream',
      fonts,
    })) as PDFKit.PDFDocument;

    const outputFilePath = './test.pdf';
    const writeStream = createWriteStream(outputFilePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    await new Promise((resolve, reject) => {
      writeStream
        .on('finish', () => {
          expect(existsSync(outputFilePath)).toEqual(true);
          unlinkSync(outputFilePath);
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }, 20000);

  it('should render PDF certificate using certificate object and local PDF generator script', async () => {
    certificate.RefSchemaUrl = 'https://schemas.en10204.io/en10168-schemas/v0.0.3-1/schema.json';
    const generatorPath = path.resolve(`${__dirname}/../../generate-EN10168-pdf-template/dist/generateContent.js`);

    const docDefinition: Partial<TDocumentDefinitions> = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 40],
      footer: function (currentPage, pageCount) {
        return { text: currentPage.toString() + ' / ' + pageCount, style: 'footer', alignment: 'center' };
      },
      defaultStyle: {
        font: 'Lato',
        fontSize: 10,
      },
    };

    const pdfDoc = (await generatePdf(certificate, {
      docDefinition,
      outputType: 'stream',
      fonts,
      generatorPath,
    })) as PDFKit.PDFDocument;

    const outputFilePath = './test-2.pdf';
    const writeStream = createWriteStream(outputFilePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    await new Promise((resolve, reject) => {
      writeStream
        .on('finish', () => {
          expect(existsSync(outputFilePath)).toEqual(true);
          unlinkSync(outputFilePath);
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }, 15000);

  it('should render PDF certificate using HTML certificate ', async () => {
    const certificateHtmlPath = `${__dirname}/../../../fixtures/EN10168/v0.0.2/template_hbs.html`;
    const certificateHtml = readFileSync(certificateHtmlPath, 'utf8');

    const buffer = (await generatePdf(certificateHtml, {
      inputType: 'html',
      outputType: 'buffer',
      fonts,
    })) as Buffer;
    expect(buffer instanceof Buffer).toEqual(true);
  }, 10000);
});
