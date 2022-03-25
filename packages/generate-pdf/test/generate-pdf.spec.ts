import { createHash } from 'crypto';
import { createWriteStream, existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import { fromBuffer } from 'pdf2pic';
import { ToBase64Response } from 'pdf2pic/dist/types/toBase64Response';
import { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { Writable } from 'stream';

import { EN10168Schema, Schemas, SupportedSchemas } from '@s1seven/schema-tools-types';

import { buildModule, generateInSandbox, generatePdf } from '../src/index';

describe('GeneratePDF', function () {
  const fonts = {
    Lato: {
      normal: `${__dirname}/../node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
      bold: `${__dirname}/../node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
      italics: `${__dirname}/../node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
      light: `${__dirname}/../node_modules/lato-font/fonts/lato-light/lato-light.woff`,
    },
  };

  const docDefinition: Omit<TDocumentDefinitions, 'content'> = {
    pageSize: 'A4',
    pageMargins: [20, 20, 20, 40],
    footer: (currentPage, pageCount) => ({
      text: currentPage.toString() + ' / ' + pageCount,
      style: 'footer',
      alignment: 'center',
    }),
    defaultStyle: {
      font: 'Lato',
      fontSize: 10,
    },
  };

  //! only include local generator path for latest version
  const testMaps: {
    type: SupportedSchemas;
    version: string;
    generatorPath?: string;
    styles: StyleDictionary;
    extraTranslationsPath?: string;
    translationsPath: string;
    certificateHtmlPath: string;
    expectedPdfPath: string;
    validCertificate: Schemas;
    docDefinition: Partial<TDocumentDefinitions>;
  }[] = [
    {
      type: SupportedSchemas.EN10168,
      version: 'v0.1.0',
      styles: require('../../generate-en10168-pdf-template/utils/styles.js'),
      translationsPath: path.resolve(`${__dirname}/../../../fixtures/EN10168/v0.1.0/translations.json`),
      certificateHtmlPath: path.resolve(`${__dirname}/../../../fixtures/EN10168/v0.1.0/template_hbs.html`),
      expectedPdfPath: path.resolve(`${__dirname}/../../../fixtures/EN10168/v0.1.0/valid_cert.pdf`),
      validCertificate: require('../../../fixtures/EN10168/v0.1.0/valid_cert.json'),
      docDefinition,
    },
    {
      type: SupportedSchemas.EN10168,
      version: 'v0.2.0',
      generatorPath: path.resolve(`${__dirname}/../../generate-en10168-pdf-template/dist/generateContent.js`),
      styles: require('../../generate-en10168-pdf-template/utils/styles.js'),
      translationsPath: path.resolve(`${__dirname}/../../../fixtures/EN10168/v0.2.0/translations.json`),
      certificateHtmlPath: path.resolve(`${__dirname}/../../../fixtures/EN10168/v0.2.0/template_hbs.html`),
      expectedPdfPath: path.resolve(`${__dirname}/../../../fixtures/EN10168/v0.2.0/valid_cert.pdf`),
      validCertificate: require('../../../fixtures/EN10168/v0.2.0/valid_cert.json'),
      docDefinition,
    },
    {
      type: SupportedSchemas.COA,
      version: 'v0.0.4',
      styles: require('../../generate-coa-pdf-template/utils/styles.js'),
      translationsPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.0.4/translations.json`),
      certificateHtmlPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.0.4/template_hbs.html`),
      expectedPdfPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.0.4/valid_cert.pdf`),
      validCertificate: require('../../../fixtures/CoA/v0.0.4/valid_cert.json'),
      docDefinition,
    },
    {
      type: SupportedSchemas.COA,
      version: 'v0.1.0',
      styles: require('../../generate-coa-pdf-template/utils/styles.js'),
      translationsPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.1.0/translations.json`),
      certificateHtmlPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.1.0/template_hbs.html`),
      expectedPdfPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.1.0/valid_cert.pdf`),
      validCertificate: require('../../../fixtures/CoA/v0.1.0/valid_cert.json'),
      docDefinition,
    },
    {
      type: SupportedSchemas.COA,
      version: 'v0.2.0',
      generatorPath: path.resolve(`${__dirname}/../../generate-coa-pdf-template/dist/generateContent.js`),
      styles: require('../../generate-coa-pdf-template/utils/styles.js'),
      translationsPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.2.0/translations.json`),
      extraTranslationsPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.2.0/extra_translations.json`),
      certificateHtmlPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.2.0/template_hbs.html`),
      expectedPdfPath: path.resolve(`${__dirname}/../../../fixtures/CoA/v0.2.0/valid_cert.pdf`),
      validCertificate: require('../../../fixtures/CoA/v0.2.0/valid_cert.json'),
      docDefinition,
    },
  ];

  const waitWritableStreamEnd = (writeStream: Writable, outputFilePath: string) => {
    return new Promise((resolve, reject) => {
      writeStream
        .on('finish', () => {
          expect(existsSync(outputFilePath)).toEqual(true);
          unlinkSync(outputFilePath);
          resolve(true);
        })
        .on('error', reject);
    });
  };

  it('should build module using local PDF generator script', async () => {
    const generatorPath = path.resolve(`${__dirname}/../../generate-en10168-pdf-template/dist/generateContent.js`);
    const module = await buildModule(generatorPath);
    expect(module).toHaveProperty('generateContent');
  }, 3000);

  it('should execute in a sandbox the PDF generator script and return pdfmake content', async () => {
    const generatorPath = path.resolve(`${__dirname}/../../generate-en10168-pdf-template/dist/generateContent.js`);
    const certificatePath = path.resolve(`${__dirname}/../../../fixtures/EN10168/v0.1.0/valid_cert.json`);
    const certificate = JSON.parse(readFileSync(certificatePath, 'utf-8'));
    //
    const content = await generateInSandbox(certificate as EN10168Schema, {}, generatorPath);
    expect(content.length).toBeGreaterThan(1);
    expect(content[0]).toHaveProperty('style');
    expect(content[0]).toHaveProperty('table');
    expect(content[0]).toHaveProperty('layout');
  }, 8000);

  testMaps.forEach((testSuite) => {
    const {
      certificateHtmlPath,
      docDefinition,
      expectedPdfPath,
      generatorPath,
      styles,
      extraTranslationsPath,
      translationsPath,
      type,
      validCertificate,
      version,
    } = testSuite;

    describe(`${type} - version ${version}`, () => {
      it('should render PDF certificate using certificate object and remote PDF generator script', async () => {
        const outputFilePath = `./${type}-${version}-test.pdf`;
        //
        const pdfDoc = await generatePdf(validCertificate, {
          outputType: 'stream',
          fonts,
        });
        const writeStream = createWriteStream(outputFilePath);
        pdfDoc.pipe(writeStream);
        pdfDoc.end();
        await waitWritableStreamEnd(writeStream, outputFilePath);
      }, 25000);

      it('should render PDF certificate using certificate object and local PDF generator script', async () => {
        const outputFilePath = `./${type}-${version}-test2.pdf`;
        if (!generatorPath) {
          return;
        }
        //
        const pdfDoc = await generatePdf(validCertificate, {
          docDefinition,
          outputType: 'stream',
          fonts,
          generatorPath,
        });
        const writeStream = createWriteStream(outputFilePath);
        pdfDoc.pipe(writeStream);
        pdfDoc.end();
        await waitWritableStreamEnd(writeStream, outputFilePath);
      }, 15000);

      it('should render PDF certificate using certificate object, local PDF generator script, styles and translations', async () => {
        if (!generatorPath) {
          return;
        }
        const translations = JSON.parse(readFileSync(translationsPath, 'utf8'));
        const extraTranslations = extraTranslationsPath ? JSON.parse(readFileSync(extraTranslationsPath, 'utf8')) : {};
        const options = {
          density: 100,
          width: 600,
          height: 600,
        };
        const expectedPDFBuffer = readFileSync(expectedPdfPath);
        //
        const pdfDoc = await generatePdf(validCertificate, {
          docDefinition: { ...docDefinition, styles },
          // docDefinition,
          outputType: 'buffer',
          fonts,
          generatorPath,
          translations,
          extraTranslations,
        });

        const expectedPDF: ToBase64Response = await fromBuffer(expectedPDFBuffer, options)(1, true);
        const result: ToBase64Response = await fromBuffer(pdfDoc, options)(1, true);
        const expectedHash = createHash('sha256').update(expectedPDF.base64).digest('hex');
        const resultHash = createHash('sha256').update(result.base64).digest('hex');
        expect(pdfDoc instanceof Buffer).toEqual(true);
        expect(resultHash).toEqual(expectedHash);
      }, 15000);

      // TODO: skipped due to issues between v0.0.2 and v0.1.0 EN10168 html => investigate
      it.skip('should render PDF certificate using HTML certificate ', async () => {
        const certificateHtml = readFileSync(certificateHtmlPath, 'utf8');
        //
        const buffer = await generatePdf(certificateHtml, {
          inputType: 'html',
          outputType: 'buffer',
          fonts,
        });
        writeFileSync('./test.pdf', buffer);
        expect(buffer instanceof Buffer).toEqual(true);
      }, 10000);
    });
  });
});
