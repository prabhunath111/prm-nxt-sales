import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LOG } from 'config/logger';
import { platform } from 'utils/platformHelper';
import { NativeModules } from 'react-native';

/** Import All languages here */
import en from 'locales/en.json';
import hi from 'locales/hi.json';
import ta from 'locales/ta.json';
import ml from 'locales/ml.json';
import bn from 'locales/bn.json';
import gu from 'locales/gu.json';
import kn from 'locales/kn.json';
import or from 'locales/or.json';
import pa from 'locales/pa.json';
import te from 'locales/te.json';
import mr from 'locales/mr.json';

const getDeviceLanguage = () => {
  let locale = 'en'; // Default locale
  const platformOS = platform()?.OS;
  if (platformOS === 'android') {
    locale = NativeModules.I18nManager.localeIdentifier;
  } else if (platformOS === 'ios') {
    locale =
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0];
  }
  return locale.split('_')[0];
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      ml: { translation: ml },
      bn: { translation: bn },
      gu: { translation: gu },
      kn: { translation: kn },
      or: { translation: or },
      pa: { translation: pa },
      te: { translation: te },
      mr: { translation: mr }
    },
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export const changeLanguage = (value: any) => {
  i18n
    .changeLanguage(value)
    .then((res: any) => LOG.info(res))
    .catch((err: any) => LOG.error(err.message));
};

export default i18n;
