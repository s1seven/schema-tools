import { generateHtml } from '../src/index';
import { HtmlDiffer } from 'html-differ';
import { readFileSync } from 'fs';

const certificatePath = `${__dirname}/../../../fixtures/EN10168/v0.0.2/valid_cert.json`;
// TODO: add tests for CoA schema after next release

describe('GenerateHTML', function () {
  const expectedHtmlFromHbs = readFileSync(`${__dirname}/../../../fixtures/EN10168/v0.0.2/template_hbs.html`, 'utf-8');
  const expectedHtmlFromMjml = readFileSync(
    `${__dirname}/../../../fixtures/EN10168/v0.0.2/template_mjml.html`,
    'utf-8',
  );

  it('should render HTML certificate using certificate local path and HBS template', async () => {
    const html = await generateHtml(certificatePath);
    const htmlDiffer = new HtmlDiffer({
      ignoreAttributes: [],
      ignoreWhitespaces: true,
      ignoreComments: true,
      ignoreEndTags: false,
      ignoreDuplicateAttributes: false,
    });

    const isEqual = htmlDiffer.isEqual(expectedHtmlFromHbs, html);
    expect(isEqual).toBe(true);
  }, 8000);

  it('should render HTML certificate using loaded certificate and HBS template', async () => {
    const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
    const html = await generateHtml(certificate);
    const htmlDiffer = new HtmlDiffer({
      ignoreAttributes: [],
      ignoreWhitespaces: true,
      ignoreComments: true,
      ignoreEndTags: false,
      ignoreDuplicateAttributes: false,
    });

    const isEqual = htmlDiffer.isEqual(expectedHtmlFromHbs, html);
    expect(isEqual).toBe(true);
  }, 8000);

  it.skip('should render HTML certificate using certificate local path and MJML template', async () => {
    const html = await generateHtml(certificatePath, { templateType: 'mjml' });
    expect(html).toEqual(expectedHtmlFromMjml);
  }, 8000);
});
