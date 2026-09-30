/**
 * manage invoice transaction history
 *
 * @module store/sales/actions/invoice
 *
 */
import uiActions from 'store/sales/actions/ui';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions as invoiceAction, sliceActions } from 'store/sales/reducer/invoice';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import formActions from 'store/sales/actions/form';
import { LOG } from 'config/logger';
import { ParentObject } from 'store/sales/types/common';
import { callAction, filterByParams } from 'utils/formBuilderHelper';
import { ALERT, CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, QUERY, STRINGS } from 'const';
import commonActions from 'store/sales/actions/common';
import { handleWebViewUrl } from 'utils/navigationHelper';
import { Sizing } from 'styles';
import { ROLES, ROUTE, STATE_KEY } from 'const/strings';
import i18n from 'config/i18n';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import i18next from 'i18next';

/**
 * Displays the Work order recreation modal.
 *
 * @function customerOfferModal
 * @returns {void}
 */

export const customerInvoiceModal =
  (params: ParentObject): AppThunk =>
  (dispatch) =>
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.CUSTOMER_INVOICE,
        showCloseIcon: params?.showCloseIcon || true,
        showHeader: true,
        formName: FORMS.customerInvoice,
        headerIcon: ICONS.CUSTOMER_INVOICE,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );

/**
 * Represents an asynchronous action to fetch and process transaction history data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 */
export const invoiceTransactions =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    const input = {
      type: STRINGS.USER,
      subscriberId: '',
    };
    return api
      .get(queries[queryName], { ...params, ...input })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formAction.setSearchBarItems({ queryName, data: data?.info }));
        dispatch(invoiceAction.setInvoiceTransactions({ data: data?.info }));
        dispatch(invoiceAction.setCloseView(false));
        return { data, status: true };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        LOG.info(error);
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process transaction history data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 */
export const getInvoiceTransactions =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    if (!/^[A-Z0-9]+$/.test(params?.transactionID)) {
      dispatch(commonActions.setErrorMessage(i18next.t('validations.subscriberInfoNumeric') as unknown as string));
      return null;
    }
    const { info } = getState().user;
    dispatch(uiActions.setModalLoader());
    if (!params?.keepFalse) {
      dispatch(invoiceAction.setCloseView(true));
    }
    if (params?.transactionID.length > 10) {
      dispatch(uiActions.setModalLoader());
      dispatch(sliceActions.setTransactionId({ transactionId: params?.transactionID }));
      if ([ROLES.asm, ROLES.asi, ROLES.csm].includes(info.internalRole)) {
        dispatch(callAction({ transactionId: params?.transactionID, isDownload: params?.isDownload }, QUERY.GetURLforInvoiceTransactions));
      } else {
        dispatch(callAction({}, QUERY.GetGstInvoiceByUserId))
          ?.then((response: ParentObject) => {
            if (response?.status) {
              MoengageMixpanel.trackEvent(MoengageMixpanelModules.customerInvoice.GetInvoiceByTransactionID.moduleName, {
                [MoengageMixpanelModules.customerInvoice.GetInvoiceByTransactionID.attributes.Status]: true,
                [MoengageMixpanelModules.customerInvoice.GetInvoiceByTransactionID.attributes.SubscriberID]: info?.userId || '',
                [MoengageMixpanelModules.customerInvoice.GetInvoiceByTransactionID.attributes.transactionId]: params?.transactionID,
              });
              dispatch(callAction({ transactionId: params?.transactionID, isDownload: params?.isDownload }, QUERY.GetURLforInvoiceTransactions));
            }
            return { status: false };
          })
          .catch((error: any) => {
            dispatch(commonActions.setErrorMessage(error.message));
            return { status: false, data: [] };
          });
      }
    } else {
      const input = {
        type: STRINGS.SUBSCRIBER,
        subscriberId: params?.transactionID,
      };
      dispatch(uiActions.setModalLoader());
      return api
        .get(queries[QUERY.InvoiceTransactions], input)
        .then((response) => {
          const data = refactorResponse(response);
          if (data?.info) {
            dispatch(formAction.setSearchBarItems({ queryName: QUERY.InvoiceTransactions, data: data?.info }));
            dispatch(invoiceAction.setInvoiceTransactions({ data: data?.info }));
            dispatch(uiActions.hideBottomModal());
            navigate(ROUTE.WEB.INVOICE_TRANSACTION);
            MoengageMixpanel.trackEvent(MoengageMixpanelModules.customerInvoice.GetInvoiceBySubscriberID.moduleName, {
              [MoengageMixpanelModules.customerInvoice.GetInvoiceBySubscriberID.attributes.Status]: true,
              [MoengageMixpanelModules.customerInvoice.GetInvoiceBySubscriberID.attributes.SubscriberID]: params?.transactionID,
              [MoengageMixpanelModules.customerInvoice.GetInvoiceBySubscriberID.attributes.transactionId]: data?.info?.[0]?.transactionId || '',
              [MoengageMixpanelModules.customerInvoice.GetInvoiceBySubscriberID.attributes.amount]: data?.info?.[0]?.amount || '',
              [MoengageMixpanelModules.customerInvoice.GetInvoiceBySubscriberID.attributes.transactionDate]: data?.info?.[0]?.transactionDate || '',
              [MoengageMixpanelModules.customerInvoice.GetInvoiceBySubscriberID.attributes.bingeRechargeFlag]: data?.info?.[0]?.bingeRechargeFlag || false,
            });
            return { data, status: true };
          }
          dispatch(uiActions.hideBottomModal());
          return { status: false };
        })
        .catch((error) => {
          dispatch(commonActions.setErrorMessage(error.message));
          LOG.info(error);
          return { status: false };
        })
        .finally(() => dispatch(uiActions.clearLoader()));
    }
    return null;
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(searchInvoiceTransactions({ exampleParam: 'exampleValue' }));
 */

