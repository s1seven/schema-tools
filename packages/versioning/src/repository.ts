import $RefParser from '@apidevtools/json-schema-ref-parser';
import Debug from 'debug';
import { createWriteStream } from 'fs';
import glob from 'glob';
import type { RuntimeOptions } from 'handlebars';
import get from 'lodash.get';
import set from 'lodash.set';
import { resolve } from 'path';
import prettier from 'prettier';
import { URL } from 'url';

import { generateHtml } from '@s1seven/schema-tools-generate-html';
import { generatePdf, TDocumentDefinitions, TFontDictionary } from '@s1seven/schema-tools-generate-pdf';
import { ExtraTranslations, PartialsMapFileName, Translations } from '@s1seven/schema-tools-types';
import { loadExternalFile, writeFile } from '@s1seven/schema-tools-utils';

const debug = Debug('schema-tools-versioning');

export interface SchemaFileProperties {
  filePath: string;
  properties: {
    path: string | string[];
    schemaType?: string;
    version?: string;
    value: string;
  }[];
}

export interface PartialsMapProperties {
  filePath?: string;
  properties: {
    path: string | string[];
    schemaType?: string;
    version?: string;
    value: string;
  }[];
}

export type CertificatePattern = `${string}.json` | string;

export class SchemaRepositoryVersion {
  readonly urlPropertyPath = 'RefSchemaUrl';

  static buildRefSchemaUrl(serverUrl: string, version: string, schemaName: string): string {
    return `${serverUrl}/${version}/${schemaName}`;
  }

  static buildCustomRefSchemaUrl(originUrl: string, schemaType: string, version: string, fileName: string): string {
    return `${originUrl}/${schemaType}/${version}/${fileName}`;
  }

  static async generateHtmlCertificate(
    certificatePath: string,
    templatePath: string,
    translations: Translations,
    extraTranslations: ExtraTranslations = null,
    handlebars: RuntimeOptions = {},
    partialsMap?: Record<string, string>,
  ): Promise<void> {
    const outputPath = certificatePath.replace('.json', '.html');
    const rawHtml = await generateHtml(certificatePath, {
      templatePath,
      templateType: 'hbs',
      translations,
      handlebars,
      extraTranslations,
      partialsMap,
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
    extraTranslations: ExtraTranslations = null,
  ): Promise<void> {
    const outputPath = certificatePath.replace('.json', '.pdf');
    const pdfDoc = await generatePdf(certificatePath, {
      docDefinition,
      generatorPath,
      inputType: 'json',
      outputType: 'stream',
      fonts,
      translations,
      extraTranslations,
    });

    const writeStream = createWriteStream(outputPath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve()).on('error', (err) => reject(err));
    });
  }

  static async generateReadableSchema({
    schemaFilePath,
    writeFilePath = './readable-schema.json',
    dereference = false,
  }: {
    schemaFilePath: string;
    writeFilePath?: string;
    dereference?: boolean;
  }): Promise<void> {
    const schema = dereference
      ? await $RefParser.dereference(resolve(schemaFilePath))
      : await $RefParser.bundle(resolve(schemaFilePath));
    await writeFile(resolve(writeFilePath), JSON.stringify(schema, null, 2));
  }

  constructor(
    readonly serverUrl: string,
    readonly schemaFilePaths: SchemaFileProperties[],
    readonly version: string,
    readonly translations: Record<string, unknown> = {},
    readonly extraTranslations: ExtraTranslations = null,
    readonly schemaName = 'schema.json',
  ) {}

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
    handlebars: RuntimeOptions = {},
    partialsMap?: Record<string, string>,
  ): Promise<void> {
    const filePaths = glob.sync(pattern);
    await Promise.all(
      filePaths.map((filePath) =>
        SchemaRepositoryVersion.generateHtmlCertificate(
          filePath,
          templatePath,
          this.translations,
          this.extraTranslations,
          handlebars,
          partialsMap,
        ),
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
          this.extraTranslations,
        ),
      ),
    );
  }

  buildRefSchemaUrl(schemaName = this.schemaName): string {
    return SchemaRepositoryVersion.buildRefSchemaUrl(this.serverUrl, this.version, schemaName);
  }

  buildCustomRefSchemaUrl(schemaType: string, version: string, fileName: string): string {
    const originUrl = new URL(this.serverUrl).origin;
    return SchemaRepositoryVersion.buildCustomRefSchemaUrl(originUrl, schemaType, version, fileName);
  }

  updateRefSchemaUrl(value: string, schemaType?: string, version?: string) {
    return schemaType && version
      ? this.buildCustomRefSchemaUrl(schemaType, version, value)
      : this.buildRefSchemaUrl(value);
  }

  async updatePartialsMapVersion(opts: PartialsMapProperties): Promise<void> {
    const filePath = opts.filePath || resolve(PartialsMapFileName);
    const partialsMap: Record<string, string> | null = await loadExternalFile(filePath, 'json', false).catch((e) => {
      debug(e);
      return null;
    });

    if (!partialsMap) {
      return;
    }
    let partialsMapHasChanged = false;
    for (const { value, path, schemaType, version } of opts.properties) {
      if (typeof get(partialsMap, path, undefined) === 'string') {
        const newValue = this.updateRefSchemaUrl(value, schemaType, version);
        set(partialsMap, path, newValue);
        partialsMapHasChanged = true;
      }
    }
    if (partialsMapHasChanged) {
      const prettierOptions = await prettier.resolveConfig(filePath);
      const newPartialsMap = prettier.format(JSON.stringify(partialsMap, null, 2), {
        ...(prettierOptions || {}),
        parser: 'json',
      });
      await writeFile(filePath, newPartialsMap);
    }
  }

  async updateSchemasVersion(): Promise<void> {
    await Promise.all(
      this.schemaFilePaths.map(async ({ filePath, properties }) => {
        const schema = await loadExternalFile(filePath, 'json', false);
        let schemaHasChanged = false;
        for (const { value, path, schemaType, version } of properties) {
          if (typeof get(schema, path, undefined) === 'string') {
            const newValue = this.updateRefSchemaUrl(value, schemaType, version);
            set(schema, path, newValue);
            schemaHasChanged = true;
          }
        }
        if (schemaHasChanged) {
          const prettierOptions = await prettier.resolveConfig(filePath);
          const jsonSchema = prettier.format(JSON.stringify(schema, null, 2), {
            ...(prettierOptions || {}),
            parser: 'json',
          });
          await writeFile(filePath, jsonSchema);
        }
      }),
    );
  }
}
