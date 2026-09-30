/**
 * in this distributer can insert the enquery details
 *
 * @module store/sales/actions/exclusiveStore
 *
 */
import { sliceActions as quotationAction } from 'store/sales/reducer/quotation';
import { sliceActions as customerService } from 'store/sales/reducer/customerService';
import formActions from 'store/sales/actions/form';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { ACTION_TYPE, ALERT, CHILD_TYPE, CONNECTION_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, PROPERTIES, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import { sliceActions } from 'store/sales/reducer/exclusiveStore';
import { callAction } from 'utils/formBuilderHelper';
import i18next from 'i18next';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getWalkInDetailsData({ exampleParam: 'exampleValue' }));
 */

export const getWalkInDetailsData = (): AppThunk => (dispatch) => {
  dispatch(formActions.setRadioContainerOptions(PROPERTIES.EXCLUSIVE_STORE.WALK_IN, QUERY.GetWalkInDetailsData));
  dispatch(sliceActions.setActionType(STRINGS.WALK_IN));
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.WALK_IN_DETAILS,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.walkInDetails,
      headerIcon: ICONS.WALK_IN,
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
 * dispatch(setWalkInDetails({ exampleParam: 'exampleValue' }));
 */
export const setWalkInDetails =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      sliceActions.setNewConnectionDetails({
        subID: '',
        pinCode: '',
        mobNo: '',
        emailAddress: '',
      }),
    );
    dispatch(quotationAction.quotationEtskSetPincode(params?.campaign));
    dispatch(formActions.setRadioContainerOptions(PROPERTIES.EXCLUSIVE_STORE.CONNECTION_TYPE, QUERY.GetNewConnectionType));
    let formName = '';
    switch (params?.campaign) {
      case STRINGS.NEW_CONNECTION:
        formName = FORMS.newConnectionDetails;
        break;

      case STRINGS.RECHARGE:
        formName = FORMS.rechargeLead;
        break;

      case STRINGS.SERVICE_COMPLAINT:
        formName = FORMS.serviceComplaintLead;
        break;

      case STRINGS.ENQUIRY_NEW_CONNECTION:
        dispatch(formActions.setUpdatedFormFields({ subscriberRmn: '', subscriberEmail: '' }, STATE_KEY.MODAL_STATE));
        formName = FORMS.newConnectionEnquiryDetails;
        break;

      case STRINGS.ENQUIRY_PACK:
        formName = FORMS.packEnquiryDetails;
        break;

      case STRINGS.SALES_VAS:
        formName = FORMS.salesOfValueLead;
        break;

      case STRINGS.BOX_UPGRADE:
        formName = FORMS.boxUpgradeDetailsLead;
        break;

      case STRINGS.GENERAL_ENQUIRY:
        formName = FORMS.generalEnquiryLead;
        break;

      default:
        formName = FORMS.walkinDetailsLead;
        break;
    }

    dispatch(uiActions.hideBottomModal());
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.WALK_IN_DETAILS,
        showCloseIcon: true,
        showHeader: true,
        formName,
        headerIcon: ICONS.WALK_IN,
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
 * dispatch(getOverThePhoneLeadDetails({ exampleParam: 'exampleValue' }));
 */
export const getOverThePhoneLeadDetails =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(formActions.setRadioContainerOptions(PROPERTIES.EXCLUSIVE_STORE.WALK_IN, QUERY.GetWalkInDetailsData));
    dispatch(sliceActions.setActionType(STRINGS.OVER_THE_PHONE));

    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.OVER_THE_PHONE,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.overThePhoneDetails,
        headerIcon: ICONS.OVER_THE_PHONE,
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
 * dispatch(setOverThePhoneLead({ exampleParam: 'exampleValue' }));
 */
