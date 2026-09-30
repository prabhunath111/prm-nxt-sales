/**
 * This is the Reducer for work order recreation
 *
 * @module store/sales/actions/boxTypeChange
 *
 */
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import i18next from 'i18next';
import { sliceActions } from 'store/sales/reducer/boxTypeChange';
import { sliceActions as etskRegistrationActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as boxUpgradeAction } from 'store/sales/reducer/boxUpgrade';
import { sliceActions as primaryActions } from 'store/sales/reducer/primaryTvRegistration';
import { sliceActions as multiActions } from 'store/sales/reducer/etskMultiTv';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse, filterPackDetails, getDisabledCategoryMatch, getRechargeFlag, transformSelectedPacksArray } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, QUERY, CONNECTION_TYPE, PROPERTIES, STATE_KEY, ROUTE, STRINGS, ALERT } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

type TskBoxType = {
  boxType: string;
  tskSNum: string;
  VCType: string;
};

interface TskDetail {
  TskSno: string;
  VCType: string;
}
let boxTypeChangeTimeoutId: ReturnType<typeof setTimeout>;

function getWorkOrder(woDtls: ParentObject[]) {
  return woDtls.find((wo) => wo.status === `${i18next.t('strings.Unscheduled')}`) || woDtls.find((wo) => wo.status === `${i18next.t('subscriberStatus.Cancelled')}`) || null;
}

function determineOrderTypeFlags(subType: string, woTypesFromProp: string[]) {
  return {
    onlyPrimary: [woTypesFromProp[0], woTypesFromProp[5], woTypesFromProp[16]].includes(subType),
    onlySecondary1: [woTypesFromProp[1], woTypesFromProp[6], woTypesFromProp[9], woTypesFromProp[18], woTypesFromProp[19]].includes(subType),
    onlySecondary2: [woTypesFromProp[2], woTypesFromProp[7], woTypesFromProp[10], woTypesFromProp[13], woTypesFromProp[20], woTypesFromProp[21], woTypesFromProp[22]].includes(
      subType,
    ),
    onlySecondary3: [
      woTypesFromProp[3],
      woTypesFromProp[8],
      woTypesFromProp[11],
      woTypesFromProp[14],
      woTypesFromProp[15],
      woTypesFromProp[23],
      woTypesFromProp[24],
      woTypesFromProp[25],
      woTypesFromProp[26],
    ].includes(subType),
    onlyMulti: [woTypesFromProp[4], woTypesFromProp[12], woTypesFromProp[17]].includes(subType),
  };
}

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(clearTskPinTimeout({ exampleParam: 'exampleValue' }));
 */
