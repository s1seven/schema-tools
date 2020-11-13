export function fillTableRow(arr: any[], colCounts: number, fill = {}) {
  if (arr.length === colCounts) {
    return arr;
  } else {
    arr.push(fill);
    return fillTableRow(arr, colCounts);
  }
}

export const createEmptyColumns = (amount: number) => Array(amount).fill({});

// TODO: add joinAndLocalizeNumber, localizeDate, localizeValue, localizeNumber helpers
