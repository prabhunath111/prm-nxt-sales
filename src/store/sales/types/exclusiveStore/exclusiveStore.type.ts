import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef exclusiveStoreType
 * @property {string} text - Content for the reducer interface.
 */
export interface exclusiveStoreType {
  storeOpenQuestion: ParentObject;
  isStoreOpen: boolean;
  actionType: string;
  demoFormQuestions: ParentObject;
  multiTvData: ParentObject;
  newConnectionDetails: ParentObject;
  needValidation: boolean;
}
