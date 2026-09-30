/**
 * Reducer interface/type definitions.
 *
 * @typedef modifyPackType
 * @property {string} text - Content for the reducer interface.
 */
export interface modifyPackType {
  subscriberId?: string | undefined;
  mobileNumber?: string | undefined;
  multiSubId?: string | undefined;
  packSelectorAccountInfo: [];
  userRole?: string;
  manageAppsRMN?: string;
}
