import { HtmlDiffer } from '@markedjs/html-differ';
import logger from '@markedjs/html-differ/lib/logger';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { parse, resolve } from 'path';

import { ExtraTranslations, Translations } from '@s1seven/schema-tools-types';
import { SchemaDirUnion, SupportedSchemas, SupportedSchemasDirMap } from '@s1seven/schema-tools-types';

import { generateHtml, GenerateHtmlOptions } from '../src/index';

/*
  When adding a new fixture version, add a new test suite to the testMap below.
  For unreleased versions, add the localOnly flag.
  To add more than one fixture per version, use the following naming format:
  valid_cert_<number>.json
  valid_cert_<number>.pdf
  valid_cert_<number>.html
*/

type CertificateTestMap = {
  type: SchemaDirUnion;
  version: string;
  localOnly?: boolean;
};

const certificateTestMap: CertificateTestMap[] = [
  {
    type: SupportedSchemasDirMap[SupportedSchemas.COA],
    version: 'v0.0.4',
  },
  {
    type: SupportedSchemasDirMap[SupportedSchemas.COA],
    version: 'v0.1.0',
  },
  {
    type: SupportedSchemasDirMap[SupportedSchemas.COA],
    version: 'v0.2.0',
  },
  {
    type: SupportedSchemasDirMap[SupportedSchemas.COA],
    version: 'v1.0.0',
  },
  {
    type: SupportedSchemasDirMap[SupportedSchemas.COA],
    version: 'v1.1.0',
  },
  {
    type: SupportedSchemasDirMap[SupportedSchemas.EN10168],
    version: 'v0.1.0',
  },
  {
    type: SupportedSchemasDirMap[SupportedSchemas.EN10168],
    version: 'v0.2.0',
  },
  {
    type: SupportedSchemasDirMap[SupportedSchemas.EN10168],
    version: 'v0.3.0',
  },
  {
    type: SupportedSchemasDirMap[SupportedSchemas.EN10168],
    version: 'v0.4.0',
  },
  {
    type: SupportedSchemasDirMap[SupportedSchemas.EN10168],
    version: 'v0.4.1',
  },
];

function generatePaths(validCertName: string, dirPath: string) {
  const { name } = parse(validCertName);
  const certificatePath = `${dirPath}/${name}.json`;
  const schemaTranslationsPath = `${dirPath}/translations.json`;
  const partialsMapPath = `${dirPath}/partials-map.json`;
  const expectedHtmlFromHbs = readFileSync(`${dirPath}/${name}.html`, 'utf-8');
  const schemaExtraTranslationsPath = existsSync(`${dirPath}/extra_translations.json`)
    ? `${dirPath}/extra_translations.json`
    : undefined;

  let partialsMap: Record<string, string>;
  try {
    partialsMap = JSON.parse(readFileSync(partialsMapPath, 'utf-8'));
  } catch (e) {
    // partialsMap is not present
    partialsMap = undefined;
  }

  return {
    name,
    certificatePath,
    schemaTranslationsPath,
    schemaExtraTranslationsPath,
    expectedHtmlFromHbs,
    partialsMap,
  };
}

const htmlDifferOptions = {
  ignoreAttributes: ['src'],
  ignoreWhitespaces: true,
  ignoreComments: true,
  ignoreEndTags: true,
  ignoreDuplicateAttributes: false,
};

type TestMap = {
  name: string;
  type: SchemaDirUnion;
  version: string;
  certificatePath: string;
  schemaTranslationsPath: string;
  schemaExtraTranslationsPath?: string;
  htmlDifferOptions: Record<string, unknown>;
  expectedHtmlFromHbs: string;
  partialsMap?: Record<string, string>;
  localTemplatePath?: string;
  localOnly?: boolean;
};

