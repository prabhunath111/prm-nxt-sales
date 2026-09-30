/**
 * In this reducer we will manage all recharge winback related information
 *
 * @module store/actions/rechargeWinback
 *
 */
import { sliceActions } from 'store/sales/reducer/rechargeWinback';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import formActions from 'store/sales/actions/form';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, CAMPAIGN_TYPE, CHILD_TYPE, FORMS, HEADER_TITLE, MODAL, PACK_CATEGORY, PROPERTIES, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import { callAction, filterByParams } from 'utils/formBuilderHelper';
import { Sizing } from 'styles';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Get the winback config properties list by making an API call.
 *
 * @function getWinBackConfigProperties
 * @param {ParentObject} params - The parameters required to add the offer pack.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const getWinBackConfigProperties =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], {})
      .then((response) => {
        const data = refactorResponse(response);
        sliceActions.winbackConfigProperties(data);
        dispatch(formActions.setRadioContainerOptions(data.winBackSubCategoryNewRadio, QUERY.WinBackSubCategoryNewRadio));
        dispatch(formActions.setMultipleDropdownOptionsData(data));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Get the winback subscriber list by making an API call.
 *
 * @function getWinBackSubscriberList
 * @param {ParentObject} params - The parameters required to add the offer pack.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const getWinBackSubscriberList =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      winBackCategory: params?.campaign || params?.campaignDropDown?.name,
      campaignStatus: STRINGS.ALL,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.winBackSubscriberList(data));
        dispatch(sliceActions.setFilteredSubscriberList(data?.winBackSubIdList));
        if (params?.campaign || params?.campaignDropDown?.name) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.rechargeWinback.Winback_SelectCampaign.moduleName, {
            [MoengageMixpanelModules.rechargeWinback.Winback_SelectCampaign.attributes.Status]: true,
            [MoengageMixpanelModules.rechargeWinback.Winback_SelectCampaign.attributes.winBackCategory]: params?.campaign || params?.campaignDropDown?.name,
          });
          dispatch(sliceActions.setCampaignName(params?.campaign || params?.campaignDropDown?.name));
          setTimeout(() => {
            dispatch(formActions.setFormValues({ campaignDropDown: { name: params?.campaign || params?.campaignDropDown?.name } }));
          }, Sizing.layout.x400);
        }
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(sliceActions.setFilteredSubscriberList([]));
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Fetch the winback back packs by making an API call.
 *
 * @function fetchWinBackPacks
 * @param {ParentObject} params - The parameters required to add the offer pack.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const fetchWinBackPacks =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { winBackSubscriberList } = getState().rechargeWinback;
    if (winBackSubscriberList?.identifier === STRINGS.PK) {
      dispatch(uiActions.setLoader());
      const requestInput = {
        subscriberId: params?.subscriberId,
        offerCode: params?.offerCode,
      };
      return api
        .post(queries[queryName], requestInput)
        .then((response) => {
          const data = refactorResponse(response);
          dispatch(sliceActions.winBackPacks(data));
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.rechargeWinback.Winback_SelectSubid.moduleName, {
            [MoengageMixpanelModules.rechargeWinback.Winback_SelectSubid.attributes.Status]: true,
            [MoengageMixpanelModules.rechargeWinback.Winback_SelectSubid.attributes.subscriberId]: params?.subscriberId,
          });
          return { status: true, data };
        })
        .catch((error: any) => {
          dispatch(sliceActions.winBackPacks([]));
          dispatch(uiActions.showErrorPage(error.message));
          return { status: false, message: error.message };
        })
        .finally(() => dispatch(uiActions.clearLoader()));
    }
    dispatch(sliceActions.winBackPacks([]));
    return { status: false };
  };

