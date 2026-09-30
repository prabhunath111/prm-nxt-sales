import { EMAIL_REGEX, MOBILE_REGEX, ONLY_ALPHABETS, ADDRESS_REGEX, ALPHA_NUMERIC, ALPHABETS_WITH_SPACES } from 'const/regexes';
import actions from 'store/sales/actions';
import { AppThunk } from 'store';
import { ParentObject } from 'store/sales/types/common';
import { STRINGS } from 'const';
import { Linking, Share } from 'react-native';

import { isAndroid, isiOS, isWeb } from './platformHelper';

interface ItemType {
  [key: string]: string | number | null | object | Array<object>;
}

export const callAction =
  (param: ParentObject, queryName: string, stateKey?: string, navigate?: any): AppThunk =>
  (dispatch) =>
    dispatch(actions[queryName](param, queryName, stateKey, navigate));

/**
 * Checks if the length of the given text is less than or equal to the specified limit.
 * @param {string} text The text to check.
 * @param {number} limit The maximum allowed length.
 * @returns {boolean} true if the length of the text is less than or equal to the limit, false otherwise.
 */
export const checkMaxLength = (text: string, limit: number): boolean => {
  if (!text) return true;
  return text.length <= limit;
};

/**
 * Checks if the length of the given text is greater than or equal to the specified limit.
 * @param {string} text The text to check.
 * @param {number} limit The minimum required length.
 * @returns {boolean} true if the length of the text is greater than or equal to the limit, false otherwise.
 */
export const checkMinLength = (text: string, limit: number): boolean => {
  if (text && text.length >= limit) {
    return true;
  }
  return false;
};

/**
 * Checks if the given value is a valid email address.
 * @param {string} value The value to check.
 * @returns {boolean} true if the value is a valid email address, false otherwise.
 */
export const isValidEmail = (value: string): boolean => {
  if (value && EMAIL_REGEX.test(value)) {
    return true;
  }
  return false;
};

/**
 * Checks if the given value is a valid email address.
 * @param {string} value The value to check.
 * @returns {boolean} true if the value is a valid email address, false otherwise.
 */
export const isValidMobile = (value: string): boolean => {
  if (value && MOBILE_REGEX.test(value)) {
    return true;
  }
  return false;
};

/**
 * Checks if the given value is a valid numeric value.
 * @param {string} value The value to check.
 * @returns {boolean} true if the value is a valid numeric value, false otherwise.
 */
export const isValidNumeric = (value: number): boolean => {
  const num = Number(value);
  if (num && typeof num === 'number' && !Number.isNaN(num)) {
    return true;
  }
  return false;
};

/**
 * Checks if the length of the given text is equal to the specified limit.
 * @param {string} text The text to check.
 * @param {number} limit The maximum allowed length.
 * @returns {boolean} true if the length of the text is equal to the limit, false otherwise.
 */

export const checkFixLength = (text: string, limit: number): boolean => {
  if (text && text.length === Number(limit)) {
    return true;
  }
  return false;
};

/**
 * Checks if the length of the given text is greater than or equal to the specified limit.
 * @param {string} actualValue The value to check.
 * @param {number} minValue The minimum required value.
 * @returns {boolean} true if the length of the text is greater than or equal to the limit, false otherwise.
 */
export const checkMinValue = (actualValue: number, minValue: number): boolean => {
  if (actualValue >= Number(minValue)) {
    return true;
  }
  return false;
};

/**
 * Checks if the length of the given text is less than or equal to the specified limit.
 * @param {string} actualValue The value to check.
 * @param {number} maxValue The maximum required length.
 * @returns {boolean} true if the length of the text is greater than or equal to the limit, false otherwise.
 */
export const checkMaxValue = (actualValue: number, maxValue: number): boolean => {
  if (actualValue <= Number(maxValue)) {
    return true;
  }
  return false;
};

/**
 * Checks if the given value is a valid name.
 * @param {string} value The value to check.
 * @returns {boolean} true if the value is a valid name, false otherwise.
 */
export const isValidName = (value: string): boolean => {
  if (value && ONLY_ALPHABETS.test(value)) {
    return true;
  }
  return false;
};
/**
 * Checks if the given value is a valid name.
 * @param {string} value The value to check.
 * @returns {boolean} true if the value is a valid name, false otherwise.
 */
