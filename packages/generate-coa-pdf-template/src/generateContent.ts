import {
  Attachment,
  BusinessTransaction,
  Certificate,
  Company,
  DeclarationOfConformity,
  Inspection,
  Parties,
  Person,
  Product,
} from './types';
import {
  computeTextStyle,
  createEmptyColumns,
  createFooter,
  localizeDate,
  localizeNumber,
  TableElement,
  tableLayout,
  Translate,
  Translations,
} from '@s1seven/schema-tools-generate-pdf-template-helpers';
import { Content, ContentCanvas, ContentText, TableCell } from 'pdfmake/interfaces';

function createManufacturerHeader(parties: Parties, logo: string): TableCell[][] {
  const manufacturerLogo: TableCell[] = logo ? [{ image: logo, width: 150 }] : [];
  const { Manufacturer } = parties;
  const manufacturerInfo: TableCell[] = [
    { text: Manufacturer.Name, style: 'h4' },
    { text: Manufacturer.Street, style: 'p' },
    {
      text: `${Manufacturer.City},${Manufacturer.ZipCode},${Manufacturer.Country}`,
      style: 'p',
    },
    // { text: commercialTransaction[element]?.VAT_Id || '', style: 'p' },
    { text: Manufacturer.Email, style: 'p' },
  ];

  return [manufacturerLogo, manufacturerInfo];
}

export function createHeader(parties: Parties, logo: string): TableElement {
  const values = createManufacturerHeader(parties, logo);

  return {
    style: 'table',
    table: {
      widths: [250, 300],
      body: [values],
    },
    layout: tableLayout,
  };
}

function createPartyColumn(party: Company): TableCell[] {
  return [
    { text: party.Name, style: 'h4' },
    { text: party.Street, style: 'p' },
    {
      text: `${party.ZipCode} ${party.City} ${party.Country}`,
      style: 'p',
    },
    { text: party.Email, style: 'p' },
  ];
}

export function createReceivers(parties: Parties, i18n: Translate): TableElement {
  const keys: TableCell[][] = ['Customer', 'ConsigneeOfGoods'].map((element) => [
    { text: i18n.translate(element, 'Certificate'), style: { bold: true, fontSize: 10, margin: [0, 4, 0, 4] } },
  ]);

  const { Customer, ConsigneeOfGoods } = parties;
  const customerColumn = createPartyColumn(Customer);
  const consigneeColumn = ConsigneeOfGoods ? createPartyColumn(ConsigneeOfGoods) : [];
  const contentBody = [keys, [customerColumn, consigneeColumn]];
  return {
    style: 'table',
    table: {
      widths: [250, 300],
      body: contentBody,
    },
    layout: tableLayout,
  };
}

export function createGeneralInfo(
  certificate: Certificate,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement] {
  const contentBody: TableCell[] = [
    { text: i18n.translate('Id', 'Certificate'), style: 'h5' },
    { text: certificate.Certificate.Id, style: 'p' },
    { text: i18n.translate('Date', 'Certificate'), style: 'h5' },
    { text: localizeDate(certificate.Certificate.Date, i18n.languages), style: 'p' },
  ];

  return [
    {
      text: `${i18n.translate('Name', 'Certificate')}  ${certificate.Certificate.Type}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      table: {
        widths: [150, 90, 100, 150],
        body: [contentBody],
      },
      layout: tableLayout,
    },
  ];
}

export function createBusinessReferences(
  reference: BusinessTransaction,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement] {
  const { Delivery, Order } = reference;
  const firstRow: TableCell[] = [
    { text: i18n.translate('Order', 'Certificate'), colSpan: 2, style: 'tableHeader' },
    {},
    { text: i18n.translate('Delivery', 'Certificate'), colSpan: 2, style: 'tableHeader' },
    {},
  ];
  const numberRow: TableCell[] = [
    { text: i18n.translate('OrderNumber', 'Certificate'), style: 'tableHeader' },
    { text: Order.Number, style: 'p' },
    { text: i18n.translate('DeliveryNumber', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.Number, style: 'p' },
  ];

  const positionRow: TableCell[] = [
    { text: i18n.translate('OrderPosition', 'Certificate'), style: 'tableHeader' },
    { text: Order.Position, style: 'p' },
    { text: i18n.translate('DeliveryPosition', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.Position, style: 'p' },
  ];

  const quantityRow: TableCell[] = [
    { text: i18n.translate('OrderQuantity', 'Certificate'), style: 'tableHeader' },
    { text: `${localizeNumber(Order.Quantity, i18n.languages)} ${Order.QuantityUnit}`, style: 'p' },
    { text: i18n.translate('DeliveryQuantity', 'Certificate'), style: 'tableHeader' },
    { text: `${localizeNumber(Delivery.Quantity, i18n.languages)} ${Delivery.QuantityUnit}`, style: 'p' },
  ];

  const dateRow: TableCell[] = [
    { text: i18n.translate('OrderDate', 'Certificate'), style: 'tableHeader' },
    { text: Order.Date ? localizeDate(Order.Date, i18n.languages) : '', style: 'p' },
    { text: i18n.translate('DeliveryDate', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.Date ? localizeDate(Delivery.Date, i18n.languages) : '', style: 'p' },
  ];

  const fifthRow: TableCell[] = [
    { text: i18n.translate('InternalOrderNumber', 'Certificate'), style: 'tableHeader' },
    { text: Order.InternalOrderNumber, style: 'p' },
    { text: i18n.translate('Transport', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.Transport, style: 'p' },
  ];

  const sixthRow: TableCell[] = [
    { text: i18n.translate('InternalOrderPosition', 'Certificate'), style: 'tableHeader' },
    { text: Order.InternalOrderPosition, style: 'p' },
    { text: i18n.translate('GoodsReceiptNumber', 'Certificate'), style: 'tableHeader' },
    { text: Delivery.GoodsReceiptNumber, style: 'p' },
  ];

  return [
    {
      text: `${i18n.translate('BusinessTransaction', 'Certificate')}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      table: {
        widths: [150, 90, 100, 150],
        body: [firstRow, numberRow, positionRow, quantityRow, dateRow, fifthRow, sixthRow],
      },
      layout: tableLayout,
    },
  ];
}

