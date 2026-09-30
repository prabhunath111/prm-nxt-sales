/**
 * reducer for activation status module
 *
 * @module store/sales/actions/activationStatus
 *
 */
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { activationStatusType } from 'store/sales/types/activationStatus';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, PROPERTIES, STATE_KEY } from 'const';
import formActions from 'store/sales/actions/form';
import { refactorResponse } from 'utils/responseHelper';
import { sliceActions } from 'store/sales/reducer/activationStatus';
import { sliceActions as activationDetailActions } from 'store/sales/reducer/activationStatusDetails';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import commonActions from 'store/sales/actions/common';
import { ParentObject } from 'store/sales/types/common';
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
 * dispatch(activationStatusAction({ exampleParam: 'exampleValue' }));
 */

export const getActivationStatus =
  (params: activationStatusType): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    dispatch(commonActions.setErrorMessage(''));
    dispatch(activationDetailActions.setSubscriptionDetails([]));
    const { info } = getState().user;

    const inputParam = params.subscriberInfo || params.multiSubId;
    const firstDigit = inputParam?.charAt(0) || '';

    // Decide logic based on first digit
    const isRMN = firstDigit >= '6';

    // Choose query
    const query = isRMN ? queries.getAllSubscriberDetails : queries.getActivationStatus;

    // Choose params
    const queryParams = {
      input: isRMN
        ? { rmn: inputParam }
        : {
            evdId: info?.userId,
            rmn: '',
            source: PROPERTIES.ACTIVATION_STATUS.CONFIG.source,
            subscriberId: inputParam,
          },
    };

    return api
      .get(query, queryParams)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusSubIDRMNProceed.moduleName, {
          [MoengageMixpanelModules.ActivationStatus.ActivationStatusSubIDRMNProceed.attributes.evdId]: info?.userId,
          [MoengageMixpanelModules.ActivationStatus.ActivationStatusSubIDRMNProceed.attributes.subscriberId]: inputParam,
          [MoengageMixpanelModules.ActivationStatus.ActivationStatusSubIDRMNProceed.attributes.rmn]: inputParam || '',
        });
        dispatch(sliceActions.setActivationStatusData(data));

        // case: only one subId → call again with subId
        if (Array.isArray(data?.subIdList) && data.subIdList.length === 1) {
          const subId = data.subIdList[0].subscriberId;
          return dispatch(getActivationStatus({ subscriberInfo: subId }));
        }

        if (data?.subIdList) {
          dispatch(formActions.setSubIdList(data?.subIdList));
          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
              headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
              showCloseIcon: true,
              showHeader: true,
              formName: FORMS.activationStatusSubIdList,
              buttonInfo: {
                goToHome: true,
              },
            }),
          );
          return { status: false, data };
        }
        if (!data?.subList && isRMN) {
          dispatch(commonActions.setErrorMessage(i18next.t(`errors.noSubidForRmn`)));
          return { status: false, data };
        }
        const { subscriberId, customerName, customerRMN } = data;
        dispatch(formActions.setDealerDetails({ subscriberId, mdn: customerRMN, customerName }));

        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const showActivationStatusModal = (): AppThunk => (dispatch) => {
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.DYNAMIC_FORM,
      headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.activationStatus,
      buttonInfo: {
        goToHome: true,
      },
    }),
  );
};

export const getActivationStatusBCP =
  (params: activationStatusType): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    dispatch(commonActions.setErrorMessage(''));
    dispatch(sliceActions.setActivationStatusData(null));

    const queryParams = {
      input: {
        bookingFormNo: params.bcpBookingRefNo || '',
        tskPin: params.bcpTskPin || '',
      },
    };

    return api
      .get(queries.getActivationStatusBCP, queryParams)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setBcpActivationStatusData(data));

        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const activationStatusModal =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_FORM,
        headerTitle: HEADER_TITLE.ACTIVATION_STATUS,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.activationStatus,
        headerIcon: ICONS.ACTIVATION_STATUS_PINK,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

/**
 * method to fill in data in primary tv when user navigates to primary tv sub module
 *
 * @function fillInSubId
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const fillInSubId =
  (_params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    const { subIdFromNavigation } = getState().activationStatus;
    const id = subIdFromNavigation;
    if (subIdFromNavigation) {
      dispatch(formActions.setUpdatedFormFields({ subscriberInfo: id }, STATE_KEY.MODAL_STATE));
    }
    dispatch(sliceActions.setSubIdFromNavigation(''));
  };
