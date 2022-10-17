import { readFileSync } from 'fs';
import { Stream } from 'stream';
import { URL } from 'url';

import { ExternalStandards, SchemaConfig, SupportedSchemas } from '@s1seven/schema-tools-types';

import {
  asCoACertificate,
  asECoCCertificate,
  asEN10168Certificate,
  getCertificateType,
  getExtraTranslations,
  getPartials,
  getRefSchemaUrl,
  getSchemaConfig,
  getTranslations,
  loadExternalFile,
  localizeNumber,
} from '../src/index';
import { axiosInstance, cache } from '../src/loaders';

const baseUrl = 'https://schemas.s1seven.com';
const en10168SchemaType = 'en10168-schemas';
const version = 'v0.0.5';

describe('Utils', function () {
  const EN_10168_CERT_PATH = `${__dirname}/../../../fixtures/EN10168/v0.1.0/valid_cert.json`;
  const ECOC_CERT_PATH = `${__dirname}/../../../fixtures/E-CoC/v1.0.0/valid_cert.json`;
  const COA_CERT_PATH = `${__dirname}/../../../fixtures/CoA/v0.0.4/valid_cert.json`;
  const MOCK_CERT = 'cert';

  const refSchemaUrl = new URL('https://schemas.s1seven.com/en10168-schemas/v0.1.0/schema.json');
  const schemaConf: SchemaConfig = {
    baseUrl,
    schemaType: en10168SchemaType,
    version: '0.1.0',
  };

  const failingLanguageTest = function () {
    (axiosInstance as any).get.mockImplementationOnce((filePath: string) => {
      if (filePath.endsWith('DE.json')) {
        throw new Error();
      }
      return { data: MOCK_CERT, status: 200 };
    });
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
      failingLanguageTest();
      await expect(getTranslations(certificateLanguages, schemaConf)).rejects.toThrow(
        'these languages have errors: DE',
      );
    });
  });

  describe('getExtraTranslations()', function () {
    const certificateLanguages = ['DE', 'EN'];
    const externalStandards: ExternalStandards[] = ['CAMPUS'];
    (axiosInstance as any) = { get: jest.fn() };

    beforeEach(() => {
      (axiosInstance as any).get.mockClear();
    });

    it('should return translations in the requested languages', async () => {
      (axiosInstance as any).get.mockResolvedValue({ data: MOCK_CERT, status: 200 });
      const translatedCerts = await getExtraTranslations(certificateLanguages, schemaConf, externalStandards);
      expect(translatedCerts).toMatchObject({ CAMPUS: { DE: MOCK_CERT, EN: MOCK_CERT } });
    });

    it('should fail at languages, where no translation is present.', async () => {
      failingLanguageTest();
      await expect(getExtraTranslations(certificateLanguages, schemaConf, externalStandards)).rejects.toThrow(
        'these languages have errors: CAMPUS - DE',
      );
    });
  });

  describe('getPartials()', function () {
    const partialsMap = {
      inspection: `${__dirname}/../../../fixtures/EN10168/v0.3.0/inspection.hbs`,
    };

    const schemaConfig: SchemaConfig = {
      baseUrl,
      schemaType: en10168SchemaType,
      version: version.replace('v', ''),
    };

    beforeEach(() => {
      (axiosInstance as any).get.mockClear();
    });

    it('returns an object with one property for each property in partials map', async () => {
      const partials = await getPartials(schemaConfig, partialsMap);
      expect(partials).toHaveProperty('inspection');
    });

    it('when partialsMap is undefined, a remote file is requested', async () => {
      (axiosInstance as any).get.mockResolvedValue({ data: partialsMap, status: 200 });
      const partials = await getPartials(schemaConfig, undefined);
      expect(axiosInstance.get).toBeCalledWith('https://schemas.s1seven.com/en10168-schemas/v0.0.5/partials-map.json', {
        responseType: 'json',
      });
      expect(partials).toHaveProperty('inspection');
    });

    it('no partials map exists, false is returned', async () => {
      (axiosInstance as any).get.mockRejectedValueOnce();
      const partials = await getPartials(schemaConfig, undefined);
      expect(partials).toBe(false);
    });
  });

  describe('getCertificateType()', function () {
    const schemaConfigs: SchemaConfig[] = [
      {
        baseUrl,
        schemaType: en10168SchemaType,
        version,
      },
      {
        baseUrl,
        schemaType: 'e-coc-schemas',
        version,
      },
      {
        baseUrl,
        schemaType: 'coa-schemas',
        version,
      },
    ];
    const expectedResults: string[] = ['en10168', 'e-coc', 'coa'];

    schemaConfigs.forEach((schemaConfig, index) => {
      it(`${schemaConfig.schemaType} returns the certificate type ${expectedResults[index]}`, async () => {
        const type = getCertificateType(schemaConfig);
        expect(expectedResults[index]).toBe(type);
      });
    });
  });

  describe('localizeNumber()', function () {
    const testValues = [
      {
        inspection: {
          Value: '31.01',
        },
        localizeValueExpectedResult: {
          EN: '31.01',
          DE: '31,01',
        },
      },
      {
        inspection: {
          Value: 31,
        },
        localizeValueExpectedResult: {
          EN: '31',
          DE: '31',
        },
      },
      {
        inspection: {
          Value: 'C',
        },
        localizeValueExpectedResult: {
          EN: 'C',
          DE: 'C',
        },
      },
    ];

    testValues.forEach((object) => {
      const { Value } = object.inspection;

      it(`localizeNumber should render ${Value} as a SafeString with English localization`, () => {
        expect(localizeNumber(Value)).toEqual(object.localizeValueExpectedResult.EN);
      });

      it(`localizeNumber should render ${Value} as a SafeString with German localization`, () => {
        expect(localizeNumber(Value, ['DE'])).toEqual(object.localizeValueExpectedResult.DE);
      });
    });
  });
});
