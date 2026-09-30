/**
 * in this user can check their tsk details
 *
 * @module store/sales/actions/tskVoucher
 *
 */
import { sliceActions } from 'store/sales/reducer/tskVoucher';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { sliceActions as quotationAction } from 'store/sales/reducer/quotation';
import { refactorResponse } from 'utils/responseHelper';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, PROPERTIES, STATE_KEY } from 'const';
import { ParentObject } from 'store/sales/types/common';
import commonAction from 'store/sales/actions/common';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
// import formAction from 'store/sales/actions/form';
import { sliceActions as formActions } from 'store/sales/reducer/form';
import i18next from 'i18next';
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(modelForTskVoucher({ exampleParam: 'exampleValue' }));
 */
export const modelForTskVoucher = (): AppThunk => (dispatch) => {
  dispatch(formActions.setDropdownData({ data: PROPERTIES.TSK_VOUCHER.DATA, queryName: 'tskType', stateKey: STATE_KEY.MODAL_STATE }));

  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.TSK_VOUCHER,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.tskVoucher,
      headerIcon: ICONS.TSK_VOUCHER,
      buttonInfo: {
        goToHome: true,
      },
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
 * dispatch(getTSKDetails({ exampleParam: 'exampleValue' }));
 */
export const getTSKDetails =
  (param: ParentObject): AppThunk =>
  (dispatch) => {
    if (!param?.VoucherType) {
      dispatch(commonAction.setErrorMessage(`${i18next.t('strings.voucherType')}`));
      return false;
    }
    dispatch(uiActions.setModalLoader());
    const requestedInput = {
      input: {
        voucherNumber: param?.TSKNo,
        voucherType: param?.VoucherType?.id,
      },
    };
    return api
      .post(queries.getTskVoucherDetails, requestedInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.TSKVoucher.TSKVoucherTSKNoProceed.moduleName, {
          [MoengageMixpanelModules.TSKVoucher.TSKVoucherTSKNoProceed.attributes.Status]: true,
          [MoengageMixpanelModules.TSKVoucher.TSKVoucherTSKNoProceed.attributes.iD]: param?.TSKNo,
        });
        const data = refactorResponse(response);
        dispatch(sliceActions.tskVoucherDetails(data.result));
        dispatch(quotationAction.quotationEtskSetPincode(param?.TSKNo));
        return { status: true };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(commonAction.setErrorMessage(error?.message));
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };
