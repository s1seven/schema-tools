const { createWriteStream } = require('fs');
const { generatePdf } = require('./dist/index');
const en10168Certificate = require('../../fixtures/EN10168/v0.0.2/valid_cert.json');

(async function (argv) {
  try {
    const schemaType = argv[2] || 'en10168-schemas';

    const fonts = {
      Lato: {
        normal: `${__dirname}/node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
        bold: `${__dirname}/node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
        italics: `${__dirname}/node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
        light: `${__dirname}/node_modules/lato-font/fonts/lato-light/lato-light.woff`,
      },
    };

    en10168Certificate.RefSchemaUrl = 'https://schemas.en10204.io/en10168-schemas/v0.0.3-2/schema.json';
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 40],
      footer: function (currentPage, pageCount) {
        return { text: currentPage.toString() + ' / ' + pageCount, style: 'footer', alignment: 'center' };
      },
      defaultStyle: {
        font: 'Lato',
        fontSize: 10,
      },
    };

    const pdfDoc = (await generatePdf(en10168Certificate, {
      docDefinition,
      outputType: 'stream',
      fonts,
    }));

    const outputFilePath = './test.pdf';
    const writeStream = createWriteStream(outputFilePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    await new Promise((resolve, reject) => {
      writeStream
        .on('finish', () => {
          resolve(true);
        })
        .on('error', (err) => {
          reject(err);
        });
    });

  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
