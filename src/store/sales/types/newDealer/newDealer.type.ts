import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef newDealerType
 * @property {string} text - Content for the reducer interface.
 */
export interface newDealerType {
  distributorList: ParentObject[];
  distributorResponse: ParentObject;
  currentASI: ParentObject;
}
