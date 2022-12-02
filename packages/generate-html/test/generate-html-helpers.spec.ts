import { readFileSync } from 'fs';

import { SchemaConfig } from '@s1seven/schema-tools-types';
import { axiosInstance } from '@s1seven/schema-tools-utils';

import { getPartials, handlebarsBaseOptions } from '../src/index';

const schemaTranslationsPath = `${__dirname}/../../../fixtures/CoA/v0.2.0/translations.json`;
const schemaExtraTranslationsPath = `${__dirname}/../../../fixtures/CoA/v0.2.0/extra_translations.json`;

const translations = JSON.parse(readFileSync(schemaTranslationsPath, 'utf8'));
const extraTranslations = JSON.parse(readFileSync(schemaExtraTranslationsPath, 'utf8'));

const { helpers } = handlebarsBaseOptions({ translations, extraTranslations });
const { localizeNumber, localizeValue } = helpers;

const inpsections = [
  {
    inspection: {
      Value: '31',
      ValueType: 'number',
      Minimum: '15',
      Maximum: '35',
    },
    localizeMaximumExpectedResult: {
      EN: { string: '35' },
      DE: { string: '35' },
    },
    localizeValueExpectedResult: {
      EN: { string: '31' },
      DE: { string: '31' },
    },
  },
  {
    inspection: {
      Value: '31',
      ValueType: 'number',
      Minimum: '15',
      Maximum: 35,
    },
    localizeMaximumExpectedResult: {
      EN: { string: '35' },
      DE: { string: '35' },
    },
    localizeValueExpectedResult: {
      EN: { string: '31' },
      DE: { string: '31' },
    },
  },
  {
    inspection: {
      Value: '85',
      ValueType: 'number',
      Minimum: '85',
      Maximum: '89',
    },
    localizeMaximumExpectedResult: {
      EN: { string: '89' },
      DE: { string: '89' },
    },
    localizeValueExpectedResult: {
      EN: { string: '85' },
      DE: { string: '85' },
    },
  },
  {
    inspection: {
      Value: '4.0',
      ValueType: 'number',
      Maximum: '4.9',
    },
    localizeMaximumExpectedResult: {
      EN: { string: '4.9' },
      DE: { string: '4,9' },
    },
    localizeValueExpectedResult: {
      EN: { string: '4.0' },
      DE: { string: '4,0' },
    },
  },
  {
    inspection: {
      Value: 'C',
      ValueType: 'string',
      Maximum: '4.9',
    },
    localizeMaximumExpectedResult: {
      EN: { string: '4.9' },
      DE: { string: '4,9' },
    },
    localizeValueExpectedResult: {
      EN: { string: 'C' },
      DE: { string: 'C' },
    },
  },
  {
    inspection: {
      Value: '4.0',
      ValueType: 'number',
      Maximum: 4.9,
    },
    localizeMaximumExpectedResult: {
      EN: { string: '4.9' },
      DE: { string: '4,9' },
    },
    localizeValueExpectedResult: {
      EN: { string: '4.0' },
      DE: { string: '4,0' },
    },
  },
  {
    inspection: {
      Value: '4.0',
      ValueType: 'number',
      Maximum: 4.0,
    },
    localizeMaximumExpectedResult: {
      EN: { string: '4' }, // Because Maximum is a number, the trailing 0 is lost
      DE: { string: '4' },
    },
    localizeValueExpectedResult: {
      EN: { string: '4.0' },
      DE: { string: '4,0' },
    },
  },
  {
    inspection: {
      Value: '4.1',
      ValueType: 'number',
      Maximum: '4.0',
    },
    localizeMaximumExpectedResult: {
      EN: { string: '4.0' },
      DE: { string: '4,0' },
    },
    localizeValueExpectedResult: {
      EN: { string: '4.1' },
      DE: { string: '4,1' },
    },
  },
  {
    inspection: {
      Value: '49.7',
      ValueType: 'number',
      Maximum: '52.0',
    },
    localizeMaximumExpectedResult: {
      EN: { string: '52.0' },
      DE: { string: '52,0' },
    },
    localizeValueExpectedResult: {
      EN: { string: '49.7' },
      DE: { string: '49,7' },
    },
  },
  {
    // test cases from https://github.com/thematerials-network/CoA-schemas/issues/57
    inspection: {
      Value: '0.08',
      ValueType: 'number',
      Maximum: '0.15',
    },
    localizeMaximumExpectedResult: {
      EN: { string: '0.15' },
      DE: { string: '0,15' },
    },
    localizeValueExpectedResult: {
      EN: { string: '0.08' },
      DE: { string: '0,08' },
    },
  },
  {
    inspection: {
      Value: '0.00',
      ValueType: 'number',
      Maximum: '0.15',
    },
    localizeMaximumExpectedResult: {
      EN: { string: '0.15' },
      DE: { string: '0,15' },
    },
    localizeValueExpectedResult: {
      EN: { string: '0.00' },
      DE: { string: '0,00' },
    },
  },
];

const baseUrl = 'https://schemas.s1seven.com';
const en10168SchemaType = 'en10168-schemas';
const version = 'v0.0.5';

describe('renders strings and numbers correctly with localization', () => {
  inpsections.forEach((object) => {
    const { Maximum, Value, ValueType } = object.inspection;

    it(`localizeNumber should render ${Maximum} as a SafeString with English localization`, () => {
      expect(localizeNumber(Maximum)).toEqual(object.localizeMaximumExpectedResult.EN);
    });

    it(`localizeNumber should render ${Maximum} as a SafeString with German localization`, () => {
      expect(localizeNumber(Maximum, ['DE'])).toEqual(object.localizeMaximumExpectedResult.DE);
    });

    it(`localizeValue should render ${Value} as a SafeString with English localization`, () => {
      expect(localizeValue(Value, ValueType)).toEqual(object.localizeValueExpectedResult.EN);
    });

    it(`localizeValue should render ${Value} as a SafeString with German localization`, () => {
      expect(localizeValue(Value, ValueType, ['DE'])).toEqual(object.localizeValueExpectedResult.DE);
    });
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

  axiosInstance.get = jest.fn();

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
