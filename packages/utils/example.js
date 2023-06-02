/* eslint-disable @typescript-eslint/no-var-requires */
const { castCertificate } = require('../../dist/packages/utils/src/certificates');
const fs = require('fs');

const sampleCertificate = JSON.parse(fs.readFileSync('./sample_certificate.json').toString());

const result = castCertificate(sampleCertificate);
console.log(result);
