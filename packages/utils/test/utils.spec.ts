import { readFileSync } from 'fs';
import { asECoCCertificate, asEN10168Certificate } from '../src/index';

const EN_CERT_PATH = `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`;
const ECOC_CERT_PATH = `${__dirname}/../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json`;

describe('Utils', function () {
  it('should validate ecoc certficates', async () => {
    const ecocSchema = JSON.parse(readFileSync(ECOC_CERT_PATH, 'utf8') as string);

    const responseOk = asECoCCertificate(ecocSchema, '/');
    expect(responseOk).toHaveProperty('ok');

    delete ecocSchema.RefSchemaUrl;
    const responseInvalid = asECoCCertificate(ecocSchema, '/');
    expect(responseInvalid).toHaveProperty('error');
  });

  it('should validate EN10168 certficates', async () => {
    const enSchema = JSON.parse(readFileSync(EN_CERT_PATH, 'utf8') as string);
    const responseOk = asEN10168Certificate(enSchema, '/');
    expect(responseOk).toHaveProperty('ok');

    delete enSchema.Certificate;
    const responseInvalid = asEN10168Certificate(enSchema, '/');
    expect(responseInvalid).toHaveProperty('error');
  });
});