export const searchInvoiceTransactions =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { invoiceTransactions } = getState().invoice;
    const requestInput = {
      subscriberId: params?.searchText,
      transactionId: params?.searchText,
      amount: params?.searchText,
      transactionDate: params?.searchText,
      bingeRechargeFlag: params?.searchText,
    };
    const filteredData = filterByParams(invoiceTransactions, requestInput);
    dispatch(formAction.setSearchBarItems({ queryName: QUERY.InvoiceTransactions, data: filteredData }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getURLforInvoiceTransactions({ exampleParam: 'exampleValue' }));
 */
export const getURLforInvoiceTransactions =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    if (params?.hideModal) {
      dispatch(uiActions.hideBottomModal());
    }
    if (params?.isDownload) {
      dispatch(uiActions.setLoader());
    } else {
      dispatch(uiActions.setModalLoader());
    }
    dispatch(callAction({ transactionId: params?.transactionId, isDownload: params?.isDownload || false }, QUERY.GetInvoiceURL))
      ?.then((response: ParentObject) => {
        if (response?.status) {
          handleWebViewUrl(response?.invoiceUrl, true);
          return { response, status: true };
        }
        return { status: false };
      })
      .catch((error: any) => {
        dispatch(commonActions.setErrorMessage(error.message));
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
 * dispatch(getGstInvoiceByUserId({ exampleParam: 'exampleValue' }));
 */
export const getGstInvoiceByUserId =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) =>
    api
      .post(queries[QUERY.GetGstInvoiceByUserId], {})
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setInvoiceGSTdata(data));
        return { response, status: true };
      })
      .catch(() => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.clearLoader());
        const { gstTransactionId } = getState().invoice;
        setTimeout(() => {
          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              isCenterModal: true,
              type: CHILD_TYPE.LABEl,
              headerIcon: ICONS.WARNING_EXCLAMATION,
              showCloseIcon: true,
              showHeader: true,
              buttonInlineStyle: true,
              onClose: () => dispatch(callAction({}, QUERY.CustomerInvoiceModal)),
              buttonInfo: {
                showCenteredHeaderIcon: true,
                primaryButtonLabel: MODAL.UPDATE_GST_NUMBER,
                secondaryButtonLabel: MODAL.PROCEED_WITHOUT_GST,
                hasOutline: true,
                queryName: QUERY.GstConfirmation,
                centerLabel: true,
                childData: i18n.t('strings.pleaseUpdateGSTNumber'),
                secondaryQueryParams: { transactionId: gstTransactionId?.transactionId, isDownload: true, hideModal: true },
                secondaryQueryName: QUERY.GetURLforInvoiceTransactions,
              },
            }),
          );
        }, Sizing.x400);
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(gstConfirmation({ exampleParam: 'exampleValue' }));
 */
