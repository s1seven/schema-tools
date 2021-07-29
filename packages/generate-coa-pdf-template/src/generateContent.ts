import { Certificate, Translations } from './types';
import { Content } from 'pdfmake/interfaces';
import { createBusinessReferences } from './lib/createBusinessReferences';
import { createFooter } from './lib/createFooter';
import { createGeneralInfo } from './lib/createGeneralInfo';
import { createHeader } from './lib/createHeader';
import { createReceivers } from './lib/createReceivers';
import { Translate } from './lib/translate';

export function generateContent(certificate: Certificate, translations: Translations): Content {
  const i18n = new Translate(translations, certificate.Certificate.CertificateLanguages);
  const header = createHeader(certificate.Certificate.Parties, certificate.Certificate.Logo || '');
  const receivers = createReceivers(certificate.Certificate.Parties, i18n);
  const generalInfo = createGeneralInfo(certificate, i18n);
  const businessReferences = createBusinessReferences(certificate.Certificate.BusinessTransaction, i18n);
  const footer = createFooter(certificate.RefSchemaUrl);

  return [header, receivers, generalInfo, businessReferences, footer];
}
