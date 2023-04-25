import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join, parse, resolve } from 'node:path';
import { argv } from 'node:process';

/*
This script is used to generate PDF, HTML and interface fixtures from a JSON file.
Running the generate PDF and HTML scripts manually is cumbersome as it requires many arguments.
This script sets sensible defaults and will work for most cases.
To use this script, add a JSON file to the fixtures folder and run the following command:
npm run fixtures:generate <path to JSON file> <true|false>
E.g. npm run fixtures:generate fixtures/CoA/v1.1.0/valid_cert_1.json
The second argument is optional and will generate a certificate interface if set to true.
This script is compatible with CoA v1.0.0 and up, and all EN10168 versions.
*/

(async () => {
  const jsonPath = argv[2];
  const generateInterfaces = argv[3];

  if (!jsonPath) {
    console.log('Please provide a path to a valid JSON certificate');
    throw new Error('Missing JSON path');
  }

  const match = jsonPath.match(/coa|en10168/i);
  if (!match) {
    throw new Error('Invalid JSON path, path must be to a valid CoA or EN10168 JSON');
  }

  const schemaType = match[0].toLowerCase();
  const { dir } = parse(jsonPath);
  const extraTranslationsPath = schemaType === 'coa' ? `-e ${join(dir, 'extra_translations.json')}` : '';
  const pdfPath = jsonPath.replace('.json', '.pdf');
  const htmlPath = jsonPath.replace('.json', '.html').replace('valid_cert', 'template_hbs');
  const translationsPath = join(dir, 'translations.json');
  const templatePath = join(dir, 'template.hbs');
  const certificateInterfacePath = join(dir, 'certificate.ts');
  let partialsMapPath = join(dir, 'partials-map.json');

  // allows for compatability with older versions where partials-map.json was not used
  await readFile(partialsMapPath, 'utf-8')
    .then(() => {
      partialsMapPath = `-p ${partialsMapPath}`;
    })
    .catch(() => {
      partialsMapPath = '';
    });

  execSync(
    `npm run fixtures:pdf -- -c ${jsonPath} -o ${pdfPath} -t ${translationsPath} -g packages/generate-${schemaType}-pdf-template/dist/generateContent.js -s packages/generate-${schemaType}-pdf-template/utils/styles.json ${extraTranslationsPath}`,
    { stdio: 'inherit', cwd: resolve(__dirname, '../') },
  );

  try {
    execSync(
      `npm run fixtures:html -- -c ${jsonPath} -o ${htmlPath} -t ${translationsPath} ${partialsMapPath} -T ${templatePath} ${extraTranslationsPath}`,
      { stdio: 'inherit', cwd: resolve(__dirname, '../') },
    );
  } catch (e) {
    if (e.message.includes('partial')) {
      console.log('Please ensure that local partials are defined with an absolute path in the partials-map.json file');
    }
    throw e;
  }

  if (generateInterfaces === 'true') {
    execSync(`npm run fixtures:interfaces -- -s ../CoA-schemas/schema.json -o ${certificateInterfacePath}`, {
      stdio: 'inherit',
      cwd: resolve(__dirname, '../'),
    });
  }
})();