export const isValidFullName = (value: string): boolean => {
  if (value && ALPHABETS_WITH_SPACES.test(value)) {
    return true;
  }
  return false;
};
/**
 * Checks if the given value is a valid name.
 * @param {string} value The value to check.
 * @returns {boolean} true if the value is a valid name, false otherwise.
 */
export const isValidAlphaNumeric = (value: string): boolean => {
  if (value && ALPHA_NUMERIC.test(value)) {
    return true;
  }
  return false;
};

/**
 * Checks if the given value is a valid address.
 * @param {string} value The value to check.
 * @returns {boolean} true if the value is a valid address, false otherwise.
 */
export const isValidAddress = (value: string): boolean => {
  if (value && ADDRESS_REGEX.test(value)) {
    return true;
  }
  return false;
};

/**
 * It will return new params based on coming from default params
 * @param params accept query parameters as a comma-separated string
 * @param value accept default value
 * @param item accept default params as an object
 * @returns new params for API
 */

export const createInputsFromParams = (params: string, value: string, item: ItemType) => {
  const array = params.split(',');
  const formInputs: ItemType = {};
  array.forEach((element: string, index: number) => {
    if (index === 0) {
      formInputs[element] = value;
    } else if (item[element]) {
      formInputs[element] = item[element];
    } else {
      formInputs[element] = '';
    }
  });
  return formInputs;
};

/**
 * Checks if the length of the given text is strictly equal to one of the values in the specified limit array.
 * @param {string} text The text to check.
 * @param {string} limit A JSON string representation of an array of allowed lengths (e.g., "[10,12]").
 * @returns {boolean} true if the length of the text is equal to one of the values in the limit array, false otherwise.
 */
export const checkAllowedLength = (text: string, limit: string): boolean => {
  const limitArray = JSON.parse(limit);
  return limitArray.includes(text.length);
};

/**
 * Checks if the length of the given text is strictly equal to one of the values in the specified limit array.
 * @param {string} text The text to check.
 * @param {string} limit A JSON string representation of an array of allowed lengths (e.g., "[10,12]").
 * @returns {boolean} true if the length of the text is equal to one of the values in the limit array, false otherwise.
 */
export const checkStartsWith = (text: string, allowedStarts: string): boolean => {
  const allowedArray = JSON.parse(allowedStarts);
  if (!text) return false;
  return allowedArray.some((prefix: string) => text.startsWith(prefix));
};

/**
 * Generic function to filter a list of objects based on a search text and specified keys.
 *
 * @template T - The type of objects in the list.
 * @param {T[]} dataList - The complete list of data.
 * @param {string[]} searchKeys - The keys to search through (e.g. ['dealerName', 'mdn', 'evdCode']).
 * @param {string} searchText - The text to search for within the list.
 * @returns {T[]} The filtered list of data.
 */
export const filterList = <T>(dataList: T[], searchKeys: (keyof T)[], searchText: string): T[] => {
  if (!searchText.trim()) return dataList; // return original list if no search text

  return dataList?.filter((item) => searchKeys.some((key) => String(item[key]).toLowerCase().includes(searchText.toLowerCase())));
};

/**
 * Generic function to filter a list of objects based on request input and specified criteria.
 *
 * @template T - The type of objects in the list. Helps maintain type safety.
 * @param {T[]} dataList - The complete list of data to be filtered.
 * @param {Object} requestInput - The filtering criteria passed as an object.
 * @param {string} [requestInput.search] - The search text to filter `mdn` and `name` fields.
 * @param {string} [requestInput.thresHoldValue] - Specifies the threshold filter ("yes" or "no").
 * @param {string} [requestInput.priceValue] - Specifies the price range filter.
 * @returns {T[]} The filtered list of data
 */
