/* eslint-disable no-console */
import { writeFileSync } from 'fs';

import { generateHtml } from './src/index';

const defaultExternalCertificatePath = `${__dirname}/../../fixtures/EN10168/v0.2.0/valid_cert.json`;
const defaultOutputPath = `${__dirname}/template.html`;

(async function (argv) {
  try {
    const certificatePath = argv[2] || defaultExternalCertificatePath;
    const outputPath = argv[3] || defaultOutputPath;

    const html = await generateHtml(certificatePath);
    writeFileSync(outputPath, html);
    console.log('HTML generated');
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
