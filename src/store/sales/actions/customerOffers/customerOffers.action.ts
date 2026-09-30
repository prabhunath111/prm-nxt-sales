/**
 * Redux store for customer offers
 *
 * @module store/actions/customerOffers
 *
 */
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { customerOffersType } from 'store/sales/types/customerOffers';
import { refactorResponse } from 'utils/responseHelper';
import { callAction, filterList } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import { CHILD_TYPE, MODAL, HEADER_TITLE, QUERY, FORMS, PROPERTIES, STRINGS, STATE_KEY, CHILD_DATA, OFFER_TYPE, ROUTE, ACCORDION_TYPE, ALERT } from 'const';
import { sliceActions } from 'store/sales/reducer/customerOffers';
import commonActions from 'store/sales/actions/common';
import i18next from 'i18next';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Asynchronous action to fetch and process customer offers data.
 *
 * @function getOffers
 * @param {customerOffersType} params - Parameters for the query.
 * @returns {AppThunk} - A thunk that dispatches actions based on API response.
 *
 * @example
 * dispatch(getOffers({ exampleParam: 'exampleValue' }));
 */

export const getOffers =
  (params: customerOffersType): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    dispatch(commonActions.setErrorMessage(''));
    return api
      .get(queries.getOfferPacks, params)
      .then((response) => {
        const data = refactorResponse(response);
        const { subIdList, subId, customerName, customerRMN } = data.accountInfo;

        if (subIdList) {
          dispatch(formActions.setSubIdList(subIdList));
          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
              headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
              showCloseIcon: true,
              showHeader: true,
              isCenterModal: true,
              formName: FORMS.customerOffersSubIdList,
              buttonInfo: {
                goToHome: true,
              },
            }),
          );
          return { status: false, data };
        }
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.My_Offer.MyOffer_Proceed.moduleName, {
          [MoengageMixpanelModules.My_Offer.MyOffer_Proceed.attributes.Status]: true,
          [MoengageMixpanelModules.My_Offer.MyOffer_Proceed.attributes.subId]: subId,
        });
        const categoryArr = data.offers?.map((offer: ParentObject) =>
          offer.offerCategory === offer.offerCategoryNT
            ? offer.offerCategoryNT
            : {
                offerCategory: offer.offerCategory,
                offerCategoryNT: offer.offerCategoryNT,
              },
        );

        dispatch(formActions.setDealerDetails({ subscriberId: subId, mdn: customerRMN, customerName }));
        dispatch(sliceActions.setOffersData(data));
        dispatch(formActions.setPillGroupItemsArr(categoryArr));

        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Searches for customer offers.
 *
 * @function searchCustomerOffers
 * @param {ParentObject} params - Parameters for the search query.
 * @returns {void}
 */

export const searchCustomerOffers =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { offersData } = getState().customerOffers; // Get current dealer list from the store
    const categoryOffer = offersData?.offers?.find((offer: ParentObject) => offer.offerCategoryNT === params.queryName);
    const offerType = OFFER_TYPE[categoryOffer?.type as keyof typeof OFFER_TYPE];
    // Define the keys you want to search on
    const dataArr = PROPERTIES.CUSTOMER_OFFERS[offerType as keyof typeof PROPERTIES.CUSTOMER_OFFERS] as { key: string }[];
    const searchKeys = Array.isArray(dataArr) ? dataArr.map((item) => item.key) : [];
    const additionalKeys = PROPERTIES.CUSTOMER_OFFERS.ADDITIONAL_SEARCH_KEYS;

    const filteredDealers = filterList(categoryOffer?.offerList, [...searchKeys, ...additionalKeys], params.searchText);

    // Dispatch action to update the dealers list in the store with the filtered dat
    dispatch(formActions.setSearchBarItems(filteredDealers, params.queryName));
  };

/**
 * Displays the customer offer modal.
 *
 * @function customerOfferModal
 * @returns {void}
 */

export const customerOfferModal =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.clearLoader());
    dispatch(uiActions.hideBottomModal());
    dispatch(formActions.setUpdatedFormFields({ subscriberInfo: '' }));

    // const { isLoading } = (getState() as RootState).ui;
    // if (isLoading) {
    //   dispatch(uiActions.clearLoader());
    // }
    // dispatch(
    //   showModalWithTransition({
    //     isModalVisible: true,
    //     isCenterModal: true,
    //     type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
    //     headerTitle: HEADER_TITLE.CUSTOMER_OFFER,
    //     showCloseIcon: params?.showCloseIcon ?? true,
    //     showHeader: true,
    //     formName: FORMS.customerOffers,
    //     headerIcon: ICONS.CUSTOMER_OFFERS,
    //     buttonInfo: {
    //       goToHome: true,
    //     },
    //   }),
    // );
  };

