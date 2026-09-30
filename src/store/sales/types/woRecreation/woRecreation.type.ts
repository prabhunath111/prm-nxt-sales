import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef woRecreationType
 * @property {string} text - Content for the reducer interface.
 */
export interface woRecreationType {
  tskAllDetails: ParentObject;
  woSuccessData: ParentObject;
  workOrderDetails: ParentObject;
  tskPinDetails: ParentObject;
  accountDetailsPrimaryAndSecondaryRepush: ParentObject;
  allPackPropsSuccessData: ParentObject;
  woFilterdData: ParentObject;
  woTypesFromPropWO: ParentObject;
  onlyPricePtForMultiTVInput: ParentObject;
}
