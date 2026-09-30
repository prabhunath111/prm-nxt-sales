import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef formType
 * @property {string} text - Content for the reducer interface.
 */
export interface formType {
  dropdownOptions: any;
  formDependentData: ParentObject;
  formDependentDefault: ParentObject;
  formData: ParentObject;
  formActionData: ParentObject;
  formNavigationData: FormNavigationType;
  formTitle: string;
  formQuery: string;
  tables: ParentObject;
  searchSuggestions: ParentObject;
  updatedFormFields: ParentObject;
  subIdList: subIdListType[];
  slabList: slabListType[];
  isMarkedForDeletion: boolean;
  isFormResetRequired: boolean;
  isFormUpdated: boolean;
  formValues: ParentObject;
  dealerDetails: DealerDetails;
  searchBarItems: ParentObject;
  offersBasisRechargeObject: ParentObject;
  offersBasisRechargeValue: ParentObject[];
  offersBasisRechargeValueType: string;
  radioContainerOptions: ParentObject;
  evdMdnNavigationData: ParentObject;
  pillGroupItemsArr: string[] | null;
  fieldsToDisable: ParentObject;
  fieldsToShow: string[];
  listData: Array<{ label: string; value: string }>;
  setChecklistTileDetails: ParentObject[];
}

export interface FormNavigationType {
  formName: string;
  routeName: string;
  queryName: string;
  params: any;
}

export interface subIdListType {
  subId: string;
  status: string;
  rmn: string;
  aliasName: string;
}

export interface DealerDetails {
  name?: string;
  mdn?: string;
  evdCode?: string;
  subscriberId?: string;
  customerName?: string;
}
export interface slabListType {
  label: string | undefined | null;
  rmn: string | number | undefined | null;
  offer: string | undefined | null;
  parterMargin: number | string | undefined | null;
  amount: number | undefined | null;
  pin: string | number | undefined | null;
  subscriberInfo: string | number | undefined | null;
  tskNumber: string | number | undefined | null;
  customerName: string | undefined | null;
  enteredAmt: number | string | null;
  rechargeIdentifier: string | undefined | null;
  prevRechargeIdentifier: string | undefined | null;
}
