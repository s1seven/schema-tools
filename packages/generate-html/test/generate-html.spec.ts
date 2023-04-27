import { HtmlDiffer } from '@markedjs/html-differ';
import logger from '@markedjs/html-differ/lib/logger';
import { readdirSync, readFileSync } from 'fs';
import { parse, resolve } from 'path';

import { ExtraTranslations, SupportedSchemas, Translations } from '@s1seven/schema-tools-types';

import { generateHtml, GenerateHtmlOptions } from '../src/index';

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

const htmlDifferOptions = {
  ignoreAttributes: ['src'],
  ignoreWhitespaces: true,
  ignoreComments: true,
  ignoreEndTags: true,
  ignoreDuplicateAttributes: false,
};

type TestMap = {
  name: string;
  type: SupportedSchemas;
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
  testMap.forEach((schemaType) => {
    const { type, versions } = schemaType;

    versions.forEach(async (version, index) => {
      const path = resolve(`${__dirname}/../../../fixtures/${type}/${version}`);
      const files = readdirSync(path);
      const filtered = files.filter((file) => file.match(/^valid_cert_[\d]+.json|^valid_cert.json/));

      filtered.map(async (validCert) => {
        const { name } = parse(validCert);
        const fileVersion = name.replace('valid_cert', '').replace('.json', '').trim();
        const certificatePath = `${__dirname}/../../../fixtures/${type}/${version}/${name}.json`;
        const schemaTranslationsPath = `${__dirname}/../../../fixtures/${type}/${version}/translations.json`;
        // only include localTemplatePath for latest (unreleased) version
        const localTemplatePath =
          schemaType.unreleasedVersions.includes(version) && index === versions.length - 1
            ? `${__dirname}/../../../fixtures/${type}/${version}/template.hbs`
            : undefined;
        let schemaExtraTranslationsPath = `${__dirname}/../../../fixtures/${type}/${version}/extra_translations.json`;
        const partialsMapPath = `${__dirname}/../../../fixtures/${type}/${version}/partials-map.json`;
        const expectedHtmlFromHbs = readFileSync(
          `${__dirname}/../../../fixtures/${type}/${version}/template_hbs${fileVersion}.html`,
          'utf-8',
        );

        let partialsMap;
        try {
          readFileSync(schemaExtraTranslationsPath, 'utf-8');
        } catch (e) {
          // if extra translations file does not exist, set to undefined
          schemaExtraTranslationsPath = undefined;
        }
        try {
          partialsMap = JSON.parse(readFileSync(partialsMapPath, 'utf-8'));
        } catch (e) {
          partialsMap = undefined;
        }

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
          localOnly: schemaType.unreleasedVersions.includes(version),
        });
      });
    });
  });
});