/**
 * Update winback subscriber status by making an API call.
 *
 * @function updateWinBackSubscriberStatus
 * @param {ParentObject} params - The parameters required to add the offer pack.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const updateWinBackSubscriberStatus =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { subscriberDetails, subscriberRmn } = getState().rechargeWinback;
    const data = subscriberDetails?.data;
    const requestInput = {
      subscriberId: data.subscriberId,
      campaignCode: data.campCode,
      offerCode: data.offerCode,
      rmn: subscriberRmn.data,
      treatmentCode: data.treatmentCode,
      comment: params?.customerResponseDropDown?.nameNT || params?.updateStatus,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.winBackSuccessData(data));
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.rechargeWinback.Winback_Update.moduleName, {
          [MoengageMixpanelModules.rechargeWinback.Winback_Update.attributes.Status]: true,
          [MoengageMixpanelModules.rechargeWinback.Winback_Update.attributes.campaignCode]: data.campCode,
          [MoengageMixpanelModules.rechargeWinback.Winback_Update.attributes.comment]: params?.customerResponseDropDown?.nameNT || params?.updateStatus,
          [MoengageMixpanelModules.rechargeWinback.Winback_Update.attributes.offerCode]: data.offerCode,
          [MoengageMixpanelModules.rechargeWinback.Winback_Update.attributes.rmn]: subscriberRmn.data,
          [MoengageMixpanelModules.rechargeWinback.Winback_Update.attributes.subscriberId]: data.subscriberId,
          [MoengageMixpanelModules.rechargeWinback.Winback_Update.attributes.treatmentCode]: data.treatmentCode,
        });
        if (!params?.updateStatus) {
          dispatch(uiActions.showAlert(data.message, ALERT.SUCCESS, { primaryText: MODAL.OK, routeName: ROUTE.WEB.RECHARGE_WINBACK, clearForm: true }, {}));
        }
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Shows confirm pop up.
 *
 * @function confirmAddOffer
 * @returns {void}
 */

export const confirmAddWinbackOffer = (): AppThunk => (dispatch) =>
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.SECURITY_CHECK,
      showCloseIcon: true,
      showHeader: true,
      isCenterModal: true,
      formName: FORMS.winBackSecurityCheck,
    }),
  );

/**
 * Adds an offer pack for a customer by making an API call.
 *
 * @function addWinBackOfferPack
 * @param {ParentObject} params - The parameters required to add the offer pack.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const addWinBackOfferPack =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.hideBottomModal());
    setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, 100);
    const { subscriberDetails, winBackPack } = getState().rechargeWinback;
    const { accountInformation } = getState().accountInformation;
    const evdPin = params.evdPin || '';
    const offer = winBackPack.data;

    const offerAmount = String(offer.stdPriUnit);
    const subData = subscriberDetails?.data;
    const requestObject = {
      input: {
        subscriberId: subData.subscriberId,
        evdPin,
        campaignType: CAMPAIGN_TYPE.WINBACK_D30,
        endDateFDR: '',
        amount: offerAmount,
        packCategory: PACK_CATEGORY.GENERIC,
        pack: offer?.name,
        noRecharge: false,
        rmn: accountInformation?.customerRMN,
        balance: accountInformation?.balance,
        customerName: accountInformation?.customerName,
        packFriendlyName: offer?.friendlyName,
      },
    };
    return api
      .post(queries.doOfferRecharge, requestObject)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(callAction({ updateStatus: STRINGS.WINBACK_RECHARGED }, QUERY.UpdateWinBackSubscriberStatus));
        dispatch(formActions.setNavigationData({ transactionId: data?.transId }, '', '', ''));
        dispatch(uiActions.clearLoader());
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      });
  };

export const winbackSubListFilter =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { winBackSubscriberList } = getState().rechargeWinback;
    const statusDropDown = params?.statusDropDown;
    let filteredList = winBackSubscriberList?.winBackSubIdList;
    let filteredData: ParentObject[] = [];
    const selectedStatuses: string[] = statusDropDown ? Object.values(statusDropDown).map((item: ParentObject) => item?.name) : [];
    const isAllSelected = selectedStatuses.includes(STRINGS.ALL);
    if (!isAllSelected && selectedStatuses.length > 0) {
      filteredList = filteredList?.filter((item: ParentObject) => selectedStatuses.includes(item.responseStatus));
    }
    const requestInput = {
      subscriberName: params?.searchText || params?.searchCapaign || '',
      subscriberId: params?.searchText || params?.searchCapaign || '',
    };
    if (filteredList) {
      filteredData = filterByParams(filteredList, requestInput);
    }
    dispatch(sliceActions.setFilteredSubscriberList(filteredData));
  };

/**
 * Shows confirm pop up.
 *
 * @function monthlyRechargeSecurityCheck
 * @returns {void}
 */

