/* eslint-disable @typescript-eslint/no-var-requires */
const { buildCertificateSummary } = require('./dist/index.js');
const en10168Certificate = require('../../fixtures/EN10168/v0.4.1/valid_cert.json');
const coaCertificate = require('../../fixtures/CoA/v1.1.0/valid_cert.json');
const eCoCCertificate = require('../../fixtures/E-CoC/v1.0.0/valid_cert.json');

(async function (argv) {
  try {
    const schemaType = argv[2] || 'en10168-schemas';

    let summary;
    if (schemaType.startsWith('en10168')) {
      summary = await buildCertificateSummary(en10168Certificate);
    } else if (schemaType.startsWith('e-coc')) {
      summary = await buildCertificateSummary(eCoCCertificate);
    } else if (schemaType.startsWith('coa')) {
      summary = await buildCertificateSummary(coaCertificate);
    }

    console.log({ summary });
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