export const autoEvdFilterData = <T>(
  dataList: ParentObject,
  requestInput: {
    search?: string;
    thresHoldValue?: string;
    priceValue?: string;
  },
): T[] => {
  // Ensure `thresHoldValue` and `priceValue` are always strings
  const { thresHoldValue, priceValue } = requestInput;

  // Parse the price range from the dropdown values
  const parsePriceRange = (priceRange?: string): [number, number] => {
    if (!priceRange || priceRange === STRINGS.ALL) return [0, Infinity]; // Show all prices if "All" is selected
    if (priceRange.includes('<')) return [-Infinity, parseInt(priceRange.replace('<', '').trim(), 10)];
    if (priceRange.includes('>')) return [parseInt(priceRange.replace('>', '').trim(), 10), Infinity];

    const rangeValues = priceRange.split('to').map((v) => parseInt(v.trim(), 10));
    return rangeValues.length === 2 ? (rangeValues as [number, number]) : [0, Infinity];
  };

  // If no data, return an empty array
  if (!dataList || !Array.isArray(dataList) || dataList.length === 0) return [];

  return dataList.filter((item: any) => {
    // Ensure item is valid before accessing properties
    if (!item) return false;

    // Search filter
    const matchesSearch =
      !requestInput.search?.trim() ||
      ['mdn', 'nameNT', 'userId'].some((key) =>
        String(item[key as keyof T] || '')
          .toLowerCase()
          .includes(requestInput.search!.toLowerCase()),
      );

    // Threshold Filter**
    const matchesThreshold = !thresHoldValue || thresHoldValue === STRINGS.ALL || item.thresholdSetNT === thresHoldValue;

    // Price Filter
    const [min, max] = parsePriceRange(priceValue);
    const matchesPrice = !priceValue || priceValue === STRINGS.ALL || (item.balance >= min && item.balance <= max);

    return matchesThreshold && matchesPrice && matchesSearch;
  });
};

export const extractValues = (obj: Record<string, any>, targetKey: string = 'value'): Record<string, any> => {
  const result: Record<string, any> = {};

  // Loop through all keys of the object
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    // If the value is an object, recurse into it
    if (value && typeof value === 'object') {
      // Check if the nested object has the targetKey ('value') in its 'object'
      if (value.object && typeof value.object === 'object' && Object.prototype.hasOwnProperty.call(value.object, targetKey)) {
        result[key] = value.object[targetKey]; // Extract the 'value' from the nested 'object'
      } else {
        // Recurse further for nested objects
        result[key] = extractValues(value, targetKey);
      }
    } else {
      // If it's a primitive value, keep it as is
      result[key] = value;
    }
  });

  return result;
};

// Define the type for filter criteria
type FilterCriteria = {
  [key: string]: string | number;
};

// The filtering function with appropriate types
export const filterByParams = (
  array: ParentObject[],
  filterCriteria: FilterCriteria,
  matchType: 'AND' | 'OR' = 'OR', // Default to OR matching
): ParentObject[] =>
  array.filter((item) =>
    matchType === 'AND'
      ? // AND logic: all criteria must match
        Object.keys(filterCriteria).every((key) => {
          const value = filterCriteria[key];
          const itemValue = item[key as keyof ParentObject];

          if (itemValue !== undefined) {
            if (typeof itemValue === 'string') {
              return itemValue.toLowerCase().includes(value.toString().toLowerCase());
            }
            if (typeof itemValue === 'number') {
              return itemValue === value;
            }
            return itemValue === value;
          }
          return false;
        })
      : // OR logic: at least one criterion must match
        Object.keys(filterCriteria).some((key) => {
          const value = filterCriteria[key];
          const itemValue = item[key as keyof ParentObject];

          if (itemValue !== undefined) {
            if (typeof itemValue === 'string') {
              return itemValue.toLowerCase().includes(value.toString().toLowerCase());
            }
            if (typeof itemValue === 'number') {
              return itemValue === value;
            }
            return itemValue === value;
          }
          return false;
        }),
  );

/**
 * Opens the dialer pad in mobile and face time in the mac.
 * @param {string} mobile mobile number for calling user.
 * @returns {boolean} true if the mobile is a valid, false otherwise.
 */
