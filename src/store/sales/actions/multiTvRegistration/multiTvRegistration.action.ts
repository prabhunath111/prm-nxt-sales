/**
 * In this reducer we will manage all multiTV registration related items
 *
 * @module store/sales/actions/multiTvRegistration
 *
 */
import { sliceActions } from 'store/sales/reducer/multiTvRegistration';
import { sliceActions as etskActions } from 'store/sales/reducer/etskMultiTv';
import { sliceActions as etskAction, sliceActions as etskRegistration } from 'store/sales/reducer/etskRegistration';
import { sliceActions as quotationAction } from 'store/sales/reducer/quotation';
import { sliceActions as woRecreationAction } from 'store/sales/reducer//woRecreation';
import { sliceActions as boxUpgradeAction } from 'store/sales/reducer/boxUpgrade';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { refactorResponse } from 'utils/responseHelper';
import { sliceActions as regActions } from 'store/sales/reducer/etskRegSchedular';
import { ParentObject } from 'store/sales/types/common';
import formActions from 'store/sales/actions/form';
import { ACCOUNT_INFO, ALERT, CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import i18next from 'i18next';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

export const clearFormMultiTv = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setTskPinParams({}));
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(tskPinValidateAdapterSecondaryOCS({ exampleParam: 'exampleValue' }));
 */

export const handelAlertConfirmationMultiTV = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setDifferentBox(true));
};
export const tskPinValidateAdapterSecondaryOCS =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { multiTvBoxType, multiTVregisterFromQuote } = getState().quotation;
    const { differentBox } = getState().multiTvRegistration;
    if (multiTVregisterFromQuote && !differentBox) {
      if (multiTvBoxType?.id !== params?.secondaryBoxType?.id) {
        const alertMessage = i18next.t('errors.boxTypeChangeConfirmation');
        dispatch(
          uiActions.showAlert(
            alertMessage,
            ALERT.CONFIRM,
            {
              primaryText: MODAL.CONFIRM,
              isSecondaryRequire: true,
              queryName: 'handelAlertConfirmationMultiTV',
              secondaryText: MODAL.CANCEL,
            },
            {},
          ),
        );
        return false;
      }
    }

    const { tskPinParams } = getState().multiTvRegistration;
    if (tskPinParams?.secondaryBoxType?.name) {
      dispatch(uiActions.setModalLoader());
    } else {
      dispatch(uiActions.setLoader());
    }
    const boxType = params?.secondaryBoxType?.name || tskPinParams?.secondaryBoxType?.name;
    const requestInput = {
      tskPin: params?.secondaryTskPin || tskPinParams?.secondaryTskPin,
      subId: params?.subscriberID || params?.multiSubId,
      boxType,
      type: STRINGS.EVD,
      flag: STRINGS.LDP,
      bingPackDetails: null,
    };
    dispatch(sliceActions.setTskPinParams(params));
    dispatch(sliceActions.setTskValidateRequestInput(requestInput));

    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationValidateTSK.moduleName, {
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationValidateTSK.attributes.Status]: true,
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationValidateTSK.attributes.SubscriberID]: params?.subscriberID || params?.multiSubId,
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationValidateTSK.attributes.boxType]: boxType,
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationValidateTSK.attributes.tskPin]: params?.secondaryTskPin || tskPinParams?.secondaryTskPin,
        });
        const isSuccess = data?.status === true || data?.result?.status === true;
        const customerInfo = data?.result?.customerInformation;
        dispatch(sliceActions.setDifferentBox(true));
        if (!isSuccess) {
          dispatch(
            formActions.setUpdatedFormFields({
              subscriberID: '',
              secondaryTskPin: '',
              secondaryBoxType: '',
            }),
          );
          dispatch(uiActions.hideBottomModal());
          dispatch(uiActions.showErrorPage(data?.message));
          return { status: false };
        }

        const subscriberData = {
          subscriberId: data.result?.subID,
          customerName: data.result?.customerInformation?.customerName,
        };
        const customerData = {
          customerName: customerInfo?.customerName,
          mobileNo: customerInfo?.mobileNo,
          emailAddress: customerInfo?.email ?? (customerInfo?.emailAddress !== 'NA' ? customerInfo?.emailAddress : null),
          language: customerInfo?.language,
          sec_lang: customerInfo?.secondaryLang,
          pincode: customerInfo?.pincode,
          addressLine1: customerInfo?.addressLine1,
          state: customerInfo?.state,
          city: customerInfo?.city,
          district: customerInfo?.district !== 'NA' ? customerInfo?.district : '',
        };
        const subIdList = data?.result?.accountInfo?.subIdList;

        if (subIdList) {
          dispatch(uiActions.hideBottomModal());
          dispatch(formActions.setSubIdList(subIdList));
          setTimeout(
            () =>
              dispatch(
                uiActions.showBottomModal({
                  isModalVisible: true,
                  type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
                  headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
                  showCloseIcon: true,
                  showHeader: true,
                  formName: FORMS.multiTvSubIdList,
                  buttonInfo: {
                    goToHome: true,
                  },
                }),
              ),
            500,
          );

          dispatch(
            formActions.setUpdatedFormFields({
              subscriberID: params?.subscriberID,
              secondaryTskPin: params?.secondaryTskPin,
              secondaryBoxType: params?.secondaryBoxType,
            }),
          );
          return { status: false, data };
        }

        dispatch(
          formActions.setUpdatedFormFields({
            subscriberID: params?.subscriberID,
          }),
        );

        dispatch(etskActions.etskMultiTvSetSubscriberId(data?.result?.subID));
        dispatch(formActions.setDealerDetails(subscriberData));
        dispatch(etskActions.etskMultiTvSetSubscriberData(data?.result));
        dispatch(etskActions.etskMultiTvSetBoxTypeSelected(params.secondaryBoxType?.name));
        dispatch(etskAction.etskSetBoxTypeSelected(boxType));
        dispatch(etskActions.etskMultiTvSetBoxTypeSelected(boxType));

        dispatch(sliceActions.setTskValidateData({ ...data?.result, subscriberID: data.result?.subID }));
        // Just for testing need to be removed once testing is done
        dispatch(etskActions.etskSetMultiBoxSelectedDetails({ ...data?.result }));
        dispatch(etskAction.etskSetCustomerDetailsData(customerData));
        dispatch(uiActions.hideBottomModal());
        dispatch(quotationAction.quotationsetMultiTVRegistration(false));
        navigate(ROUTE.WEB.MULTI_TV_SUMMAARY);
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(
          formActions.setUpdatedFormFields({
            secondaryTskPin: '',
            secondaryBoxType: multiTVregisterFromQuote ? multiTvBoxType : '',
          }),
        );
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(multiTvRegistrationModal({ exampleParam: 'exampleValue' }));
 */