export const setOverThePhoneLead =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      sliceActions.setNewConnectionDetails({
        subID: '',
        pinCode: '',
        mobNo: '',
        emailAddress: '',
      }),
    );
    dispatch(quotationAction.quotationEtskSetPincode(params?.campaign));
    dispatch(formActions.setRadioContainerOptions(PROPERTIES.EXCLUSIVE_STORE.CONNECTION_TYPE, QUERY.GetNewConnectionType));
    let formName = '';
    switch (params?.campaign) {
      case STRINGS.NEW_CONNECTION:
        formName = FORMS.newConnectionDetailsWithoutDemo;
        break;

      case STRINGS.RECHARGE:
        formName = FORMS.rechargeLeadWithoutDemo;
        break;

      case STRINGS.SERVICE_COMPLAINT:
        formName = FORMS.serviceComplaintLeadWithoutDemo;
        break;

      case STRINGS.ENQUIRY_NEW_CONNECTION:
        formName = FORMS.newConnectionEnquiryDetailsWithoutDemo;
        break;

      case STRINGS.ENQUIRY_PACK:
        formName = FORMS.packEnquiryDetailsWithoutDemo;
        break;

      case STRINGS.SALES_VAS:
        formName = FORMS.salesOfValueLeadWithoutDemo;
        break;

      case STRINGS.BOX_UPGRADE:
        formName = FORMS.boxUpgradeDetailsLeadWithoutDemo;
        break;

      case STRINGS.GENERAL_ENQUIRY:
        formName = FORMS.generalEnquiryLeadWithoutDemo;
        break;

      default:
        formName = FORMS.walkinDetailsLead;
        break;
    }

    dispatch(uiActions.hideBottomModal());
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.OVER_THE_PHONE,
        showCloseIcon: true,
        showHeader: true,
        formName,
        headerIcon: ICONS.OVER_THE_PHONE,
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
 * dispatch(getTeleCallingData({ exampleParam: 'exampleValue' }));
 */
export const getTeleCallingData = (): AppThunk => (dispatch) => {
  dispatch(formActions.setRadioContainerOptions(PROPERTIES.EXCLUSIVE_STORE.WALK_IN, QUERY.GetWalkInDetailsData));
  dispatch(sliceActions.setActionType(STRINGS.TELE_CALLING));

  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.TELE_CALLING_DETAILS,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.teleCallingDetails,
      headerIcon: ICONS.TELE_CALLING,
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
 * dispatch(setTeleCallingDetails({ exampleParam: 'exampleValue' }));
 */
export const setTeleCallingDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      sliceActions.setNewConnectionDetails({
        subID: '',
        pinCode: '',
        mobNo: '',
        emailAddress: '',
      }),
    );
    dispatch(quotationAction.quotationEtskSetPincode(params?.campaign));
    dispatch(formActions.setRadioContainerOptions(PROPERTIES.EXCLUSIVE_STORE.CONNECTION_TYPE, QUERY.GetNewConnectionType));
    let formName = '';
    switch (params?.campaign) {
      case STRINGS.NEW_CONNECTION:
        formName = FORMS.newConnectionDetailsWithoutDemo;
        break;

      case STRINGS.RECHARGE:
        formName = FORMS.rechargeLeadWithoutDemo;
        break;

      case STRINGS.SERVICE_COMPLAINT:
        formName = FORMS.serviceComplaintLeadWithoutDemo;
        break;

      case STRINGS.ENQUIRY_NEW_CONNECTION:
        formName = FORMS.newConnectionEnquiryDetailsWithoutDemo;
        break;

      case STRINGS.ENQUIRY_PACK:
        formName = FORMS.packEnquiryDetailsWithoutDemo;
        break;

      case STRINGS.SALES_VAS:
        formName = FORMS.salesOfValueLeadWithoutDemo;
        break;

      case STRINGS.BOX_UPGRADE:
        formName = FORMS.boxUpgradeDetailsLeadWithoutDemo;
        break;

      case STRINGS.GENERAL_ENQUIRY:
        formName = FORMS.generalEnquiryLeadWithoutDemo;
        break;

      default:
        formName = FORMS.walkinDetailsLead;
        break;
    }

    dispatch(uiActions.hideBottomModal());
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.TELE_CALLING_DETAILS,
        showCloseIcon: true,
        showHeader: true,
        formName,
        headerIcon: ICONS.TELE_CALLING,
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
 * dispatch(getOutboundActivityLeadData({ exampleParam: 'exampleValue' }));
 */
