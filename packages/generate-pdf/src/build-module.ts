import Module from 'module';
import { Content } from 'pdfmake/interfaces';

import { ExtraTranslations, LanguageFontMap, Schemas, Translations } from '@s1seven/schema-tools-types';
import { loadExternalFile } from '@s1seven/schema-tools-utils';

export async function buildModule(
  filePath: string,
  moduleName?: string,
): Promise<{
  //! TODO: create standard function signature!!!!
  generateContent: (
    certificate: Schemas,
    translations: Translations,
    languageFontMap?: LanguageFontMap,
    extraTranslations?: ExtraTranslations,
  ) => Content[];
}> {
  const code = await loadExternalFile(filePath, 'text');
  const fileNamePrefix = moduleName || filePath;
  const fileName = `${fileNamePrefix}-${new Date().toISOString()}`;
  const _module = new Module(fileName);
  _module.filename = fileName;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_module as any)._compile(code, fileName);
  _module.loaded = true;
  return _module.exports;
}
