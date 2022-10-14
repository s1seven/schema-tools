import { URL } from 'url';

import { CampusTranslations } from '@s1seven/schema-tools-types';
import {
  getExtraTranslations as loadExtraTranslations,
  getSchemaConfig,
  getTranslations as loadTranslations,
} from '@s1seven/schema-tools-utils';

import { Translations } from '../src/types';

export async function getTranslations(certificateLanguages: string[], refSchemaUrl: string) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadTranslations(certificateLanguages, schemaConfig) as Promise<Translations>;
}
export function getExtraTranslations(
  certificateLanguages: string[],
  refSchemaUrl: string,
  externalStandards: 'CAMPUS'[],
) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadExtraTranslations(certificateLanguages, schemaConfig, externalStandards) as Promise<CampusTranslations>;
}
