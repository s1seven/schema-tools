/* eslint-disable @typescript-eslint/no-var-requires */

const { readFileSync, writeFileSync } = require('fs');
const { generateHtml } = require('./dist/index');
const { compile } = require('handlebars');

const defaultExternalCertificatePath = `${__dirname}/../../fixtures/EN10168/v0.3.0/valid_cert.json`;
const defaultTranslationsPath = `${__dirname}/../../fixtures/EN10168/v0.3.0/translations.json`;
const defaultOutputPath = `${__dirname}/template.html`;
const defaultTemplatePath = '../../../EN10168-schemas/template.hbs';
const defaultTemplatePartialPath = '../../../EN10168-schemas/inspection.hbs';

(async function (argv) {
  try {
    const certificatePath = argv[2] || defaultExternalCertificatePath;
    const outputPath = argv[3] || defaultOutputPath;
    const translationsPath = argv[4] || defaultTranslationsPath;
    const templatePath = argv[5] || defaultTemplatePath;
    const templatePartialPath = argv[6] || defaultTemplatePartialPath;
    const translations = JSON.parse(readFileSync(translationsPath).toString());
    const templatePartial = readFileSync(templatePartialPath).toString();

    const html = await generateHtml(certificatePath, {
      translations,
      templatePath,
      templateType: 'hbs',
      handlebars: { partials: { inspection: (ctx, opts) => compile(templatePartial)(ctx, opts) } },
    });
    writeFileSync(outputPath, html);
    console.log('HTML generated');
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
