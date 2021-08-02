import { getSchemaConfig, getTranslations as loadTranslations } from '@s1seven/schema-tools-utils';
import { Translations } from '../src/types';
import { URL } from 'url';

export async function getTranslations(certificateLanguages: string[], refSchemaUrl: string) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadTranslations(certificateLanguages, schemaConfig) as Promise<Translations>;
}
