import { HtmlDiffer } from '@markedjs/html-differ';
import logger from '@markedjs/html-differ/lib/logger';
import { readFileSync } from 'fs';

import { ExtraTranslations, SupportedSchemas, Translations } from '@s1seven/schema-tools-types';

import { generateHtml, GenerateHtmlOptions } from '../src/index';

describe('GenerateHTML', function () {
  //! only include localOnly, localTemplatePath for latest (unreleased) version
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
      type: SupportedSchemas.EN10168,
      version: 'v0.2.0',
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.2.0/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/EN10168/v0.2.0/translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.2.0/certificate.ts`, 'utf-8'),
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.2.0/template_hbs.html`, 'utf-8'),
      expectedHtmlFromMjml: '',
    },
    {
      type: SupportedSchemas.EN10168,
      version: 'v0.3.0',
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.3.0/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/EN10168/v0.3.0/translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.3.0/certificate.ts`, 'utf-8'),
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.3.0/template_hbs.html`, 'utf-8'),
      localTemplatePath: `${__dirname}/../../../fixtures/EN10168/v0.3.0/template.hbs`,
      partialsMap: {
        inspection: 'https://schemas.s1seven.dev/en10168-schemas/v0.3.0/inspection.hbs',
      },
      expectedHtmlFromMjml: '',
    },
    {
      type: SupportedSchemas.EN10168,
      version: 'v0.4.0',
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.4.0/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/EN10168/v0.4.0/translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.4.0/certificate.ts`, 'utf-8'),
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.4.0/template_hbs.html`, 'utf-8'),
      localTemplatePath: `${__dirname}/../../../fixtures/EN10168/v0.4.0/template.hbs`,
      partialsMap: {
        inspection: 'https://schemas.s1seven.dev/en10168-schemas/v0.4.0/inspection.hbs',
        company: 'https://schemas.s1seven.dev/schema-definitions/v0.0.6/company/company.hbs',
        measurement: 'https://schemas.s1seven.dev/schema-definitions/v0.0.6/measurement/measurement.hbs',
        validation: 'https://schemas.s1seven.dev/schema-definitions/v0.0.6/validation/validation.hbs',
        productDescription:
          'https://schemas.s1seven.dev/schema-definitions/v0.0.6/product-description/product-description.hbs',
        commercialTransaction:
          'https://schemas.s1seven.dev/schema-definitions/v0.0.6/commercial-transaction/commercial-transaction.hbs',
        chemicalElement: 'https://schemas.s1seven.dev/schema-definitions/v0.0.6/chemical-element/chemical-element.hbs',
      },
      expectedHtmlFromMjml: '',
    },
    {
      type: SupportedSchemas.EN10168,
      version: 'v0.4.1',
      certificatePath: `${__dirname}/../../../fixtures/EN10168/v0.4.1/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/EN10168/v0.4.1/translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.4.1/certificate.ts`, 'utf-8'),
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.4.1/template_hbs.html`, 'utf-8'),
      localTemplatePath: `${__dirname}/../../../fixtures/EN10168/v0.4.1/template.hbs`,
      partialsMap: {
        inspection: `${__dirname}/../../../fixtures/EN10168/v0.4.1/inspection.hbs`,
        company: 'https://schemas.s1seven.dev/schema-definitions/v0.0.7/company/company.hbs',
        measurement: 'https://schemas.s1seven.dev/schema-definitions/v0.0.7/measurement/measurement.hbs',
        validation: 'https://schemas.s1seven.dev/schema-definitions/v0.0.7/validation/validation.hbs',
        productDescription:
          'https://schemas.s1seven.dev/schema-definitions/v0.0.7/product-description/product-description.hbs',
        commercialTransaction:
          'https://schemas.s1seven.dev/schema-definitions/v0.0.7/commercial-transaction/commercial-transaction.hbs',
        chemicalElement: 'https://schemas.s1seven.dev/schema-definitions/v0.0.7/chemical-element/chemical-element.hbs',
      },
      expectedHtmlFromMjml: '',
      localOnly: true,
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
    {
      type: SupportedSchemas.COA,
      version: 'v0.2.0',
      certificatePath: `${__dirname}/../../../fixtures/CoA/v0.2.0/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/CoA/v0.2.0/translations.json`,
      schemaExtraTranslationsPath: `${__dirname}/../../../fixtures/CoA/v0.2.0/extra_translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/CoA/v0.2.0/certificate.ts`, 'utf-8'),
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/CoA/v0.2.0/template_hbs.html`, 'utf-8'),
      expectedHtmlFromMjml: '',
    },
    {
      type: SupportedSchemas.COA,
      version: 'v1.0.0',
      certificatePath: `${__dirname}/../../../fixtures/CoA/v1.0.0/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/CoA/v1.0.0/translations.json`,
      schemaExtraTranslationsPath: `${__dirname}/../../../fixtures/CoA/v1.0.0/extra_translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/CoA/v1.0.0/certificate.ts`, 'utf-8'),
      localTemplatePath: `${__dirname}/../../../fixtures/CoA/v1.0.0/template.hbs`,
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/CoA/v1.0.0/template_hbs.html`, 'utf-8'),
      expectedHtmlFromMjml: '',
      partialsMap: {
        company: 'https://schemas.s1seven.dev/schema-definitions/v0.0.5/company/company.hbs',
      },
    },
    {
      type: SupportedSchemas.COA,
      version: 'v1.1.0',
      certificatePath: `${__dirname}/../../../fixtures/CoA/v1.1.0/valid_cert.json`,
      schemaTranslationsPath: `${__dirname}/../../../fixtures/CoA/v1.1.0/translations.json`,
      schemaExtraTranslationsPath: `${__dirname}/../../../fixtures/CoA/v1.1.0/extra_translations.json`,
      schemaInterface: readFileSync(`${__dirname}/../../../fixtures/CoA/v1.1.0/certificate.ts`, 'utf-8'),
      localTemplatePath: `${__dirname}/../../../fixtures/CoA/v1.1.0/template.hbs`,
      expectedHtmlFromHbs: readFileSync(`${__dirname}/../../../fixtures/CoA/v1.1.0/template_hbs.html`, 'utf-8'),
      expectedHtmlFromMjml: '',
      partialsMap: {
        company: 'https://schemas.s1seven.dev/schema-definitions/v0.0.7/company/company.hbs',
      },
      localOnly: true,
    },
  ];

  const htmlDifferOptions = {
    ignoreAttributes: ['src'],
    ignoreWhitespaces: true,
    ignoreComments: true,
    ignoreEndTags: true,
    ignoreDuplicateAttributes: false,
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  testsMap.forEach((testSuite) => {
    const {
      certificatePath,
      expectedHtmlFromHbs,
      expectedHtmlFromMjml,
      localOnly,
      localTemplatePath,
      partialsMap,
      schemaExtraTranslationsPath,
      schemaTranslationsPath,
      type,
      version,
    } = testSuite;
    describe(`For ${type} - version ${version}`, () => {
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

      it.skip('should render HTML certificate using certificate local path and MJML template', async () => {
        const html = await generateHtml(certificatePath, { templateType: 'mjml' });
        expect(html).toEqual(expectedHtmlFromMjml);
      }, 8000);
    });
  });
});
