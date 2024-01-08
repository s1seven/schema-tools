/* eslint-disable @typescript-eslint/no-var-requires */
import { createHash } from 'node:crypto';
import { createWriteStream, existsSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import { join, parse, resolve } from 'node:path';
import { Writable } from 'node:stream';
import { fromBuffer } from 'pdf2pic';
import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';

import { SchemaDirUnion, SupportedSchemas, SupportedSchemasDirMap } from '@s1seven/schema-tools-types';
import { EN10168Schema, Schemas } from '@s1seven/schema-tools-types';

import { type GeneratePdfOptionsExtended, buildModule, generateInSandbox, generatePdf } from '../src';

type PDFGenerationTestProperties = {
  name: string;
  type: SupportedSchemas;
  version: string;
  styles: StyleDictionary;
  extraTranslationsPath?: string;
  translationsPath: string;
  expectedPdfPath: string;
  validCertificate: Schemas;
  docDefinition: Partial<TDocumentDefinitions>;
  generatorPath?: string;
  isUnreleasedVersion?: boolean;
};

/*
  When adding a new fixture version, add a new test suite to the testMap below.
  For unreleased versions, add the isUnreleasedVersion flag. This will ensure that only local files are used for the tests.
  Be sure to update isLatestVersion to the new version, isLatestVersion is used to run the 
  latest version with the current local generatePdf script. isLatestVersion is unrelated to the isUnreleasedVersion flag.
  To add more than one fixture per version, use the following naming format:
  valid_cert_<number>.json
  valid_cert_<number>.pdf
  valid_cert_<number>.html
*/

type CertificateTestMap = {
  type: SupportedSchemas;
  version: string;
  isUnreleasedVersion?: boolean;
  isLatestVersion?: boolean;
};

const certificateTestMap: CertificateTestMap[] = [
  {
    type: SupportedSchemas.COA,
    version: 'v0.0.4',
  },
  {
    type: SupportedSchemas.COA,
    version: 'v0.1.0',
  },
  {
    type: SupportedSchemas.COA,
    version: 'v0.2.0',
  },
  {
    type: SupportedSchemas.COA,
    version: 'v1.0.0',
  },
  {
    type: SupportedSchemas.COA,
    version: 'v1.1.0',
    isLatestVersion: true,
  },
  {
    type: SupportedSchemas.EN10168,
    version: 'v0.1.0',
  },
  {
    type: SupportedSchemas.EN10168,
    version: 'v0.2.0',
  },
  {
    type: SupportedSchemas.EN10168,
    version: 'v0.3.0',
  },
  {
    type: SupportedSchemas.EN10168,
    version: 'v0.4.0',
  },
  {
    type: SupportedSchemas.EN10168,
    version: 'v0.4.1',
    isLatestVersion: true,
  },
];

const fonts = {
  Lato: {
    normal: `${__dirname}/../../../node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
    bold: `${__dirname}/../../../node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
    italics: `${__dirname}/../../../node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
    light: `${__dirname}/../../../node_modules/lato-font/fonts/lato-light/lato-light.woff`,
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

const generatePaths = (
  validCertName: string,
  dirPath: string,
  type: SchemaDirUnion,
  version: string,
  isLatestVersion?: boolean,
) => {
  const { name } = parse(validCertName);
  const validCertificate = require(join(dirPath, validCertName));
  const expectedPdfPath = `${dirPath}/${name}.pdf`;
  const translationsPath = `${dirPath}/translations.json`;
  const coaCertsWithoutExtraTranslations = ['v0.0.4', 'v0.1.0'];
  let generatorPath: string;
  if (isLatestVersion) {
    generatorPath = resolve(`${__dirname}/../../generate-${type.toLowerCase()}-pdf-template/dist/generateContent.cjs`);
  }
  let extraTranslationsPath: string;

  if (type.toLowerCase() === SupportedSchemas.COA && !coaCertsWithoutExtraTranslations.includes(version)) {
    extraTranslationsPath = `${dirPath}/extra_translations.json`;
  }
  return {
    name,
    validCertificate,
    expectedPdfPath,
    translationsPath,
    generatorPath,
    extraTranslationsPath,
  };
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

const runPDFGenerationTests = (testSuite: PDFGenerationTestProperties) => {
  const {
    name,
    docDefinition,
    expectedPdfPath,
    generatorPath,
    styles,
    extraTranslationsPath,
    translationsPath,
    type,
    validCertificate,
    version,
    isUnreleasedVersion,
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
      const generatePdfOptions: GeneratePdfOptionsExtended<'stream'> = isUnreleasedVersion
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
    }, 10000);

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

      const expectedPDF = await fromBuffer(expectedPDFBuffer, options)(1, { responseType: 'base64' });
      const result = await fromBuffer(pdfDoc, options)(1, { responseType: 'base64' });
      const expectedHash = createHash('sha256')
        .update(expectedPDF.base64 as string)
        .digest('hex');
      const resultHash = createHash('sha256')
        .update(result.base64 as string)
        .digest('hex');
      expect(pdfDoc instanceof Buffer).toEqual(true);
      expect(resultHash).toEqual(expectedHash);
    }, 10000);

    it('should render PDF certificate using certificate object and remote PDF generator script', async () => {
      const outputFilePath = `./${type}-${version}-test.pdf`;
      const translations = JSON.parse(readFileSync(translationsPath, 'utf8'));
      const extraTranslations = extraTranslationsPath ? JSON.parse(readFileSync(extraTranslationsPath, 'utf8')) : {};

      const generatePdfOptions: GeneratePdfOptionsExtended<'stream'> = isUnreleasedVersion
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
  });
};

describe('GeneratePDF', function () {
  it('should build module using local PDF generator script', async () => {
    const generatorPath = resolve(`${__dirname}/../../generate-en10168-pdf-template/dist/generateContent.cjs`);
    const module = await buildModule(generatorPath);
    expect(module).toHaveProperty('generateContent');
  }, 3000);

  it('should execute in a sandbox the PDF generator script and return pdfmake content', async () => {
    const generatorPath = resolve(`${__dirname}/../../generate-en10168-pdf-template/dist/generateContent.cjs`);
    const certificatePath = resolve(`${__dirname}/../../../fixtures/EN10168/v0.1.0/valid_cert.json`);
    const certificate = JSON.parse(readFileSync(certificatePath, 'utf-8'));
    //
    const content = await generateInSandbox(certificate as EN10168Schema, {}, generatorPath);
    expect(content.length).toBeGreaterThan(1);
    expect(content[0]).toHaveProperty('style');
    expect(content[0]).toHaveProperty('table');
    expect(content[0]).toHaveProperty('layout');
  }, 8000);

  certificateTestMap.forEach((schema) => {
    const { type, version, isUnreleasedVersion, isLatestVersion } = schema;
    const styles = require(`../../generate-${type.toLowerCase()}-pdf-template/utils/styles.js`);
    const dirname: SchemaDirUnion = SupportedSchemasDirMap[type];

    const dirPath = resolve(`${__dirname}/../../../fixtures/${dirname}/${version}`);
    const files = readdirSync(dirPath);
    const validCertNames = files.filter((file) => file.match(/^valid_cert_[\d]+.json|^valid_cert.json/));

    validCertNames.forEach((validCertName) => {
      const { name, translationsPath, expectedPdfPath, validCertificate, generatorPath, extraTranslationsPath } =
        generatePaths(validCertName, dirPath, dirname, version, isLatestVersion);

      runPDFGenerationTests({
        name,
        type,
        version,
        styles,
        translationsPath,
        extraTranslationsPath,
        expectedPdfPath,
        validCertificate,
        docDefinition,
        generatorPath,
        isUnreleasedVersion,
      });
    });
  });
});
