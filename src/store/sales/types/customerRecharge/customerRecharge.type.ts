import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef customerRechargeType
 * @property {string} text - Content for the reducer interface.
 */
export interface customerRechargeType {
  navigationId: ParentObject;
  mainFormData: ParentObject;
  bingeFlag: string;
  bingeCategory: ParentObject[];
  bingeDuration: ParentObject[];
  bingeOfferSelected: ParentObject | undefined;
  androidUpgradeSelected: boolean;
  bingeCategorySelected: ParentObject | undefined;
  bingeDurationSelected: ParentObject | undefined;
  isBingeSelected: boolean;
  isRadioSelected: boolean;
  dataPacks: ParentObject;
  selectedId: string | undefined;
  selectedIdRadio: string | undefined | null;
  selectedOffer: ParentObject;
}
