import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef primaryTvRegistrationType
 * @property {ParentObject} tskValidateData - Content for the reducer interface.
 */
export interface primaryTvRegistrationType {
  tskValidateData: ParentObject;
  isBoxMismatchConfirmed: boolean;
}
