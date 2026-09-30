import { sliceActions } from 'store/sales/reducer/notifications';
import formActions from 'store/sales/actions/form';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { sanitizeDates } from 'utils/formBuilderHelper';
import { getFilteredNotifications } from 'utils/mixPanelHelper';
import * as actions from './notifications.action';

jest.mock('store/sales/reducer/notifications', () => ({
  sliceActions: {
    setNotificationData: jest.fn(() => ({ type: 'NOTIFICATIONS_SET_DATA' })),
    setRead: jest.fn(() => ({ type: 'NOTIFICATIONS_SET_READ' })),
    setUnRead: jest.fn(() => ({ type: 'NOTIFICATIONS_SET_UNREAD' })),
    setCarouselData: jest.fn(() => ({ type: 'NOTIFICATIONS_SET_CAROUSEL' })),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  setListData: jest.fn(() => ({ type: 'FORM_SET_LIST_DATA' })),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    getMoEngageMessages: jest.fn(),
  },
}));

jest.mock('utils/formBuilderHelper', () => ({
  sanitizeDates: jest.fn((data) => data),
}));

jest.mock('utils/mixPanelHelper', () => ({
  getFilteredNotifications: jest.fn(),
}));

describe('notifications actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    }) as any;
    getState = jest.fn(() => ({
      notifications: {
        read: false,
        unRead: false,
        notificationData: [],
      },
    }));
  });

  describe('filterNotifications', () => {
    const data = [
      { id: 1, isClicked: true },
      { id: 2, isClicked: false },
    ];

    test('read=true, unRead=true returns all', () => {
      actions.filterNotifications({ data, read: true, unRead: true })(dispatch, getState, undefined);
      expect(formActions.setListData).toHaveBeenCalledWith(data);
    });

    test('read=true returns only clicked', () => {
      actions.filterNotifications({ data, read: true, unRead: false })(dispatch, getState, undefined);
      expect(formActions.setListData).toHaveBeenCalledWith([{ id: 1, isClicked: true }]);
    });

    test('unRead=true returns only non-clicked', () => {
      actions.filterNotifications({ data, read: false, unRead: true })(dispatch, getState, undefined);
      expect(formActions.setListData).toHaveBeenCalledWith([{ id: 2, isClicked: false }]);
    });

    test('read=false, unRead=false returns all (default logic)', () => {
      actions.filterNotifications({ data, read: false, unRead: false })(dispatch, getState, undefined);
      expect(formActions.setListData).toHaveBeenCalledWith(data);
    });
  });

  describe('setNotifications', () => {
    test('success', async () => {
      const data = [{ id: 1 }];
      (getFilteredNotifications as jest.Mock).mockResolvedValueOnce(data);
      await actions.setNotifications('tab')(dispatch, getState, undefined);
      expect(getFilteredNotifications).toHaveBeenCalledWith('tab');
      expect(sanitizeDates).toHaveBeenCalledWith(data);
      expect(sliceActions.setNotificationData).toHaveBeenCalled();
      expect(formActions.setListData).toHaveBeenCalled();
    });

    test('catch block', async () => {
      (getFilteredNotifications as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await actions.setNotifications('tab')(dispatch, getState, undefined);
      expect(formActions.setListData).toHaveBeenCalledWith([]);
    });
  });

  describe('setAllNotifications', () => {
    test('success', async () => {
      const messages = {
        1: { payload: { notificationType: 'banner' }, action: [{ kvPair: { notificationType: 'banner' } }] }, // filtered out
        2: { payload: { notificationType: 'message' } }, // kept
        3: { action: [{ kvPair: { notificationType: 'banner' } }] }, // kept (only one)
        4: { payload: { notificationType: 'banner' } }, // kept (only one)
      };
      (MoengageMixpanel.getMoEngageMessages as jest.Mock).mockResolvedValueOnce({ messages });
      await actions.setAllNotifications()(dispatch, getState, undefined);

      const setListDataCall = (formActions.setListData as unknown as jest.Mock).mock.calls.find((call) => call[0].length > 0)?.[0];
      expect(setListDataCall).toHaveLength(3);
    });

    test('catch block', async () => {
      (MoengageMixpanel.getMoEngageMessages as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await actions.setAllNotifications()(dispatch, getState, undefined);
      expect(formActions.setListData).toHaveBeenCalledWith([]);
    });
  });

  describe('resetNotification', () => {
    test('dispatches reset actions', () => {
      actions.resetNotification()(dispatch, getState, undefined);
      expect(formActions.setListData).toHaveBeenCalledWith([]);
      expect(sliceActions.setNotificationData).toHaveBeenCalledWith([]);
    });
  });

  describe('setRead', () => {
    test('dispatches setRead and filters', () => {
      actions.setRead(true)(dispatch, getState, undefined);
      expect(sliceActions.setRead).toHaveBeenCalledWith(true);
      expect(formActions.setListData).toHaveBeenCalled();
    });
  });

  describe('setUnRead', () => {
    test('dispatches setUnRead and filters', () => {
      actions.setUnRead(true)(dispatch, getState, undefined);
      expect(sliceActions.setUnRead).toHaveBeenCalledWith(true);
      expect(formActions.setListData).toHaveBeenCalled();
    });
  });

  describe('getCarouselImage', () => {
    test('success with sorting and mapping', async () => {
      const messages = {
        1: { id: 'm1', payload: { notificationType: 'banner', displayOrder: '2' }, media: { url: 'u1' } },
        2: { id: 'm2', payload: { notificationType: 'message' } },
        3: { id: 'm3', action: [{ kvPair: { notificationType: 'banner', gcm_webUrl: 'l3' } }], payload: { displayOrder: '1' }, media: { url: 'u3' } },
        4: { id: 'm4', payload: { notificationType: 'banner' }, action: [{ value: 'v4' }] },
        5: { id: 'm5', action: [{ kvPair: { notificationType: 'banner' } }] }, // No payload at all
      };
      (MoengageMixpanel.getMoEngageMessages as jest.Mock).mockResolvedValueOnce({ messages });
      await actions.getCarouselImage()(dispatch, getState, undefined);

      const carouselData = (sliceActions.setCarouselData as unknown as jest.Mock).mock.calls[0][0];
      expect(carouselData).toHaveLength(4);
      expect(carouselData[0].id).toBe('m4'); // Order 0 from displayOrder: undefined
      expect(carouselData[1].id).toBe('m5'); // Order 0 from payload: undefined
      expect(carouselData[2].id).toBe('m3'); // Order 1
      expect(carouselData[3].id).toBe('m1'); // Order 2
    });

    test('catch block', async () => {
      (MoengageMixpanel.getMoEngageMessages as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await actions.getCarouselImage()(dispatch, getState, undefined);
      expect(sliceActions.setCarouselData).toHaveBeenCalledWith([]);
    });
  });
});
