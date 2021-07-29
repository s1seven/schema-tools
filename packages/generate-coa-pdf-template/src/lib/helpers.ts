import { TableLayout } from 'pdfmake/interfaces';

export const createEmptyColumns = (amount: number) => Array(amount).fill({});

export const tableLayout: TableLayout = {
  hLineWidth: function (): number {
    return 0;
  },
  vLineWidth: function (): number {
    return 0;
  },
};

export function localizeValue(value: string, type: string, locales: string | string[] = 'EN') {
  let result: any;

  const getLocalizeDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat(locales, options).format(new Date(value));
  };

  switch (type) {
    case 'number':
      result = new Intl.NumberFormat(locales, { maximumSignificantDigits: 6 }).format(Number(value));
      break;
    case 'date':
      result = getLocalizeDate();
      break;
    case 'date-time':
      result = getLocalizeDate();
      break;
    default:
      result = value;
  }
  return result;
}

export function localizeDate(lvalue: string | number | Date, locales: string | string[] = 'EN') {
  const event = new Date(lvalue);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(locales, options).format(event);
}

export function localizeNumber(lvalue: number, locales: string | string[] = 'EN') {
  return new Intl.NumberFormat(locales, { maximumSignificantDigits: 6 }).format(lvalue);
}
