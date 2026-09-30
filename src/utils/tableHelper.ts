import { NUMBER_REGEX, NON_ZERO_LEADING_REGEX } from 'const/regexes';
import { TableColumnProps, TableMeta, TableRow } from 'hooks/useDataTable';
import { Row } from '@tanstack/react-table';
import { ALIGNMENT, ICONS, STRINGS } from 'const';

/**
 * check max number exists or not
 * @param {number} number get input number
 * @param {number} maxNumber get max number
 * @returns {number} return number
 */
function checkMaxNumber(number: number, maxNumber: number): number {
  if (number > maxNumber) {
    return maxNumber;
  }
  return number;
}

/**
 * Checks if the given value is a valid quantity.
 * @param {string} value If sanitizedText is empty, set quantity to 0, otherwise parse the number
 * @returns {number} qty if the value is a valid quantity, 0 otherwise.
 */
export const validateAndSanitizeInput = (value: any, maxNumber: number): number => {
  const sanitizedText = String(value).replace(NUMBER_REGEX, '').replace(NON_ZERO_LEADING_REGEX, '');

  const newQuantity = sanitizedText === '' ? 0 : parseInt(sanitizedText, 10);
  if (!Number.isNaN(newQuantity) && value >= 0) {
    return checkMaxNumber(newQuantity, maxNumber);
  }
  return 0;
};

/**
 * Update if the given value is a valid quantity.
 * @param {any} inputValue receive field value
 * @param {TableColumnProps<TableRow>} columnDef get table column from plugin
 * @param {TableMeta} tableMeta get table options from plugin
 * @param {any} row get table row from plugin.
 * @param {object} tableInstance get table instance from plugin.
 * @param {string} icon get custom icon.
 * @returns {Row<TableRow>} return updated quantity
 */
export const updateUserInput = (inputValue: any, columnDef: TableColumnProps<TableRow>, tableMeta: TableMeta, row: Row<TableRow>, tableInstance: object, icon: string | null) => {
  let value = inputValue;
  switch (columnDef.operation) {
    case STRINGS.VALIDATE_NUMBER:
      if (icon === ICONS.ADD) {
        value = validateAndSanitizeInput(value + 1, row.original.maxQuantity);
        tableMeta?.updateData(row.index, columnDef?.accessorKey, value, true, (tableRecords: TableRow[]) => {
          columnDef?.onTableDataSubmit?.(tableRecords, tableInstance);
        });
      } else if (icon === ICONS.REMOVE) {
        value = validateAndSanitizeInput(value - 1, row.original.maxQuantity);
        tableMeta?.updateData(row.index, columnDef?.accessorKey, value, true, (tableRecords: TableRow[]) => {
          columnDef?.onTableDataSubmit?.(tableRecords, tableInstance);
        });
      } else {
        value = validateAndSanitizeInput(value, row.original.maxQuantity);
      }
      break;
    case STRINGS.DELETE_ROW:
      columnDef?.onConfirmationAlert?.(row, tableMeta, columnDef);
      break;
    default:
      break;
  }
  return value;
};

/**
 * Find searching key is available or not
 * @param keys - Get keys from input
 * @param obj - Get object from input
 * @param isEditable - Get status of custom cell
 * @returns return if exists otherwise will be null
 */
export function findExistingKey(keys: null | string, obj: TableRow, isEditable: boolean): string | null {
  if (keys === null) {
    return null;
  }

  const keysToCheck = isEditable ? [keys] : JSON.parse(keys.replace(/'/g, '"'));

  const matchedKey = keysToCheck.find((key: string) => key in obj);
  return matchedKey || null;
}

/**
 * It is used to check any new entries exists or not
 * @param key - Get key from input
 * @param newObject - Get new object from input
 * @param items - Get old list
 * @returns Return a new list if a new object is not available.
 */
export function checkForDuplicateEntries(key: string, newObject: TableRow, items: TableRow[]): TableRow[] {
  const newData = [...items];
  const exists = items.some((obj) => obj[key] === newObject[key]);

  if (!exists) {
    newData.push(newObject);
  }
  return newData;
}

/**
 * Get Item By Id
 * @param items - Get list from input
 * @param id - Get key from input
 * @returns Matched object
 */
export function getItemById(items: TableRow[], id: number): TableRow | undefined {
  return items.find((item) => item.id === id);
}

/**
 * It is used to return css props
 * @param type - Get common type from server
 * @returns Return flex box css props
 */
export const getTextAlignment = (type: string): string => {
  switch (type) {
    case ALIGNMENT.LEFT:
      return 'flex-start';
    case ALIGNMENT.RIGHT:
      return 'flex-end';
    default:
      return type;
  }
};

/**
 * It is used to check whether data is present in the table or not.
 * @param table - Get table data
 * @returns boolean
 */
export function isTableEmpty(table: TableRow[]): boolean {
  return Array.isArray(table) && table.length === 0;
}

/**
 * Splits the given text every N characters and adds a space **only** if the word is longer than 15 characters without spaces.
 * @param text - The input string to check and split.
 * @param n - Number of characters after which a space should be added.
 * @returns The formatted string with spaces inserted (only if required).
 */
export function splitLongText(text: string, n: number): string {
  if (text.length > 15 && !text.includes(' ')) {
    return text.match(new RegExp(`.{1,${n}}`, 'g'))?.join(' ') || text;
  }
  return text; // Return as is if length <= 15 or contains spaces
}

/**
 * Filters feedbacks raised in the last `n` days.
 * @param list Array of feedback data
 * @param days Number of days to look back
 * @returns Filtered feedback list
 */
/**
 * Filters items based on `raisedDate` within the last `n` days.
 * Assumes `raisedDate` is in "DD-MM-YYYY" format.
 */
export const filterLastNDays = (items: any[], days: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to start of today

  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - days + 1); // include today as day 1

  return items.filter((item) => {
    if (!item.date) return false;

    const [day, month, year] = item.date.split('-').map(Number);
    const raisedDate = new Date(year, month - 1, day); // month is 0-based
    raisedDate.setHours(0, 0, 0, 0);

    return raisedDate >= pastDate && raisedDate <= today;
  });
};