/**
 * Proceeds with the customer offer.
 *
 * @function proceedWithOffer
 * @returns {void}
 */
let isModalOpening = false;

export const proceedWithOffer = (): AppThunk => async (dispatch, getState) => {
  if (isModalOpening) return;
  isModalOpening = true;

  try {
    dispatch(uiActions.hideBottomModal());
    const { offersData } = getState().customerOffers;
    const { fdoStatus } = offersData;
    if (fdoStatus === i18next.t('true')) {
      dispatch(uiActions.showAlert(i18next.t(`strings.fdoMessage`), ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
      return;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });

    dispatch(uiActions.setModalLoader());

    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.LABEl,
        headerTitle: HEADER_TITLE.REPLACE_OFFER,
        showCloseIcon: true,
        showHeader: true,
        isCenterModal: true,
        buttonInfo: {
          primaryButtonLabel: MODAL.YES_PROCEED,
          secondaryButtonLabel: MODAL.CANCEL,
          childData: CHILD_DATA.ADD_OFFER_LABEl,
          queryName: QUERY.ReplaceOffer,
        },
      }),
    );
  } finally {
    dispatch(uiActions.clearLoader());
    setTimeout(() => {
      isModalOpening = false;
    }, 500);
  }
};

/**
 * Replaces the customer offer.
 *
 * @function replaceOffer
 * @returns {void}
 */

export const replaceOffer = (): AppThunk => (dispatch, getState) => {
  const { selectedOfferData, offersData } = getState().customerOffers;
  const { balance } = offersData;
  let selectedOffer = selectedOfferData.item;
  let finalPackPrice = selectedOfferData.item.packPrice;
  if (parseFloat(balance) < 0) {
    finalPackPrice = Math.round((Math.abs(selectedOfferData.item.packPrice) + Math.abs(balance)) * 100) / 100;
  }
  selectedOffer = { ...selectedOffer, packPrice: finalPackPrice };

  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.PACK_CARD,
      headerTitle: HEADER_TITLE.TO_BE_ADDED,
      showCloseIcon: true,
      showHeader: true,
      isCenterModal: true,
      buttonInfo: {
        primaryButtonLabel: MODAL.CONFIRM,
        secondaryButtonLabel: MODAL.CANCEL,
        queryName: QUERY.ConfirmAddOffer,
        childData: selectedOffer,
      },
    }),
  );
};

/**
 * Shows confirm pop up.
 *
 * @function confirmAddOffer
 * @returns {void}
 */

export const confirmAddOffer = (): AppThunk => (dispatch) =>
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
      headerTitle: FORMS.securityCheck,
      showCloseIcon: true,
      showHeader: true,
      isCenterModal: true,
      formName: FORMS.securityCheck,
    }),
  );

/**
 * Adds an offer pack for a customer by making an API call.
 *
 * @function addOfferPack
 * @param {ParentObject} params - The parameters required to add the offer pack.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */

export const addOfferPackConfirm =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { selectedOfferData } = getState().customerOffers;
    const { dealerDetails } = getState().form[STATE_KEY.FORM_STATE];
    const updatedParams = { ...params };

    delete updatedParams.mdn;
    delete updatedParams.type;
    const evdPin = params.evdPin || '';

    const requestObject = {
      input: {
        ...(evdPin ? selectedOfferData.input : updatedParams),
        noRecharge: !!params.otp,
        evdPin,
        subscriberId: dealerDetails.subscriberId,
      },
    };
    const amount = selectedOfferData?.input?.amount ?? '';
    const endDateFDR = selectedOfferData?.input?.endDateFDR;

    let formattedDate = 'an unknown date';

    if (endDateFDR && !Number.isNaN(Number(endDateFDR)) && selectedOfferData?.offerType === ACCORDION_TYPE.DYNAMIC_OFFERS) {
      const dateObj = new Date(Number(endDateFDR));
      formattedDate = dateObj.toDateString();
      const message = i18next.t('strings.evd_deduction_message', {
        amount,
        formattedDate,
      });

      return dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.LABEl,
          headerTitle: HEADER_TITLE.CONFIRMATION,
          showCloseIcon: true,
          showHeader: true,
          isCenterModal: true,
          buttonInfo: {
            primaryButtonLabel: MODAL.YES_PROCEED,
            secondaryButtonLabel: MODAL.CANCEL,
            queryName: QUERY.AddOfferPack,
            queryParams: { ...requestObject },
            childData: message,
          },
        }),
      );
    }
    return dispatch(callAction({ ...requestObject }, QUERY.AddOfferPack)).then(
      (response: any) => ({ ...response }), // ✅ always returns
    );
  };

