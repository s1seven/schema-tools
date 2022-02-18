import { HtmlDiffer } from '@markedjs/html-differ';
import logger from '@markedjs/html-differ/lib/logger';
import { readFileSync } from 'fs';

import { SupportedSchemas } from '@s1seven/schema-tools-types';

import { generateHtml } from '../src/index';

describe('GenerateHTML', function () {
  const testsMap = [
    {
      type: SupportedSchemas.EN10168,
      version: 'v0.0.2',
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/EN10168/v0.0.2/translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.0.2/certificate.ts`, 'utf-8'),
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.0.2/template_hbs.html`, 'utf-8'),
      expectedHtmlFromMjml: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.0.2/template_mjml.html`, 'utf-8'),
    },
    {
      type: SupportedSchemas.EN10168,
      version: 'v0.1.0',
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.1.0/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/EN10168/v0.1.0/translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.1.0/certificate.ts`, 'utf-8'),
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.1.0/template_hbs.html`, 'utf-8'),
      expectedHtmlFromMjml: '',
    },
    {
      type: SupportedSchemas.COA,
      version: 'v0.0.4',
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.0.4/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/CoA/v0.0.4/translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/CoA/v0.0.4/certificate.ts`, 'utf-8'),
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/CoA/v0.0.4/template_hbs.html`, 'utf-8'),
      expectedHtmlFromMjml: '',
    },
    {
      type: SupportedSchemas.COA,
      version: 'v0.1.0',
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.1.0/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/CoA/v0.1.0/translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/CoA/v0.1.0/certificate.ts`, 'utf-8'),
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/CoA/v0.1.0/template_hbs.html`, 'utf-8'),
      expectedHtmlFromMjml: '',
    },
  ];

  const htmlDifferOptions = {
    ignoreAttributes: ['src'],
    ignoreWhitespaces: true,
    ignoreComments: true,
    ignoreEndTags: true,
    ignoreDuplicateAttributes: false,
  };

  testsMap.forEach((testSuite) => {
    const { certificatePath, expectedHtmlFromHbs, expectedHtmlFromMjml, schemaTranslationsPath, type, version } =
      testSuite;
    describe(`For ${type} - version ${version}`, () => {
      it('should render HTML certificate using certificate local path and HBS template', async () => {
        const html = await generateHtml(certificatePath);
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
        const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
        const html = await generateHtml(certificate);
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
        const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
        const translations = JSON.parse(readFileSync(schemaTranslationsPath, 'utf8'));
        const html = await generateHtml(certificate, { translations });
        const htmlDiffer = new HtmlDiffer(htmlDifferOptions);
        //
        const isEqual = await htmlDiffer.isEqual(expectedHtmlFromHbs, html);
        if (!isEqual) {
          const diff = await htmlDiffer.diffHtml(expectedHtmlFromHbs, html);
          logger.logDiffText(diff, { charsAroundDiff: 40 });
        }
        expect(isEqual).toBe(true);
      }, 5000);

      it.skip('should render HTML certificate using certificate local path and MJML template', async () => {
        const html = await generateHtml(certificatePath, { templateType: 'mjml' });
        expect(html).toEqual(expectedHtmlFromMjml);
      }, 8000);
    });
  });
});
