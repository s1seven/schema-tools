import { Certificate, Translate } from './types';

import { createCommercialTransaction } from './lib/commercialTransaction';
import { createProductDescription } from './lib/createProductDescription';

export function generateContent(certificate: Certificate, i18n: Translate) {

  const commercialTransaction = createCommercialTransaction(certificate.Certificate.CommercialTransaction, i18n);
  const productDescription = createProductDescription(certificate.Certificate.ProductDescription, i18n);

  return  [
    { text: 'Certificate', style: 'h1' },
    ...commercialTransaction.content,
    ...productDescription.content,
  ];
};