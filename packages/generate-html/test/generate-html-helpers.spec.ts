import { readFileSync } from 'fs';

import { handlebarsBaseOptions } from '../src/index';

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
      ValueType: 'string',
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
      ValueType: 'string',
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
      ValueType: 'string',
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
      ValueType: 'string',
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

describe('LocalizeNumber renders strings and numbers correctly with English localization', () => {
  inpsections.forEach((object) => {
    const Maximum = object.inspection.Maximum;

    it(`should render ${Maximum} as a SafeString`, () => {
      expect(localizeNumber(Maximum)).toEqual(object.localizeMaximumExpectedResult.EN);
    });
  });
});

describe('LocalizeNumber renders strings and numbers correctly with German localization', () => {
  inpsections.forEach((object) => {
    const Maximum = object.inspection.Maximum;

    it(`should render ${Maximum} as a SafeString`, () => {
      expect(localizeNumber(Maximum, ['DE'])).toEqual(object.localizeMaximumExpectedResult.DE);
    });
  });
});

describe('LocalizeValue renders strings and numbers correctly with English localization', () => {
  inpsections.forEach((object) => {
    const { Value, ValueType } = object.inspection;

    it(`should render ${Value} as a SafeString`, () => {
      expect(localizeValue(Value, ValueType)).toEqual(object.localizeValueExpectedResult.EN);
    });
  });
});

describe('LocalizeValue renders strings and numbers correctly with German localization', () => {
  inpsections.forEach((object) => {
    const { Value, ValueType } = object.inspection;

    it(`should render ${Value} as a SafeString`, () => {
      expect(localizeValue(Value, ValueType, ['DE'])).toEqual(object.localizeValueExpectedResult.DE);
    });
  });
});
