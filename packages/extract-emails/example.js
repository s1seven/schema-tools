/* eslint-disable @typescript-eslint/no-var-requires */
const { extractParties } = require('./dist/index');
const en10168Certificate = require('../../fixtures/EN10168/v0.3.0/valid_cert.json');
const coaCertificate = require('../../fixtures/CoA/v1.0.0/valid_cert.json');
const eCoCCertificate = require('../../fixtures/E-CoC/v1.0.0/valid_cert.json');

(async function (argv) {
  try {
    const schemaType = argv[2] || 'en10168-schemas';

    let mails;
    if (schemaType.startsWith('en10168')) {
      mails = await extractParties(en10168Certificate);
    } else if (schemaType.startsWith('e-coc')) {
      mails = await extractParties(eCoCCertificate);
    } else if (schemaType.startsWith('coa')) {
      mails = await extractParties(coaCertificate);
    }

    console.log({ mails });
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
