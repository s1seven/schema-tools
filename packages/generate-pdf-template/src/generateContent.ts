import 'regenerator-runtime/runtime';
import { createTransactionParties } from './lib/createTransactionParties';
import { createCommercialTransaction } from './lib/commercialTransaction';
import { createProductDescription } from './lib/createProductDescription';
// import { getTranslations } from './lib/helpers';
import { Translate } from './lib/translate';
import { Certificate } from './types';

export async function generateContent(certificate: Certificate, translations: Record<string, unknown>) {
  // TODO: update build config to do :
  // ? const translations = await getTranslations(certificate.Certificate.CertificateLanguages, certificate.RefSchemaUrl);
  const i18n = new Translate(translations);
  const commercialParties = createTransactionParties(certificate.Certificate.CommercialTransaction, i18n);
  const commercialTransaction = createCommercialTransaction(certificate.Certificate.CommercialTransaction, i18n);
  const productDescription = createProductDescription(certificate.Certificate.ProductDescription, i18n);

  return [...commercialParties.content, ...commercialTransaction.content, ...productDescription.content];
}
