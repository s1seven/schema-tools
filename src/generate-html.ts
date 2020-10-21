import { compile } from 'handlebars';
import { readFile, statFile, writeFile } from './utils';

const defaultTemplateFilePath = './Template/index.hbs';
const defaultCssFilePath = './Template/style.css';

export type GenerateHtmlOptions = {
  jsonFilePath: string;
  outputFilePath: string;
  templateFilePath?: string;
  cssFilePath?: string;
};

async function checkFiles(options: GenerateHtmlOptions) {
  const { jsonFilePath, templateFilePath, cssFilePath } = options;
  try {
    if (templateFilePath) {
      await statFile(templateFilePath);
    }
    if (cssFilePath) {
      await statFile(cssFilePath);
    }
    await statFile(jsonFilePath);
  } catch (error) {
    console.error(`File not found : `, error.message);
  }
}

export async function generateHtml(
  options: GenerateHtmlOptions
): Promise<void> {
  const {
    jsonFilePath,
    outputFilePath,
    templateFilePath = defaultTemplateFilePath,
    cssFilePath = defaultCssFilePath,
  } = options;

  await checkFiles(options);
  const templateFile = await readFile(templateFilePath, 'utf-8');
  const template = compile(templateFile);

  const cssFile = await readFile(cssFilePath, 'utf-8');
  const jsonSchema = JSON.parse(await readFile(jsonFilePath, 'utf-8'));
  const html = template(jsonSchema);

  const source = `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <style rel="stylesheet" type="text/css">${cssFile}</style>
  </head>
  <body>
      ${html || ''}
  </body>
  </html>`;

  // console.log(source);

  await writeFile(outputFilePath, source);
}