export function createProductDescription(
  product: Product,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement] {
  const textFields: { name: string; i18n: string; format?: 'Date' | 'Array' }[] = [
    { name: 'Name', i18n: 'ProductName' },
    { name: 'Number', i18n: 'ProductNumber' },
    { name: 'CustomerProductNumber', i18n: 'CustomerProductNumber' },
    { name: 'CountryOfOrigin', i18n: 'CountryOfOrigin' },
    { name: 'PlaceOfOrigin', i18n: 'PlaceOfOrigin' },
    { name: 'ChargeNumber', i18n: 'ChargeNumber' },
    { name: 'ProductionDate', i18n: 'ProductionDate', format: 'Date' },
    { name: 'Standards', i18n: 'Standards', format: 'Array' },
    { name: 'AdditionalInformation', i18n: 'AdditionalInformation', format: 'Array' },
  ];

  const rows: TableCell[][] = textFields
    .map((field) =>
      product[field.name]
        ? [
            { text: i18n.translate(field.i18n, 'Certificate'), colSpan: 2, style: 'tableHeader' },
            {},
            { text: computeTextStyle(product[field.name], field.format, i18n.languages), colSpan: 2, style: 'p' },
            {},
          ]
        : null,
    )
    .filter((val) => !!val);

  return [
    {
      text: `${i18n.translate('Product', 'Certificate')}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      table: {
        widths: [150, 90, 100, 150],
        body: rows,
      },
      layout: tableLayout,
    },
  ];
}

function createInspection(inspection: Inspection, i18n: Translate): TableCell[] {
  const textFields: { name: string; format?: 'Number' }[] = [
    { name: 'Property' },
    { name: 'Method' },
    { name: 'Unit' },
    { name: 'Value', format: 'Number' },
    { name: 'Minimum', format: 'Number' },
    { name: 'Maximum', format: 'Number' },
    { name: 'Temperature', format: 'Number' },
    { name: 'Weight', format: 'Number' },
  ];

  return textFields.reduce((acc, field) => {
    acc.push({ text: computeTextStyle(inspection[field.name], field.format, i18n.languages), style: 'caption' });
    return acc;
  }, []);
}

export function createAnalysis(
  analysis: {
    Inspections?: Inspection[];
    AdditionalInformation?: string[];
  },
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement] {
  const headerStyle = {
    fontSize: 8,
    italics: true,
    margin: [0, 2, 0, 2],
  };
  const headerRow: TableCell[] = [
    { text: i18n.translate('Property', 'Certificate'), style: headerStyle },
    { text: i18n.translate('Method', 'Certificate'), style: headerStyle },
    { text: i18n.translate('Unit', 'Certificate'), style: headerStyle },
    { text: i18n.translate('Value', 'Certificate'), style: headerStyle },
    { text: i18n.translate('Minimum', 'Certificate'), style: headerStyle },
    { text: i18n.translate('Maximum', 'Certificate'), style: headerStyle },
    { text: i18n.translate('Temperature', 'Certificate'), style: headerStyle },
    { text: i18n.translate('Weight', 'Certificate'), style: headerStyle },
  ];

  const body = [headerRow];
  if (analysis.Inspections?.length) {
    const inspectionsRows = analysis.Inspections.map((inspection) => createInspection(inspection, i18n));
    body.push(...inspectionsRows);
  }
  if (analysis.AdditionalInformation?.length) {
    const emptyColumns = createEmptyColumns(7);
    const additionalInformationTitle: TableCell[] = [
      { text: i18n.translate('AdditionalInformation', 'Certificate'), style: headerStyle, colSpan: 8 },
      ...emptyColumns,
    ];
    const additionalInformation: TableCell[] = [
      { text: analysis.AdditionalInformation.join('\n'), style: 'p', colSpan: 8 },
      ...emptyColumns,
    ];
    body.push(additionalInformationTitle, additionalInformation);
  }

  return [
    {
      text: `${i18n.translate('Inspections', 'Certificate')}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      table: {
        widths: [80, 80, 50, 50, 50, 50, 50, 50],
        body,
      },
      layout: tableLayout,
    },
  ];
}

