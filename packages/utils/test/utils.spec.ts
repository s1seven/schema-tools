import { readFileSync } from 'fs';
import { asECoCCertificate, asEN10168Certificate } from '../src/index';

const EN_CERT_PATH = `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`;
const ECOC_CERT_PATH = `${__dirname}/../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json`;

describe('Utils', function () {
  describe('E-CoC', function () {
    const ecocSchema = JSON.parse(readFileSync(ECOC_CERT_PATH, 'utf8') as string);

    it('should validate a valid certificate', async () => {
      const responseOk = asECoCCertificate(ecocSchema, '/');
      expect(responseOk).toHaveProperty('ok');
    });

    it('should validate an invalid certificate', async () => {
      delete ecocSchema.RefSchemaUrl;
      const responseInvalid = asECoCCertificate(ecocSchema, '/');
      expect(responseInvalid).toHaveProperty('error');
    });
  });

  describe('EN10168', function () {
    const enSchema = JSON.parse(readFileSync(EN_CERT_PATH, 'utf8') as string);

    it('should validate a valid certificate', async () => {
      const responseOk = asEN10168Certificate(enSchema, '/');
      expect(responseOk).toHaveProperty('ok');
    });

    it('should validate an invalid certificate', async () => {
      delete enSchema.Certificate;
      const responseInvalid = asEN10168Certificate(enSchema, '/');
      expect(responseInvalid).toHaveProperty('error');
    });
  });
});
