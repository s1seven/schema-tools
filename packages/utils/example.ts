/* eslint-disable no-console */
import fs from 'fs';

import { castCertificate } from './src/certificates';

const sampleCertificate = JSON.parse(fs.readFileSync('./sample_certificate.json').toString());

const result = castCertificate(sampleCertificate);
console.log(result);