export const clearTskPinTimeout = (): AppThunk => () => {
  if (boxTypeChangeTimeoutId) {
    clearTimeout(boxTypeChangeTimeoutId);
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
 * dispatch(modelForBoxTypeRMN({ exampleParam: 'exampleValue' }));
 */
export const modelForBoxTypeRMN = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setFirstFlag(true));
  dispatch(sliceActions.resetSelectBoxDetails());
  api
    .post(queries.getBoxTypesFromProps, {})
    .then((response) => {
      const { data } = refactorResponse(response);
      dispatch(sliceActions.setBoxTypeProps(data));
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          isCenterModal: true,
          type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
          headerTitle: HEADER_TITLE.BOX_TYPE_CHANGE,
          showCloseIcon: true,
          showHeader: true,
          formName: FORMS.boxTypeChangeRMN,
          headerIcon: ICONS.OLD_BOX_TYPE_CHANGE,
          buttonInfo: {
            goToHome: true,
          },
        }),
      );
    })
    .catch((error) => {
      dispatch(uiActions.clearLoader());
      dispatch(uiActions.hideBottomModal());
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
 * dispatch(showExitsingBox({ exampleParam: 'exampleValue' }));
 */
export const showExitsingBox = (): AppThunk => (dispatch) => {
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.SELECT_TSK,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.selectExitsingBoxType,
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
 * dispatch(getAccountInfoBoxTypeChange({ exampleParam: 'exampleValue' }));
 */
export const getAccountInfoBoxTypeChange =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    const subscriberId = params?.subscriberInfo;
    dispatch(sliceActions.setSubID(subscriberId));
    dispatch(uiActions.setModalLoader());
    dispatch(sliceActions.setPendingWo(false));
    return api
      .post(queries[queryName], { subscriberId })
      .then((response) => {
        const { subscriberList, tskDeatils } = refactorResponse(response);
        if (subscriberList?.length > 0) {
          dispatch(uiActions.clearLoader());
          dispatch(formActions.setSubIdList(subscriberList));
          dispatch(uiActions.clearLoader());
          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
              headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
              showCloseIcon: true,
              showHeader: true,
              formName: FORMS.boxtypeSubIDList,
              buttonInfo: {
                goToHome: true,
              },
            }),
          );
          return { status: false };
        }
        if (tskDeatils?.length !== 0) {
          if (tskDeatils[0]?.connectionType === CONNECTION_TYPE.PRIMARY && tskDeatils[0]?.bookingFormNo) {
            dispatch(commonActions.setErrorMessage(`${i18next.t('strings.boxTypeNotForEtsk')}`));
            dispatch(uiActions.clearLoader());
            return { status: false };
          }
        } else {
          dispatch(commonActions.setErrorMessage(`${i18next.t('strings.tskNotFromMsale')}`));
          dispatch(uiActions.clearLoader());
          return { status: false };
        }

        dispatch(callAction({ ...params }, QUERY.GetWorkOrderDetailsBoxType, '', navigate));
        return { status: false };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(commonActions.setErrorMessage(error.message));
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
 * dispatch(getWorkOrderDetailsBoxType({ exampleParam: 'exampleValue' }));
 */
export const getWorkOrderDetailsBoxType =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { subId, firstFlag, tskDetails } = getState().boxTypeChange;
    const requestInput = {
      subscriberId: params?.subscriberInfo || subId,
      vcNumber: '',
    };
    return api
      .post(queries.getExistingWO, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_CheckWOStatus.moduleName, {
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_CheckWOStatus.attributes.Status]: true,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_CheckWOStatus.attributes.SubscriberID]: params?.subscriberInfo || subId,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_CheckWOStatus.attributes.tskPin1]: tskDetails?.[0]?.TskSno,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_CheckWOStatus.attributes.vcNumber]: '',
        });

        const woStatus = data?.workOrderDetails?.[0]?.woStatus;
        if (woStatus === STRINGS.UNSCHEDULED) {
          if (!firstFlag) {
            dispatch(uiActions.clearLoader());
            dispatch(uiActions.showErrorPage(`${i18next.t('strings.workOrderStillNotCancelled')}`));
            return { response, status: false };
          }
          dispatch(sliceActions.setPendingWo(true));
          dispatch(sliceActions.setPendingWoDetails(data?.workOrderDetails?.[0]));
          dispatch(callAction({ ...params }, QUERY.TskStatusAllDetailsProcedure, '', navigate));
          return { response, status: true };
        }
        if (!firstFlag) {
          const alertMessage = `${i18next.t('strings.workOrderCancel')}`;
          dispatch(
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
        dispatch(sliceActions.setPendingWo(false));
        dispatch(callAction({ ...params }, QUERY.TskStatusAllDetailsProcedure, '', navigate));
        return { response, status: true };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
        return { status: false };
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
 * dispatch(cancelWorkorder({ exampleParam: 'exampleValue' }));
 */
export const cancelWorkorder =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { pendingWoDetails, subId } = getState().boxTypeChange;
    const requestInput = {
      input: {
        subscriberId: subId,
        woSubType: pendingWoDetails?.woSubType,
        woSalesType: pendingWoDetails?.woSalesType,
        woType: pendingWoDetails?.woType,
        workOrderNo: pendingWoDetails?.woNo,
      },
    };

    return api
      .post(queries.deleteWorkOrder, requestInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_WOcancellationConfirm.moduleName, {
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_WOcancellationConfirm.attributes.Status]: true,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_WOcancellationConfirm.attributes.SubscriberID]: subId,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_WOcancellationConfirm.attributes.woSalesType]: pendingWoDetails?.woSalesType,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_WOcancellationConfirm.attributes.woSubType]: pendingWoDetails?.woSubType,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_WOcancellationConfirm.attributes.woType]: pendingWoDetails?.woType,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_WOcancellationConfirm.attributes.workOrderNo]: pendingWoDetails?.woNo,
        });
        if (response?.status) {
          dispatch(uiActions.hideBottomModal());
          dispatch(sliceActions.setFirstFlag(false));
          dispatch(callAction(params, 'getBoxType', '', navigate));
          return { status: true };
        }
        return { status: false };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
        return { status: false };
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
 * dispatch(tskStatusAllDetailsProcedure({ exampleParam: 'exampleValue' }));
 */
