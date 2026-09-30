import { STRINGS, VALUE_TYPE, PROPERTIES } from 'const';
import { ParentObject } from 'store/sales/types/common';
/**
 * Represents a utility function for refactoring API responses.
 *
 * @param {any} response - The response object from the API.
 * @returns {any} The refactored output based on the response.
 */

type ResponseType = {
  data: any;
  status: boolean;
  message: string;
};

export const refactorResponse = (response: any) => {
  let output: any = {};
  if (response) {
    const values: any = Object.values(response) || [];
    const data: ResponseType = values?.length ? values[0] : {};
    output = data;
  }
  return output;
};

/**
 * Formats a value based on its type.
 *
 * @param {string} type - The type of the value (e.g., 'amount').
 * @param {any} value - The value to be formatted.
 * @returns {string} The formatted value.
 *
 * @example
 * formatValue(VALUE_TYPE.AMOUNT, 100); // Returns '₹100'
 */

export const formatValue = (type: string, value: any): string => {
  if (value === null || value === undefined) {
    return 'NA';
  }
  switch (type) {
    case VALUE_TYPE.AMOUNT:
      return `\u20B9${value}`;
    case VALUE_TYPE.CURRENCY:
      return `Rs ${value}`;
    default:
      return value;
  }
};

/**
 * Extracts the `id` values from an array of objects and returns a comma-separated string.
 * @param {Array<{ id: string }>} data - Array of objects containing `id` properties.
 * @returns {string} - Comma-separated string of `id` values.
 */
export const getCommaSeparatedIds = (data: Array<{ id: string }>): string => data?.map((item) => item.id).join(',');

export const cleanText = (text: string): string => text.replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();

const normalizeLanguage = (lang: string): string => {
  const map: Record<string, string> = {
    oriya: STRINGS.odia,
    odiya: STRINGS.odia,
    odia: STRINGS.odia,
  };

  return map[lang.toLowerCase()] || lang.toLowerCase();
};

export const filterPackDetails = (data: ParentObject[], filters: ParentObject) => {
  const { selectedLanguages = [], selectedGenre = [], selectedBoxType = [] } = filters;

  return data.filter((item) => {
    const itemLanguages = item.languageName?.split(',').map((language: string) => normalizeLanguage(language.trim())) || [];

    const itemGenres = item.genreName?.split(',').map((genre: string) => genre.trim().toLowerCase()) || [];
    const itemBoxTypes = item.boxTypeNT?.split(',').map((box: string) => box.trim().toLowerCase()) || [];

    const languages = selectedLanguages.map((selectLang: ParentObject) => normalizeLanguage(selectLang.name));
    const genres = selectedGenre.map((selectGenre: ParentObject) => selectGenre.name.toLowerCase());
    const boxTypes = selectedBoxType.map((selectBox: ParentObject) => selectBox.name.toLowerCase());

    const matchesLanguage = languages.length === 0 || languages.some((lang: string) => itemLanguages.includes(lang));
    const matchesGenre = genres.length === 0 || genres.some((genre: string) => itemGenres.includes(genre));
    const matchesBoxType = boxTypes.length === 0 || boxTypes.some((box: string) => itemBoxTypes.includes(box));

    return matchesLanguage && matchesGenre && matchesBoxType;
  });
};

export const transformPacksArray = (originalArray: ParentObject[]) =>
  originalArray?.map((pack) => ({
    Packs: pack.siebelNameNT,
    Price: pack.price,
  }));
export const transformSelectedPacksArray = (originalArray: ParentObject[]) => originalArray?.map((pack) => `${pack.siebelNameNT} - Rs.${pack.price}~${pack.category?.nameNT}`);

export const getRechargeFlag = (selectedPacks: ParentObject[], disableLDPPacks: ParentObject[]): string => {
  const matched = selectedPacks.find((pack) => {
    const categoryName = pack?.category?.nameNT;
    if (!categoryName) return false;

    const matchingLDPPack = disableLDPPacks.find((ldp) => ldp.category === categoryName);
    return matchingLDPPack && (matchingLDPPack.DhamakaFlag === 'Dhamaka' || matchingLDPPack.DhamakaFlag === 'DhamakaCOD');
  });

  if (!matched) return 'N';

  const categoryName = matched?.category?.nameNT;
  const matchingLDPPack = disableLDPPacks.find((ldp) => ldp.category === categoryName);

  if (matchingLDPPack?.DhamakaFlag === 'Dhamaka') return 'S';
  if (matchingLDPPack?.DhamakaFlag === 'DhamakaCOD') return 'D2';

  return 'N';
};

