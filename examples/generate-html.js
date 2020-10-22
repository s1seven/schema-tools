const { generateHtml } = require('../dist/index');

const defaultTemplatePath = `https://raw.githubusercontent.com/s1seven/schemas/main/EN10168.hbs`;
const defaultExternalSchemaPath = `${__dirname}/../fixtures/EN10168/valid_en10168_test.json`;

(async function (argv) {
  try {
    const templatePath = argv[2] || defaultTemplatePath;
    const schemaPath = argv[3] || defaultExternalSchemaPath;
    const html = await generateHtml(templatePath, schemaPath);
    console.log('HTML generated', html);
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