export const tskStatusAllDetailsProcedure =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const { boxTypeProps, subId } = getState().boxTypeChange;
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      subscriberId: params?.subscriberInfo || subId,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const loginUserId = info?.userId;
        const tskDetailsArr = data.tskDetails;
        const { dealerDetails } = data;
        const accStatus = data.accountStatus;
        const woDtls = data.woDetails || [];
        const orderNumber = data?.eaiOrderDetails?.[0]?.orderNumber;
        if (data?.tskDetails?.length === 0) {
          dispatch(commonActions.setErrorMessage(`${i18next.t('strings.noDataFound')}`));
          dispatch(uiActions.clearLoader());
          return { status: false };
        }

        const authDealer = tskDetailsArr.every((tsk: ParentObject) => tsk.DealerCode === loginUserId);
        const authDealerRegChk = dealerDetails.some((dealer: ParentObject) => dealer.connectionType === CONNECTION_TYPE.PRIMARY && dealer.dealerCode === loginUserId);

        dispatch(sliceActions.setOderNumber(orderNumber));
        dispatch(etskRegistrationActions.etskClearSelectedPacksToBuyData());
        dispatch(sliceActions.setTskDetails(tskDetailsArr));
        if (authDealer || authDealerRegChk) {
          dispatch(
            formActions.setDealerDetails({
              subscriberId: params?.subscriberInfo || params?.woMultiSubId || subId,
              customerName: `${data?.accountDetails?.firstName} ${data?.accountDetails?.lastName}`,
            }),
          );
          if (woDtls.length > 0) {
            const woOrderSet = getWorkOrder(woDtls);
            if (woOrderSet) {
              const flags = determineOrderTypeFlags(woOrderSet?.SubType, boxTypeProps?.woType);
              dispatch(sliceActions.setFlags(flags));
              if (flags.onlyMulti) {
                if (accStatus !== `${i18next.t('subscriberStatus.Active')}`) {
                  dispatch(uiActions.clearLoader());
                  return dispatch(commonActions.setErrorMessage(`${i18next.t('strings.multiTVActNotActive')}`));
                }
              } else if (flags.onlyPrimary || flags.onlySecondary1 || flags.onlySecondary2 || flags.onlySecondary3) {
                if (accStatus !== `${i18next.t('subscriberStatus.Pending')}`) {
                  dispatch(uiActions.clearLoader());
                  return dispatch(commonActions.setErrorMessage(`${i18next.t('strings.actNotInPending')}`));
                }
              }
            } else {
              dispatch(uiActions.clearLoader());
              return dispatch(commonActions.setErrorMessage(`${i18next.t('strings.noUnscheduledWO')}`));
            }
          } else {
            dispatch(uiActions.clearLoader());
            return dispatch(commonActions.setErrorMessage(`${i18next.t('strings.noUnscheduledWO')}`));
          }
        } else {
          const woOrderSet = getWorkOrder(woDtls);
          if (woOrderSet) {
            const flags = determineOrderTypeFlags(woOrderSet?.SubType, boxTypeProps?.woType);
            if (flags.onlyMulti) {
              const authDealerMulti = tskDetailsArr.some((tsk: ParentObject) => tsk.DealerCode === loginUserId);
              const authDealerRegMultiChk = dealerDetails.some((dealer: ParentObject) => dealer.CONNECTIONTYPE === CONNECTION_TYPE.SECONDARY && dealer.DEALERCODE === loginUserId);

              if (authDealerMulti || authDealerRegMultiChk) {
                if (accStatus !== `${i18next.t('subscriberStatus.Active')}`) {
                  dispatch(uiActions.clearLoader());
                  return dispatch(commonActions.setErrorMessage(`${i18next.t('strings.multiTVActNotActive')}`));
                }
              } else {
                dispatch(uiActions.clearLoader());
                return dispatch(commonActions.setErrorMessage(`${i18next.t('strings.dealerNotAuth')}`));
              }
            } else {
              dispatch(uiActions.clearLoader());
              return dispatch(commonActions.setErrorMessage(`${i18next.t('strings.dealerNotAuth')}`));
            }
          } else {
            dispatch(uiActions.clearLoader());
            return dispatch(commonActions.setErrorMessage(`${i18next.t('strings.noUnscheduledWO')}`));
          }
        }
        dispatch(callAction({ ...params }, QUERY.getTskPinDetailsBoxType, '', navigate));
        return { status: false };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(commonActions.setErrorMessage(error.message));
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
 * dispatch(getTskPinDetailsBoxType({ exampleParam: 'exampleValue' }));
 */
export const getTskPinDetailsBoxType =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { subId, tskDetails } = getState().boxTypeChange;
    const requestInput = {
      input: {
        tskPin1: tskDetails?.[0]?.TskSno,
        tskPin2: tskDetails?.[1]?.TskSno || null,
        tskPin3: tskDetails?.[2]?.TskSno || null,
        tskPin4: tskDetails?.[3]?.TskSno || null,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ValidateSubID.moduleName, {
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ValidateSubID.attributes.Status]: true,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ValidateSubID.attributes.SubscriberID]: subId,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ValidateSubID.attributes.tskPin1]: tskDetails?.[0]?.TskSno,
        });
        dispatch(sliceActions.setTskPin(data));
        dispatch(callAction({ ...params }, QUERY.getActivationStatusOtherDetailsBoxType, '', navigate));
        return { status: false };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
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
 * dispatch(getActivationStatusOtherDetailsBoxType({ exampleParam: 'exampleValue' }));
 */
export const getActivationStatusOtherDetailsBoxType =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { tskDetails } = getState().boxTypeChange as { tskDetails: TskDetail[] };
    const { subId, firstFlag } = getState().boxTypeChange;

    const requestInput = {
      input: {
        subscriberId: params?.subscriberInfo || subId,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const tskDetailsMap = new Map(tskDetails.map((item: ParentObject) => [item.TskSno, item]));
        const tskOrderMap = new Map(tskDetails.map((item, index) => [item.TskSno, index]));

        let tskSnoAndBoxTypeArr: TskBoxType[] = data.otherDetails
          .filter((detail: ParentObject) => detail.pref_box_typeNT)
          .map((detail: ParentObject) => {
            const matchedTask = tskDetailsMap.get(detail.tsk_no);
            if (!matchedTask) return null;
            const boxType = detail.pref_box_typeNT === STRINGS.STANDARD ? STRINGS.SD : detail.pref_box_typeNT;
            return {
              boxType,
              tskSNum: detail?.tsk_no,
              VCType: matchedTask?.VCType,
            };
          })
          .filter(Boolean);
        tskSnoAndBoxTypeArr = tskSnoAndBoxTypeArr.filter(Boolean) as TskBoxType[];
        tskSnoAndBoxTypeArr.sort((a, b) => (tskOrderMap.get(a.tskSNum) ?? 0) - (tskOrderMap.get(b.tskSNum) ?? 0));
        dispatch(sliceActions.setTskSnoAndBoxTypeArr(tskSnoAndBoxTypeArr));
        const formattedDetails = tskSnoAndBoxTypeArr.map((box: ParentObject) => {
          const textValue = `${box.tskSNum}-${box.VCType}-${box.boxType}`;
          return {
            text: textValue,
            value: textValue,
          };
        });
        dispatch(sliceActions.setBoxData(formattedDetails));
        dispatch(boxUpgradeAction.setBoxData(formattedDetails));
        dispatch(formActions.setRadioContainerOptions(formattedDetails, QUERY.BoxTypeChangeRadioData));
        if (formattedDetails.length > 0 && firstFlag) {
          return dispatch(callAction({ type: STRINGS.PROCEED }, QUERY.exitingWorkOrder, '', navigate));
        }
        dispatch(sliceActions.setFirstFlag(true));
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.clearLoader());
        navigate(ROUTE.WEB.SELECT_BOX_TYPE);

        return Promise.resolve({ status: true });
      })

      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
        return { status: false };
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
 * dispatch(exitingWorkOrder({ exampleParam: 'exampleValue' }));
 */
