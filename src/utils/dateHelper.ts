import { LOG } from 'config/logger';

/**
 * Formats a timestamp into a localized date string.
 * For more information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @param {number | string} timestamp The timestamp to format.
 * @param {string} [locale='en-GB'] The locale used for formatting (default is 'en-GB').
 * @param {Intl.DateTimeFormatOptions} [options={}] Additional options for formatting.
 * @returns {string} The formatted date string.
 */
export const formatDate = (timestamp: number | string, locale = 'en-GB', options: Intl.DateTimeFormatOptions = {}): string => {
  const date = new Date(timestamp);
  // Specify date and time format using "style" options (i.e. full, long, medium, short)
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

/**
 * Converts a date string in the format "dd/MM/yyyy" to ISO date format "yyyy-MM-dd".
 * If the input string is empty or invalid, returns the current date in ISO format.
 * @param {string} d The input date string in the format "dd/MM/yyyy".
 * @returns {string} The date string in ISO format "yyyy-MM-dd".
 */
export const toISODate = (d: string, splitBy: string = '/'): string => {
  if (d) {
    const splitDate = d.split(splitBy);
    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
  }
  return new Date().toISOString().substring(0, 10);
};

/**
 * Converts a date string in the format "dd/MM/yyyy" to ISO date format "yyyy-MM-dd".
 * If the input string is empty or invalid, returns the current date in ISO format.
 * @param {string} date The input date string in the format "dd/MM/yyyy".
 * @returns {string} The date string in ISO format "yyyy-MM-dd".
 */
export const toUSDate = (date: string, splitBy: string = '/', joinBy: string = '/'): string => {
  if (date) {
    const splitDate = date.split(splitBy);
    return `${splitDate[1]}${joinBy}${splitDate[0]}${joinBy}${splitDate[2]}`;
  }
  return date;
};

/**
 * Formats a date string into ISO 8601 format with a specific time and timezone offset.
 * @param inputDateStr - The input date string in MM/DD/YYYY format.
 * @param time - The time to include in the formatted string (default is '00:00:00').
 * @param timeZoneOffset - The timezone offset to include in the formatted string (default is '+00:00').
 * @returns The formatted date string in ISO 8601 format.
 */
export function formatISODate(inputDateStr: string, time: string = '00:00:00', timeZoneOffset: string = '+05:30'): string {
  // Validate and parse the input date string
  const [month, day, year] = inputDateStr.split('/').map(Number);

  if (Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31 || year < 1000) {
    throw new Error('Invalid input date format');
  }

  // Create a Date object (JavaScript months are 0-indexed)
  const parsedDate = new Date(year, month - 1, day);

  // Ensure the date is valid
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date');
  }

  // Format individual components
  const yearStr: string = parsedDate.getFullYear().toString();
  const monthStr: string = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
  const dayStr: string = parsedDate.getDate().toString().padStart(2, '0');

  // Construct ISO 8601 formatted date string
  return `${yearStr}-${monthStr}-${dayStr}T${time}.000${timeZoneOffset}`;
}

/**
 * Calculates the difference in days between the current date and a given request date.
 *
 * @param {string} requestDate - The date string representing the request date in a valid format (e.g., "11 Sep 2024").
 *
 * @returns {number} The number of days between the current date and the request date. If the request date is in the future, the number will be positive; if it's in the past, the number will be negative.
 *
 * @example
 * const daysDifference = calculateDaysDifference("11 Sep 2024");
 * console.log(daysDifference); // Output will depend on the current date
 */
export const calculateDaysDifference = (requestDate: string): number => {
  const currentDate = new Date();
  const targetDate = new Date(requestDate);

  const timeDiff = currentDate.getTime() - targetDate.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

  return dayDiff;
};

// Function to format a date as 'YYYY-MM-DD'
export const formatDateISO = (date: Date): string | null => {
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return date.toISOString().split('T')[0]; // Return 'YYYY-MM-DD'
  }
  return null;
};

/**
 * Calculates the difference in days between the current date and a given request date in "DD/MM/YYYY" format.
 *
 * @param {string} requestDate - The date string in "DD/MM/YYYY" format.
 * @returns {number} The number of days between the current date and the request date.
 *
 * @example
 * const daysDifference = calculateDaysDifference("02/01/2025");
 * console.log(daysDifference); // Output will depend on the current date
 */
export const calculatePastDaysDifference = (requestDate: string): number => {
  try {
    const [day, month, year] = requestDate.split('/').map(Number);

    // Create the target date using the correct format
    const targetDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

    // Get the current date and normalize both dates to midnight
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds and convert to days
    const timeDiff = currentDate.getTime() - targetDate.getTime();
    const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

    return dayDiff;
  } catch (error) {
    LOG.error('Invalid date format provided:', error);
    return NaN;
  }
};

/**
 * Formats the current date in the specified format ('dd/mm/yyyy' or 'mm/dd/yyyy').
 *
 * @param {Date} currentDate - The date to format (default is new Date()).
 * @param {string} formatType - The desired format ('dd/mm/yyyy' or 'mm/dd/yyyy').
 * @returns {string} - The formatted date string.
 */
export const getCurrentDateFormatted = (currentDate: Date = new Date(), formatType: 'dd/mm/yyyy' | 'mm/dd/yyyy' = 'dd/mm/yyyy'): string => {
  const day = String(currentDate.getDate()).padStart(2, '0'); // Ensure 2 digits
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = currentDate.getFullYear();

  return formatType === 'mm/dd/yyyy' ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
};

/**
 * Formats the current date in the specified format ('dd/mm/yyyy' or 'mm/dd/yyyy').
 *
 * @param {Date} currentDate - The date to format (default is new Date()).
 * @returns {string} - The formatted date string.
 */
export const formatDateToISO = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const addHoursToTime = (timeStr: string, hoursToAdd: number): string => {
  const [hoursStr, minutesStr, secondsMilliStr] = timeStr.split(':');

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const [secondsStr] = secondsMilliStr.split('.');
  const seconds = parseInt(secondsStr, 10);

  const date = new Date();
  date.setHours(hours, minutes, seconds, 0); // set time (milliseconds set to 0)

  date.setHours(date.getHours() + hoursToAdd); // add hours

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatted = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.000`;

  return formatted;
};

export const handleIsValidDate = (defaultDate: string) =>
  !Number.isNaN(new Date(defaultDate).getTime()) ? new Date(defaultDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10);

export const getTwelveHourFormat = (isoString: string) => {
  const date = new Date(isoString);
  // Get the time in AM/PM
  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return timeString;
};

export const getRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffInDays = Math.floor((nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24));

  const timePart = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (diffInDays === 0) return `Today | ${timePart}`;
  if (diffInDays === 1) return `Yesterday | ${timePart}`;

  const datePart = date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return `${datePart} | ${timePart}`;
};

export const isTimeExpired = (expiry: string): boolean => {
  const expiryDate = new Date(expiry);
  const currentDate = new Date();
  return currentDate > expiryDate;
};

export default {
  formatDate,
  toISODate,
  toUSDate,
  formatISODate,
  formatDateISO,
  formatDateToISO,
  addHoursToTime,
  handleIsValidDate,
  getTwelveHourFormat,
  getRelativeTime,
  isTimeExpired,
};
