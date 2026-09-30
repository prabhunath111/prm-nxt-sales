import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef demoAccountType
 * @property {string} text - Content for the reducer interface.
 */
export interface demoAccountType {
  demoAccountDealerDetails: ParentObject;
  tskValidationDetails: ParentObject;
  tskRegistrationDetails: ParentObject;
  packDetails: ParentObject;
  demoAccountSuccessData: ParentObject;
  evdCode: string;
  isETSK: boolean;
  selectedBox: string;
}