export const getBoxType =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    api
      .post(queries.getMultiTvBoxType, params)
      .then((response) => {
        const data = refactorResponse(response);
        const dropdownDataName = data?.result?.boxType;
        dispatch(sliceActions.setBoxDetails(dropdownDataName));
        navigate(ROUTE.WEB.SELECT_BOX_TYPE);
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
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
 * dispatch(exitingWorkOrder({ exampleParam: 'exampleValue' }));
 */
export const exitingWorkOrder =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const data = getState().boxTypeChange;
    const { pendingWo } = data;
    dispatch(uiActions.clearLoader());
    dispatch(boxUpgradeAction.setSelectedBox(params?.campaign));
    const type = params?.campaign || '';
    const parts = type.split('-');
    dispatch(boxUpgradeAction.setSelectedBoxVcNumber(parts[0]));
    dispatch(boxUpgradeAction.setSelectedBoxType(parts[1]));
    dispatch(boxUpgradeAction.setSelectedBoxConnectionType(parts[2]));

    const firstBoxType = parts[2];
    const eligibleBoxTypesArray = PROPERTIES.BOX_TYPE_CHANGE.ELEGIBLE_BOXTYPE.filter((item) => item !== firstBoxType).map((boxType) => ({
      AMOUNT: boxType,
      NEW_BOXNT: boxType,
    }));
    dispatch(boxUpgradeAction.setElegibles(eligibleBoxTypesArray));
    if (pendingWo) {
      return dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          isCenterModal: true,
          type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
          headerTitle: HEADER_TITLE.CONFIRMATION,
          showCloseIcon: true,
          showHeader: true,
          formName: FORMS.existingWorkOrderDetailsBoxTypeChange,
          buttonInfo: {
            goToHome: true,
            primaryButtonLabel: MODAL.CONFIRM,
            queryName: QUERY.cancelWorkorder,
          },
        }),
      );
    }
    dispatch(sliceActions.setPendingWo(false));
    dispatch(uiActions.hideBottomModal());
    dispatch(callAction(params, 'getBoxType', '', navigate));

    // navigate(ROUTE.WEB.SELECT_BOX_TYPE);
    return { status: true };
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(boxTypeChange({ exampleParam: 'exampleValue' }));
 */
export const boxTypeChange =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, _navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { subId, orderNumber } = getState().boxTypeChange;
    dispatch(uiActions.clearAlert());
    dispatch(etskRegistrationActions.etskSetCategorySelected(undefined));
    dispatch(etskRegistrationActions.etskSetDurationSelected(undefined));
    dispatch(etskRegistrationActions.etskClearSelectedPacksToBuyData());
    dispatch(etskRegistrationActions.etskSetPackSelected(''));
    dispatch(etskRegistrationActions.etskSetSelectedPill(STRINGS.NEW_CUSTOMER_BEST_OFFERS));
    const tskType = params?.upgradedType === STRINGS.SD ? STRINGS.STANDARD : params?.upgradedType;
    dispatch(sliceActions.setboxType(tskType));
    const requestInput = {
      input: {
        newTSKType: tskType,
        salesOrderNum: params?.sendOrder ? orderNumber || '' : '',
        subscriberId: subId,
        tskSerialNumber: params?.vcNumber,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);

        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ChangeBox.moduleName, {
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ChangeBox.attributes.Status]: true,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ChangeBox.attributes.SubscriberID]: subId,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ChangeBox.attributes.newTSKType]: tskType,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ChangeBox.attributes.salesOrderNum]: params?.sendOrder ? orderNumber || '' : '',
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ChangeBox.attributes.tskSerialNumber]: params?.vcNumber,
        });
        dispatch(sliceActions.setBoxTypeChangeReferenceId(data?.referenceId));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(uiActions.clearLoader());
        throw error;
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
 * dispatch(boxTypeChangeSuccess({ exampleParam: 'exampleValue' }));
 */
