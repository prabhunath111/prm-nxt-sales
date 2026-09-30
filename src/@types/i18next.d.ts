declare module 'i18next' {
  export const use: any;
  /**
   * Initializes i18next.
   * @param {object} options - Options for initialization.
   */
  export const init: any;
  /**
   * Changes the language in i18next.
   * @param {string} language - The language code to change to.
   */
  export const changeLanguage: any;
  /**
   * Options for customizing i18next behavior.
   */
  export interface CustomTypeOptions {
    backend: any;
    fallbackLng: string;
    debug: boolean;
    load: string;
    ns: Array;
    defaultNS: string;
    keySeparator: boolean;
    interpolation: {
      escapeValue: boolean;
      formatSeparator: string;
    };
    react: {
      wait: boolean;
    };
  }

  export function language(_arg0: string, _selectedUri: string | undefined, _language: any) {
    throw new Error('Function not implemented.');
  }

  export function t(_arg0: string, _arg1?: { amount?: any; formattedDate?: string }): string {
    throw new Error('Function not implemented.');
  }
}
