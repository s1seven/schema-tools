import { getSchemaConfig, getTranslations as loadTranslations } from '@s1seven/schema-tools-utils';
import { CertificateLanguages } from '../src/types';
import { Translations } from '@s1seven/schema-tools-generate-pdf-template-helpers';
import { URL } from 'url';

export function getTranslations(certificateLanguages: CertificateLanguages, refSchemaUrl: string) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadTranslations(certificateLanguages, schemaConfig) as Promise<Translations>;
}