export const boxTypeChangeSuccess =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { flags } = getState().boxTypeChange;
    if (flags.onlyMulti) {
      dispatch(callAction({ ...params }, QUERY.GetOnlyPricePtForMultiTVInputBoxType, '', navigate));
      return { status: false };
    }
    dispatch(callAction({ ...params }, QUERY.getAccountDetailsPrimaryAndSecondaryRepushBoxType, '', navigate));
    return { status: false };
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getAccountDetailsPrimaryAndSecondaryRepushBoxType({ exampleParam: 'exampleValue' }));
 */
export const getAccountDetailsPrimaryAndSecondaryRepushBoxType =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { tskPin } = getState().boxTypeChange;
    const { info } = getState().user;
    const requestInput = {
      input: {
        tskPin: tskPin?.[0]?.TSKPIN,
        tskPin1: tskPin?.[1]?.TSKPIN || null,
        tskPin2: tskPin?.[2]?.TSKPIN || null,
        tskPin3: tskPin?.[3]?.TSKPIN || null,
        type: STRINGS.EVD,
        userName: info?.userId,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setAccountDetailsPrimaryAndSecondaryRepushBoxType(data));
        dispatch(callAction({ ...params }, QUERY.getAllPacksPropBoxType, '', navigate));
        return { status: false };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
      })
      .finally(() => {});
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getAllPacksPropBoxType({ exampleParam: 'exampleValue' }));
 */
export const getAllPacksPropBoxType =
  (_params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    const { accountDetailsPrimaryAndSecondaryRepushBoxType, tskDetails, subId } = getState().boxTypeChange;
    const requestInput = {
      input: {
        subscriberId: subId,
        channel: tskDetails?.channelName,
        outlet: tskDetails?.outletType,
        version: '',
        roleId: info?.roleId,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        let data = refactorResponse(response);
        const filterData = {
          languages: {
            title: STRINGS.LANGUAGES,
            data: data.languages,
          },
          genre: {
            title: STRINGS.GENRES,
            data: data.geners,
          },
          boxType: {
            title: STRINGS.BOX_TYPE,
            data: data.boxTypes,
          },
        };

        const pricePointPrimary = accountDetailsPrimaryAndSecondaryRepushBoxType?.pricePoint || 0;
        const pricePointSecondary1 = accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_1?.pricePoint || 0;
        const pricePointSecondary2 = accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_2?.pricePoint || 0;
        const pricePointSecondary3 = accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_3?.pricePoint || 0;
        data = {
          ...data,
          packageName: accountDetailsPrimaryAndSecondaryRepushBoxType?.packageName,
          pricePointPrimary,
          pricePointSecondary1,
          pricePointSecondary2,
          pricePointSecondary3,
        };
        const monthlyPack = data?.packageName?.[0]?.PackageInfo?.filter((pack: ParentObject) => pack.uom === i18next.t('strings.MONTHLY'));
        dispatch(primaryActions.setTskValidateData({ pricePointPrimary, pricePointSecondary1, pricePointSecondary2, pricePointSecondary3 }));
        data.offerCategories = data.offerCategories.slice(0, -1);
        dispatch(etskRegistrationActions.etskSetAccountCreationSuccessData(data));
        dispatch(etskRegistrationActions.etskSetFiltersData(filterData));
        dispatch(etskRegistrationActions.etskSetFreePackSelected(monthlyPack?.packName ?? ''));
        dispatch(etskRegistrationActions.etskSetPrimaryBoxPrice(monthlyPack?.pricePt ?? '0'));
        dispatch(etskRegistrationActions.etskSetCategoryDropdownData(data.PopularPacks));
        dispatch(etskRegistrationActions.etskSetDurationDropdownData(data.durations));
        dispatch(uiActions.hideBottomModal());

        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPack.moduleName, {
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPack.attributes.Status]: true,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPack.attributes.SubscriberID]: subId,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPack.attributes.roleId]: info?.roleId,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPack.attributes.tskPin]: accountDetailsPrimaryAndSecondaryRepushBoxType?.tskPin,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPack.attributes.userName]: accountDetailsPrimaryAndSecondaryRepushBoxType?.accountDetails[0]?.USERNAME,
        });

        navigate(ROUTE.WEB.BOX_TYPE_CHANNELS);

        return { status: true, response };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
        return { status: false, error };
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
 * dispatch(getWoPacksBoxType({ exampleParam: 'exampleValue' }));
 */
export const getWoPacksBoxType =
  (params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { accountDetailsPrimaryAndSecondaryRepushBoxType } = getState().boxTypeChange;
    const { value, filters } = params;
    const requestInput = {
      category: value.nameNT,
      boxType: accountDetailsPrimaryAndSecondaryRepushBoxType?.boxType,
    };
    return api
      .post(queries.getPacks, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SelectPackCategory.moduleName, {
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SelectPackCategory.attributes.Status]: true,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SelectPackCategory.attributes.boxType]: accountDetailsPrimaryAndSecondaryRepushBoxType?.boxType,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SelectPackCategory.attributes.category]: value?.nameNT,
        });
        if (data?.status) {
          const filteredData = filterPackDetails(data?.result?.packsDetails, filters);
          dispatch(etskRegistrationActions.etskSetCategorySelectionPacksData(filteredData));
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(data.message));
        return { status: true, data };
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
 * dispatch(getRentalPackBoxType({ exampleParam: 'exampleValue' }));
 */
