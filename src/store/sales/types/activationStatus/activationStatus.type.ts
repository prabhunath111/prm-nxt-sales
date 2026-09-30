/**
 * Reducer interface/type definitions.
 *
 * @typedef activationStatusType
 * @property {string} text - Content for the reducer interface.
 */
export interface activationStatusType {
  activationStatusData?: object | null;
  subscriberInfo?: string;
  multiSubId?: string;
  bcpActStatusInfo?: string;
  bcpActivationStatusData?: object | null;
  bcpBookingRefNo?: string | null;
  bcpTskPin?: string | null;
  subIdFromNavigation?: string;
}
