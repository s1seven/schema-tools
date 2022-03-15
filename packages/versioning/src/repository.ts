import { createWriteStream } from 'fs';
import glob from 'glob';
import get from 'lodash.get';
import set from 'lodash.set';
import prettier from 'prettier';

import { generateHtml } from '@s1seven/schema-tools-generate-html';
import { generatePdf, TDocumentDefinitions, TFontDictionary } from '@s1seven/schema-tools-generate-pdf';
import { loadExternalFile, writeFile } from '@s1seven/schema-tools-utils';

export interface SchemaFileProperties {
  filePath: string;
  properties: { path: string | string[]; value: string }[];
}

export type CertificatePattern = `${string}.json` | string;

export class SchemaRepositoryVersion {
  readonly urlPropertyPath = 'RefSchemaUrl';

  static buildRefSchemaUrl(serverUrl: string, version: string, schemaName: string): string {
    return `${serverUrl}/${version}/${schemaName}`;
  }

  static async generateHtmlCertificate(
    certificatePath: string,
    templatePath: string,
    translations: Record<string, any>,
    handlebars: Record<string, any> = {},
  ): Promise<void> {
    const outputPath = certificatePath.replace('.json', '.html');
    const rawHtml = await generateHtml(certificatePath, {
      templatePath,
      templateType: 'hbs',
      translations,
      handlebars,
    });

    const html = prettier.format(rawHtml, { parser: 'html' });
    await writeFile(outputPath, html);
  }

  static async generatePdfCertificate(
    certificatePath: string,
    generatorPath: string,
    translations: Record<string, any>,
    docDefinition: Partial<TDocumentDefinitions>,
    fonts: TFontDictionary,
  ): Promise<void> {
    const outputPath = certificatePath.replace('.json', '.pdf');
    const pdfDoc = await generatePdf(certificatePath, {
      docDefinition,
      generatorPath,
      inputType: 'json',
      outputType: 'stream',
      fonts,
      translations,
    });

    const writeStream = createWriteStream(outputPath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve()).on('error', (err) => reject(err));
    });
  }

  constructor(
    readonly serverUrl: string,
    readonly schemaFilePaths: SchemaFileProperties[],
    readonly version: string,
    readonly translations: Record<string, unknown> = {},
    readonly schemaName = 'schema.json',
  ) {}

  buildRefSchemaUrl(schemaName = this.schemaName): string {
    return SchemaRepositoryVersion.buildRefSchemaUrl(this.serverUrl, this.version, schemaName);
  }

  async updateJsonFixturesVersion(pattern: CertificatePattern): Promise<void> {
    const filePaths = glob.sync(pattern);
    await Promise.all(
      filePaths.map(async (filePath) => {
        const certificate = await loadExternalFile(filePath, 'json', false);
        const RefSchemaUrl = this.buildRefSchemaUrl();
        certificate[this.urlPropertyPath] = RefSchemaUrl;
        const prettierOptions = await prettier.resolveConfig(filePath);
        const json = prettier.format(JSON.stringify(certificate, null, 2), {
          ...(prettierOptions || {}),
          parser: 'json',
        });
        await writeFile(filePath, json);
      }),
    );
  }

  async updateHtmlFixturesVersion(
    pattern: CertificatePattern,
    templatePath: string,
    handlebars: Record<string, any> = {},
  ): Promise<void> {
    const filePaths = glob.sync(pattern);
    await Promise.all(
      filePaths.map((filePath) =>
        SchemaRepositoryVersion.generateHtmlCertificate(filePath, templatePath, this.translations, handlebars),
      ),
    );
  }

  async updatePdfFixturesVersion(
    pattern: CertificatePattern,
    generatorPath: string,
    docDefinition: Partial<TDocumentDefinitions>,
    fonts: TFontDictionary,
  ): Promise<void> {
    const filePaths = glob.sync(pattern);
    await Promise.all(
      filePaths.map((filePath) =>
        SchemaRepositoryVersion.generatePdfCertificate(
          filePath,
          generatorPath,
          this.translations,
          docDefinition,
          fonts,
        ),
      ),
    );
  }

  async updateSchemasVersion(): Promise<void> {
    await Promise.all(
      this.schemaFilePaths.map(async ({ filePath, properties }) => {
        const schema = await loadExternalFile(filePath, 'json', false);
        let schemaHasChanged = false;
        for (const { value, path } of properties) {
          if (typeof get(schema, path, undefined) === 'string') {
            const newValue = this.buildRefSchemaUrl(value);
            set(schema, path, newValue);
            schemaHasChanged = true;
          }
        }
        if (schemaHasChanged) {
          await writeFile(filePath, JSON.stringify(schema, null, 2));
        }
      }),
    );
  }
}