export const getRentalPackBoxType =
  (_params: any): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    dispatch(commonActions.reSetErrorMessage());
    const { selectedPacksToBuy, freePackSelected } = getState().etskRegistration;
    const { accountDetailsPrimaryAndSecondaryRepushBoxType } = getState().boxTypeChange;
    const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelName);
    const secondBoxType1 = accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_1?.boxType;
    const secondBoxType2 = accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_2?.boxType;
    const secondBoxType3 = accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_3?.boxType;
    if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
      finalPacks.unshift(freePackSelected);
    }
    const finalPrice = selectedPacksToBuy.reduce((sum: number, curr: ParentObject) => sum + Number(curr.price), 0);
    const requestInput = {
      subscriberId: accountDetailsPrimaryAndSecondaryRepushBoxType?.subscriberId,
      selectedPacksTogetRentalUniqueArray: finalPacks,
      tskPin: accountDetailsPrimaryAndSecondaryRepushBoxType?.tskPin,
      packPriceFe: finalPrice.toString(),
      tskSerialNumber: accountDetailsPrimaryAndSecondaryRepushBoxType?.tskSerialNumber,
      tskSerialNumber1: accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_1?.tskSerialNumber || null,
      tskSerialNumber2: accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_2?.tskSerialNumber || null,
      tskSerialNumber3: accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_3?.tskSerialNumber || null,
      boxType: accountDetailsPrimaryAndSecondaryRepushBoxType?.boxType,
      boxType1: accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_1?.boxType || null,
      boxType2: accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_2?.boxType || null,
      boxType3: accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_3?.boxType || null,
    };
    return api
      .post(queries.getWoRentalPack, requestInput)
      .then((response) => {
        const data = refactorResponse(response);

        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPackProceed.moduleName, {
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPackProceed.attributes.Status]: true,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPackProceed.attributes.SubscriberID]: accountDetailsPrimaryAndSecondaryRepushBoxType?.subscriberId,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPackProceed.attributes.boxType]: accountDetailsPrimaryAndSecondaryRepushBoxType?.boxType,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPackProceed.attributes.packPriceFe]: finalPrice.toString(),
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPackProceed.attributes.selectedPacksTogetRentalUniqueArray]: finalPacks,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPackProceed.attributes.tskPin]: accountDetailsPrimaryAndSecondaryRepushBoxType?.tskPin,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPackProceed.attributes.tskSerialNumber]: accountDetailsPrimaryAndSecondaryRepushBoxType?.tskSerialNumber,
        });
        if (response?.status) {
          dispatch(
            etskRegistrationActions.etskSetValidatePacksSuccessData({ ...data?.result, noOfConnection: data?.result?.connections, secondBoxType1, secondBoxType2, secondBoxType3 }),
          );
          return data;
        }
        dispatch(uiActions.showErrorPage(data.message));
        dispatch(commonActions.setErrorMessage(data.message));
        dispatch(uiActions.clearLoader());

        return { status: false, message: data.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
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
 * dispatch(boxTypeRechargeDetails({ exampleParam: 'exampleValue' }));
 */
export const boxTypeRechargeDetails = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  dispatch(commonActions.reSetErrorMessage());
  const { selectedPacksToBuy, freePackSelected } = getState().etskRegistration;
  const { accountDetailsPrimaryAndSecondaryRepushBoxType } = getState().boxTypeChange;
  const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelName);
  if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
    finalPacks.unshift(freePackSelected);
  }
  const finalPrice = selectedPacksToBuy.reduce((sum: number, curr: ParentObject) => sum + Number(curr.price), 0);

  MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SummaryProceed.moduleName, {
    [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SummaryProceed.attributes.Status]: true,
    [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SummaryProceed.attributes.SubscriberID]: accountDetailsPrimaryAndSecondaryRepushBoxType?.subscriberId,
    [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SummaryProceed.attributes.boxType]: accountDetailsPrimaryAndSecondaryRepushBoxType?.boxType,
    [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SummaryProceed.attributes.packPriceFe]: finalPrice.toString(),
    [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SummaryProceed.attributes.selectedPacksTogetRentalUniqueArray]: finalPacks,
    [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SummaryProceed.attributes.tskPin]: accountDetailsPrimaryAndSecondaryRepushBoxType?.tskPin,
    [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_SummaryProceed.attributes.tskSerialNumber]: accountDetailsPrimaryAndSecondaryRepushBoxType?.tskSerialNumber,
  });
  dispatch(uiActions.clearLoader());
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: FORMS.rechargeDetails,
      showCloseIcon: true,
      showHeader: true,
      isCenterModal: true,
      formName: FORMS.boxTypeChangeRechargeDetails,
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
 * dispatch(boxTypeRecreationFillAmount({ exampleParam: 'exampleValue' }));
 */