export const multiTvRegistrationModal =
  (params: ParentObject): AppThunk =>
  (dispatch) =>
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.MULTI_TV_REGISTRATION,
        showCloseIcon: params?.showCloseIcon || true,
        showHeader: true,
        formName: FORMS.multiTvRegistration,
        headerIcon: ICONS.MULTI_TV_ACCOUNT_PINK,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(retrieveMultiTvBoxType({ exampleParam: 'exampleValue' }));
 */
export const retrieveMultiTvBoxType =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { multiTVregisterFromQuote, multiTvBoxType } = getState().quotation;
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationPageVisit.moduleName, {
      [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationPageVisit.attributes.Status]: true,
    });
    return api
      .post(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);

        const dropdownDataName = data?.result?.boxType;
        if (multiTVregisterFromQuote) {
          dispatch(formActions.setFieldsToDisable({ fieldName: ACCOUNT_INFO.subscriberID }));
          dispatch(formActions.setUpdatedFormFields({ secondaryBoxType: multiTvBoxType }));
          dispatch(formAction.setDropdownOptionsData({ data: dropdownDataName, queryName }));
          return { status: false };
        }
        dispatch(sliceActions.setDifferentBox(true));
        dispatch(quotationAction.quotationPrimarySetBoxTypeData(data?.result?.boxType));
        dispatch(formAction.setDropdownOptionsData({ data: dropdownDataName, queryName }));
        dispatch(formAction.setDropdownOptionsData({ data: dropdownDataName, queryName: QUERY.BoxTypesFilter }));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(multiTvWorkOrderConfirmation({ exampleParam: 'exampleValue' }));
 */

