import { expect } from 'chai';
import { readFileSync } from 'fs';
import { generateHtml } from '../src/generate-html';

const templatePath = `https://raw.githubusercontent.com/s1seven/schemas/main/EN10168.hbs`;
const schemaPath = `${__dirname}/../fixtures/EN10168/valid_en10168_test.json`;

describe.skip('GenerateHTML', () => {
  const expectedHtml = readFileSync(
    `${__dirname}/../fixtures/EN10168/index.html`,
    'utf-8'
  );

  it('should generate HTML certificate using external template and JSON paths', async () => {
    const html = await generateHtml(templatePath, schemaPath);
    expect(html).to.be.equal(expectedHtml);
  });
});