export const boxTypeRecreationFillAmount =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { finalPrice, accountCreationSuccessData, selectedPacksToBuy } = getState().etskRegistration;
    const { accountDetailsPrimaryAndSecondaryRepushBoxType } = getState().boxTypeChange;
    const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
    const hasMatchedPack = getDisabledCategoryMatch(selectedPacksToBuy, disabledPacks);
    let rechargeAmount = finalPrice;
    if (hasMatchedPack?.rechargeAmount) {
      const pricePoint = (accountDetailsPrimaryAndSecondaryRepushBoxType?.pricePoint ?? 0) / 100;
      const pricePoint1 = (accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_1?.pricePoint ?? 0) / 100;
      const pricePoint2 = (accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_2?.pricePoint ?? 0) / 100;
      const pricePoint3 = (accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_3?.pricePoint ?? 0) / 100;

      rechargeAmount = hasMatchedPack.rechargeAmount - Number(pricePoint) - Number(pricePoint1) - Number(pricePoint2) - Number(pricePoint3);
    }
    dispatch(formActions.setUpdatedFormFields({ rechargeAmount }, STATE_KEY.MODAL_STATE));
    if (hasMatchedPack?.rechargeEnabled === STRINGS.NO) {
      setTimeout(() => {
        dispatch(formActions.setFieldsToDisable({ fieldName: STRINGS.RECHARGE_AMOUNT_FIELD }, STATE_KEY.MODAL_STATE));
      }, 200);
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
 * dispatch(confirmBoxTypeRechargeModal({ exampleParam: 'exampleValue' }));
 */
export const confirmBoxTypeRechargeModal =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    const message = i18next.t('strings.amountDeductionMsg', { amount: params?.rechargeAmount });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.LABEl,
        headerTitle: HEADER_TITLE.CONFIRMATION,
        showCloseIcon: true,
        showHeader: true,
        onClose: () => dispatch(commonActions.reSetErrorMessage()),
        buttonInfo: {
          primaryButtonLabel: MODAL.CONFIRM,
          secondaryButtonLabel: MODAL.MODIFY,
          childData: message,
          queryName: QUERY.doPickPackAndWorkOrderCreationPrimaryAndSecondaryBoxType,
          queryParams: { ...params },
          secondaryQueryName: QUERY.boxTypeRechargeDetails,
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
 * dispatch(doPickPackAndWorkOrderCreationPrimaryAndSecondaryBoxType({ exampleParam: 'exampleValue' }));
 */
export const doPickPackAndWorkOrderCreationPrimaryAndSecondaryBoxType =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { accountCreationSuccessData, selectedPacksToBuy, freePackSelected, finalPrice, validatePacksSuccessData } = getState().etskRegistration;
    const { accountDetailsPrimaryAndSecondaryRepushBoxType } = getState().boxTypeChange;
    const reqDetails = accountDetailsPrimaryAndSecondaryRepushBoxType;
    const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelName);
    const { selectedSlot, timeSlotsData } = getState().etskRegSchedular || {};
    const [startTime, endTime] = (selectedSlot ?? '').split(' - ');
    if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
      finalPacks.unshift(freePackSelected);
    }
    const disableLDPPacks = accountCreationSuccessData?.disableLDPPacks || [];
    const rechargeFlag = getRechargeFlag(selectedPacksToBuy, disableLDPPacks);
    const selectedPacksArray = transformSelectedPacksArray(selectedPacksToBuy);
    selectedPacksArray.unshift(`${freePackSelected}~BasicPacks`);
    dispatch(boxUpgradeAction.setSubscriberID(reqDetails?.subscriberId));
    dispatch(boxUpgradeAction.setRechargeFlag(true));
    dispatch(boxUpgradeAction.setPaidAmount(String(params?.rechargeAmount)));

    const requestInput = {
      subscriberId: reqDetails?.subscriberId,
      packageName: freePackSelected,
      finalValidatedPacksArray: finalPacks,
      rechargeAmount: String(params?.rechargeAmount),
      tskSerialNumber: reqDetails?.tskSerialNumber,
      orderId: STRINGS.CHNAGE_TBL,
      tskSerialNumber1: accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_1?.tskSerialNumber || null,
      tskSerialNumber2: accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_2?.tskSerialNumber || null,
      tskSerialNumber3: accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_3?.tskSerialNumber || null,
      package1: (accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_1?.tskSerialNumber && validatePacksSuccessData?.packToAdd) || null,
      package2: (accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_2?.tskSerialNumber && validatePacksSuccessData?.packToAdd) || null,
      package3: (accountDetailsPrimaryAndSecondaryRepushBoxType?.secondary_3?.tskSerialNumber && validatePacksSuccessData?.packToAdd) || null,
      requiredRechargeAmount: finalPrice,
      selectedPackAndCategoriesArray: selectedPacksArray,
      rechargeEvdPin: params?.EvdPinInput,
      rechargeFlag,
      flexiFlag: '0',
      bingeSelected: accountDetailsPrimaryAndSecondaryRepushBoxType?.bingeEligibility ? STRINGS.YES : STRINGS.NO,
      typeUser: STRINGS.EVD,
      startTime: startTime || null,
      endTime: endTime || null,
      ocsFlag: reqDetails?.ocsFlag,
      taskId: timeSlotsData?.taskId ?? null,
    };
    return api
      .post(queries.doPickPackAndWorkOrderCreationPrimaryAndSecondary, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_RechargeConfirm.moduleName, {
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_RechargeConfirm.attributes.Status]: true,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_RechargeConfirm.attributes.SubscriberID]: reqDetails?.subscriberId,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_RechargeConfirm.attributes.requiredRechargeAmount]: finalPrice,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_RechargeConfirm.attributes.selectedPackAndCategoriesArray]: selectedPacksArray,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_RechargeConfirm.attributes.rechargeAmount]: String(params?.rechargeAmount),
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_RechargeConfirm.attributes.rechargeEvdPin]: params?.EvdPinInput,
          [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_RechargeConfirm.attributes.tskSerialNumber]: reqDetails?.tskSerialNumber,
        });
        dispatch(sliceActions.setBoxTypeSuccessData(data));
        dispatch(uiActions.hideBottomModal());
        if (data?.status) {
          dispatch(boxUpgradeAction.setStatus(data?.message));
          dispatch(boxUpgradeAction.setTransactionID(data?.result?.transId));
          dispatch(boxUpgradeAction.setSRno(data?.woNumber));
          dispatch(boxUpgradeAction.setSucessMsg(data?.result?.message));
          dispatch(boxUpgradeAction.setFinalRequiredAmount(finalPrice));
          navigate(ROUTE.WEB.BOX_TYPE_SUCCESS);
          return { status: true, data };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data?.message));
        return { status: false, message: data?.message };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, error };
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
 * dispatch(getExistingBoxDetails({ exampleParam: 'exampleValue' }));
 */
