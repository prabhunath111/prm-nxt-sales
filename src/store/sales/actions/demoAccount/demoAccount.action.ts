/**
 * In this reducer we will manage all demo account creation related information
 *
 * @module store/sales/actions/demoAccount
 *
 */
import { sliceActions } from 'store/sales/reducer/demoAccount';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, PROPERTIES, QUERY, STRINGS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import commonActions from 'store/sales/actions/common';
import { callAction } from 'utils/formBuilderHelper';
import { ROLES, ROUTE } from 'const/strings';
import formActions from 'store/sales/actions/form';
import i18next from 'i18next';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

let demoAccountTimeoutId: ReturnType<typeof setTimeout>;

/**
 * Displays the Work order recreation modal.
 *
 * @function customerOfferModal
 * @returns {void}
 */

export const demoAccountCreationModal =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_PageVisit.moduleName, {
      [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_PageVisit.attributes.Status]: true,
    });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.DEMO_ACCOUNT,
        showCloseIcon: params?.showCloseIcon ?? true,
        showHeader: true,
        formName: FORMS.demoAccount,
        headerIcon: ICONS.DEMO_ACCOUNT,
      }),
    );
  };

export const demoAccountETSKModal =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.DemoAccountCreation.DemoAccountETSKRepush_PageVisit.moduleName, {
      [MoengageMixpanelModules.DemoAccountCreation.DemoAccountETSKRepush_PageVisit.attributes.Status]: true,
    });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.DEMO_ACC_ETSK,
        showCloseIcon: params?.showCloseIcon ?? true,
        showHeader: true,
        formName: FORMS.demoAccountEtsk,
        headerIcon: ICONS.ETSK_REPUSH,
      }),
    );
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(checkDealerEligibilityForDemo({ exampleParam: 'exampleValue' }));
 */
