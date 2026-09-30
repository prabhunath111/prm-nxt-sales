import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef boxTypeChangeType
 * @property {string} text - Content for the reducer interface.
 */
export interface boxTypeChangeType {
  boxTypeProps: ParentObject;
  subId: string;
  pendingWo: boolean;
  pendingWoDetails: ParentObject;
  orderNumber: string;
  tskDetails: ParentObject[];
  boxData: ParentObject[];
  tskPin: ParentObject[];
  accountDetailsPrimaryAndSecondaryRepushBoxType: ParentObject;
  tskSnoAndBoxTypeArr: ParentObject[];
  boxTypeSuccessData: ParentObject;
  boxTypeChangeReferenceId: string;
  firstFlag: boolean;
  flags: ParentObject;
  pricePtForMultiTVInput: ParentObject;
  boxType: string;
  selectBoxDetails: ParentObject[];
  boxDetails: ParentObject[];
}
