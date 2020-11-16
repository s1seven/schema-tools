import { loadExternalFile } from '@s1seven/schema-tools-utils';
import { CertificateLanguages } from '../src/types';

export async function getTranslations(certificateLanguages: CertificateLanguages, refSchemaUrl: string) {
  const translationsArray = await Promise.all(
    certificateLanguages.map(async (lang) => {
      const filePath = refSchemaUrl.replace('schema.json', `${lang}.json`);
      return { [lang]: await loadExternalFile(filePath, 'json') };
    }),
  );

  return translationsArray.reduce((acc, translation) => {
    const [key] = Object.keys(translation);
    acc[key] = translation[key];
    return acc;
  }, {});
}