export const openDialer = (mobile: number | string) => {
  const url = `tel:${mobile}`;
  if (isWeb) {
    // Check if running on mobile and the webkit.messageHandlers API is available and isPdf || isWord || isExcel
    if (window.webkit?.messageHandlers?.cordova_iab) {
      const message = { action: 'call', url: encodeURIComponent(url) };
      window.webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(message));
    }
    window.open(url, '_blank');
  } else {
    Linking.openURL(url);
  }
  return null;
};

/**
 * Utility function to format object values as a comma-separated string
 * @param {string} filterObj filter object to format values
 * @returns {string} it will return the value as a comma-separated string
 */
export const formatFilter = (filterObj: ParentObject) => (filterObj ? Object.values(filterObj).join(',') : undefined);

/**
 * Utility function to format object values as a comma-separated string
 * @param {string} filterObj filter object to format values
 * @returns {T[]} it will return the value as an array
 */
export const normalizeArray = (filterObj: ParentObject): string[] => {
  if (!filterObj) return []; // Return an empty array if input is null/undefined
  return Object.values(filterObj)
    .filter((s): s is string => s !== undefined) // Remove undefined values
    .map((s) => s.toLowerCase()); // Convert to lowercase
};

/**
 * Utility function to frequest for android media permissions
 * @param {string} requestMediaPermissions request for android media permissions
 * @returns {string} request for android media permissions
 */
/**
 * request for permissions — Mobile
 */
/**
 * Save CSV file locally — Web & Mobile (via Share)
 */
export const downloadCSV = async (data: any[], headers: string[], filename = 'data.csv'): Promise<{ status: boolean }> => {
  if (!Array.isArray(data) || data.length === 0) return { status: false };

  const csvHeaders = `${headers.join(',')}\n`;
  const csvRows = data.map((row) => headers.map((field) => row[field] ?? '').join(',')).join('\n');
  const csvContent = csvHeaders + csvRows;

  if (isWeb) {
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  } else {
    try {
      const RNFS = await import('react-native-fs');
      // Write to app cache instead of external storage to prevent permission issues.
      // This is the "Scoped Storage" friendly way.
      const path = `${RNFS.CachesDirectoryPath}/${filename}`;

      await RNFS.writeFile(path, csvContent, 'utf8');

      // Use native Share API so the user can choose to save the file or share it.
      // This does not require READ/WRITE_EXTERNAL_STORAGE permissions.
      await Share.share({
        url: isAndroid() ? `file://${path}` : `file://${path}`,
        message: STRINGS.HERE_IS_YOUR_CSV,
        title: filename,
      });

      return { status: true };
    } catch (error) {
      return { status: false };
    }
  }
};


export const filterTableWithDropDown = (dataArray: Record<string, ParentObject>[], filterCriteria: Record<string, ParentObject>) =>
  dataArray.filter((item) =>
    Object.entries(filterCriteria).every(([key, value]) => {
      if (!value || Object.keys(value).length === 0 || Object.values(value).some((entry: ParentObject) => entry.name.toUpperCase() === STRINGS.ALL.toUpperCase())) {
        return true;
      }
      const selectedValues = Object.values(value).map((entry: any) => entry.name.toUpperCase());
      return selectedValues.includes(item[key]?.toUpperCase());
    }),
  );

/**
 * Utility function to determine whether a field should be hidden based on platform and itemStyle.
 *
 * - If the field's itemStyle is not `HIDE_IN_MOBILE`, it will always be shown.
 * - If the itemStyle is `HIDE_IN_MOBILE`:
 *    - It will be hidden on mobile platforms (Android, iOS, or Cordova WebView).
 *    - It will NOT be hidden on Web.
 *
 * @param {ParentObject} field - The field object containing itemStyle and other properties.
 * @returns {boolean} `true` if the field should be hidden, otherwise `false`.
 */
export const shouldHideField = (field: ParentObject, styleName: string, hideInWeb: boolean = false) => {
  const isMobile = window.webkit?.messageHandlers?.cordova_iab || isAndroid() || isiOS();
  const isWebView = !isMobile;
  if (field.itemStyle === styleName) {
    if (hideInWeb) {
      return isWebView;
    }
    return isMobile;
  }
  return false;
};

export const sanitizeDates = (data: any) => JSON.parse(JSON.stringify(data, (_, value) => (value instanceof Date ? value.toISOString() : value)));
