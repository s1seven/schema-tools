/* eslint-disable no-console */
import coaCertificate from '../../fixtures/CoA/v1.1.0/valid_cert.json';
import eCoCCertificate from '../../fixtures/E-CoC/v1.0.0/valid_cert.json';
import en10168Certificate from '../../fixtures/EN10168/v0.4.1/valid_cert.json';
import { buildCertificateSummary, CertificateSummary } from './src/index';

(async function (argv) {
  try {
    const schemaType = argv[2] || 'en10168-schemas';

    let summary: CertificateSummary | null = null;
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
