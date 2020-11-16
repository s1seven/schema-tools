import { generatePdf } from '../src/index';

const certificatePath = `${__dirname}/../../../fixtures/EN10168/valid_cert.json`;

describe.skip('GeneratePDF', function () {
  it('should render PDF certificate using certificate local path and HBS template', async () => {
    const buffer = await generatePdf(certificatePath);
    console.log(buffer);
  }, 5000);
});
