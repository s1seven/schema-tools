/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-var-requires */

const { readFileSync, writeFileSync } = require('fs');
const { generateHtml } = require('./dist/index');

const defaultExternalCertificatePath = `${__dirname}/../../fixtures/CoA/v0.2.0/valid_cert.json`;
const defaultOutputPath = `${__dirname}/template.html`;
const defaultTranslationsPath = `${__dirname}/../../fixtures/CoA/v0.2.0/translations.json`;
const defaultExtraTranslationsPath = `${__dirname}/../../fixtures/CoA/v0.2.0/extra_translations.json`;
const defaultTemplatePath = '/Users/eamon/work/CoA-schemas/template.hbs';

(async function (argv) {
  try {
    const certificatePath = argv[2] || defaultExternalCertificatePath;
    const outputPath = argv[3] || defaultOutputPath;
    const translationsPath = argv[4] || defaultTranslationsPath;
    const extraTranslationsPath = argv[5] || defaultExtraTranslationsPath;
    const templatePath = argv[6] || defaultTemplatePath;

    const translations = JSON.parse(readFileSync(translationsPath).toString());
    const extraTranslations = JSON.parse(readFileSync(extraTranslationsPath).toString());

    const html = await generateHtml(certificatePath, { translations, extraTranslations, templatePath });
    writeFileSync(outputPath, html);
    console.log('HTML generated');
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
