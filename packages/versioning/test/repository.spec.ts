/* eslint-disable sonarjs/no-duplicate-string */
import type { TDocumentDefinitions } from '@s1seven/schema-tools-generate-pdf';
import { loadExternalFile, removeFile, writeFile } from '@s1seven/schema-tools-utils';

import { PartialsMapProperties, SchemaFileProperties, SchemaRepositoryVersion } from '../src/index';

describe('Versioning', function () {
  const serverUrl = 'https://schemas.s1seven.com';
  const version = '5.0.0';
  const schemaName = 'schema.json';
  const defaultSchemaFilePaths: SchemaFileProperties[] = [{ filePath: '', properties: [{ value: '', path: '' }] }];
  const translations = { EN: {} };
  const extraTranslations = { CAMPUS: { EN: {} } };
  const pattern = `${__dirname}/certificate-*`;
  const fixtures = {
    'certificate-1.json': { RefSchemaUrl: '' },
    'certificate-2.json': { RefSchemaUrl: '' },
    'partials-map.json': { company: '', group: '' },
    'schema.json': { $id: '', prop: { subschema: '' } },
    'sub-schema.json': { $id: '' },
  };

  SchemaRepositoryVersion.generateHtmlCertificate = jest.fn();
  SchemaRepositoryVersion.generatePdfCertificate = jest.fn();

  beforeAll(async () => {
    // create fake files
    await Promise.all(
      Object.entries(fixtures).map(([file, value]) =>
        writeFile(`${__dirname}/${file}`, JSON.stringify(value, null, 2)),
      ),
    );
  });

  afterAll(async () => {
    // delete fake files
    await Promise.all(Object.keys(fixtures).map((file) => removeFile(`${__dirname}/${file}`)));
  });

  it('should update get RefSchemaUrl from parameters', () => {
    const instance = new SchemaRepositoryVersion(serverUrl, defaultSchemaFilePaths, version, {}, null, schemaName);
    const RefSchemaUrl = instance.buildRefSchemaUrl();
    expect(RefSchemaUrl).toBe(`${serverUrl}/${version}/${schemaName}`);
  });

  it('should update JSON certificate fixtures', async () => {
    const instance = new SchemaRepositoryVersion(serverUrl, defaultSchemaFilePaths, version);
    await instance.updateJsonFixturesVersion(`${pattern}.json`);
    const certificateFixture = await loadExternalFile(`${__dirname}/certificate-1.json`, 'json');
    expect(certificateFixture).toHaveProperty('RefSchemaUrl');
    expect(certificateFixture.RefSchemaUrl).toBe(instance.buildRefSchemaUrl());
  });

  it('should update HTML certificate fixtures', async () => {
    const templatePath = 'test.hbs';
    const instance = new SchemaRepositoryVersion(
      serverUrl,
      defaultSchemaFilePaths,
      version,
      translations,
      extraTranslations,
    );
    await instance.updateHtmlFixturesVersion(`${pattern}.json`, templatePath);
    expect(SchemaRepositoryVersion.generateHtmlCertificate).toBeCalledTimes(2);
    expect(SchemaRepositoryVersion.generateHtmlCertificate).toBeCalledWith(
      expect.stringContaining('certificate'),
      templatePath,
      translations,
      extraTranslations,
      {},
      undefined,
    );
  });

  it('should update PDF certificate fixtures', async () => {
    const generatorPath = 'test.min.js';
    const fonts = {
      Lato: { normal: '' },
    };
    const docDefinition: Partial<TDocumentDefinitions> = {
      pageSize: 'A4',
      defaultStyle: { font: 'Lato' },
    };
    const instance = new SchemaRepositoryVersion(serverUrl, defaultSchemaFilePaths, version, translations, {});
    await instance.updatePdfFixturesVersion(`${pattern}.json`, generatorPath, docDefinition, fonts);
    expect(SchemaRepositoryVersion.generatePdfCertificate).toBeCalledTimes(2);
    expect(SchemaRepositoryVersion.generatePdfCertificate).toBeCalledWith(
      expect.stringContaining('certificate'),
      generatorPath,
      translations,
      docDefinition,
      fonts,
      {},
    );
  });

  it('should update Partials map version(s)', async () => {
    const partialsMapPaths: PartialsMapProperties = {
      filePath: `${__dirname}/partials-map.json`,
      properties: [
        {
          path: 'company',
          schemaType: 'schema-definitions',
          version: 'v0.0.0',
          value: 'company/company.hbs',
        },
        {
          path: 'group',
          value: 'group/group.hbs',
        },
      ],
    };

    const instance = new SchemaRepositoryVersion(serverUrl, [], version);
    await instance.updatePartialsMapVersion(partialsMapPaths);

    const partialsMapFixtures = await loadExternalFile(`${__dirname}/partials-map.json`, 'json');
    expect(partialsMapFixtures).toHaveProperty('company');
    expect(partialsMapFixtures).toHaveProperty('group');
    expect(partialsMapFixtures['group']).toBe(instance.buildRefSchemaUrl('group/group.hbs'));
    expect(partialsMapFixtures['company']).toBe(
      instance.buildCustomRefSchemaUrl('schema-definitions', 'v0.0.0', 'company/company.hbs'),
    );
  });

  it('should update Schema version(s)', async () => {
    const schemaFilePaths: SchemaFileProperties[] = [
      {
        filePath: `${__dirname}/schema.json`,
        properties: [
          { value: 'schema.json', path: '$id' },
          {
            value: 'material-certification.json#/definitions/MaterialTest',
            path: 'prop.subschema',
          },
        ],
      },
      {
        filePath: `${__dirname}/sub-schema.json`,
        properties: [{ value: 'sub-schema.schema.json', path: '$id' }],
      },
    ];
    const instance = new SchemaRepositoryVersion(serverUrl, schemaFilePaths, version);
    await instance.updateSchemasVersion();

    const schemaFixture = await loadExternalFile(`${__dirname}/schema.json`, 'json');
    const subSchemaFixture = await loadExternalFile(`${__dirname}/sub-schema.json`, 'json');
    expect(schemaFixture).toHaveProperty('$id');
    expect(schemaFixture['$id']).toBe(instance.buildRefSchemaUrl('schema.json'));
    expect(schemaFixture['prop']['subschema']).toBe(
      instance.buildRefSchemaUrl('material-certification.json#/definitions/MaterialTest'),
    );
    expect(subSchemaFixture).toHaveProperty('$id');
    expect(subSchemaFixture['$id']).toBe(instance.buildRefSchemaUrl('sub-schema.schema.json'));
  });
});
