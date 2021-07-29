import { defaultSchemaUrl } from './constants';
import { getTranslations } from './getTranslations';
import { supplementaryInformation } from '../src/lib/supplementaryInformation';
import { Translate } from '../src/lib/translate';
import { Translations } from '../src/types';

/* eslint-disable sonarjs/no-duplicate-string */
describe('Rendering supplementary information', () => {
  let translations: Translations;

  beforeAll(async () => {
    translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
  });

  it('does not render header when no supplementary inforamtion is given', () => {
    const i18n = new Translate({ EN: translations.EN }, ['EN']);
    expect(supplementaryInformation({}, i18n)).toEqual([]);
  });

  it('correctly renders header in one language', () => {
    const suppInfo = {
      A11: {
        Key: 'First Supplementary Information Commercial Transaction',
        Value: '1.0',
        Unit: 'Apples',
      },
    };
    const i18n = new Translate({ EN: translations.EN }, ['EN']);
    expect(supplementaryInformation(suppInfo, i18n)[0]).toEqual([
      { text: 'Supplementary information', style: 'h5', colSpan: 3 },
      {},
      {},
    ]);
  });

  it('correctly renders header in two languages', () => {
    const suppInfo = {
      A11: {
        Key: 'A11 First Supplementary Information Commercial Transaction',
        Value: '1.0',
        Unit: 'Apples',
      },
    };
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);

    expect(supplementaryInformation(suppInfo, i18n)[0]).toEqual([
      { text: 'Supplementary information / Ergänzende Angaben', style: 'h5', colSpan: 3 },
      {},
      {},
    ]);
  });

  it('correctly renders supplementary information', () => {
    const suppInfo = {
      A11: {
        Key: 'First Supplementary Information Commercial Transaction',
        Value: '1.0',
        Unit: 'Apples',
      },
      A96: {
        Key: 'Last Supplementary Information Commercial Transaction',
        Value: 'A96',
      },
    };
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);

    const supplementarInforamtion = supplementaryInformation(suppInfo, i18n);
    expect(supplementarInforamtion.length).toEqual(3);
    expect(supplementarInforamtion[0]).toEqual([
      { text: 'Supplementary information / Ergänzende Angaben', style: 'h5', colSpan: 3 },
      {},
      {},
    ]);
    expect(supplementarInforamtion[1]).toEqual([
      { text: 'A11 First Supplementary Information Commercial Transaction', style: 'tableHeader', colSpan: 2 },
      {},
      { text: '1.0 Apples', style: 'p', colSpan: 1 },
    ]);
    expect(supplementarInforamtion[2]).toEqual([
      { text: 'A96 Last Supplementary Information Commercial Transaction', style: 'tableHeader', colSpan: 2 },
      {},
      { text: 'A96 ', style: 'p', colSpan: 1 },
    ]);
  });

  it('correctly renders supplementary information for colSpan = 4', () => {
    const suppInfo = {
      A11: {
        Key: 'First Supplementary Information Commercial Transaction',
        Value: '1.0',
        Unit: 'Apples',
      },
    };
    const i18n = new Translate({ EN: translations.EN, DE: translations.DE }, ['EN', 'DE']);

    const supplementarInforamtion = supplementaryInformation(suppInfo, i18n, 4);
    expect(supplementarInforamtion.length).toEqual(2);
    expect(supplementarInforamtion[0]).toEqual([
      { text: 'Supplementary information / Ergänzende Angaben', style: 'h5', colSpan: 4 },
      {},
      {},
      {},
    ]);
    expect(supplementarInforamtion[1]).toEqual([
      { text: 'A11 First Supplementary Information Commercial Transaction', style: 'tableHeader', colSpan: 3 },
      {},
      {},
      { text: '1.0 Apples', style: 'p', colSpan: 1 },
    ]);
  });
});
