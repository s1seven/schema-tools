/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */

import { readFileSync, writeFileSync } from 'fs';

import { generateHtml } from './src/index';

const defaultExternalCertificatePath = `${__dirname}/../../fixtures/CoA/v0.2.0/valid_cert.json`;
const defaultOutputPath = `${__dirname}/template.html`;
const defaultTranslationsPath = `${__dirname}/../../fixtures/CoA/v0.2.0/translations.json`;
const defaultExtraTranslationsPath = `${__dirname}/../../fixtures/CoA/v0.2.0/extra_translations.json`;
const defaultPartialsMap = `${__dirname}/../../fixtures/CoA/v1.1.0/partials-map.json`;
const defaultTemplatePath = '../../../CoA-schemas/template.hbs';

(async function (argv) {
  try {
    const certificatePath = argv[2] || defaultExternalCertificatePath;
    const outputPath = argv[3] || defaultOutputPath;
    const translationsPath = argv[4] || defaultTranslationsPath;
    const extraTranslationsPath = argv[5] || defaultExtraTranslationsPath;
    const templatePath = argv[6] || defaultTemplatePath;
    const partialsMapPath = argv[6] || defaultPartialsMap;

    const translations = JSON.parse(readFileSync(translationsPath).toString());
    const extraTranslations = JSON.parse(readFileSync(extraTranslationsPath).toString());
    const partialsMap = JSON.parse(readFileSync(partialsMapPath).toString());

    const html = await generateHtml(certificatePath, { translations, extraTranslations, templatePath, partialsMap });
    writeFileSync(outputPath, html);
    console.log('HTML generated');
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
