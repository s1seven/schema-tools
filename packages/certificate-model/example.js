const { CertificateModel } = require('./dist/index');
const validCertificate = require('../../fixtures/EN10168/v0.0.2/valid_cert.json');

(async function (argv) {
  try {
    const schemaType = argv[2] || 'en10168-schemas';
    const schemaVersion = argv[3] || '0.0.2';

    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: schemaVersion,
        schemaType,
      },
    });

    const cert = new CertModel(validCertificate);
    cert.set({
      RefSchemaUrl:
        'https://schemas.en10204.io/en10168-schemas/v0.0.2-3/schema.json',
    });

    const RefSchemaUrl = cert.get('RefSchemaUrl');
    console.log({ RefSchemaUrl });
    const validation = cert.validate();
    console.log({ isValid: validation.valid });
    const toJSON = cert.toJSON();
    console.log('Certificate instance', toJSON);
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
