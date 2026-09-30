/**
 * reducer for notifications
 *
 * @module store/sales/actions/notifications
 *
 */
import { sliceActions } from 'store/sales/reducer/notifications';
import { AppThunk } from 'store';
import formActions from 'store/sales/actions/form';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { sanitizeDates } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import { getFilteredNotifications } from 'utils/mixPanelHelper';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(filterNotifications({ exampleParam: 'exampleValue' }));
 */
export const filterNotifications =
  (params: { data: ParentObject[]; read: boolean; unRead: boolean }): AppThunk =>
  async (dispatch) => {
    const { data, read, unRead } = params;

    const filteredData = data.filter((notification: ParentObject) => {
      if (read && unRead) return true;
      if (read) return notification.isClicked;
      if (unRead) return !notification.isClicked;
      return true;
    });
    dispatch(formActions.setListData(filteredData));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setNotifications({ exampleParam: 'exampleValue' }));
 */
export const setNotifications =
  (tabName: string): AppThunk =>
  async (dispatch, getState) => {
    const { read, unRead } = getState().notifications;
    try {
      const filteredData = await getFilteredNotifications(tabName);
      dispatch(filterNotifications({ data: sanitizeDates(filteredData), read, unRead }));
      dispatch(sliceActions.setNotificationData(sanitizeDates(filteredData)));
    } catch (error: any) {
      dispatch(formActions.setListData([]));
    }
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setAllNotifications({ exampleParam: 'exampleValue' }));
 */
export const setAllNotifications = (): AppThunk => async (dispatch) => {
  try {
    const notificationsData: any = await MoengageMixpanel.getMoEngageMessages();
    const notificationMessages = Object.values(notificationsData.messages);
    const bannerNotifications = notificationMessages.filter(
      (item: ParentObject) => item?.payload?.notificationType !== 'banner' || item?.action?.[0]?.kvPair?.notificationType !== 'banner',
    );
    dispatch(formActions.setListData(sanitizeDates(bannerNotifications)));
    dispatch(sliceActions.setNotificationData(sanitizeDates(bannerNotifications)));
  } catch (error: any) {
    dispatch(formActions.setListData([]));
  }
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(resetNotification({ exampleParam: 'exampleValue' }));
 */
export const resetNotification = (): AppThunk => async (dispatch) => {
  dispatch(formActions.setListData([]));
  dispatch(sliceActions.setNotificationData([]));
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setRead({ exampleParam: 'exampleValue' }));
 */
export const setRead =
  (params: boolean): AppThunk =>
  async (dispatch, getState) => {
    const { notificationData, unRead } = getState().notifications;
    dispatch(sliceActions.setRead(params));
    dispatch(filterNotifications({ data: notificationData, read: params, unRead }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setUnRead({ exampleParam: 'exampleValue' }));
 */
export const setUnRead =
  (params: boolean): AppThunk =>
  async (dispatch, getState) => {
    const { notificationData, read } = getState().notifications;
    dispatch(sliceActions.setUnRead(params));
    dispatch(filterNotifications({ data: notificationData, read, unRead: params }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setAllNotifications({ exampleParam: 'exampleValue' }));
 */
export const getCarouselImage = (): AppThunk => async (dispatch) => {
  try {
    const notificationsData: any = await MoengageMixpanel.getMoEngageMessages();
    const notificationMessages = Object.values(notificationsData.messages);
    const bannerNotifications = notificationMessages
      .filter((item: ParentObject) => item?.payload?.notificationType === 'banner' || item?.action?.[0]?.kvPair?.notificationType === 'banner')
      .sort((a: ParentObject, b: ParentObject) => Number(a?.payload?.displayOrder || 0) - Number(b?.payload?.displayOrder || 0))
      .map((item: ParentObject) => ({
        id: item.id,
        image: item?.media?.url,
        deepLink: item?.action?.[0]?.kvPair?.gcm_webUrl || item?.action?.[0]?.value || '',
      }));

    dispatch(sliceActions.setCarouselData(sanitizeDates(bannerNotifications)));
  } catch (error: any) {
    dispatch(sliceActions.setCarouselData([]));
  }
};
