const { CertificateModel } = require('./dist/index');
const validEn10168Certificate = require('../../fixtures/EN10168/v0.0.2/valid_cert.json');
const validECoCCertificate = require('../../fixtures/E-CoC/v0.0.2-2/valid_cert.json');

async function en10168Certificate(CertModel) {
  const cert = new CertModel(validEn10168Certificate);

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
}

async function eCoCCertificate(CertModel) {
  const cert = new CertModel(validECoCCertificate);

  cert.on('error', (err) => {
    console.error(err.message);
  });

  cert.on('ready', async () => {
    let RefSchemaUrl = cert.get('RefSchemaUrl');
    console.log({ RefSchemaUrl });

    console.log('Certificate schemaProperties', cert.schemaProperties);

    const toJSON = cert.toJSON();
    console.log('Certificate ECoCData', toJSON.EcocData);

    const validation = cert.validate();
    console.log({ isValid: validation.valid });

  });
}

(async function (argv) {
  try {
    const schemaType = argv[2] || 'en10168-schemas';
    const schemaVersion = argv[3] || 'v0.0.2-2';

    const CertModel = await CertificateModel.build({
      schemaConfig: {
        version: schemaVersion,
        schemaType,
      },
    });

    if (schemaType.startsWith('en10168')) {
      await en10168Certificate(CertModel);
    } else if (schemaType.startsWith('e-coc')) {
      await eCoCCertificate(CertModel);
    }
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
