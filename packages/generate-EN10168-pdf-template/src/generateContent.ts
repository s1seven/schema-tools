import { Certificate } from './types';
import { Content } from 'pdfmake/interfaces';
import { createCommercialTransaction } from './lib/commercialTransaction';
import { createFooter } from './lib/createFooter';
import { createInspection } from './lib/createInspection';
import { createOtherTests } from './lib/createOtherTests';
import { createProductDescription } from './lib/createProductDescription';
import { createTransactionParties } from './lib/createTransactionParties';
import { createValidation } from './lib/createValidation';
import { Translate } from './lib/translate';

export async function generateContent(
  certificate: Certificate,
  translations: Record<string, unknown>,
): Promise<Content> {
  const i18n = new Translate(translations);
  const commercialParties = createTransactionParties(certificate.Certificate.CommercialTransaction, i18n);
  const commercialTransaction = createCommercialTransaction(certificate.Certificate.CommercialTransaction, i18n);
  const productDescription = createProductDescription(certificate.Certificate.ProductDescription, i18n);
  const inspection = createInspection(certificate.Certificate.Inspection, i18n);
  const otherTests = createOtherTests(certificate.Certificate.OtherTests, i18n);
  const validation = createValidation(certificate.Certificate.Validation, i18n);
  const footer = createFooter(certificate.RefSchemaUrl);

  return [
    commercialParties,
    ...commercialTransaction,
    ...productDescription,
    ...inspection,
    ...otherTests,
    ...validation,
    footer,
  ];
}
