/* eslint-disable global-require */
import { sliceActions } from 'store/sales/reducer/customerOffers';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { api } from 'services/apolloClient';
import { callAction } from 'utils/formBuilderHelper';
import { CHILD_TYPE, HEADER_TITLE, FORMS, PROPERTIES, ACCORDION_TYPE, QUERY, MODAL, ALERT } from 'const';

jest.mock('services/apolloClient', () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

jest.mock('store/sales/reducer/customerOffers', () => ({
  sliceActions: {
    setOffersData: jest.fn(),
    setSelectedOfferData: jest.fn(),
    handleRemoveOffer: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(),
  setModalLoader: jest.fn(),
  clearLoader: jest.fn(),
  showAlert: jest.fn(),
  hideBottomModal: jest.fn(),
  showErrorPage: jest.fn(),
  setLoader: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setSubIdList: jest.fn(),
  setDealerDetails: jest.fn(),
  setOffersData: jest.fn(),
  setOffersBasisRechargeObject: jest.fn(),
  setUpdatedFormFields: jest.fn(),
  clearFormData: jest.fn(),
  setFormActionDefault: jest.fn(),
  setSlabList: jest.fn(),
  setSearchBarItems: jest.fn(),
  setPillGroupItemsArr: jest.fn(),
  setNavigationData: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
  filterList: jest.fn(() => []),
}));

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
}));

