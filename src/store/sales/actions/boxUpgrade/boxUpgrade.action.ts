/**
 * This is the Reducer for work order recreation
 *
 * @module store/sales/actions/boxUpgrade
 *
 */
import { sliceActions } from 'store/sales/reducer/boxUpgrade';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, CHILD_TYPE, CONNECTION_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, QUERY, ROUTE, STATE_KEY, STRINGS, SUBSCRIBER_STATUS } from 'const';
import formActions from 'store/sales/actions/form';
import i18next from 'i18next';
import { callAction } from 'utils/formBuilderHelper';
import commonActions from 'store/sales/actions/common';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

let boxUpgradeTimeout: ReturnType<typeof setTimeout>;

export const clearTskPinTimeout = (): AppThunk => () => {
  if (boxUpgradeTimeout) {
    clearTimeout(boxUpgradeTimeout);
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
 * dispatch(modelForRMN({ exampleParam: 'exampleValue' }));
 */
export const modelForRMN = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setRechargeAmount(''));
  MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxUpgrade.BoxUpgrade_PageVisit.moduleName, {
    [MoengageMixpanelModules.BoxUpgrade.BoxUpgrade_PageVisit.attributes.Status]: true,
  });
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.BOX_UPGRADE,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.boxUpgrade,
      headerIcon: ICONS.BOX_UPGRADE,
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
 * dispatch(MultipleSubIdModal({ exampleParam: 'exampleValue' }));
 */
export const MultipleSubIdModal = (): AppThunk => (dispatch) => {
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.boxUpgradeSubIdList,
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
 * dispatch(getAccountInfoBoxUpgrade({ exampleParam: 'exampleValue' }));
 */
export const getAccountInfoBoxUpgrade =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      subscriberInfo: params?.subscriberInfo,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const { subIdList, subId, customerName, customerRMN, boxDetails, customerStatus } = data;
        if (
          customerStatus === i18next.t('subscriberStatus.Cancelled') ||
          customerStatus === i18next.t('subscriberStatus.CancelPending') ||
          customerStatus === i18next.t('subscriberStatus.Deactivated') ||
          customerStatus === i18next.t('subscriberStatus.Pending') ||
          customerStatus === i18next.t('subscriberStatus.Blacklisted') ||
          customerStatus === i18next.t('subscriberStatus.Suspended') ||
          customerStatus === i18next.t('subscriberStatus.TempSuspension')
        ) {
          dispatch(commonActions.setErrorMessage(`${i18next.t('errors.inactiveSubId')}`));
          return { status: false };
        }
        dispatch(formActions.setDealerDetails({ subscriberId: subId, mdn: customerRMN, customerName }));
        dispatch(sliceActions.setBoxUpgradeACInfoBoxData(data));
        if (subIdList) {
          const sortedSubIdList = [...subIdList].sort((a, b) => {
            if (a.status === SUBSCRIBER_STATUS.ACTIVE && b.status !== SUBSCRIBER_STATUS.ACTIVE) return -1;
            if (a.status !== SUBSCRIBER_STATUS.ACTIVE && b.status === SUBSCRIBER_STATUS.ACTIVE) return 1;
            return 0;
          });
          dispatch(uiActions.clearLoader());
          dispatch(formActions.setSubIdList(sortedSubIdList));
          dispatch(MultipleSubIdModal());
          return { status: false, data };
        }
        dispatch(sliceActions.setSubscriberID(subId));
        if (boxDetails.length <= 0) {
          return dispatch(commonActions.setErrorMessage(i18next.t('strings.boxUpgradeNotAllowed')));
        }
        const formattedDetails = boxDetails.map((box: ParentObject) => {
          const textValue = `${box.vcNumber}-${box.connectionTypeNT}-${box.boxTypeNT}`;
          const radioValue = `${box.vcNumber}-${box.connectionType}-${box.boxType}`;
          return {
            text: radioValue,
            value: textValue,
            connectionType: box.connectionTypeNT,
            boxType: box.boxTypeNT,
          };
        });
        const hasPrimaryAndroidBox = formattedDetails.some(
          (item: ParentObject) => item.connectionType === CONNECTION_TYPE.PRIMARY && item.boxType === i18next.t('strings.Android'),
        );
        if (hasPrimaryAndroidBox) {
          dispatch(commonActions.setErrorMessage(i18next.t('strings.boxUpgradeNotAllowed')));
          dispatch(uiActions.clearLoader());
          return { status: false };
        }
        const primaryBoxes = formattedDetails.filter((item: ParentObject) => item.connectionType === CONNECTION_TYPE.PRIMARY);
        const otherBoxes = formattedDetails.filter((item: ParentObject) => item.connectionType !== CONNECTION_TYPE.PRIMARY);
        const sortedDetails = [...primaryBoxes, ...otherBoxes];
        dispatch(sliceActions.setBoxData(sortedDetails));
        dispatch(formActions.setRadioContainerOptions(sortedDetails, QUERY.BoxUpgradeRadioData));
        if (sortedDetails) {
          dispatch(uiActions.clearLoader());
          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              isCenterModal: true,
              type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
              headerTitle: HEADER_TITLE.SELECT_BOX,
              showCloseIcon: true,
              showHeader: true,
              formName: FORMS.selectExitingBox,
              buttonInfo: {
                goToHome: true,
              },
            }),
          );
          return { response, status: true };
        }
        dispatch(uiActions.hideBottomModal());
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(commonActions.setErrorMessage(error.message));
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
 * dispatch(isEligibleForUpgrade({ exampleParam: 'exampleValue' }));
 */
