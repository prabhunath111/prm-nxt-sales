import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef evdMdnChangeType
 * @property {object} evdMdnChangeData - Content for the reducer interface.
 */
export interface evdMdnChangeType {
  evdMdnChangeData: ParentObject;
  evdMdnPartnerList: [];
  evdMdnPartnerFilteredList: [];
  evdMdnDistSuccessData: ParentObject;
}
