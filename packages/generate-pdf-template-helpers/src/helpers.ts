import { TableLayout } from 'pdfmake/interfaces';

import { TableElement } from './types';

export function fillTableRow(arr: any[], colCounts: number, fill = {}) {
  if (arr.length === colCounts) {
    return arr;
  } else {
    arr.push(fill);
    return fillTableRow(arr, colCounts, fill);
  }
}

export const createEmptyColumns = (amount: number) => Array(amount).fill({});

export const tableLayout: TableLayout = {
  hLineWidth: function (): number {
    return 0;
  },
  vLineWidth: function (): number {
    return 0;
  },
};

export function computeTextStyle(
  value: string | string[],
  format?: 'Date' | 'Array' | 'Number',
  locales?: string | string[],
) {
  if (format === 'Date') {
    return localizeDate(value as string, locales);
  } else if (format === 'Array' && Array.isArray(value)) {
    return value.join(', ');
  } else if (format === 'Number' && typeof value === 'number') {
    return localizeNumber(value, locales);
  }
  return value;
}

export function localizeValue(
  value: string,
  type: 'number' | 'date' | 'date-time' | string,
  locales: string | string[] = 'EN',
) {
  let result: any;

  switch (type) {
    case 'number':
      result = localizeNumber(Number(value));
      break;
    case 'date':
      result = localizeDate(value, locales);
      break;
    case 'date-time':
      result = localizeDate(value, locales);
      break;
    default:
      result = value;
  }
  return result;
}

export function localizeDate(lvalue: string | number | Date, locales: string | string[] = 'EN') {
  const event = new Date(lvalue);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(locales, options).format(event);
}

export function localizeNumber(lvalue: number | string, locales: string | string[] = 'EN') {
  if (typeof lvalue === 'string') {
    lvalue = Number(lvalue);
  }
  return new Intl.NumberFormat(locales, { maximumSignificantDigits: 6 }).format(lvalue);
}

export function createFooter(RefSchemaUrl: string): TableElement {
  return {
    style: 'table',
    margin: [0, 50, 0, 0],
    table: {
      widths: [280, 250],
      body: [
        [
          {
            text: [
              {
                text: 'Powered by ',
                style: 'small',
                margin: [0, 0, 0, 0],
              },
              {
                text: 's1seven.com',
                style: 'small',
                color: 'blue',
                margin: [0, 0, 0, 0],
                decoration: 'underline',
                link: 'https://s1seven.com',
              },
            ],
          },
          { text: RefSchemaUrl, style: 'small', color: '#D3D3D3', margin: [0, 0, 0, 0], alignment: 'right' },
        ],
      ],
    },
    layout: tableLayout,
  };
}
