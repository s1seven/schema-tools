import { expect } from 'chai';
import { readFileSync } from 'fs';
import { generateHtml } from '../src/generate-html';

const certificatePath = `${__dirname}/../fixtures/EN10168/valid_cert.json`;

describe('GenerateHTML', function () {
  this.timeout(4000);

  const expectedHtmlFromHbs = readFileSync(
    `${__dirname}/../fixtures/EN10168/template_hbs.html`,
    'utf-8'
  );
  const expectedHtmlFromMjml = readFileSync(
    `${__dirname}/../fixtures/EN10168/template_mjml.html`,
    'utf-8'
  );

  it('should render HTML certificate using certificate local path and HBS template', async () => {
    const html = await generateHtml(certificatePath);
    expect(html).to.be.equal(expectedHtmlFromHbs);
  });

  it.skip('should render HTML certificate using certificate local path and MJML template', async () => {
    const html = await generateHtml(certificatePath, { templateType: 'mjml' });
    expect(html).to.be.equal(expectedHtmlFromMjml);
  });
});