/**
 * Adds an offer pack for a customer by making an API call.
 *
 * @function addOfferPack
 * @param {ParentObject} params - The parameters required to add the offer pack.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */

export const addOfferPack =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, mdn, ...rest } = params;
    const { offersData } = getState().customerOffers;
    const { accountInfo, balance } = offersData;
    let finalPackPrice = params.amount;

    if (parseFloat(balance) < 0) {
      finalPackPrice = Math.round((Math.abs(params.amount) + Math.abs(balance)) * 100) / 100;
    }
    const reqParams = params.otp
      ? {
          input: {
            ...rest,
            noRecharge: !!params.otp,
            evdPin: '',
            isDhamakaEligible: accountInfo.isDhamakaEligible,
            balance,
            rmn: accountInfo?.customerRMN,
            customerName: accountInfo?.customerName,
          },
        }
      : {
          input: {
            ...params?.input,
            isDhamakaEligible: accountInfo?.isDhamakaEligible,
            balance,
            amount: String(finalPackPrice),
            rmn: accountInfo?.customerRMN,
            customerName: accountInfo?.customerName,
          },
        };

    return api
      .post(queries.doOfferRecharge, reqParams)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formActions.setNavigationData({ transactionId: data?.transId }, '', '', ''));
        return { status: true, data, routeName: ROUTE.WEB.CUSTOMER_OFFER_SUCCESS };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Initiates the generation of an OTP for offer recharge.
 *
 * @function getOtpForOfferRecharge
 * @param {ParentObject} params - The parameters required to generate the OTP.
 * @returns {AppThunk} A thunk action that triggers an OTP modal and handles API response.
 */

export const getOtpForOfferRecharge =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { dealerDetails } = getState().form[STATE_KEY.FORM_STATE];
    const { offersData } = getState().customerOffers;
    const { fdoStatus } = offersData;

    if (fdoStatus === 'true') {
      dispatch(uiActions.showAlert(i18next.t(`strings.fdoMessage`), ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
      return params;
    }

    const requestObject = {
      input: { subscriberId: dealerDetails.subscriberId },
    };

    return api
      .post(queries.generateOtp, requestObject)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(
          uiActions.showBottomModal({
            isModalVisible: true,
            type: CHILD_TYPE.OTP_MODAL,
            headerTitle: '',
            data: { ...params.customerOffersList.input, subscriberId: dealerDetails.subscriberId, mdn: dealerDetails.mdn },
            showCloseIcon: false,
            showHeader: false,
            isCenterModal: true,
            buttonInfo: {
              otpButtonLabel: MODAL.CONFIRM_TO_PROCEED,
              queryName: QUERY.AddOfferPack,
              sentToTitle: STRINGS.SENTTO,
              resendOtpQuery: QUERY.ResendOtpForRecharge,
              routeName: ROUTE.WEB.CUSTOMER_OFFER_SUCCESS,
            },
          }),
        );

        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Resends an OTP for a recharge request.
 *
 * @function resendOtpForRecharge
 * @returns {AppThunk} A thunk action that triggers the resend OTP process and handles API response.
 */

export const resendOtpForRecharge = (): AppThunk => (dispatch, getState) => {
  const { dealerDetails } = getState().form[STATE_KEY.FORM_STATE];

  const requestObject = {
    input: { subscriberId: dealerDetails.subscriberId },
  };

  return api
    .post(queries.generateOtp, requestObject)
    .then((response) => {
      const data = refactorResponse(response);
      return data;
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
    });
};

/**
 * Sets the selected offer data in the state.
 *
 * @function setSelectedOfferData
 * @param {ParentObject} params - The selected offer data to be set.
 * @returns {AppThunk} A thunk action that updates the selected offer data in the state.
 */

export const setSelectedOfferData =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setSelectedOfferData(params));
  };

/**
 * handle offer removal in the state.
 *
 * @function handleRemoveOffer
 * @param {boolean} params - isOfferRemoved
 * @returns {AppThunk} A thunk action that updates the selected offer data in the state.
 */

export const handleRemoveOffer =
  (params: boolean): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.handleRemoveOffer(params));
  };

/**
 * handle offer removal in the state.
 *
 * @function fillInPill
 * @param {boolean} params - isOfferRemoved
 * @returns {AppThunk} A thunk action that updates the selected offer data in the state.
 */

export const fillInPill =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { offersData } = getState().customerOffers;
    dispatch(formActions.setUpdatedFormFields({ offerPills: offersData?.offers?.[0]?.offerCategoryNT }));
  };

export const trackEvent =
  (_params: ParentObject): AppThunk =>
  () => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.My_Offer.MyOffer_PageVisit.moduleName, {
      [MoengageMixpanelModules.My_Offer.MyOffer_PageVisit.attributes.Status]: true,
    });
  };