const runHTMLGenerationTests = async (testMap: TestMap) => {
  const {
    name,
    type,
    version,
    certificatePath,
    schemaTranslationsPath,
    schemaExtraTranslationsPath,
    htmlDifferOptions,
    expectedHtmlFromHbs,
    partialsMap,
    localTemplatePath,
    localOnly,
  } = testMap;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  describe(`For ${type} - version ${version} - ${name}`, () => {
    let certificate: Record<string, unknown>;
    let translations: Translations | undefined;
    let extraTranslations: ExtraTranslations | undefined;
    let localExtraOptions: GenerateHtmlOptions | undefined;

    beforeAll(async () => {
      certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
      translations = JSON.parse(readFileSync(schemaTranslationsPath, 'utf8'));
      extraTranslations = schemaExtraTranslationsPath
        ? JSON.parse(readFileSync(schemaExtraTranslationsPath, 'utf8'))
        : {};

      if (localOnly) {
        localExtraOptions = {
          translations,
          extraTranslations,
          templatePath: localTemplatePath,
          partialsMap,
        };
      }
    });

    it('should render HTML certificate using certificate local path and HBS template', async () => {
      const generateHtmlOptions = localOnly ? localExtraOptions : { partialsMap };
      const html = await generateHtml(certificatePath, generateHtmlOptions);
      const htmlDiffer = new HtmlDiffer(htmlDifferOptions);
      //
      const isEqual = await htmlDiffer.isEqual(expectedHtmlFromHbs, html);
      if (!isEqual) {
        const diff = await htmlDiffer.diffHtml(expectedHtmlFromHbs, html);
        logger.logDiffText(diff, { charsAroundDiff: 40 });
      }
      expect(isEqual).toBe(true);
    }, 8000);

    it('should render HTML certificate using loaded certificate and HBS template', async () => {
      const generateHtmlOptions = localOnly ? localExtraOptions : { partialsMap };
      const html = await generateHtml(certificate, generateHtmlOptions);
      const htmlDiffer = new HtmlDiffer(htmlDifferOptions);
      //
      const isEqual = await htmlDiffer.isEqual(expectedHtmlFromHbs, html);
      if (!isEqual) {
        const diff = await htmlDiffer.diffHtml(expectedHtmlFromHbs, html);
        logger.logDiffText(diff, { charsAroundDiff: 40 });
      }
      expect(isEqual).toBe(true);
    }, 8000);

    it('should render HTML certificate using local translations', async () => {
      const generateHtmlOptions = localOnly ? localExtraOptions : { translations, extraTranslations, partialsMap };
      const html = await generateHtml(certificate, generateHtmlOptions);
      const htmlDiffer = new HtmlDiffer(htmlDifferOptions);
      //
      const isEqual = await htmlDiffer.isEqual(expectedHtmlFromHbs, html);
      if (!isEqual) {
        const diff = await htmlDiffer.diffHtml(expectedHtmlFromHbs, html);
        logger.logDiffText(diff, { charsAroundDiff: 40 });
      }
      expect(isEqual).toBe(true);
    }, 5000);
  });
};

describe('GenerateHTML', function () {
  certificateTestMap.forEach((schemaType) => {
    const { type, version, localOnly } = schemaType;

    const dirPath = resolve(`${__dirname}/../../../fixtures/${type}/${version}`);
    const files = readdirSync(dirPath);
    const validCertNames = files.filter((file) => file.match(/^valid_cert_[\d]+.json|^valid_cert.json/));
    const localTemplatePath = `${dirPath}/template.hbs`;

    validCertNames.map(async (validCertName) => {
      const {
        name,
        certificatePath,
        schemaTranslationsPath,
        schemaExtraTranslationsPath,
        expectedHtmlFromHbs,
        partialsMap,
      } = generatePaths(validCertName, dirPath);

      await runHTMLGenerationTests({
        name,
        type,
        version,
        certificatePath,
        schemaTranslationsPath,
        schemaExtraTranslationsPath,
        htmlDifferOptions,
        localTemplatePath,
        expectedHtmlFromHbs,
        partialsMap,
        localOnly,
      });
    });
  });
});