export const getExistingBoxDetails = (): AppThunk => (dispatch, getState) => {
  const { subId, boxData } = getState().boxTypeChange;
  const lebelForMultipleBox = boxData.length > 1 ? i18next.t('strings.lebelForMultipleBoxTypeChange') : i18next.t('strings.lebelForSingleBoxTypeChange');
  const UpdatedSubID = `${i18next.t('strings.subscriberID')}: ${subId}`;
  dispatch(formActions.setUpdatedFormFields({ lebelForMultipleBox, subscriberID: UpdatedSubID }, STATE_KEY.MODAL_STATE));
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getRechargeAmount({ exampleParam: 'exampleValue' }));
 */
export const getRechargeAmount = (): AppThunk => (dispatch, getState) => {
  const { finalPrice, accountCreationSuccessData, selectedPacksToBuy, paidPrice } = getState().etskRegistration;
  const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
  const hasMatchedPack = getDisabledCategoryMatch(selectedPacksToBuy, disabledPacks);
  let rechargeAmount = finalPrice;
  if (Number(paidPrice) > 0) {
    rechargeAmount = paidPrice;
  }
  dispatch(formActions.setUpdatedFormFields({ rechargeAmount }, STATE_KEY.MODAL_STATE));

  if (hasMatchedPack?.rechargeEnabled === STRINGS.NO) {
    boxTypeChangeTimeoutId = setTimeout(() => {
      dispatch(formActions.setFieldsToDisable({ fieldName: STRINGS.RECHARGE_AMOUNT_FIELD }, STATE_KEY.MODAL_STATE));
    }, 200);
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
 * dispatch(handelRechargeAmount({ exampleParam: 'exampleValue' }));
 */
export const handelRechargeAmount =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(etskRegistrationActions.etskSetPaidPrice(params?.rechargeAmount));
  };
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getWODetailsBoxtype({ exampleParam: 'exampleValue' }));
 */
export const getWODetailsBoxtype = (): AppThunk => (dispatch, getState) => {
  const { pendingWoDetails } = getState().boxTypeChange;
  const message = i18next.t('strings.existingWorkOrder', { amount: pendingWoDetails?.woNo });
  dispatch(formActions.setUpdatedFormFields({ LebelforWoInfo: message }, STATE_KEY.MODAL_STATE));
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getOnlyPricePtForMultiTVInputBoxType({ exampleParam: 'exampleValue' }));
 */
export const getOnlyPricePtForMultiTVInputBoxType =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  async (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { vcNumber } = getState().boxUpgrade;
    const requestInput = {
      input: {
        tskSerialNo: vcNumber,
      },
    };
    return api
      .post(queries.getOnlyPricePtForMultiTV, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          dispatch(sliceActions.setOnlyPricePtForMultiTVInput(data));
          dispatch(multiActions.etskMultiTvSetBoxTypeSelected(data?.boxType));
          dispatch(callAction({ ...params, ...data }, QUERY.GetSecMultiTVDtlsOrgBoxType, '', navigate));
          return { status: true, data };
        }
        return { status: true, data };
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
 * dispatch(getSecMultiTVDtlsOrgBoxType({ exampleParam: 'exampleValue' }));
 */
export const getSecMultiTVDtlsOrgBoxType =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  async (dispatch, getState) => {
    const { subId, pricePtForMultiTVInput, boxType } = getState().boxTypeChange;
    const requestInput = {
      input: {
        subscriberId: subId,
        boxType,
      },
    };
    return api
      .post(queries.getSecMultiTVDtlsOrg, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(uiActions.hideBottomModal());
        dispatch(
          multiActions.etskSetMultiBoxSelectedDetails({
            ...data,
            pricePoint: pricePtForMultiTVInput?.pricePoints?.[0]?.PRICEPOINT,
            disableEditRechDhamakaMultiTV: data?.disableEditRechDhamakaMultiTVBoxChange,
          }),
        );
        navigate(ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY);
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };
