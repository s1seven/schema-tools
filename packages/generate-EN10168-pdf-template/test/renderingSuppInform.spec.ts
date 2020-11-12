import { getTranslations } from './getTranslations';
import { Translate } from '../src/lib/translate';
import { supplementaryInformation } from '../src/lib/supplementaryInformation';

const defaultSchemaUrl = 'https://schemas.en10204.io/en10168-schemas/v0.0.2/schema.json';

describe('Rendering supplementary information', () => {
  it('does not render header when no supplementary inforamtion is given', async () => {
    const translations = await getTranslations(['EN'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    expect(supplementaryInformation({}, i18n)).toEqual([]);
  });

  it('correctly renders header in one language', async () => {
    const suppInfo = {
      A11: {
        Key: 'First Supplementary Information Commercial Transaction',
        Value: '1.0',
        Unit: 'Apples',
      },
    };
    const translations = await getTranslations(['EN'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    expect(supplementaryInformation(suppInfo, i18n)[0]).toEqual([
      { text: 'Supplementary information', style: 'h3', colSpan: 3 },
      {},
      {},
    ]);
  });

  it('correctly renders header in two languages', async () => {
    const suppInfo = {
      A11: {
        Key: 'First Supplementary Information Commercial Transaction',
        Value: '1.0',
        Unit: 'Apples',
      },
    };
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    expect(supplementaryInformation(suppInfo, i18n)[0]).toEqual([
      { text: 'Supplementary information / Ergänzende Angaben', style: 'h3', colSpan: 3 },
      {},
      {},
    ]);
  });

  it('correctly renders supplementary information', async () => {
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
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const supplementarInforamtion = supplementaryInformation(suppInfo, i18n);
    expect(supplementarInforamtion.length).toEqual(3);
    expect(supplementarInforamtion[0]).toEqual([
      { text: 'Supplementary information / Ergänzende Angaben', style: 'h3', colSpan: 3 },
      {},
      {},
    ]);
    expect(supplementarInforamtion[1]).toEqual([
      { text: 'First Supplementary Information Commercial Transaction', style: 'tableHeader', colSpan: 1 },
      { text: '1.0 Apples', style: 'p', colSpan: 2 },
    ]);
    expect(supplementarInforamtion[2]).toEqual([
      { text: 'Last Supplementary Information Commercial Transaction', style: 'tableHeader', colSpan: 1 },
      { text: 'A96 ', style: 'p', colSpan: 2 },
    ]);
  });

  it('correctly renders supplementary information for colSpan = 4', async () => {
    const suppInfo = {
      A11: {
        Key: 'First Supplementary Information Commercial Transaction',
        Value: '1.0',
        Unit: 'Apples',
      },
    };
    const translations = await getTranslations(['EN', 'DE'], defaultSchemaUrl);
    const i18n = new Translate(translations);
    const supplementarInforamtion = supplementaryInformation(suppInfo, i18n, 4);
    expect(supplementarInforamtion.length).toEqual(2);
    expect(supplementarInforamtion[0]).toEqual([
      { text: 'Supplementary information / Ergänzende Angaben', style: 'h3', colSpan: 4 },
      {},
      {},
      {},
    ]);
    expect(supplementarInforamtion[1]).toEqual([
      { text: 'First Supplementary Information Commercial Transaction', style: 'tableHeader', colSpan: 2 },
      {},
      { text: '1.0 Apples', style: 'p', colSpan: 2 },
    ]);
  });
});