/**
 * Checks whether all provided PINs are unique and non-empty.
 * @param pins - An array of string PINs
 * @returns `true` if all non-empty PINs are unique, otherwise `false`
 */
export const arePinsUnique = (pins: (string | undefined | null)[]): boolean => {
  const nonEmptyPins = pins.filter((pin) => typeof pin === 'string' && pin.trim() !== '');
  const uniquePins = new Set(nonEmptyPins);
  return uniquePins.size === nonEmptyPins.length;
};

export const getAllCategoryNames = (originalArray: ParentObject[]) => originalArray?.map((pack) => pack.category?.nameNT).filter(Boolean) as string[]; // remove undefined/null

export const hasDisabledCategory = (selectedPacks: ParentObject[], disabledPacks: ParentObject[], bingeOffers: string[]): boolean => {
  let disabledOffers = disabledPacks?.map((pack) => pack.category).filter(Boolean) as string[];
  if (bingeOffers.length > 0) {
    disabledOffers = [...disabledOffers, ...bingeOffers];
  }

  return selectedPacks?.some((pack) => disabledOffers.includes(pack.category?.nameNT));
};

export const getDisabledCategoryMatch = (selectedPacks: ParentObject[], disabledPacks: ParentObject[]): ParentObject | undefined => {
  const SelectedOffersCategories = selectedPacks?.map((pack) => pack.category?.nameNT).filter(Boolean) as string[];

  return disabledPacks?.find((pack) => SelectedOffersCategories.includes(pack.category));
};

export const formatDurationForUI = (duration: string = ''): string => {
  const normalized = duration.toString().trim().toLowerCase();

  const map: Record<string, string> = {
    monthly: 'Monthly',
    '30': 'Monthly',

    quarterly: 'Quarterly',
    '90': 'Quarterly',
    '3 months': 'Quarterly',

    'semi-annual-special': 'Semi Annual',
    'semi-annual': 'Semi Annual',
    'semi annual': 'Semi Annual',
    semiannual: 'Semi Annual',
    '180': 'Semi Annual',

    'bi-annual': 'Bi-Annual',
    'bi annual': 'Bi-Annual',

    annual: 'Annual',
    '360': 'Annual',
    '365': 'Annual',

    '1 week': '1 week',
    '15 days': '15 days',
    '2 months': '2 Months',
  };

  return map[normalized] || '';
};

export const generateRandom12DigitNumber = () => Math.floor(100000000000 + Math.random() * 900000000000).toString();

export const maskMobileNumber = (number: string | undefined) => (number && number.length === 10 ? `${number.slice(0, 2)}******${number.slice(8)}` : number);

export const convertTo62Func = (requestId: string): string => {
  const character = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  let id = Number(requestId);
  let conversion = '';
  while (id > 0) {
    conversion = character[id % 62] + conversion;
    id = Math.floor(id / 62);
  }
  return conversion;
};
export const getDhamakaRechargeAmount = (packSelected: string, DHAMAKA_LIST: ParentObject[]) => {
  if (!packSelected) return null;

  const normalized = packSelected.trim().toLowerCase();

  const match = DHAMAKA_LIST.find((item) => item.category.trim().toLowerCase() === normalized);

  return match || null;
};

export const getDisableValue = (packSelected: string) => {
  if (!packSelected) return 'Y';

  const value = packSelected.toLowerCase();

  const hasDhamaka = value.includes('dhamaka');
  const hasCOD = value.includes('cod');

  if (hasDhamaka && !hasCOD) {
    return 'N';
  }

  return 'Y';
};

export const isDhamakaCODCategory = (selectedPacksToBuy: Array<{ category?: { nameNT?: string } }>): boolean =>
  selectedPacksToBuy.some((pack) => PROPERTIES.ETSK_REGISTRATION.DHAMAKA_COD_NAMES.includes(pack?.category?.nameNT ?? ''));

export function isValueInRange(rangeStr: string, value: number): boolean {
  // Split by '-' and trim spaces
  const [minStr, maxStr] = rangeStr.split('-').map((str) => str.trim());

  // Convert to numbers
  const min = Number(minStr);
  const max = Number(maxStr);

  // Validate and compare
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return false;
  }

  return value >= min && value <= max;
}

export const getSafeValue = (val: ParentObject | string) => {
  if (!val || (typeof val === 'object' && Object.keys(val).length === 0)) {
    return '';
  }
  return typeof val === 'object' ? val.name || '' : val;
};
