import { SchemaConfig } from '@s1seven/schema-tools-types';
import { readFileSync } from 'fs';
import {
  asECoCCertificate,
  asEN10168Certificate,
  getRefSchemaUrl,
  getSchemaConfig,
  getTranslations,
} from '../src/index';
import { cache, loadExternalFile } from '../src/index';
import { Stream } from 'stream';
import { URL } from 'url';
import axios from 'axios';
jest.mock('axios');

const mockCacheGet = jest.fn();
const mockCacheSet = jest.fn();
(cache as any) = { get: mockCacheGet, set: mockCacheSet };

const EN_CERT_PATH = `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`;
const ECOC_CERT_PATH = `${__dirname}/../../../fixtures/E-CoC/v0.0.2-2/valid_cert.json`;
const MOCK_CERT = 'cert';
const enSchema = JSON.parse(readFileSync(EN_CERT_PATH, 'utf8') as string);
const refSchemaUrl = new URL('https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json');
const schemaConf: SchemaConfig = {
  baseUrl: 'https://schemas.en10204.io',
  schemaType: 'en10168-schemas',
  version: '0.0.2',
};
const certificateLanguages = ['DE', 'FR', 'EN'];

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

  describe('loadExternalFile()', function () {
    const mockCacheGet = jest.fn();
    const mockCacheSet = jest.fn();
    (cache as any) = { get: mockCacheGet, set: mockCacheSet };
    beforeEach(() => {
      mockCacheGet.mockClear();
      mockCacheSet.mockClear();
    });

    it('should load file from cache', async () => {
      mockCacheGet.mockReturnValueOnce(enSchema);
      const certificate = await loadExternalFile(EN_CERT_PATH, 'json');
      expect(mockCacheGet).toHaveBeenCalledWith(EN_CERT_PATH);
      expect(certificate).toEqual(enSchema);
    });

    it('should return javascript object', async () => {
      const certificate = await loadExternalFile(EN_CERT_PATH, 'json');
      expect(certificate).toBeInstanceOf(Object);
    });

    it('should return string', async () => {
      const certificate = await loadExternalFile(EN_CERT_PATH, 'text');
      expect(typeof certificate === 'string').toBeTruthy();
    });

    it('should return buffer', async () => {
      const certificate = await loadExternalFile(EN_CERT_PATH, 'arraybuffer');
      expect(certificate).toBeInstanceOf(Buffer);
    });

    it('should return stream', async () => {
      const certificate = await loadExternalFile(EN_CERT_PATH, 'stream');
      expect(certificate).toBeInstanceOf(Stream);
    });
  });

  it('getRefSchemaUrl() should return proper url object', function () {
    expect(getRefSchemaUrl(schemaConf)).toMatchObject(refSchemaUrl);
  });

  it('getSchemaConfig() should return proper schemaConfig object', function () {
    expect(getSchemaConfig(refSchemaUrl)).toMatchObject(schemaConf);
  });

  describe('getTranslations()', function () {
    beforeEach(() => {
      (axios as any).get.mockClear();
    });

    it('should return certificates in the requested languages', async () => {
      (axios as any).get.mockResolvedValue({ data: MOCK_CERT, status: 200 });
      const translatedCerts = await getTranslations(certificateLanguages, schemaConf);
      expect(translatedCerts).toMatchObject({ DE: MOCK_CERT, FR: MOCK_CERT, EN: MOCK_CERT });
    });

    it('should fail at languages, where no certification is present.', async () => {
      (axios as any).get.mockImplementationOnce((filePath: string) => {
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
