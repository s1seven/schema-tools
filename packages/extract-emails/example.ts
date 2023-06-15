/* eslint-disable no-console */
import coaCertificate from '../../fixtures/CoA/v1.1.0/valid_cert.json';
import eCoCCertificate from '../../fixtures/E-CoC/v1.0.0/valid_cert.json';
import en10168Certificate from '../../fixtures/EN10168/v0.3.0/valid_cert.json';
import { extractParties, PartyEmail } from './src/index';

(async function (argv) {
  try {
    const schemaType = argv[2] || 'en10168-schemas';

    let mails: PartyEmail[] | null = null;
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
