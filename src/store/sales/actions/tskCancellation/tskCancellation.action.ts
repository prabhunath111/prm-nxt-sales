/**
 * for Tsk cancellation
 *
 * @module store/sales/actions/tskCancellation
 *
 */
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { ParentObject } from 'store/sales/types/common';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { ALERT, CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import queries from 'store/sales/query';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { callAction } from 'utils/formBuilderHelper';
import i18next from 'i18next';
import { sliceActions as tskCancellationActions } from 'store/sales/reducer/tskCancellation';

export const tskCancellationModal =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.hideBottomModal());
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_FORM,
        headerTitle: HEADER_TITLE.PHYSICAL_TSK_CANCELLATION,
        showCloseIcon: params?.showCloseIcon || true,
        showHeader: true,
        formName: FORMS.tskCancellation,
        headerIcon: ICONS.TSK_REFUND,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };
export const validateTskCancellationModal =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.PHYSICAL_TSK_CANCELLATION,
        showCloseIcon: params?.showCloseIcon || true,
        showHeader: true,
        formName: FORMS.validateTskCancellation,
        headerIcon: ICONS.TSK_REFUND,
        onClose: () => dispatch(callAction({}, QUERY.TskCancellationModal)),
      }),
    );
  };
export const validateTskPinForCancellation =
  (params: ParentObject): AppThunk =>
  async (dispatch) => {
    dispatch(uiActions.setModalLoader());
    return api
      .post(queries.validateTskPinForCancellation, { tskPin: params.cancellationTskPin })
      .then((response) => {
        const data = refactorResponse(response);
        const result = data?.result;
        const validateData = {
          ...result,
          tskPin: params.cancellationTskPin,
        };

        if (data?.status === true) {
          dispatch(uiActions.hideBottomModal());
          dispatch(tskCancellationActions.setCancelTskValidateData(validateData));
          return { status: true, data };
        }
        dispatch(commonActions.setErrorMessage(data.message));
        return { status: false, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        return { status: false, data: error };
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };
export const getCancellationTskData = (): AppThunk => (dispatch, getState) => {
  const { cancelTskValidateData } = getState().tskCancellation;
  setTimeout(() => {
    dispatch(
      formActions.setUpdatedFormFields(
        {
          cancellationTskType: cancelTskValidateData?.tskType,
          cancellationSerialNum: cancelTskValidateData?.tskSerialNumber,
          cancellationTskPrice: cancelTskValidateData?.price,
        },
        STATE_KEY.FORM_STATE,
      ),
    );
  }, 400);
};

export const confirmCancelTSK = (): AppThunk => (dispatch) => {
  const alertMessage = `${i18next.t('alertMessages.disclaimerCancelTSK')}`;
  dispatch(
    uiActions.showAlert(
      alertMessage,
      ALERT.CONFIRM,
      {
        primaryText: MODAL.YES,
        secondaryText: MODAL.NO,
        isSecondaryRequire: true,
        queryName: QUERY.CancelTskPin,
        clearForm: false,
      },
      {},
    ),
  );
};

export const cancelTskPin = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setModalLoader());
  const { cancelTskValidateData } = getState().tskCancellation;
  return api
    .post(queries.cancelTskPin, { tskSerialNumber: cancelTskValidateData?.tskSerialNumber, tskPin: cancelTskValidateData.tskPin })
    .then((response) => {
      const data = refactorResponse(response);
      if (data.status === true) {
        dispatch(uiActions.hideBottomModal());
        dispatch(
          uiActions.showBottomModal({
            isModalVisible: true,
            isCenterModal: true,
            type: CHILD_TYPE.LABEl,
            headerTitle: HEADER_TITLE.PHYSICAL_TSK_CANCELLATION,
            showCloseIcon: true,
            showHeader: true,
            headerIcon: ICONS.TSK_REFUND,
            buttonInfo: {
              primaryButtonLabel: MODAL.OK,
              centerLabel: true,
              childData: data?.message,
              routeName: ROUTE.WEB.TSK_CANCELLATION,
              queryName: QUERY.TskCancellationModal,
            },
          }),
        );
        return { status: true, data };
      }
      dispatch(uiActions.hideBottomModal());
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          isCenterModal: true,
          type: CHILD_TYPE.LABEl,
          headerTitle: HEADER_TITLE.PHYSICAL_TSK_CANCELLATION,
          showCloseIcon: true,
          showHeader: true,
          headerIcon: ICONS.TSK_REFUND,
          buttonInfo: {
            primaryButtonLabel: MODAL.OK,
            centerLabel: true,
            childData: data?.message,
          },
        }),
      );
      return { status: false, data };
    })
    .catch((error) => {
      dispatch(uiActions.hideBottomModal());
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          isCenterModal: true,
          type: CHILD_TYPE.LABEl,
          headerTitle: HEADER_TITLE.PHYSICAL_TSK_CANCELLATION,
          showCloseIcon: true,
          showHeader: true,
          headerIcon: ICONS.TSK_REFUND,
          buttonInfo: {
            primaryButtonLabel: MODAL.OK,
            centerLabel: true,
            childData: error.message?.split(`${STRINGS.APOLLO_ERROR}:`)[1],
          },
        }),
      );
      return { status: false, data: error };
    })
    .finally(() => {
      dispatch(uiActions.clearLoader());
    });
};