export const multiTvWorkOrderConfirmation =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { evdPin } = params;
    const amount = params.rechargeAmount;
    const { finalPrice, boxTypeSelected } = getState().etskRegistration;
    const { tskValidateData } = getState().multiTvRegistration;

    const { selectedSlot, timeSlotsData } = getState().etskRegSchedular || {};
    const { boxSelectedDetails } = getState().etskMultiTv;

    const [startTime, endTime] = (selectedSlot ?? '').split(' - ');

    const message = i18next.t('strings.amountDeductionMsg', { amount });

    const requestInput = {
      subscriberId: tskValidateData?.subID,
      packageName: tskValidateData?.packToAdd,
      rechargeAmount: Math.ceil(Number(amount)).toString(),
      assetNumber: tskValidateData?.tskSerial,
      type: STRINGS.EVD,
      requiredRechargeAmount: finalPrice,
      rechargeEvdPin: evdPin,
      flexiFlag: '0',
      dhamakaMulRechBalChk: boxSelectedDetails?.disableEditRechDhamakaMultiTV === STRINGS.YES ? STRINGS.DM : STRINGS.DL,
      startTime: startTime || null,
      endTime: endTime || null,
      ocsFlag: tskValidateData?.ocsFlag || STRINGS.NO,
      taskId: timeSlotsData?.taskId ?? null,
      boxType: boxTypeSelected,
    };

    dispatch(etskRegistration.etskSetPaidPrice(amount));
    dispatch(etskRegistration.etskSetEvdPin(evdPin));
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
          queryName: QUERY.DoPickPackAndWorkOrderCreationSecondary,
          queryParams: { ...requestInput },
          secondaryQueryName: QUERY.RechargeDetails,
          secondaryQueryParams: FORMS.multiTvRechargeDetails,
          hasOutline: true,
        },
      }),
    );

    return { params, status: true };
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(doPickPackAndWorkOrderCreationSecondary({ exampleParam: 'exampleValue' }));
 */

export const doPickPackAndWorkOrderCreationSecondary =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { formNavigationData } = getState().form[STATE_KEY.FORM_STATE];
    const { workOrderDetails, tskAllDetails } = getState().woRecreation;
    const { subId, tskDetails } = getState().boxTypeChange;
    const { boxSelectedDetails } = getState().etskMultiTv;
    let packArray = '';
    boxSelectedDetails?.packageNameArray.forEach((pack: ParentObject) => {
      const key = pack.packName;
      if (key?.toLowerCase().includes(i18next.t('strings.network'))) {
        return;
      }
      packArray = key;
    });
    let updatedParams: ParentObject = { ...params };
    if (formNavigationData?.params?.routeName === ROUTE.WEB.WO_MULTI_TV_SUMMARY) {
      updatedParams = {
        ...params,
        boxType: formNavigationData?.params?.woBoxType || '',
        assetNumber: tskAllDetails?.tskDetails?.[0]?.TskSno,
        packageName: packArray,
        subscriberId: workOrderDetails?.info?.[0]?.sub_id,
        moduleName: STRINGS.WO_RECREATION,
      };
    }
    if (formNavigationData?.params?.routeName === ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY) {
      updatedParams = {
        ...params,
        boxType: formNavigationData?.params?.woBoxType || '',
        subscriberId: subId || '',
        assetNumber: tskDetails?.[0]?.TskSno || '',
        packageName: boxSelectedDetails?.packageNameArray?.[0]?.packName || '',
      };
    }

    dispatch(uiActions.setModalLoader());
    dispatch(etskRegistration.etskSetEvdPin(''));
    return api
      .post(queries.doPickPackAndWorkOrderCreationSecondary, updatedParams)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationSummaryProceed.moduleName, {
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationSummaryProceed.attributes.Status]: true,
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationSummaryProceed.attributes.SubscriberID]: subId,
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationSummaryProceed.attributes.assetNo]: tskDetails?.[0]?.TskSno || '',
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationSummaryProceed.attributes.boxType]: formNavigationData?.params?.woBoxType || '',
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationSummaryProceed.attributes.packageName]: boxSelectedDetails?.packageNameArray?.[0]?.packName || '',
          [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationSummaryProceed.attributes.rechargeAmount]: params?.rechargeAmount,
        });
        if (response?.status) {
          dispatch(regActions.setCreateWoEtskSuccessData(data));
          dispatch(woRecreationAction.setWoSuccessData(data));
          if (formNavigationData?.params?.routeName === ROUTE.WEB.WO_MULTI_TV_SUMMARY) {
            navigate(ROUTE.WEB.WORK_ORDER_RECREATION_SUCCEESS);
          }
          if (formNavigationData?.params?.routeName === ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY) {
            dispatch(boxUpgradeAction.setStatus(data?.message));
            dispatch(boxUpgradeAction.setTransactionID(data?.result?.transId));
            dispatch(boxUpgradeAction.setSRno(data?.woNumber));
            dispatch(boxUpgradeAction.setFinalRequiredAmount(params?.rechargeAmount));
            navigate(ROUTE.WEB.BOX_TYPE_SUCCESS);
          } else {
            navigate(ROUTE.WEB.MULTI_TV_SUCCESS);
          }
          return {
            status: true,
            routeName: formNavigationData?.params?.routeName === ROUTE.WEB.WO_MULTI_TV_SUMMARY ? ROUTE.WEB.WORK_ORDER_RECREATION_SUCCEESS : ROUTE.WEB.MULTI_TV_SUCCESS,
          };
        }

        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data?.message || response?.message));
        return { status: false, message: data?.message };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error?.message));
        return { status: false, message: error?.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