export const getOutboundActivityLeadData = (): AppThunk => (dispatch) => {
  dispatch(formActions.setRadioContainerOptions(PROPERTIES.EXCLUSIVE_STORE.WALK_IN, QUERY.GetWalkInDetailsData));
  dispatch(sliceActions.setActionType(STRINGS.OUTBOUND_ACTIVITY));
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.OUT_BOUND_ACTIVITY,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.outBoundDetails,
      headerIcon: ICONS.OUTBOUND_LEAD,
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
 * dispatch(setOutBoundDetails({ exampleParam: 'exampleValue' }));
 */
export const setOutBoundDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      sliceActions.setNewConnectionDetails({
        subID: '',
        pinCode: '',
        mobNo: '',
        emailAddress: '',
      }),
    );
    dispatch(quotationAction.quotationEtskSetPincode(params?.campaign));
    dispatch(formActions.setRadioContainerOptions(PROPERTIES.EXCLUSIVE_STORE.CONNECTION_TYPE, QUERY.GetNewConnectionType));
    let formName = '';
    switch (params?.campaign) {
      case STRINGS.NEW_CONNECTION:
        formName = FORMS.newConnectionDetails;
        break;

      case STRINGS.RECHARGE:
        formName = FORMS.rechargeLead;
        break;

      case STRINGS.SERVICE_COMPLAINT:
        formName = FORMS.serviceComplaintLead;
        break;

      case STRINGS.ENQUIRY_NEW_CONNECTION:
        formName = FORMS.newConnectionEnquiryDetails;
        break;

      case STRINGS.ENQUIRY_PACK:
        formName = FORMS.packEnquiryDetails;
        break;

      case STRINGS.SALES_VAS:
        formName = FORMS.salesOfValueLead;
        break;

      case STRINGS.BOX_UPGRADE:
        formName = FORMS.boxUpgradeDetailsLead;
        break;

      case STRINGS.GENERAL_ENQUIRY:
        formName = FORMS.generalEnquiryLead;
        break;

      default:
        formName = FORMS.walkinDetailsLead;
        break;
    }

    dispatch(uiActions.hideBottomModal());
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.OUT_BOUND_ACTIVITY,
        showCloseIcon: true,
        showHeader: true,
        formName,
        headerIcon: ICONS.OUTBOUND_LEAD,
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
 * dispatch(submitWalkinDetails({ exampleParam: 'exampleValue' }));
 */
