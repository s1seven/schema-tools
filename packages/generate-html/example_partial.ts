/* eslint-disable no-console */
import { readFileSync, writeFileSync } from 'fs';

import { generateHtml } from './src/index';

const defaultExternalCertificatePath = `${__dirname}/../../fixtures/EN10168/v0.3.0/valid_cert.json`;
const defaultTranslationsPath = `${__dirname}/../../fixtures/EN10168/v0.3.0/translations.json`;
const defaultOutputPath = `${__dirname}/template.html`;
const defaultTemplatePath = `${__dirname}/../../fixtures/EN10168/v0.3.0/template.hbs`;
const defaultTemplatePartialPath = `${__dirname}/../../fixtures/EN10168/v0.3.0/inspection.hbs`;

(async function (argv) {
  try {
    const certificatePath = argv[2] || defaultExternalCertificatePath;
    const outputPath = argv[3] || defaultOutputPath;
    const translationsPath = argv[4] || defaultTranslationsPath;
    const templatePath = argv[5] || defaultTemplatePath;
    const templatePartialPath = argv[6] || defaultTemplatePartialPath;
    const translations = JSON.parse(readFileSync(translationsPath).toString());

    const html = await generateHtml(certificatePath, {
      translations,
      templatePath,
      templateType: 'hbs',
      partialsMap: {
        inspection: templatePartialPath,
      },
    });
    writeFileSync(outputPath, html);
    console.log('HTML generated');
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