export function createDeclarationOfConformity(
  declarationOfConformity: DeclarationOfConformity,
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement] {
  const declaration: TableCell[] = [{ text: declarationOfConformity.Declaration, style: 'p', colSpan: 2 }, {}];
  return [
    {
      text: `${i18n.translate('DeclarationOfConformity', 'Certificate')}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      table: {
        widths: [400, 150],
        body: [declaration],
      },
      layout: tableLayout,
    },
  ];
}

export function createContacts(contacts: Person[], i18n: Translate): [ContentText, ContentCanvas, TableElement] {
  const headerRow: TableCell[] = [
    { text: i18n.translate('ContactName', 'Certificate'), style: 'tableHeader' },
    { text: i18n.translate('ContactRole', 'Certificate'), style: 'tableHeader' },
    { text: i18n.translate('ContactDepartment', 'Certificate'), style: 'tableHeader' },
    { text: i18n.translate('ContactEmail', 'Certificate'), style: 'tableHeader' },
    { text: i18n.translate('ContactPhone', 'Certificate'), style: 'tableHeader' },
    { text: i18n.translate('ContactFax', 'Certificate'), style: 'tableHeader' },
  ];

  const contactsRows: TableCell[][] = contacts.map((contact) => [
    { text: contact.Name, style: 'p' },
    { text: contact.Role, style: 'p' },
    { text: contact.Department, style: 'p' },
    { text: contact.Email, style: 'p' },
    { text: contact.Phone, style: 'p' },
    { text: contact.Fax, style: 'p' },
  ]);

  const body = [headerRow, ...contactsRows];

  return [
    {
      text: `${i18n.translate('Contacts', 'Certificate')}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      table: {
        widths: ['*', '*', '*', '*', '*', '*'],
        body,
      },
      layout: tableLayout,
    },
  ];
}

export function createAttachments(
  attachments: Attachment[],
  i18n: Translate,
): [ContentText, ContentCanvas, TableElement] {
  const attachmentsRows: TableCell[][] = attachments.map((attachment) => [{ text: attachment.FileName, style: 'p' }]);
  return [
    {
      text: `${i18n.translate('Attachments', 'Certificate')}`,
      style: 'h2',
      margin: [0, 0, 0, 4],
    },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    {
      style: 'table',
      table: {
        widths: ['*'],
        body: [...attachmentsRows],
      },
      layout: tableLayout,
    },
  ];
}

export function generateContent(certificate: Certificate, translations: Translations): Content {
  const i18n = new Translate(translations, certificate.Certificate.CertificateLanguages);
  const header = createHeader(certificate.Certificate.Parties, certificate.Certificate.Logo || '');
  const receivers = createReceivers(certificate.Certificate.Parties, i18n);
  const generalInfo = createGeneralInfo(certificate, i18n);
  const businessReferences = createBusinessReferences(certificate.Certificate.BusinessTransaction, i18n);
  const productDescription = createProductDescription(certificate.Certificate.Product, i18n);
  const analysis = createAnalysis(certificate.Certificate.Analysis, i18n);
  const declarationOfConformity = createDeclarationOfConformity(certificate.Certificate.DeclarationOfConformity, i18n);
  const content: Content = [
    header,
    receivers,
    generalInfo,
    businessReferences,
    productDescription,
    analysis,
    declarationOfConformity,
  ];

  if (certificate.Certificate.Contacts?.length) {
    const contacts = createContacts(certificate.Certificate.Contacts, i18n);
    content.push(contacts);
  }
  if (certificate.Certificate.Attachments?.length) {
    const attachments = createAttachments(certificate.Certificate.Attachments, i18n);
    content.push(attachments);
  }
  const footer = createFooter(certificate.RefSchemaUrl);
  content.push(footer);
  return content;
}
