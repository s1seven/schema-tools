import { readFileSync } from 'fs';
import { generateHtml } from '../src/index';

const certificatePath = `${__dirname}/../../../fixtures/EN10168/valid_cert.json`;

describe('GenerateHTML', function () {
  const expectedHtmlFromHbs = readFileSync(`${__dirname}/../../../fixtures/EN10168/template_hbs.html`, 'utf-8');
  const expectedHtmlFromMjml = readFileSync(`${__dirname}/../../../fixtures/EN10168/template_mjml.html`, 'utf-8');

  it('should render HTML certificate using certificate local path and HBS template', async () => {
    const html = await generateHtml(certificatePath);
    expect(html).toEqual(expectedHtmlFromHbs);
  }, 5000);

  it.skip('should render HTML certificate using certificate local path and MJML template', async () => {
    const html = await generateHtml(certificatePath, { templateType: 'mjml' });
    expect(html).toEqual(expectedHtmlFromMjml);
  }, 5000);
});