describe('customerOffers actions', () => {
  let dispatch: any;
  let getState: any;
  let actions: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Isolate modules to reset module-level variables like isModalOpening
    jest.isolateModules(() => {
      actions = require('./customerOffers.action');
    });

    dispatch = jest.fn((a: any) => (typeof a === 'function' ? a(dispatch, getState, undefined) : a));
    getState = jest.fn(
      () =>
        ({
          customerOffers: {
            offersData: { fdoStatus: 'false', offers: [], balance: '0', accountInfo: { subId: 'sub123', customerRMN: 'rmn', customerName: 'name' } },
            selectedOfferData: { item: { packPrice: 100 }, input: { amount: '100', endDateFDR: '1711958400000' }, offerType: ACCORDION_TYPE.DYNAMIC_OFFERS },
          },
          form: {
            formState: {
              formActionData: {},
              dealerDetails: { subscriberId: 'sub123', mdn: '1234567890' },
            },
          },
        }) as any,
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('getOffers', () => {
    test('getOffers success with accountInfo only', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        accountInfo: { subId: 'sub123', customerName: 'name', customerRMN: 'rmn' },
        offers: [],
      });
      const action = actions.getOffers({ input: { subId: '123' } } as any);
      await (action as any)(dispatch, getState, undefined);
      expect(sliceActions.setOffersData).toHaveBeenCalled();
      expect(uiActions.clearLoader).toHaveBeenCalled();
    });

    test('getOffers success with subIdList', async () => {
      const mockResponse = {
        accountInfo: { subIdList: ['sub1', 'sub2'], subId: 'sub1', customerName: 'name', customerRMN: 'rmn' },
      };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);
      const action = actions.getOffers({ input: { subId: '123' } } as any);
      const result = await (action as any)(dispatch, getState, undefined);
      expect(formActions.setSubIdList).toHaveBeenCalledWith(['sub1', 'sub2']);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(
        expect.objectContaining({
          type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
          headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
          formName: FORMS.customerOffersSubIdList,
        }),
      );
      expect(result.status).toBe(false);
    });

    test('getOffers category mapping', async () => {
      const mockResponse = {
        accountInfo: { subId: 'sub1', customerName: 'name', customerRMN: 'rmn' },
        offers: [
          { offerCategory: 'CAT1', offerCategoryNT: 'CAT1' },
          { offerCategory: 'CAT2', offerCategoryNT: 'CAT2_NT' },
        ],
      };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);
      const action = actions.getOffers({ input: { subId: '123' } } as any);
      await (action as any)(dispatch, getState, undefined);
      expect(formActions.setPillGroupItemsArr).toHaveBeenCalledWith(['CAT1', { offerCategory: 'CAT2', offerCategoryNT: 'CAT2_NT' }]);
    });

    test('getOffers API failure', async () => {
      (api.get as jest.Mock).mockRejectedValue({ message: 'API Error' });
      const action = actions.getOffers({ input: { subId: '123' } } as any);
      await (action as any)(dispatch, getState, undefined);
      expect(commonActions.setErrorMessage).toHaveBeenCalledWith('API Error');
      expect(uiActions.clearLoader).toHaveBeenCalled();
    });
  });

  describe('searchCustomerOffers', () => {
    test('searchCustomerOffers basic', () => {
      getState.mockReturnValue({
        customerOffers: {
          offersData: {
            offers: [{ offerCategoryNT: 'CAT1', type: 'DYNAMIC_OFFERS', offerList: [{ id: 1 }] }],
          },
        },
      } as any);
      const action = actions.searchCustomerOffers({ searchText: 'test', queryName: 'CAT1' });
      (action as any)(dispatch, getState, undefined);
      expect(formActions.setSearchBarItems).toHaveBeenCalled();
    });

    test('searchCustomerOffers fallback to empty array', () => {
      getState.mockReturnValue({
        customerOffers: { offersData: { offers: [{ offerCategoryNT: 'CAT1', type: 'UNKNOWN_TYPE' }] } },
      } as any);
      const action = actions.searchCustomerOffers({ searchText: 'test', queryName: 'CAT1' });
      (action as any)(dispatch, getState, undefined);
      expect(formActions.setSearchBarItems).toHaveBeenCalled();
    });

    test('searchCustomerOffers with non-array dataArr', () => {
      const originalProps = PROPERTIES.CUSTOMER_OFFERS;
      (PROPERTIES as any).CUSTOMER_OFFERS = { ...originalProps, SOME_TYPE: 'not-an-array' };

      getState.mockReturnValue({
        customerOffers: {
          offersData: {
            offers: [{ offerCategoryNT: 'CAT1', type: 'SOME_TYPE', offerList: [{ id: 1 }] }],
          },
        },
      } as any);

      const action = actions.searchCustomerOffers({ searchText: 'test', queryName: 'CAT1' });
      (action as any)(dispatch, getState, undefined);
      expect(formActions.setSearchBarItems).toHaveBeenCalled();

      (PROPERTIES as any).CUSTOMER_OFFERS = originalProps;
    });
  });

  test('customerOfferModal', () => {
    const action = actions.customerOfferModal({});
    (action as any)(dispatch, getState, undefined);
    expect(uiActions.clearLoader).toHaveBeenCalled();
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ subscriberInfo: '' });
  });

  describe('proceedWithOffer', () => {
    test('proceedWithOffer success after delay', async () => {
      const action = actions.proceedWithOffer();
      const promise = (action as any)(dispatch, getState, undefined);

      // Try to call again to test isModalOpening guard
      const secondCall = (action as any)(dispatch, getState, undefined);
      expect(await secondCall).toBeUndefined();

      jest.advanceTimersByTime(110);
      await promise;

      expect(uiActions.showBottomModal).toHaveBeenCalled();

      jest.advanceTimersByTime(510); // Clear isModalOpening (Line 189)
    });

    test('proceedWithOffer fdoStatus true', async () => {
      getState.mockReturnValue({
        customerOffers: { offersData: { fdoStatus: 'true' } },
      } as any);
      const action = actions.proceedWithOffer();
      await (action as any)(dispatch, getState, undefined);
      expect(uiActions.showAlert).toHaveBeenCalledWith(expect.anything(), ALERT.INFO, expect.objectContaining({ primaryText: MODAL.OK }), expect.anything());
    });
  });

  describe('replaceOffer', () => {
    test('replaceOffer normal balance', () => {
      const action = actions.replaceOffer();
      (action as any)(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(
        expect.objectContaining({
          buttonInfo: expect.objectContaining({
            childData: expect.objectContaining({ packPrice: 100 }),
          }),
        }),
      );
    });

    test('replaceOffer negative balance', () => {
      getState.mockReturnValue({
        customerOffers: {
          offersData: { balance: '-50' },
          selectedOfferData: { item: { packPrice: 100 } },
        },
      } as any);
      const action = actions.replaceOffer();
      (action as any)(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(
        expect.objectContaining({
          buttonInfo: expect.objectContaining({
            childData: expect.objectContaining({ packPrice: 150 }),
          }),
        }),
      );
    });
  });

  test('confirmAddOffer', () => {
    const action = actions.confirmAddOffer();
    (action as any)(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        formName: FORMS.securityCheck,
      }),
    );
  });

  describe('addOfferPackConfirm', () => {
    test('addOfferPackConfirm with evdPin', async () => {
      getState.mockReturnValue({
        customerOffers: {
          selectedOfferData: { input: { some: 'data' }, offerType: '' }, // No date/Not dynamic
        },
        form: {
          formState: { dealerDetails: { subscriberId: 'sub123' } },
        },
      } as any);
      const action = actions.addOfferPackConfirm({ evdPin: '1234' });
      (callAction as jest.Mock).mockResolvedValue({ status: true });

      await (action as any)(dispatch, getState, undefined);
      expect(callAction).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({ evdPin: '1234', subscriberId: 'sub123' }),
        }),
        QUERY.AddOfferPack,
      );
    });

    test('addOfferPackConfirm with dynamic offers and date', async () => {
      const action = actions.addOfferPackConfirm({});
      await (action as any)(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(
        expect.objectContaining({
          headerTitle: HEADER_TITLE.CONFIRMATION,
          type: CHILD_TYPE.LABEl,
        }),
      );
    });

    test('addOfferPackConfirm fallback callAction', async () => {
      getState.mockReturnValue({
        customerOffers: {
          selectedOfferData: { input: {}, offerType: '' },
        },
        form: {
          formState: { dealerDetails: { subscriberId: 'sub123' } },
        },
      } as any);
      (callAction as jest.Mock).mockResolvedValue({ status: true });
      const action = actions.addOfferPackConfirm({});
      const result = await (action as any)(dispatch, getState, undefined);
      expect(result.status).toBe(true);
    });
  });

  describe('addOfferPack', () => {
    test('addOfferPack success with otp', async () => {
      getState.mockReturnValue({
        customerOffers: {
          offersData: { balance: '0', accountInfo: { isDhamakaEligible: true, customerRMN: 'rmn', customerName: 'name' } },
        },
      } as any);
      (api.post as jest.Mock).mockResolvedValue({ transId: '123' });
      const action = actions.addOfferPack({ otp: '1234', amount: 100, other: 'data' });
      await (action as any)(dispatch, getState, undefined);
      expect(formActions.setNavigationData).toHaveBeenCalledWith({ transactionId: '123' }, '', '', '');
    });

    test('addOfferPack success without otp and negative balance', async () => {
      getState.mockReturnValue({
        customerOffers: {
          offersData: { balance: '-10', accountInfo: { isDhamakaEligible: true, customerRMN: 'rmn', customerName: 'name' } },
        },
      } as any);
      (api.post as jest.Mock).mockResolvedValue({ transId: '123' });
      const action = actions.addOfferPack({ amount: 100, input: { some: 'input' } });
      await (action as any)(dispatch, getState, undefined);
      expect(api.post).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          input: expect.objectContaining({ amount: '110' }),
        }),
      );
    });

    test('addOfferPack failure', async () => {
      (api.post as jest.Mock).mockRejectedValue({ message: 'Error' });
      const action = actions.addOfferPack({ amount: 100 });
      const result = await (action as any)(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('Error');
      expect(result.status).toBe(false);
    });
  });

  describe('getOtpForOfferRecharge', () => {
    test('getOtpForOfferRecharge success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      const action = actions.getOtpForOfferRecharge({ customerOffersList: { input: {} } } as any);
      await (action as any)(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(
        expect.objectContaining({
          type: CHILD_TYPE.OTP_MODAL,
        }),
      );
    });

    test('getOtpForOfferRecharge fdoStatus true', async () => {
      getState.mockReturnValue({
        customerOffers: { offersData: { fdoStatus: 'true' } },
        form: { formState: { dealerDetails: {} } },
      } as any);
      const action = actions.getOtpForOfferRecharge({});
      const result = await (action as any)(dispatch, getState, undefined);
      expect(uiActions.showAlert).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    test('getOtpForOfferRecharge failure', async () => {
      (api.post as jest.Mock).mockRejectedValue({ message: 'OTP Error' });
      const action = actions.getOtpForOfferRecharge({ customerOffersList: { input: {} } } as any);
      await (action as any)(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('OTP Error');
    });
  });

  describe('resendOtpForRecharge', () => {
    test('resendOtpForRecharge success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      const action = actions.resendOtpForRecharge();
      await (action as any)(dispatch, getState, undefined);
      expect(api.post).toHaveBeenCalled();
    });

    test('resendOtpForRecharge failure', async () => {
      (api.post as jest.Mock).mockRejectedValue({ message: 'Resend Error' });
      const action = actions.resendOtpForRecharge();
      await (action as any)(dispatch, getState, undefined);
      expect(commonActions.setErrorMessage).toHaveBeenCalledWith('Resend Error');
    });
  });

  test('setSelectedOfferData', () => {
    const action = actions.setSelectedOfferData({ id: 1 });
    (action as any)(dispatch, getState, undefined);
    expect(sliceActions.setSelectedOfferData).toHaveBeenCalledWith({ id: 1 });
  });

  test('handleRemoveOffer', () => {
    const action = actions.handleRemoveOffer(true);
    (action as any)(dispatch, getState, undefined);
    expect(sliceActions.handleRemoveOffer).toHaveBeenCalledWith(true);
  });

  test('fillInPill', () => {
    getState.mockReturnValue({
      customerOffers: { offersData: { offers: [{ offerCategoryNT: 'cat' }] } },
    } as any);
    const action = actions.fillInPill({});
    (action as any)(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ offerPills: 'cat' });
  });
});
