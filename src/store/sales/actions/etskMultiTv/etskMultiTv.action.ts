/**
 * This is the main reducer for the module etsk multi tv
 *
 * @module store/sales/actions/etskMultiTv
 *
 */
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/etskMultiTv';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import i18next from 'i18next';
import commonActions from 'store/sales/actions/common';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions as etskActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as regActions } from 'store/sales/reducer/etskRegSchedular';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { MoengageMixpanel } from 'services/moengageMixpanel/index.web';

/**
 * Opens the bottom modal to show input for RMN/Subscriber id
 *
 * @function etskMultiTvStartingModel
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */

export const etskMultiTvStartingModel =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.ETSMultiTV.ETSKMultiTVPageVisit.moduleName, {
      [MoengageMixpanelModules.ETSMultiTV.ETSKMultiTVPageVisit.attributes.Status]: true,
    });
    dispatch(etskActions.etskSetFlexiPlan(0));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.ETSK_MULTI_TV,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.eTSKMultiTv,
        headerIcon: ICONS.ETSK_MULTI_TV_PINK,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

/**
 * Method will call api to check if the subscriber id or RMN is valid and provide details of the account
 *
 * @function validSubIDETSKMulti
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const validSubIDETSKMulti =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    dispatch(commonActions.setErrorMessage(''));
    const { info } = getState().user;

    const requestInput = {
      input: {
        subscriberId: params.subscriberInfo ?? params.multiSubId,
        userName: info.userId,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.ETSMultiTV.ETSKMultiSUBIDRMNProceed.moduleName, {
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiSUBIDRMNProceed.attributes.Status]: true,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiSUBIDRMNProceed.attributes.SubscriberID]: params.subscriberInfo ?? params.multiSubId,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiSUBIDRMNProceed.attributes.userName]: info.userId,
        });
        if (response?.status) {
          const data = refactorResponse(response);
          const { subIdList, subId, customerName, customerRMN } = data?.accountInfo ?? {};

          if (subIdList) {
            dispatch(formActions.setSubIdList(subIdList));
            dispatch(
              uiActions.showBottomModal({
                isModalVisible: true,
                type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
                headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
                showCloseIcon: true,
                showHeader: true,
                formName: FORMS.eTSKMultiTvSubIdList,
                buttonInfo: {
                  goToHome: true,
                },
              }),
            );
            return { status: false, data };
          }
          dispatch(sliceActions.etskMultiTvSetSubscriberId(subId));
          dispatch(formActions.setDealerDetails({ subscriberId: subId, mdn: customerRMN, customerName }));
          dispatch(sliceActions.etskMultiTvSetSubscriberData(data));
          dispatch(uiActions.hideBottomModal());
          return { status: true, data };
        }
        dispatch(commonActions.setErrorMessage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Query that will fill in the data in dropdowns of number of connections and offers
 *
 * @function fillInOfferAndConnections
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const fillInOfferAndConnections =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { subscriberData } = getState().etskMultiTv;
    const boxTypeArr: ParentObject[] = [
      { name: i18next.t('strings.HD'), value: 'HD' },
      { name: i18next.t('strings.Android'), value: 'Android' },
    ];

    const dropDownData = {
      noConnectionsDropdown: [{ name: '1', value: 1 }],
      secondary1: boxTypeArr,
      eTskMultiOfrTypeDropdown: subscriberData.eTskMultiOfrTypeDropdown,
    };
    dispatch(formAction.setMultipleAutoCompleteData({ data: dropDownData }));
    dispatch(
      formActions.setUpdatedFormFields({
        numberOfConnectionsDropdown: { name: '1', value: 1 },
      }),
    );
  };

/**
 * Query that give the billing summary details as per the offer and box selected
 *
 * @function getSecMultiTVDtlsETSKMul
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const getSecMultiTVDtlsETSKMul =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    if (!params?.numberOfConnectionsDropdown) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.selectNumberOfConnections') as unknown as string));
      return null;
    }
    if (!params?.secondary1Dropdown) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.selectBoxType') as unknown as string));
      return null;
    }
    if (!params?.OfferDropdown) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.selectOfferType') as unknown as string));
      return null;
    }
    dispatch(uiActions.setLoader());
    dispatch(commonActions.setErrorMessage(''));
    const { subscriberId } = getState().etskMultiTv;

    const requestInput = {
      input: {
        bingeplus_Selectedpacks: null,
        boxType: params.secondary1Dropdown?.value,
        etskMulSelOfr: params.OfferDropdown?.nameNT,
        subId: subscriberId,
      },
    };
    dispatch(sliceActions.etskMultiTvSetBoxTypeSelected(params.secondary1Dropdown?.value));
    dispatch(sliceActions.etskMultiTvSetOfferSelected(params.OfferDropdown?.nameNT));
    dispatch(etskActions.etskSetBoxTypeSelected(params.secondary1Dropdown?.name));
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteConnectionProceed.moduleName, {
          [MoengageMixpanelModules.Quotation.QuoteConnectionProceed.attributes.Status]: true,
          [MoengageMixpanelModules.Quotation.QuoteConnectionProceed.attributes.boxType]: params.secondary1Dropdown?.value,
          [MoengageMixpanelModules.Quotation.QuoteConnectionProceed.attributes.noOfBoxes]: params.OfferDropdown?.nameNT,
        });
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.ETSMultiTV.ETSKMultiBoxtypeSelectionProceed.moduleName, {
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiBoxtypeSelectionProceed.attributes.Status]: true,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiBoxtypeSelectionProceed.attributes.boxType]: params.secondary1Dropdown?.value,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiBoxtypeSelectionProceed.attributes.SubscriberID]: subscriberId,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiBoxtypeSelectionProceed.attributes.bingeplusSelectedpacks]: params.OfferDropdown?.nameNT,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiBoxtypeSelectionProceed.attributes.etskMulSelOfr]: params.OfferDropdown?.nameNT,
        });
        if (response?.status) {
          dispatch(sliceActions.etskSetMultiBoxSelectedDetails(data));
          dispatch(etskActions.etskSetValidatePacksSuccessData(data));
          const { customerInformation } = data;
          const customerInformationeETSK = {
            customerName: customerInformation?.name,
            mobileNo: customerInformation?.primaryMobile,
            emailAddress: customerInformation?.email !== 'NA' ? customerInformation?.email : [],
            language: customerInformation?.primaryLanguage,
            sec_lang: customerInformation?.secondaryLanguage,
            pincode: customerInformation?.pinCode,
            addressLine1: customerInformation?.address,
            state: customerInformation?.state,
            city: customerInformation?.city,
            district: customerInformation?.district !== 'NA' ? customerInformation?.district : '',
          };

          dispatch(etskActions.etskSetCustomerDetailsData(customerInformationeETSK));
          return { status: true, data };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data.message));
        return { status: false, message: data.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Query that opens the confirmation modal and on click of confirm calls an api EtskSchedular
 *
 * @function eTskMultiTvSubmissionConfirmation
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const eTskMultiTvSubmissionConfirmation =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const amount = params.rechargeAmount;
    const { boxSelectedDetails, subscriberId, offerSelected, boxType, subscriberData } = getState().etskMultiTv;

    if (Math.ceil(Number(amount)) < Number(boxSelectedDetails?.eTSKMinRechargeAmount ?? '0')) {
      dispatch(commonActions.setErrorMessage(`${i18next.t('strings.minRechargeAmount')} ${Number(boxSelectedDetails?.eTSKMinRechargeAmount ?? '0')}`));
      dispatch(formActions.setUpdatedFormFields({ rechargeAmount: Number(boxSelectedDetails?.eTSKMinRechargeAmount ?? '0').toString() }, STATE_KEY.MODAL_STATE));
      return null;
    }
    const { evdPin } = params;
    const message = i18next.t('strings.amountDeductionMsg', { amount });
    const { finalPrice } = getState().etskRegistration;
    const { selectedSlot, timeSlotsData } = getState().etskRegSchedular || {};

    const [startTime, endTime] = (selectedSlot ?? '').split(' - ');

    const requestInput = {
      subscriberId,
      rechargeAmount: Math.ceil(Number(amount)).toString(),
      rechargeEvdPin: evdPin,
      etskSelectedOffer: offerSelected,
      requiredRechargeAmount: finalPrice,
      boxTypeFe: boxType,
      dhamakaMulRechBalChk: boxSelectedDetails?.disableEditRechDhamakaMultiTV === STRINGS.YES ? STRINGS.DM : STRINGS.DL,
      startTime: startTime || null,
      endTime: endTime || null,
      ocsFlag: subscriberData?.accountInfo?.ocsFlag || STRINGS.NO,
      taskId: timeSlotsData?.taskId ?? null,
    };
    dispatch(etskActions.etskSetPaidPrice(Math.ceil(Number(amount)).toString()));
    dispatch(etskActions.etskSetEvdPin(evdPin));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.LABEl,
        headerTitle: HEADER_TITLE.CONFIRMATION,
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: {
          primaryButtonLabel: MODAL.CONFIRM,
          secondaryButtonLabel: MODAL.MODIFY,
          childData: message,
          queryName: QUERY.DoRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul,
          queryParams: { ...requestInput },
          secondaryQueryName: QUERY.RechargeDetails,
          secondaryQueryParams: FORMS.etskMultiTvRechargeDetails,
          hasOutline: true,
        },
      }),
    );
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.ETSMultiTV.ETSKMultiSummaryProceed.moduleName, {
      [MoengageMixpanelModules.ETSMultiTV.ETSKMultiSummaryProceed.attributes.Status]: true,
    });
    return { params, status: true };
  };

/**
 * Query that calls the api that do recharge and create WO
 *
 * @function doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul =
  (params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { boxSelectedDetails, subscriberId, offerSelected, boxType, subscriberData } = getState().etskMultiTv;

    dispatch(etskActions.etskSetEvdPin(''));
    return api
      .post(queries.doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul, params)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.ETSMultiTV.ETSKMultiRechargeConfirm.moduleName, {
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiRechargeConfirm.attributes.SubscriberID]: subscriberId,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiRechargeConfirm.attributes.boxType]: boxType,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiRechargeConfirm.attributes.dhamakaMulRechBalChk]:
            boxSelectedDetails?.disableEditRechDhamakaMultiTV === STRINGS.YES ? STRINGS.DM : STRINGS.DL,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiRechargeConfirm.attributes.etskSelectedOffer]: offerSelected,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiRechargeConfirm.attributes.rechargeEvdPin]: subscriberData,
        });
        if (response?.status) {
          data.response.woNumber = data.response.workOrderId;
          dispatch(regActions.setCreateWoEtskSuccessData(data));
          navigate(ROUTE.WEB.ETSK_MULTI_TV_SUCCESS);
          return { status: true, routeName: ROUTE.WEB.ETSK_MULTI_TV_SUCCESS };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data.message));
        return { status: false, message: data.message };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Opens the bottom modal to show input for RMN/Subscriber id
 *
 * @function etskMultiTvRepushModel
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */

