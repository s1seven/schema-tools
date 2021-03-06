import {
  asCoACertificate,
  asECoCCertificate,
  asEN10168Certificate,
  axiosInstance,
  cache,
  getRefSchemaUrl,
  getSchemaConfig,
  getTranslations,
  loadExternalFile,
} from '../src/index';
import { SchemaConfig, SupportedSchemas } from '@s1seven/schema-tools-types';
import { readFileSync } from 'fs';
import { Stream } from 'stream';
import { URL } from 'url';

describe('Utils', function () {
  const EN_10168_CERT_PATH = `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`;
  const ECOC_CERT_PATH = `${__dirname}/../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json`;
  const COA_CERT_PATH = `${__dirname}/../../../fixtures/CoA/v0.0.2-1/valid_cert.json`;
  const MOCK_CERT = 'cert';

  const refSchemaUrl = new URL('https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json');
  const schemaConf: SchemaConfig = {
    baseUrl: 'https://schemas.en10204.io',
    schemaType: 'en10168-schemas',
    version: '0.0.2',
  };

  it('getRefSchemaUrl() should return proper url object', () => {
    expect(getRefSchemaUrl(schemaConf)).toMatchObject(refSchemaUrl);
  });

  it('getSchemaConfig() should return proper schemaConfig object', () => {
    expect(getSchemaConfig(refSchemaUrl)).toMatchObject(schemaConf);
  });

  describe('Validate certificates', function () {
    const certificateMaps = [
      { filePath: ECOC_CERT_PATH, validator: asECoCCertificate, type: SupportedSchemas.ECOC },
      { filePath: EN_10168_CERT_PATH, validator: asEN10168Certificate, type: SupportedSchemas.EN10168 },
      { filePath: COA_CERT_PATH, validator: asCoACertificate, type: SupportedSchemas.COA },
    ];

    certificateMaps.forEach(({ type, validator, filePath }) => {
      const certificate = JSON.parse(readFileSync(filePath, 'utf8'));

      describe(type, function () {
        it('should validate a valid certificate', () => {
          const cert = validator(certificate);
          expect(cert).not.toBeNull();
        });

        it('should validate an invalid certificate', () => {
          delete certificate.RefSchemaUrl;
          const cert = validator(certificate);
          expect(cert).toBeNull();
        });

        it('should validate an invalid certificate and throw', () => {
          delete certificate.RefSchemaUrl;
          expect(() => validator(certificate, true)).toThrow();
        });
      });
    });
  });

  describe('loadExternalFile()', function () {
    const en10168Certificate = JSON.parse(readFileSync(EN_10168_CERT_PATH, 'utf8') as string);
    const mockCacheGet = jest.fn();
    const mockCacheSet = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (cache as any) = { get: mockCacheGet, set: mockCacheSet };

    beforeEach(() => {
      mockCacheGet.mockClear();
      mockCacheSet.mockClear();
    });

    it('should load file from cache', async () => {
      mockCacheGet.mockReturnValueOnce(en10168Certificate);
      const certificate = await loadExternalFile(EN_10168_CERT_PATH, 'json');
      expect(mockCacheGet).toHaveBeenCalledWith(`${EN_10168_CERT_PATH}-json`);
      expect(certificate).toEqual(en10168Certificate);
    });

    it('should return javascript object', async () => {
      const certificate = await loadExternalFile(EN_10168_CERT_PATH, 'json');
      expect(certificate).toBeInstanceOf(Object);
    });

    it('should return string', async () => {
      const certificate = await loadExternalFile(EN_10168_CERT_PATH, 'text');
      expect(typeof certificate === 'string').toBeTruthy();
    });

    it('should return buffer', async () => {
      const certificate = await loadExternalFile(EN_10168_CERT_PATH, 'arraybuffer');
      expect(certificate).toBeInstanceOf(Buffer);
    });

    it('should return stream', async () => {
      const certificate = await loadExternalFile(EN_10168_CERT_PATH, 'stream');
      expect(certificate).toBeInstanceOf(Stream);
    });
  });

  describe('getTranslations()', function () {
    const certificateLanguages = ['DE', 'FR', 'EN'];
    (axiosInstance as any) = { get: jest.fn() };

    beforeEach(() => {
      (axiosInstance as any).get.mockClear();
    });

    it('should return translations in the requested languages', async () => {
      (axiosInstance as any).get.mockResolvedValue({ data: MOCK_CERT, status: 200 });
      const translatedCerts = await getTranslations(certificateLanguages, schemaConf);
      expect(translatedCerts).toMatchObject({ DE: MOCK_CERT, FR: MOCK_CERT, EN: MOCK_CERT });
    });

    it('should fail at languages, where no translation is present.', async () => {
      (axiosInstance as any).get.mockImplementationOnce((filePath: string) => {
        if (filePath.endsWith('DE.json')) {
          throw new Error();
        }
        return { data: MOCK_CERT, status: 200 };
      });

      await expect(getTranslations(certificateLanguages, schemaConf)).rejects.toThrow(
        'these languages have errors: DE',
      );
    });
  });
});