export const submitWalkinDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const { etskPincode } = getState().quotation;
    const { actionType } = getState().exclusiveStore;
    dispatch(uiActions.setModalLoader());
    const requestedInput = {
      input: {
        partnerId: info?.userId || '',
        subscriberId: params?.subscriberID || '',
        mobileNumber: params?.subscriberRmn || '',
        customerName: params?.subscriberName || '',
        pincode: params?.pinCode || '',
        connectionType: params?.connectionType || '',
        boxType: null,
        emailAddress: params?.subscriberEmail || '',
        reason: params?.reason || '',
        remarks: params?.remark || '',
        modName: actionType || '',
        typeOfWalkIn: etskPincode || '',
      },
    };
    return api
      .post(queries.walkInInsertProcedure, requestedInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (response.status) {
          dispatch(uiActions.clearLoader());
          dispatch(uiActions.hideBottomModal());
          if (actionType === STRINGS.SPECIAL_COMMENTS) {
            const alertMessage = `${i18next.t('strings.specialCommentSuccess')}`;
            MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.moduleName, {
              [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.Status]: true,
              [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.modName]: actionType || '',
              [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.partnerId]: info?.userId || '',
              [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.reason]: params?.reason || '',
              [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.remarks]: params?.remark || '',
            });
            return dispatch(
              uiActions.showAlert(
                alertMessage,
                ALERT.SUCCESS,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                },
                {},
              ),
            );
          }
          if (etskPincode === STRINGS.GENERAL_ENQUIRY) {
            const alertMessage = `${i18next.t('strings.submitSuccess')}`;
            return dispatch(
              uiActions.showAlert(
                alertMessage,
                ALERT.SUCCESS,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                },
                {},
              ),
            );
          }

          MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreWalkInDetailsPageProceed.moduleName, {
            [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreWalkInDetailsPageProceed.attributes.Status]: true,
            [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreWalkInDetailsPageProceed.attributes.FormName]: etskPincode,
          });
          switch (etskPincode) {
            case STRINGS.NEW_CONNECTION:
              navigate(ROUTE.WEB.PRIMARY_TV_REGISTRATION);
              break;
            case STRINGS.RECHARGE:
              setTimeout(() => {
                dispatch(formActions.setUpdatedFormFields({ subscriberInfo: params?.subscriberID }));
              }, 400);
              navigate(ROUTE.WEB.CUSTOMER_RECHARGE);
              break;
            case STRINGS.SERVICE_COMPLAINT:
              dispatch(customerService.setSubscriberData({ accountInfo: { subId: params?.subscriberID } }));
              navigate(ROUTE.WEB.CUSTOMER_SERVICE);
              break;
            case STRINGS.ENQUIRY_NEW_CONNECTION:
              if (params?.connectionType === CONNECTION_TYPE.PRIMARY) {
                dispatch(quotationAction.setisWalkIn(true));
                dispatch(quotationAction.quotationEtskSetPincode(params?.pinCode));
              }
              if (params?.connectionType === STRINGS.MULTI) {
                dispatch(quotationAction.setisWalkIn(true));
                dispatch(quotationAction.setIsMultiTv(true));
                setTimeout(() => {
                  dispatch(formActions.setUpdatedFormFields({ subscriberInfo: params?.subscriberID }, STATE_KEY.MODAL_STATE));
                }, 600);
              }
              navigate(ROUTE.WEB.QUOTATION);
              break;
            case STRINGS.ENQUIRY_PACK:
              setTimeout(() => {
                dispatch(formActions.setUpdatedFormFields({ subscriberId: params?.subscriberID }, STATE_KEY.MODAL_STATE));
              }, 400);
              navigate(ROUTE.WEB.MODIFY_PACK);
              break;
            case STRINGS.SALES_VAS:
              setTimeout(() => {
                dispatch(formActions.setUpdatedFormFields({ subscriberInfo: params?.subscriberID }));
              }, 400);
              navigate(ROUTE.WEB.CUSTOMER_OFFERS);
              break;
            case STRINGS.BOX_UPGRADE:
              setTimeout(() => {
                dispatch(formActions.setUpdatedFormFields({ subscriberInfo: params?.subscriberID }, STATE_KEY.MODAL_STATE));
              }, 400);
              navigate(ROUTE.WEB.BOX_UPGRADE);
              break;
            case STRINGS.GENERAL_ENQUIRY:
              dispatch(uiActions.hideBottomModal());
              break;
            default:
              dispatch(uiActions.hideBottomModal());
              break;
          }
        }
        return { status: true, data };
      })
      .catch((error) => {
        if (actionType === STRINGS.SPECIAL_COMMENTS) {
          const alertMessage = `${i18next.t('strings.specialCommentAlreadyPresent')}`;
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.moduleName, {
            [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.Status]: true,
            [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.modName]: actionType || '',
            [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.partnerId]: info?.userId || '',
            [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.reason]: params?.reason || '',
            [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsProceed.attributes.remarks]: params?.remark || '',
          });
          dispatch(uiActions.showErrorPage(alertMessage));
          return;
        }
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => {
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
 * dispatch(getSpecialCommentdata({ exampleParam: 'exampleValue' }));
 */
export const getSpecialCommentdata =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setActionType(STRINGS.SPECIAL_COMMENTS));
    return Promise.resolve({ status: true });
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getSpecialCommentsData({ exampleParam: 'exampleValue' }));
 */