export const etskMultiTvRepushModel =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.ETSMultiTV.ETSKMultiRepushPageVisit.moduleName, {
      [MoengageMixpanelModules.ETSMultiTV.ETSKMultiRepushPageVisit.attributes.Status]: true,
    });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.ETSK_MULTI_TV_REPUSH,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.eTSKMultiTvRepush,
        headerIcon: ICONS.ETSK_REPUSH_PINK,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

/**
 * Method will call api to check if the subscriber id or RMN is valid and provide details of the account
 *
 * @function etskMultiTvRepush
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const etskMultiTvRepush =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    dispatch(commonActions.setErrorMessage(''));
    const { info } = getState().user;

    const requestInput = {
      input: {
        subscriberId: params.subscriberInfoRepush ?? params.multiSubIdRepush,
        userName: info.userId,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.ETSMultiTV.ETSKMultiRepushSUBIDRMNProceed.moduleName, {
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiRepushSUBIDRMNProceed.attributes.Status]: true,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiRepushSUBIDRMNProceed.attributes.SubscriberID]: params.subscriberInfoRepush ?? params.multiSubIdRepush,
          [MoengageMixpanelModules.ETSMultiTV.ETSKMultiRepushSUBIDRMNProceed.attributes.userName]: info.userId,
        });
        if (response?.status) {
          const data = refactorResponse(response);
          if (data?.response?.status === STRINGS.RechNo) {
            dispatch(commonActions.setErrorMessage(i18next.t('strings.multiTvRegister') as unknown as string));
            return null;
          }
          const { subIdList, customerName, customerRMN } = data?.response?.accountInfo ?? {};
          const { boxType, subscriberId, rechargeAmount } = data?.response ?? {};
          if (subIdList) {
            dispatch(formActions.setSubIdList(subIdList));
            dispatch(
              uiActions.showBottomModal({
                isModalVisible: true,
                type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
                headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
                showCloseIcon: true,
                showHeader: true,
                formName: FORMS.eTSKMultiTvRepushSubIdList,
                buttonInfo: {
                  goToHome: true,
                },
              }),
            );
            return { status: false, data };
          }
          dispatch(sliceActions.etskMultiTvRepushSetSubscriberId(subscriberId));
          dispatch(formActions.setDealerDetails({ subscriberId, mdn: customerRMN, customerName }));
          dispatch(etskActions.etskSetBoxTypeSelected(boxType));
          dispatch(regActions.setCreateWoEtskSuccessData(data));
          dispatch(etskActions.etskSetValidatePacksSuccessData({}));
          dispatch(etskActions.etskSetPaidPrice(rechargeAmount));
          dispatch(uiActions.hideBottomModal());
          return { status: true, data };
        }
        dispatch(commonActions.setErrorMessage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