export const isEligibleForUpgrade =
  (param: ParentObject): AppThunk =>
  (dispatch) =>
    api
      .post(queries.getEligibles, { boxType: param?.quality })
      .then((response) => {
        const { eligibilities } = refactorResponse(response);
        if (eligibilities.length > 0) {
          dispatch(sliceActions.setElegibles(eligibilities));
          return { status: true };
        }
        dispatch(
          uiActions.showBottomModal({
            isModalVisible: true,
            type: CHILD_TYPE.LABEl,
            headerTitle: HEADER_TITLE.BOX_UPGRADE,
            showCloseIcon: true,
            showHeader: true,
            headerIcon: ICONS.BOX_UPGRADE,
            buttonInfo: {
              primaryButtonLabel: MODAL.OK,
              childData: i18next.t('strings.notEligibleForBoxUpgrade'),
              queryName: QUERY.ModelForRMN,
            },
          }),
        );
        return { status: false };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        if (param.screen) {
          dispatch(sliceActions.setElegibles([]));
          return dispatch(
            uiActions.showAlert(
              error?.message?.split(`${STRINGS.APOLLO_ERROR}: `)[1] ?? error?.message,
              ALERT.ERROR,
              {
                primaryText: MODAL.OK,
                routeName: ROUTE.WEB.BOX_UPGRADE,
              },
              {},
            ),
          );
        }
        return dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(existingWorkOrder({ exampleParam: 'exampleValue' }));
 */
export const existingWorkOrder =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(sliceActions.setSelectedBox(params?.campaign));
    const [vcNumber, type, quality] = (params?.campaign || '').split('-');

    dispatch(sliceActions.setSelectedBoxVcNumber(vcNumber));
    dispatch(sliceActions.setSelectedBoxType(type));
    dispatch(sliceActions.setSelectedBoxConnectionType(quality));

    const { SubscriberID } = getState().boxUpgrade;
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      subscriberId: SubscriberID,
      vcNumber,
    };
    return api
      .post(queries.getExistingWO, requestInput)
      .then((response) => {
        const { workOrderDetails } = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxUpgrade.BoxUpgradeBoxselectionProceed.moduleName, {
          [MoengageMixpanelModules.BoxUpgrade.BoxUpgradeBoxselectionProceed.attributes.Status]: true,
          [MoengageMixpanelModules.BoxUpgrade.BoxUpgradeBoxselectionProceed.attributes.SubscriberID]: params?.subscriberInfo,
          [MoengageMixpanelModules.BoxUpgrade.BoxUpgradeBoxselectionProceed.attributes.vcNumber]: vcNumber,
        });
        if (quality === STRINGS.ANDROID) {
          return dispatch(isEligibleForUpgrade({ quality, screen: false }));
        }
        if (!workOrderDetails[0]) {
          return dispatch(isEligibleForUpgrade({ quality, screen: false }));
        }
        dispatch(sliceActions.setWoDetails(workOrderDetails));
        dispatch(
          uiActions.showBottomModal({
            isModalVisible: true,
            headerTitle: HEADER_TITLE.CONFIRMATION,
            showCloseIcon: true,
            showHeader: true,
            type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
            formName: FORMS.existingWorkOrder,
            buttonInfo: {
              primaryButtonLabel: MODAL.OK,
              queryName: QUERY.ModelForRMN,
            },
          }),
        );
        return { status: false };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
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
 * dispatch(proceedWithRechargeBox({ exampleParam: 'exampleValue' }));
 */
export const proceedWithRechargeBox = (): AppThunk => (dispatch) => {
  try {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.RECHARGE_BOX,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.proceedWithRecharge,
      }),
    );
  } catch (error) {
    dispatch(uiActions.clearLoader());
    dispatch(uiActions.hideBottomModal());
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
 * dispatch(ProceedWithConfirm({ exampleParam: 'exampleValue' }));
 */
export const ProceedWithConfirm =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.hideBottomModal());
    dispatch(sliceActions.setEVDPin(params?.EvdPinInput));
    const state = getState()?.boxUpgrade;
    const message = i18next.t('strings.amountDeductionMsgForBoxUpgrade', { amount: state?.paidAmount });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.LABEl,
        headerTitle: HEADER_TITLE.CONFIRMATION,
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: {
          primaryButtonLabel: MODAL.CONFIRM,
          secondaryButtonLabel: MODAL.BACK,
          childData: message,
          queryName: QUERY.FinalBoxUpgradation,
          secondaryQueryName: QUERY.proceedWithRechargeBox,
          hasOutline: true,
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
 * dispatch(getBingePlusData({ exampleParam: 'exampleValue' }));
 */
export const getBingePlusData =
  (param: string): AppThunk =>
  (dispatch) => {
    if (param) {
      return api
        .post(queries.getBingePlusOffer, { duration: param })
        .then((response) => {
          const { packageDetails } = refactorResponse(response);
          dispatch(sliceActions.setBingeOfferData(packageDetails));
          return { status: true };
        })
        .catch((error) => {
          dispatch(uiActions.clearLoader());
          dispatch(uiActions.hideBottomModal());
          dispatch(uiActions.showErrorPage(error.message));
        })
        .finally(() => {
          dispatch(uiActions.clearLoader());
        });
    }
    return Promise.resolve({ status: false });
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(finalBoxUpgradation({ exampleParam: 'exampleValue' }));
 */
export const finalBoxUpgradation =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { SubscriberID, vcNumber, upgradedToNT, paidAmount, evdPin, eligibles, bingeFlag, rechargeFlag, finalRequiredAmount } = getState().boxUpgrade;
    const matchedItem = eligibles.find((item: ParentObject) => item.NEW_BOXNT === upgradedToNT);
    const { SR_SUBAREANT, SR_TYPENT, DESCRIPTIONNT } = matchedItem;
    dispatch(uiActions.setModalLoader());
    clearTskPinTimeout();
    const requestInput = {
      input: {
        amount: Number(finalRequiredAmount),
        bingeFlag,
        boxType: upgradedToNT,
        recharge: rechargeFlag,
        rechargeEvdPin: evdPin,
        srSubArea: SR_SUBAREANT,
        srType: SR_TYPENT,
        subId: SubscriberID,
        vcNum: vcNumber,
        description: DESCRIPTIONNT,
        androidRechAmt: Number(paidAmount),
      },
    };
    return api
      .post(queries.finalSubmissonBoxUpgrade, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const { errorCode, transId, srNumberNT, message } = data;
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxUpgrade.BoxUpgradeChangeBoxType.moduleName, {
          [MoengageMixpanelModules.BoxUpgrade.BoxUpgradeChangeBoxType.attributes.Status]: true,
        });
        dispatch(sliceActions.setStatus(errorCode));
        dispatch(sliceActions.setTransactionID(transId));
        dispatch(sliceActions.setSRno(srNumberNT));
        dispatch(sliceActions.setSucessMsg(message));
        dispatch(uiActions.clearLoader());
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxUpgrade.BoxUpgradeRechargeConfirm.moduleName, {
          [MoengageMixpanelModules.BoxUpgrade.BoxUpgradeRechargeConfirm.attributes.Status]: true,
          [MoengageMixpanelModules.BoxUpgrade.BoxUpgradeRechargeConfirm.attributes.details]: requestInput,
        });
        navigate(ROUTE.WEB.BOX_UPGRADE_SUCCESS);
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false };
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
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
 * dispatch(showModifyPackModal({ exampleParam: 'exampleValue' }));
 */
