import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef dealerFeedbackType
 * @property {ParentObject} feedbackSuccessData - Content for the reducer interface.
 */
export interface dealerFeedbackType {
  feedbackSuccessData: ParentObject;
  isSubscriberValid: boolean;
  message: '';
  radioFeedbackSelected: string;
}
