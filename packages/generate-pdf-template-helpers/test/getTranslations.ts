import { URL } from 'node:url';

import {
  getExtraTranslations as loadExtraTranslations,
  getSchemaConfig,
  getTranslations as loadTranslations,
} from '@s1seven/schema-tools-utils';

export async function getTranslations(certificateLanguages: string[], refSchemaUrl: string) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadTranslations(certificateLanguages, schemaConfig);
}
export function getExtraTranslations(
  certificateLanguages: string[],
  refSchemaUrl: string,
  externalStandards: 'CAMPUS'[],
) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadExtraTranslations(certificateLanguages, schemaConfig, externalStandards);
}