export const showModifyPackModal = (): AppThunk => (dispatch) => {
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.DYNAMIC_FORM,
      headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.modifyPack,
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
 * dispatch(changeRechargeAmount({ exampleParam: 'exampleValue' }));
 */
export const changeRechargeAmount =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setPaidAmount(params?.rechargeAmount));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(backToRMNModal({ exampleParam: 'exampleValue' }));
 */
export const backToRMNModal =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(callAction({ ...params }, queryName, '', navigate));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setValueofExitsingBox({ exampleParam: 'exampleValue' }));
 */
export const getValueofExitsingBox = (): AppThunk => (dispatch, getState) => {
  const { accountInfoBoxData } = getState().boxUpgrade;
  const { boxDetails, subId } = accountInfoBoxData;
  const multiBoxMessage = i18next.t(boxDetails?.length === 1 ? 'strings.singleBoxUpgradeSubID' : 'strings.multipleBoxMessageUpgrade', { amount: subId });
  dispatch(formActions.setUpdatedFormFields({ lebelForMultipleBox: multiBoxMessage }, STATE_KEY.MODAL_STATE));
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getWODetails({ exampleParam: 'exampleValue' }));
 */
export const getWODetails = (): AppThunk => (dispatch, getState) => {
  const { woDetails } = getState().boxUpgrade;
  const message = i18next.t('strings.workOrderWithOutCancel', { amount: woDetails[0]?.woNo });
  dispatch(formActions.setUpdatedFormFields({ WOType: woDetails[0]?.woType, WOSubType: woDetails[0]?.woSubType, LebelforInfo: message }, STATE_KEY.MODAL_STATE));
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getRechargeDetails({ exampleParam: 'exampleValue' }));
 */
export const getRechargeDetails = (): AppThunk => (dispatch, getState) => {
  const { accountInfoBoxData, paidAmount, upgradedType } = getState().boxUpgrade;
  dispatch(formActions.setUpdatedFormFields({ rechargeAmount: paidAmount }, STATE_KEY.MODAL_STATE));
  if (upgradedType === STRINGS.HD) {
    boxUpgradeTimeout = setTimeout(() => dispatch(formActions.setFieldsToDisable({ fieldName: STRINGS.RECHARGE_AMOUNT_FIELD }, STATE_KEY.MODAL_STATE)), 300);
  }
  if (accountInfoBoxData?.isDhamakaEligible) {
    boxUpgradeTimeout = setTimeout(() => dispatch(formActions.setFieldsToDisable({ fieldName: STRINGS.RECHARGE_AMOUNT_FIELD }, STATE_KEY.MODAL_STATE)), 300);
  }
};
