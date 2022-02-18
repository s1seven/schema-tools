import { URL } from 'url';

import { getSchemaConfig, getTranslations as loadTranslations } from '@s1seven/schema-tools-utils';

import { CertificateLanguages, CoATranslations } from '../src/types';

export function getTranslations(certificateLanguages: CertificateLanguages, refSchemaUrl: string) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadTranslations(certificateLanguages, schemaConfig) as Promise<CoATranslations>;
}
