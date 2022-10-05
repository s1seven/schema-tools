import { URL } from 'url';

import { CampusTranslations } from '@s1seven/schema-tools-types';
import {
  getExtraTranslations as loadExtraTranslations,
  getSchemaConfig,
  getTranslations as loadTranslations,
} from '@s1seven/schema-tools-utils';

import { CertificateLanguages, CoATranslations } from '../src/types';

export function getTranslations(certificateLanguages: CertificateLanguages, refSchemaUrl: string) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadTranslations(certificateLanguages, schemaConfig) as Promise<CoATranslations>;
}

export function getExtraTranslations(
  certificateLanguages: CertificateLanguages,
  refSchemaUrl: string,
  externalStandards: 'CAMPUS'[],
) {
  const schemaConfig = getSchemaConfig(new URL(refSchemaUrl));
  return loadExtraTranslations(certificateLanguages, schemaConfig, externalStandards) as Promise<CampusTranslations>;
}
