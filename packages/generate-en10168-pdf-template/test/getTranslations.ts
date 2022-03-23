import { URL } from 'url';

import { Translate } from '@s1seven/schema-tools-generate-pdf-template-helpers';
import { Languages } from '@s1seven/schema-tools-types';
import { getSchemaConfig, getTranslations as loadTranslations } from '@s1seven/schema-tools-utils';

import { CertificateLanguages, EN10168Translations } from '../src/types';

export function getTranslations(certificateLanguages: CertificateLanguages, refSchemaUrl: string) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadTranslations(certificateLanguages, schemaConfig) as Promise<EN10168Translations>;
}

export const getI18N = (translations: EN10168Translations, languages: Languages[] = ['EN', 'DE']) => {
  translations = languages.reduce((acc, key) => {
    acc[key] = translations[key];
    return acc;
  }, {} as EN10168Translations);
  return new Translate<EN10168Translations>(translations, {}, languages);
};
