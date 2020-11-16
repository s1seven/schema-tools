import { createTransactionParties } from './lib/createTransactionParties';
import { createCommercialTransaction } from './lib/commercialTransaction';
import { createInspection } from './lib/createInspection';
import { createProductDescription } from './lib/createProductDescription';
import { Translate } from './lib/translate';
import { Certificate, Content } from './types';
import { createValidation } from './lib/createValidation';
import { createOtherTests } from './lib/createOtherTests';

export async function generateContent(
  certificate: Certificate,
  translations: Record<string, unknown>,
): Promise<Content> {
  const i18n = new Translate(translations);
  const commercialParties = createTransactionParties(certificate.Certificate.CommercialTransaction, i18n);
  const commercialTransaction = createCommercialTransaction(certificate.Certificate.CommercialTransaction, i18n);
  const productDescription = createProductDescription(certificate.Certificate.ProductDescription, i18n);
  const inspection = createInspection(certificate.Certificate.Inspection, i18n);
  const otherTests = certificate.Certificate.OtherTests
    ? createOtherTests(certificate.Certificate.OtherTests, i18n)
    : '';
  const validation = createValidation(certificate.Certificate.Validation, i18n);

  return [commercialParties, commercialTransaction, productDescription, ...inspection, otherTests, ...validation];
}
