/* eslint-disable @typescript-eslint/no-var-requires */
const { extractEmails } = require('./dist/index');
const en10168Certificate = require('../../fixtures/EN10168/v0.0.2/valid_cert.json');
const eCoCCertificate = require('../../fixtures/E-CoC/v0.0.2-2/valid_cert.json');

(async function (argv) {
  try {
    const schemaType = argv[2] || 'en10168-schemas';

    let mails;
    if (schemaType.startsWith('en10168')) {
      mails = await extractEmails(en10168Certificate);
    } else if (schemaType.startsWith('e-coc')) {
      mails = await extractEmails(eCoCCertificate);
    }

    console.log({ mails });
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