export const gstConfirmation = (): AppThunk => async (dispatch) => {
  dispatch(uiActions.hideBottomModal());
  dispatch(uiActions.clearLoader());
  dispatch(
    uiActions.showBottomModal({
      isCenterModal: true,
      isModalVisible: true,
      type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
      headerTitle: FORMS.gstDetails,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.gstDetails,
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
 * dispatch(gstConfirmation({ exampleParam: 'exampleValue' }));
 */
export const gstConfirmationProfile = (): AppThunk => async (dispatch) => {
  dispatch(uiActions.hideBottomModal());
  dispatch(uiActions.clearLoader());
  dispatch(
    uiActions.showBottomModal({
      isCenterModal: true,
      isModalVisible: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: FORMS.gstDetails,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.gstDetailsProfile,
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
 * dispatch(gstConfirmation({ exampleParam: 'exampleValue' }));
 */
export const fillinGstTypeAndNumber = (): AppThunk => (dispatch, getState) => {
  const { gstData } = getState().invoice;
  dispatch(formActions.setUpdatedFormFields({ dealerType: gstData?.dealerType, gstNumber: gstData?.gstNumber }, STATE_KEY.MODAL_STATE));
};
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(gstConfirmation({ exampleParam: 'exampleValue' }));
 */
export const fillInGSTNumber = (): AppThunk => (dispatch, getState) => {
  const { gstData } = getState().invoice;
  if (gstData?.gstNumber) {
    dispatch(formActions.setUpdatedFormFields({ gstNumber: gstData?.gstNumber }, STATE_KEY.MODAL_STATE));
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
 * dispatch(updateGst({ exampleParam: 'exampleValue' }));
 */
export const updateGst =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { closeView, gstTransactionId } = getState().invoice;
    const requestObject = {
      input: {
        gstNumber: params?.gstNumber,
        gstRemarks: params?.dealerType,
      },
    };
    return api
      .post(queries[queryName], requestObject)
      .then((response) => {
        dispatch(uiActions.hideBottomModal());
        const data = refactorResponse(response);
        dispatch(
          uiActions.showAlert(
            i18n.t('strings.gstUpdateSuccessMessage'),
            ALERT.SUCCESS,
            {
              primaryText: MODAL.OK,
              clearForm: true,
              closeView,
              queryParams: { transactionId: gstTransactionId?.transactionId, isDownload: true, hideModal: true },
              queryName: QUERY.GetURLforInvoiceTransactions,
            },
            {},
          ),
        );
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
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
 * dispatch(updateGst({ exampleParam: 'exampleValue' }));
 */
export const updateGstFromInvoice =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { closeView, gstTransactionId, comingFromInvoice } = getState().invoice;
    dispatch(invoiceAction.setComingFromInvoice(!comingFromInvoice));
    const requestObject = {
      input: {
        gstNumber: params?.gstNumber,
        gstRemarks: params?.dealerType,
      },
    };
    return api
      .post(queries[queryName], requestObject)
      .then((response) => {
        dispatch(uiActions.hideBottomModal());
        const data = refactorResponse(response);
        dispatch(
          uiActions.showAlert(
            i18n.t('strings.gstUpdateSuccessMessage'),
            ALERT.SUCCESS,
            {
              primaryText: MODAL.OK,
              clearForm: true,
              closeView,
              queryParams: { transactionId: gstTransactionId?.transactionId, isDownload: true, hideModal: true },
              queryName: QUERY.GetURLforInvoiceTransactions,
            },
            {},
          ),
        );
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const getGstDetailsByUserId = (): AppThunk => (dispatch) => {
  dispatch(uiActions.setModalLoader());

  return api
    .get(queries.getGstDetailsByUserId, {})
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(sliceActions.setGSTData({ gstNumber: data?.gstNumber, dealerType: data?.dealerType }));
      return { data, status: true };
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
      LOG.info(error);
      return { status: false };
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
 * dispatch(updateGst({ exampleParam: 'exampleValue' }));
 */
export const updateGstProfile =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    const requestObject = {
      input: {
        gstNumber: params?.dealerType === STRINGS.UNREGISTERED ? null : params?.gstNumber,
        gstRemarks: params?.dealerType,
      },
    };
    return api
      .post(queries.updateGst, requestObject)
      .then(async (response) => {
        if (response?.status) {
          dispatch(uiActions.hideBottomModal());
          const data = refactorResponse(response);
          const responseData = await dispatch(getGstDetailsByUserId());
          const message = params?.dealerType === STRINGS.UNREGISTERED ? STRINGS.GST_UNREGISTERED : STRINGS.GST_UPDATED_SUCCESSFULLY;
          if (responseData) {
            dispatch(
              uiActions.showBottomModal({
                isModalVisible: true,
                type: CHILD_TYPE.LABEl,
                headerTitle: HEADER_TITLE.CONFIRMATION,
                showCloseIcon: true,
                showHeader: false,
                buttonInfo: {
                  primaryButtonLabel: MODAL.OK,
                  childData: message,
                  centerLabel: true,
                },
              }),
            );
          }
          return data;
        }
        dispatch(commonActions.setErrorMessage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const validateGST =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const clearValue = params?.gst.replace(/[^A-Za-z0-9]/g, '');
    dispatch(formActions.setUpdatedFormFields({ gstNumber: clearValue, transactionID: clearValue }, STATE_KEY.MODAL_STATE));
  };