export const checkDealerEligibilityForDemo =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      input: {
        dealerId: params?.subscriberInfo,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_ValidateDistributor_DealerCode.moduleName, {
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_ValidateDistributor_DealerCode.attributes.Status]: true,
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_ValidateDistributor_DealerCode.attributes.dealerId]: params?.subscriberInfo,
        });
        dispatch(sliceActions.setDemoAccountEVDCode(params?.subscriberInfo));
        const reponseEligibleCount = data?.response.eligibility[0].ELIGIBILE_COUNT;
        const reponseEligibleCountInt = Number(reponseEligibleCount);
        if (reponseEligibleCount === null || reponseEligibleCount === '' || reponseEligibleCount === '0') {
          const errorMessage = `${i18next.t('strings.dealerIdNotEligibleDemo')}`;
          dispatch(commonActions.setErrorMessage(errorMessage));
          return { status: false, data };
        }
        if (reponseEligibleCountInt > 0) {
          dispatch(sliceActions.setDemoAccountDealerDetails(data));
          dispatch(uiActions.clearLoader());
          dispatch(formActions.setRadioContainerOptions(PROPERTIES.DEMO_ACCOUNT_CREATION.TYPE_OF_DEMO, QUERY.GetNewConnectionType));
          return { status: true, data };
        }
        return { status: false, data };
      })
      .catch((error: any) => {
        dispatch(commonActions.setErrorMessage(error.message));
        return { status: false, message: error.message };
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
 * dispatch(tskPinValidateForDemo({ exampleParam: 'exampleValue' }));
 */
export const tskPinValidateForDemo =
  (params: ParentObject, queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const { demoAccountDealerDetails } = getState().demoAccount;
    dispatch(uiActions.setLoader());
    if (params?.connectionType === STRINGS.ETSK) {
      dispatch(sliceActions.setIsETSK(true));
      dispatch(sliceActions.setSetUpBox(params?.primaryBoxType?.nameNT));
      dispatch(callAction({ tskPin: params?.tskPin, isEtskDemoAcc: true, boxType: params?.primaryBoxType?.nameNT }, QUERY.DoDemoAccountCreationAndTSKRegistration, '', navigate));
      return { status: true };
    }
    const requestInput = {
      input: {
        TSKPin: params?.tskPin,
        boxType: params?.primaryBoxType?.nameNT,
        dealerId: demoAccountDealerDetails?.response?.eligibility?.[0]?.DLR_ID,
        pincode: demoAccountDealerDetails?.response?.dealerDetails?.pincode,
        userName: info?.userId,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (params?.connectionType !== STRINGS.ETSK) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Tsk_Validation.moduleName, {
            [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Tsk_Validation.attributes.Status]: true,
            [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Tsk_Validation.attributes.TSKPin]: params?.tskPin,
            [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Tsk_Validation.attributes.dealerId]: demoAccountDealerDetails?.response?.eligibility?.[0]?.DLR_ID,
          });
        }
        dispatch(uiActions.clearLoader());
        dispatch(sliceActions.setTskValidationDetails({ ...data, tskPin: params?.tskPin }));
        dispatch(sliceActions.setSetUpBox(data?.response?.boxType));
        dispatch(callAction({ ...data?.response, tskPin: params?.tskPin, isEtskDemoAcc: false }, QUERY.DoDemoAccountCreationAndTSKRegistration, '', navigate));
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
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
 * dispatch(doDemoAccountCreationAndTSKRegistration({ exampleParam: 'exampleValue' }));
 */
export const doDemoAccountCreationAndTSKRegistration =
  (params: ParentObject, queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    demoAccountTimeoutId = setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, 200);
    const { info } = getState().user;
    const { demoAccountDealerDetails, evdCode } = getState().demoAccount;
    const dealerDetails = demoAccountDealerDetails?.response?.dealerDetails;
    const parts = (dealerDetails?.nameNT ?? '').split(' ');
    const requestInput = {
      input: {
        TSKPin: params?.tskPin,
        accountHolderDealerId: evdCode,
        accountHolderRole: dealerDetails?.roleIdNT,
        addressLine1: dealerDetails?.addressLine1NT,
        addressLine2: dealerDetails?.addressLine2NT,
        boxType: params?.boxType,
        buildingName: '',
        city: dealerDetails?.cityNT,
        district: dealerDetails?.districtNT,
        country: STRINGS.INDIA,
        emailAddress: '',
        firstName: parts[0] || '',
        landmark: '',
        lastName: parts.length > 1 ? parts[parts.length - 1] : '',
        mobileNo: dealerDetails?.mobileNo,
        param1: '',
        param2: '',
        param3: '',
        param4: '',
        pincode: dealerDetails?.pincode,
        source: STRINGS.MOBDESKTOP,
        state: dealerDetails?.stateNT,
        town: dealerDetails?.townNT,
        type: ROLES.ad,
        userName: info?.userId,
        isEtskDemoAcc: params?.isEtskDemoAcc,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formActions.setMultipleDropdownOptionsData({ offerCategory: data?.response?.offerCategory }));
        dispatch(sliceActions.setPackDetails(data));
        dispatch(
          formActions.setDealerDetails({
            subscriberId: data?.response?.subID,
            customerName: demoAccountDealerDetails?.response?.dealerDetails?.name,
          }),
        );
        dispatch(uiActions.clearLoader());
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Pickpack_PageVisit.moduleName, {
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Pickpack_PageVisit.attributes.Status]: true,
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Pickpack_PageVisit.attributes.TSKPin]: params?.tskPin,
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Pickpack_PageVisit.attributes.boxType]: params?.boxType,
        });
        navigate(ROUTE.WEB.DEMO_ACCOUNT_SUMMARY);
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => {
        if (demoAccountTimeoutId) {
          clearTimeout(demoAccountTimeoutId);
        }
        dispatch(uiActions.clearLoader());
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
 * dispatch(checkForCategory({ exampleParam: 'exampleValue' }));
 */

export const checkForCategory =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { packDetails } = getState().demoAccount;
    const packList = packDetails?.response?.packageName?.[0];
    const hasCategory = params?.null || params?.offerName;
    return Promise.resolve()
      .then(() => {
        if (hasCategory === packList?.OfferCategoryNT) {
          dispatch(
            formActions.setMultipleDropdownOptionsData({
              packageInfo: packList?.PackageInfo,
            }),
          );
        }
        return { status: true, message: '' };
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
 * dispatch(doPickPackAndWorkOrderCreationPrimary({ exampleParam: 'exampleValue' }));
 */
export const doPickPackAndWorkOrderCreationPrimary =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const { demoAccountDealerDetails, packDetails, isETSK } = getState().demoAccount;
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        dealerCodePrimary: packDetails?.response?.dealerCode,
        orderId: '',
        productName: params?.packageName?.nameNT,
        productName1: [],
        productName2: [],
        rechargeAmount: '',
        subID: packDetails?.response?.subID,
        tskSerialNumber: packDetails?.response?.tskSerialNumber || null,
        type: ROLES.ad,
        userName: info?.userId,
        bookingFormNo: isETSK ? packDetails?.response?.bookingFormNumber : null,
      },
    };
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Pickpack_Proceed.moduleName, {
      [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Pickpack_Proceed.attributes.Status]: true,
      [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Pickpack_Proceed.attributes.SubscriberID]: packDetails?.response?.subID,
      [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Pickpack_Proceed.attributes.dealerCodePrimary]: packDetails?.response?.dealerCode,
      [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Pickpack_Proceed.attributes.tskSerialNumber]: packDetails?.response?.tskSerialNumber || null,
    });
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(
          formActions.setDealerDetails({
            subscriberId: packDetails?.response?.subID,
            customerName: demoAccountDealerDetails?.response?.dealerDetails?.name,
          }),
        );
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Success_PageVisit.moduleName, {
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Success_PageVisit.attributes.Status]: true,
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Success_PageVisit.attributes.SubscriberID]: packDetails?.response?.subID,
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Success_PageVisit.attributes.dealerCodePrimary]: packDetails?.response?.dealerCode,
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountCreation_Success_PageVisit.attributes.tskSerialNumber]: packDetails?.response?.tskSerialNumber || null,
        });
        dispatch(sliceActions.setDemoAccountSuccessData(data?.response));
        dispatch(uiActions.clearLoader());
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const validateDemoAcEtsk =
  (params: ParentObject, queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      bookingFormNumber: params?.bookingFormNumberRepush,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.DemoAccountCreation.DemoAccountETSKRepush_Validate.moduleName, {
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountETSKRepush_Validate.attributes.Status]: true,
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountETSKRepush_Validate.attributes.bookingFormNumber]: params?.bookingFormNumberRepush,
        });
        dispatch(uiActions.hideBottomModal());
        dispatch(formActions.setMultipleDropdownOptionsData({ offerCategory: data?.response?.offerCategory }));
        dispatch(sliceActions.setPackDetails(data));
        dispatch(sliceActions.setIsETSK(true));
        dispatch(sliceActions.setSetUpBox(data?.response?.boxType?.boxTypeNT));
        dispatch(sliceActions.setDemoAccountDealerDetails(data));
        dispatch(
          formActions.setDealerDetails({
            subscriberId: data?.response?.subID,
            customerName: data?.response?.dealerDetails?.name,
          }),
        );
        dispatch(uiActions.clearLoader());
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.DemoAccountCreation.DemoAccountETSKRepushPickPack_PageVisit.moduleName, {
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountETSKRepushPickPack_PageVisit.attributes.Status]: true,
          [MoengageMixpanelModules.DemoAccountCreation.DemoAccountETSKRepushPickPack_PageVisit.attributes.bookingFormNumber]: params?.bookingFormNumberRepush,
        });
        navigate(ROUTE.WEB.DEMO_ACCOUNT_ETSK_SUMMARY);
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(commonActions.setErrorMessage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => {
        if (demoAccountTimeoutId) {
          clearTimeout(demoAccountTimeoutId);
        }
        dispatch(uiActions.clearLoader());
      });
  };
