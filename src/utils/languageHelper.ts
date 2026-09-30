import { STRINGS } from 'const';
import { storageService } from 'services/storageService';
import { changeLanguage } from 'i18next';
import { REDIRECTION_LANG } from 'const/strings';

const CUSTOM_LANGUAGE_MAP: Record<string, string> = {
  pu: STRINGS.PUNJABI,
  pa: STRINGS.PUNJABI, // ISO code for Punjabi
  en: STRINGS.ENGLISH,
  hi: STRINGS.HINDI,
  kn: STRINGS.KANNADA,
  ml: STRINGS.MALAYALAM,
  or: STRINGS.ORIYA,
  ta: STRINGS.TAMIL,
  te: STRINGS.TELUGU,
  bn: STRINGS.BENGALI,
  gu: STRINGS.GUJARATI,
  mr: STRINGS.MARATHI,
  // Add more overrides if needed
};

const LANGUAGE_CODE_MAP: Record<string, string> = {
  pu: STRINGS.PA, // Map custom 'pu' to ISO 'pa'
  // Add other mappings if needed
};

// fun to get full name of languages
export const getFullLanguageName = (langCode: string): string => {
  try {
    const normalizedCode = langCode.toLowerCase();

    if (CUSTOM_LANGUAGE_MAP[normalizedCode]) {
      return CUSTOM_LANGUAGE_MAP[normalizedCode];
    }

    const name = new Intl.DisplayNames([STRINGS.EN], { type: 'language' }).of(normalizedCode);
    return name && name !== normalizedCode ? name : STRINGS.UNKNOWN_LANGUAGE;
  } catch {
    return STRINGS.UNKNOWN_LANGUAGE;
  }
};

// load language on start
export const loadLanguage = async () => {
  const savedLanguage = await storageService.getItem(STRINGS.APP_LANGUAGE);
  if (savedLanguage) {
    changeLanguage(savedLanguage);
  }
};

// getting valid language code if not getting valid code fom api
export const getValidLanguageCode = (lng: string): string => LANGUAGE_CODE_MAP[lng.toLowerCase()] || lng.toLowerCase();

const redirectionLangMapping: Record<string, string> = {
  en: REDIRECTION_LANG.en,
  hi: REDIRECTION_LANG.hi,
  mr: REDIRECTION_LANG.mr,
  ml: REDIRECTION_LANG.ml,
  kn: REDIRECTION_LANG.kn,
  bn: REDIRECTION_LANG.bn,
  te: REDIRECTION_LANG.te,
  ta: REDIRECTION_LANG.ta,
  pu: REDIRECTION_LANG.pu,
  pa: REDIRECTION_LANG.pa,
  or: REDIRECTION_LANG.or,
  gu: REDIRECTION_LANG.gu,
};

export const getRedirectionLangPayload = (lang: string): string => redirectionLangMapping[lang] || lang; // fallback to original if not found