export const monthlyRechargeSecurityCheck =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(formActions.setNavigationData({ monthlyRecharge: params?.monthlyRecharge }, '', '', ''));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.SECURITY_CHECK,
        showCloseIcon: true,
        showHeader: true,
        isCenterModal: true,
        formName: FORMS.winBackMonthlyRecharge,
      }),
    );
  };

/**
 * Performs a recomended monthly recharge.
 *
 * @param {ParentObject} params - The parameters for the recharge request.
 * @returns {AppThunk} A thunk action for dispatching.
 */
export const doMonthlyRecharge =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { subscriberDetails } = getState().rechargeWinback;
    const { formNavigationData } = getState().form[STATE_KEY.FORM_STATE];
    const rechargeAmount = formNavigationData?.params?.monthlyRecharge;
    const subData = subscriberDetails?.data;
    dispatch(uiActions.hideBottomModal());
    setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, 100);
    const newParams = {
      amount: Number(rechargeAmount),
      pin: params.evdPin,
      subscriberInfo: subData.subscriberId,
      tskNumber: null,
    };
    return api
      .post(queries.doRecharge, { input: newParams })
      .then((response) => {
        dispatch(uiActions.hideBottomModal());
        const data = refactorResponse(response);
        dispatch(callAction({ updateStatus: STRINGS.WINBACK_RECHARGED }, QUERY.UpdateWinBackSubscriberStatus));
        dispatch(
          uiActions.showAlert(
            data.message,
            ALERT.SUCCESS,
            { primaryText: MODAL.OK, routeName: ROUTE.WEB.RECHARGE_WINBACK, clearForm: true, showDownloadInvoice: true, showWinBackMessage: true },
            { data: { ...newParams, ...data }, type: CHILD_TYPE.LIST_DATA, listData: PROPERTIES.CUSTOMER_RECHARGE.CONFIRM_RECOMENDED_RECHARGE },
          ),
        );
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.rechargeWinback.Winback_Recharge.moduleName, {
          [MoengageMixpanelModules.rechargeWinback.Winback_Recharge.attributes.Status]: true,
          [MoengageMixpanelModules.rechargeWinback.Winback_Recharge.attributes.amount]: Number(rechargeAmount),
          [MoengageMixpanelModules.rechargeWinback.Winback_Recharge.attributes.pin]: params.evdPin,
          [MoengageMixpanelModules.rechargeWinback.Winback_Recharge.attributes.subscriberInfo]: subData.subscriberId,
          [MoengageMixpanelModules.rechargeWinback.Winback_Recharge.attributes.tskNumber]: null,
        });
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(formActions.clearFormData(true));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Fetch the knowlarity number by making an API call.
 *
 * @function getUniqueKwlrtyToken
 * @param {ParentObject} params - The parameters required to add the offer pack.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const getUniqueKwlrtyToken =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      mobileNumber: params?.mobile,
      subscriberId: params?.subID,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setUniqueKwlrtyNumber(data));
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * To set the subscriber details
 *
 * @function setSubscriberDetails
 * @returns {void}
 */
export const setSubscriberDetails =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setSubscriberDetails({ data: params }));
  };

/**
 * To set the subscriber RMN
 *
 * @function setSubscribeRmn
 * @returns {void}
 */
export const setSubscribeRmn =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setSubscriberRmn({ data: params }));
  };
/**
 * To set the winBack pack
 *
 * @function setWinBackPack
 * @returns {void}
 */
export const setWinBackPack =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setWinBackPack({ data: params }));
  };

/**
 * To set the winBack pack
 *
 * @function restrictAmount
 * @returns {void}
 */
export const restrictAmount =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const MIN = 200;
    const MAX = 49000;
    const text = params?.amount;
    const numeric = text.replace(/[^0-9]/g, '');

    if (!numeric) {
      dispatch(formActions.setUpdatedFormFields({ monthlyRecharge: '' }));
      return;
    }

    const value = Number(numeric);

    if (value < MIN) {
      dispatch(formActions.setUpdatedFormFields({ monthlyRecharge: String(MIN) }));
      return;
    }
    if (value > MAX) {
      dispatch(formActions.setUpdatedFormFields({ monthlyRecharge: String(MAX) }));
      return;
    }
    dispatch(formActions.setUpdatedFormFields({ monthlyRecharge: numeric }));
  };
