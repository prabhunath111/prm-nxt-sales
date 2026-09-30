import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef notificationsType
 */
export interface notificationsType {
  read: boolean;
  unRead: boolean;
  notificationData: ParentObject[];
  carouselData: ParentObject[];
}
