import { compile } from 'handlebars';
import { loadExternalFile, writeFile } from './utils';

export type GenerateHtmlOptions = {
  templateFilePath: string;
  jsonFilePath: string;
  outputFilePath?: string;
};

export async function generateHtml(
  templateFilePath: string,
  jsonFilePath: string,
  outputFilePath?: string
): Promise<string> {
  const templateFile = (await loadExternalFile(
    templateFilePath,
    'text'
  )) as string;
  const template = compile<object>(templateFile);
  const jsonSchema = (await loadExternalFile(jsonFilePath, 'json')) as object;
  const html = template(jsonSchema);

  if (outputFilePath) {
    await writeFile(outputFilePath, html);
  }

  return html;
}