export const getSpecialCommentsData =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    const currentDate = new Date().toLocaleDateString(STRINGS.DATE_FORMAT, PROPERTIES.SELECT_DATE);
    dispatch(formActions.setUpdatedFormFields({ dateInput: currentDate }));
    setTimeout(() => {
      dispatch(formActions.setFieldsToDisable({ fieldName: STRINGS.DATE_INPUT }));
    }, 100);
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getStoreOpeningStoreClosingData({ exampleParam: 'exampleValue' }));
 */
export const getStoreOpeningStoreClosingData =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    const requestedInput = {
      storeAction: STRINGS.CUSTOMER_DEMO,
    };
    return api
      .post(queries.getStoreOpeningClosingQues, requestedInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setDemoFormQuestions(data));
        dispatch(callAction({}, QUERY.multiTVBoxType, '', navigate));
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
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
 * dispatch(multiTVBoxType({ exampleParam: 'exampleValue' }));
 */
export const multiTVBoxType =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) =>
    api
      .post(queries.getMultiTvBoxType, params)
      .then((response) => {
        const data = refactorResponse(response);
        if (response.status) {
          dispatch(sliceActions.setMultiTvData(data));
        }
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });

export const getStoreOpeningQuestion = (): AppThunk => (dispatch) => {
  const requestedInput = {
    storeAction: ACTION_TYPE.STORE_OPEN,
  };
  dispatch(sliceActions.setIsStoreOpen(true));
  return api
    .post(queries.getStoreOpeningClosingQues, requestedInput)
    .then((response) => {
      const data = refactorResponse(response);
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreStoreOpen.moduleName, {
        [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreStoreOpen.attributes.Status]: true,
        [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreStoreOpen.attributes.storeOpen]: ACTION_TYPE.STORE_OPEN,
      });
      dispatch(sliceActions.exclusiveStoreOpenData(data));
      return { status: true };
    })
    .catch((error) => {
      dispatch(uiActions.clearLoader());
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
 * dispatch(getStoreClosingQuestion({ exampleParam: 'exampleValue' }));
 */
export const getStoreClosingQuestion = (): AppThunk => (dispatch) => {
  const requestedInput = {
    storeAction: ACTION_TYPE.STORE_CLOSE,
  };
  dispatch(sliceActions.setIsStoreOpen(false));
  return api
    .post(queries.getStoreOpeningClosingQues, requestedInput)
    .then((response) => {
      const data = refactorResponse(response);
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreStoreClose.moduleName, {
        [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreStoreClose.attributes.Status]: true,
        [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreStoreClose.attributes.storeClose]: ACTION_TYPE.STORE_CLOSE,
      });
      dispatch(sliceActions.exclusiveStoreOpenData(data));
      return { status: true };
    })
    .catch((error) => {
      dispatch(uiActions.clearLoader());
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
 * dispatch(checkStoreStatus({ exampleParam: 'exampleValue' }));
 */
export const checkStoreStatus =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const requestedDate = {
      partnerId: info?.userId,
      closeOrOpenVal: params?.actionType,
    };
    return api
      .post(queries.getStoreOpeningSelProcedure, requestedDate)
      .then((response) => {
        const data = refactorResponse(response);
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
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
 * dispatch(submitStoreAns({ exampleParam: 'exampleValue' }));
 */
export const submitStoreAns =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const questionID = params?.questionId;
    const ans = Array.isArray(params?.answer) ? params.answer.join(',') : String(params?.answer ?? '');
    const requestedDate = {
      input: {
        partnerId: info?.userId || '',
        answeredVal: ans,
        questionId: questionID.toString(),
        storeAction: params?.action,
      },
    };
    return api
      .post(queries.submitStoreAns, requestedDate)
      .then((response) => ({ status: true, response }))
      .catch((error) => {
        dispatch(uiActions.clearLoader());
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
 * dispatch(submitDemoForm({ exampleParam: 'exampleValue' }));
 */
export const submitDemoForm =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const { actionType } = getState().exclusiveStore;
    const { etskPincode } = getState().quotation;
    const requestedDate = {
      input: {
        answeredVal: params?.finalData?.answers,
        boxType: params?.finalData?.connectionType || '',
        connectionType: params?.finalData?.connectionProvider || '',
        customerName: params?.finalData?.name,
        emailAddress: params?.finalData?.email,
        existingSubId: params?.finalData?.existingBox,
        mobileNumber: params?.finalData?.mobileNumber,
        modName: actionType,
        multiBoxType: params?.finalData?.multiTVConnection,
        multiTVConnection: params?.finalData?.multiTVConnectionType,
        partnerId: info?.userId || '',
        questionId: params?.finalData?.questions,
        storeAction: STRINGS.CUSTOMER_DEMO,
        subscriberId: params?.finalData?.subscriberId,
        typeOfWalkIn: etskPincode,
      },
    };

    return api
      .post(queries.submitDemoForm, requestedDate)
      .then((response) => {
        if (response.status) {
          const alertMessage = `${i18next.t('strings.submitSuccess')}`;
          dispatch(uiActions.showAlert(alertMessage, ALERT.SUCCESS, { primaryText: MODAL.OK }, {}));
          navigate(ROUTE.WEB.EXCLUSIVE_STORE);
        }
        const alertMessage = `${i18next.t('strings.submitSuccess')}`;
        return dispatch(uiActions.showAlert(alertMessage, ALERT.SUCCESS, { primaryText: MODAL.OK }, {}));
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
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
 * dispatch(changeExclusiveAction({ exampleParam: 'exampleValue' }));
 */
export const changeExclusiveAction = (): AppThunk => (dispatch, getState) => {
  const { actionType } = getState().exclusiveStore;
  switch (actionType) {
    case STRINGS.WALK_IN:
      dispatch(callAction({}, QUERY.GetWalkInDetailsData));
      break;
    case STRINGS.OVER_THE_PHONE:
      dispatch(callAction({}, QUERY.GetOverThePhoneLeadDetails));
      break;
    case STRINGS.TELE_CALLING:
      dispatch(callAction({}, QUERY.GetTeleCallingData));
      break;
    case STRINGS.OUTBOUND_ACTIVITY:
      dispatch(callAction({}, QUERY.GetOutboundActivityLeadData));
      break;
    default:
      dispatch(callAction({}, QUERY.GetWalkInDetailsData));
      break;
  }
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setNewConnectionDetails({ exampleParam: 'exampleValue' }));
 */
export const setNewConnectionDetails =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setNewConnectionDetails(params));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getNewConnectionDetails({ exampleParam: 'exampleValue' }));
 */
export const getNewConnectionDetails =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { newConnectionDetails } = getState().exclusiveStore;
    dispatch(sliceActions.setNeedValidation(true));
    if (params?.connectionType === CONNECTION_TYPE.PRIMARY) {
      setTimeout(() => {
        dispatch(
          formActions.setUpdatedFormFields(
            {
              pinCode: newConnectionDetails?.pinCode,
              subscriberRmn: newConnectionDetails?.mobNo,
              subscriberEmail: newConnectionDetails?.emailAddress,
            },
            STATE_KEY.MODAL_STATE,
          ),
        );
      }, 400);
    }
    if (params?.connectionType === STRINGS.MULTI) {
      setTimeout(() => {
        dispatch(
          formActions.setUpdatedFormFields(
            {
              subscriberID: newConnectionDetails?.subID,
              subscriberRmn: newConnectionDetails?.mobNo,
              subscriberEmail: newConnectionDetails?.emailAddress,
            },
            STATE_KEY.MODAL_STATE,
          ),
        );
      }, 400);
    }
  };
