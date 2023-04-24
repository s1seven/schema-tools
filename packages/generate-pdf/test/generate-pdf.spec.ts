/* eslint-disable @typescript-eslint/no-var-requires */
import { createHash } from 'node:crypto';
import { createWriteStream, existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path, { join, parse, resolve } from 'node:path';
import { Writable } from 'node:stream';
import { fromBuffer } from 'pdf2pic';
import type { ToBase64Response } from 'pdf2pic/dist/types/toBase64Response';
import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';

import { EN10168Schema, Schemas, SupportedSchemas } from '@s1seven/schema-tools-types';

import { type GeneratePdfOptionsExtended, buildModule, generateInSandbox, generatePdf } from '../src';

type TestMap = {
  name: string;
  type: SupportedSchemas;
  version: string;
  styles: StyleDictionary;
  extraTranslationsPath?: string;
  translationsPath: string;
  certificateHtmlPath: string;
  expectedPdfPath: string;
  validCertificate: Schemas;
  docDefinition: Partial<TDocumentDefinitions>;
  generatorPath?: string;
  localOnly?: boolean;
};

/*
  When adding a new version, please also add a new test suite to the testMap below.
  Add new unreleased versions both to versions and unreleasedVersions. 
  Remove from unreleasedVersions upon release.
  To add more than one fixture per version, use the following naming format:
  valid_cert_<number>.json
  valid_cert_<number>.pdf
  valid_cert_<number>.html
  */

const testMap = [
  {
    type: SupportedSchemas.EN10168,
    versions: ['v0.1.0', 'v0.2.0', 'v0.3.0', 'v0.4.0', 'v0.4.1'],
    unreleasedVersions: [],
  },
  {
    type: SupportedSchemas.COA,
    versions: ['v0.0.4', 'v0.1.0', 'v0.2.0', 'v1.0.0', 'v1.1.0'],
    unreleasedVersions: [],
  },
];

const fonts = {
  Lato: {
    normal: `${__dirname}/../node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
    bold: `${__dirname}/../node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
    italics: `${__dirname}/../node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
    light: `${__dirname}/../node_modules/lato-font/fonts/lato-light/lato-light.woff`,
  },
  NotoSansSC: {
    normal: `${__dirname}/../../../fixtures/fonts/noto-sans-sc-chinese-simplified-300-normal.woff2`,
    bold: `${__dirname}/../../../fixtures/fonts/noto-sans-sc-chinese-simplified-700-normal.woff2`,
    italics: `${__dirname}/../../../fixtures/fonts/noto-sans-sc-chinese-simplified-100-normal.woff2`,
    light: `${__dirname}/../../../fixtures/fonts/noto-sans-sc-chinese-simplified-100-normal.woff2`,
  },
};

const languageFontMap = {
  CN: 'NotoSansSC',
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

const runPDFGenerationTests = (testSuite: TestMap) => {
  const {
    name,
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
    localOnly,
  } = testSuite;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  describe(`${type} - version ${version} - ${name}.json`, () => {
    it('should render PDF certificate using certificate object and local PDF generator script', async () => {
      if (!generatorPath) {
        return;
      }
      const outputFilePath = `./${type}-${version}-test2.pdf`;
      const translations = JSON.parse(readFileSync(translationsPath, 'utf8'));
      const extraTranslations = extraTranslationsPath ? JSON.parse(readFileSync(extraTranslationsPath, 'utf8')) : {};
      const generatePdfOptions: GeneratePdfOptionsExtended<'stream'> = localOnly
        ? {
            docDefinition: { ...docDefinition, styles },
            outputType: 'stream',
            fonts,
            generatorPath,
            translations,
            extraTranslations,
            languageFontMap,
          }
        : {
            docDefinition,
            outputType: 'stream',
            fonts,
            generatorPath,
            languageFontMap,
          };
      //
      const pdfDoc = await generatePdf(validCertificate, generatePdfOptions);
      const writeStream = createWriteStream(outputFilePath);
      pdfDoc.pipe(writeStream);
      pdfDoc.end();
      await waitWritableStreamEnd(writeStream, outputFilePath);
    }, 8000);

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
        outputType: 'buffer',
        fonts,
        generatorPath,
        translations,
        extraTranslations,
        languageFontMap,
      });

      const expectedPDF: ToBase64Response = await fromBuffer(expectedPDFBuffer, options)(1, true);
      const result: ToBase64Response = await fromBuffer(pdfDoc, options)(1, true);
      const expectedHash = createHash('sha256').update(expectedPDF.base64).digest('hex');
      const resultHash = createHash('sha256').update(result.base64).digest('hex');
      expect(pdfDoc instanceof Buffer).toEqual(true);
      expect(resultHash).toEqual(expectedHash);
    }, 8000);

    it('should render PDF certificate using certificate object and remote PDF generator script', async () => {
      const outputFilePath = `./${type}-${version}-test.pdf`;
      const translations = JSON.parse(readFileSync(translationsPath, 'utf8'));
      const extraTranslations = extraTranslationsPath ? JSON.parse(readFileSync(extraTranslationsPath, 'utf8')) : {};

      const generatePdfOptions: GeneratePdfOptionsExtended<'stream'> = localOnly
        ? {
            docDefinition: { ...docDefinition, styles },
            outputType: 'stream',
            fonts,
            generatorPath,
            translations,
            extraTranslations,
            languageFontMap,
          }
        : {
            outputType: 'stream',
            fonts,
            languageFontMap,
          };
      //
      const pdfDoc = await generatePdf(validCertificate, generatePdfOptions);
      const writeStream = createWriteStream(outputFilePath);
      pdfDoc.pipe(writeStream);
      pdfDoc.end();
      await waitWritableStreamEnd(writeStream, outputFilePath);
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
};

describe('GeneratePDF', function () {
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

  testMap.forEach((schema) => {
    const { type, versions } = schema;
    const styles = require(`../../generate-${type}-pdf-template/utils/styles.js`);

    versions.forEach((version, index) => {
      const path = resolve(`${__dirname}/../../../fixtures/${type}/${version}`);
      const files = readdirSync(path);
      const filtered = files.filter((file) => file.match(/^valid_cert_[\d]+.json|^valid_cert.json/));
      const lastestVersion = index === versions.length - 1;

      filtered.map((validCert) => {
        const { name } = parse(validCert);
        const validCertificate = require(join(path, validCert));
        const certificateHtmlPath = `${path}/${name}.html`;
        const expectedPdfPath = `${path}/${name}.pdf`;
        const translationsPath = `${path}/translations.json`;
        let extraTranslationsPath: string;
        let generatorPath: string;

        // TODO: refactor this
        if (type === SupportedSchemas.COA && !['v0.0.4', 'v0.1.0'].includes(version)) {
          extraTranslationsPath = `${path}/extra_translations.json`;
        }
        if (lastestVersion) {
          generatorPath = resolve(`${__dirname}/../../generate-${type}-pdf-template/dist/generateContent.js`);
        }

        runPDFGenerationTests({
          name,
          type,
          version,
          styles,
          translationsPath,
          extraTranslationsPath,
          certificateHtmlPath,
          expectedPdfPath,
          validCertificate,
          docDefinition,
          generatorPath,
          localOnly: schema.unreleasedVersions.includes(version),
        });
      });
    });
  });
});
