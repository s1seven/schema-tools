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

    cert.on('error', (err) => {
      console.error(err.message);
    });

    cert.on('ready', async () => {
      let RefSchemaUrl = cert.get('RefSchemaUrl');
      console.log({ RefSchemaUrl });
      await cert.set({
        RefSchemaUrl: 'https://schemas.en10204.io/en10168-schemas/v0.0.2-3/schema.json',
      });
      RefSchemaUrl = cert.get('RefSchemaUrl');
      console.log({ RefSchemaUrl });

      console.log('Certificate schemaProperties', cert.schemaProperties);

      const toJSON = cert.toJSON();
      console.log('Certificate instance', toJSON);

      const validation = cert.validate();
      console.log({ isValid: validation.valid });

      // this assignement should fire error event due to conflict with new schema loaded
      await cert
        .set({
          RefSchemaUrl: 'https://schemas.en10204.io/en10168-schemas/v0.0.2-2/schema.json',
        })
        .catch((e) => e);
    });
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);

