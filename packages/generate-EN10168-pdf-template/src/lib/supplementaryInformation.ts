import { CommercialTransactionSupplementaryInformation, Translate } from '../types'

const createBrackets = (amount: number) => [...Array(amount).fill({})];

export const supplementaryInformation = (data: CommercialTransactionSupplementaryInformation, i18n: Translate, colSpan: number = 3) => {

  const dataMapped = Object.keys(data).map(element =>
    [{ text: data[element].Key, style: 'p', colSpan: (colSpan - 2) },
    ...createBrackets(colSpan - 3),
    {text: `${data[element].Value} ${data[element].Unit ? data[element].Unit : ''}`, colSpan: 2}],
    {}
    )

  if (dataMapped.length === 0) return []
  return [
    [
      { text: i18n.translate('SupplementaryInformation', 'otherFields'), style: 'h2', colSpan }, ...createBrackets(colSpan - 1),
    ],
    ...dataMapped
  ]
}
