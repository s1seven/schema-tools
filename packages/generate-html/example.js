/* eslint-disable @typescript-eslint/no-var-requires */

const { generateHtml } = require('../dist/index');

const defaultExternalCertificatePath = `${__dirname}/../../fixtures/EN10168/valid_en10168_test.json`;

(async function (argv) {
  try {
    const certificatePath = argv[2] || defaultExternalCertificatePath;
    const html = await generateHtml(certificatePath);
    console.log('HTML generated', html);
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
