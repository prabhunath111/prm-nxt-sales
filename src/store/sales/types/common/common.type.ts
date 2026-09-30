/**
 * reducer interface definitions
 *
 * @type {object}
 * @property {string} text - content for the reducer interface
 */
export interface CommonStore {
  i18Lang: any;
  errorMessage: string;
  dealerDetails: DealerDetails;
  tableColumns: [];
  tableData: [];
  tableFilteredData: [];
  webViewUrl?: string;
  customAmount?: string;
  customFormData?: ParentObject;
  totalListCount?: string;
  toggleSwitchEnabled: { [key: string]: boolean };
  dropdownVisible: boolean;
}

export interface LangVariable {
  localeName: string;
}

export interface ParentObject {
  [key: string]: any;
}

/**
 * Represents an object with dynamic key-value pairs.
 */

export interface Option {
  id: string | number;
  name: string;
  subName?: string;
  disabled?: boolean; // ✅ allow disabled
  [key: string]: string | number | boolean | null | undefined; // allow boolean
}

export interface DealerDetails {
  mdn: string;
  name: string;
  evdCode: string;
  dealerId: string;
  title?: string;
  link?: boolean;
}
