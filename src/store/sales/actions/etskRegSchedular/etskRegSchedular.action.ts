/**
 * eTskRegistration module redux file
 *
 * @module store/sales/actions/eTskRegistration
 *
 */

import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { CHILD_TYPE, FORMS } from 'const';
import i18next from 'i18next';
import { sliceActions } from 'store/sales/reducer/etskRegSchedular';
import { refactorResponse } from 'utils/responseHelper';
import queries from 'store/sales/query';
import { api } from 'services/apolloClient';
import { ParentObject } from 'store/sales/types/common';
import commonActions from 'store/sales/actions/common';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(eTskRegistrationAction({ exampleParam: 'exampleValue' }));
 */

export const rechargeDetails =
  (formName?: string, _recharge?: string): AppThunk =>
  (dispatch) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: FORMS.rechargeDetails,
        showCloseIcon: true,
        showHeader: true,
        isCenterModal: true,
        formName: formName || FORMS.rechargeDetails,
        onClose: () => dispatch(commonActions.reSetErrorMessage()),
      }),
    );
  };

export const installationDetails = (): AppThunk => (dispatch) =>
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.CALENDAR,
      headerTitle: i18next.t(`strings.setInstallationDetails`),
      showCloseIcon: true,
      showHeader: true,
      onClose: () => dispatch(commonActions.reSetErrorMessage()),
    }),
  );

export const installationTimeSlots = (): AppThunk => (dispatch) =>
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.DATE_TIME,
      headerTitle: i18next.t(`strings.setInstallationDetails`),
      showCloseIcon: true,
      showHeader: true,
      onClose: () => dispatch(commonActions.reSetErrorMessage()),
    }),
  );

export const handleEtskScheduleDate =
  (date: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.handleEtskScheduleDate(date));
  };

export const handleEtskTimeSlots =
  (timeSlots: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.handleEtskTimeSlots(timeSlots));
  };

export const GetETSKSlot = (): AppThunk => (dispatch, getState) => {
  const { date } = getState().etskRegSchedular;
  const { accountCreationSuccessData } = getState().etskRegistration;
  const { subscriberId } = getState().etskMultiTv;

  const requestInput = {
    bookingFormNumber: accountCreationSuccessData.bookingFormNumber || '',
    subscriberId: subscriberId || accountCreationSuccessData.subID || accountCreationSuccessData.subscriberId,
    preferredDate: date ?? '',
  };
  dispatch(uiActions.setModalLoader());

  return api
    .post(queries.GetETSKSlot, requestInput)
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(sliceActions.setTimeSlotsData(data));
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
    })
    .finally(() => dispatch(uiActions.clearLoader()));
};

export const pickPackAndGetSlotPrimaryAndSecondary = (): AppThunk => (dispatch, getState) => {
  const { date } = getState().etskRegSchedular;
  const { accountCreationSuccessData, selectedPacksToBuy, freePackSelected } = getState().etskRegistration;
  const { accountDetailsPrimaryAndSecondaryRepush } = getState().woRecreation;
  const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelName);
  if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
    finalPacks.unshift(freePackSelected);
  }
  const requestInput = {
    subscriberId: accountCreationSuccessData.subId || accountCreationSuccessData.subscriberId || accountDetailsPrimaryAndSecondaryRepush?.accountDetails[0]?.SUBSCRIBERID,
    preferedDate: date ?? '',
  };

  dispatch(uiActions.setModalLoader());

  return api
    .post(queries.pickPackAndGetSlotPrimaryAndSecondary, requestInput)
    .then((response) => {
      const data = refactorResponse(response);
      if (data?.status) {
        dispatch(sliceActions.setTimeSlotsData(data?.result));
      } else {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data.message));
      }
    })
    .catch((error) => {
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
 * dispatch(pickPackAndGetSlotSecondary({ exampleParam: 'exampleValue' }));
 */

export const pickPackAndGetSlotSecondary = (): AppThunk => (dispatch, getState) => {
  const { date } = getState().etskRegSchedular;
  const { tskPinParams, tskValidateData } = getState().multiTvRegistration;
  const { boxTypeSelected } = getState().etskRegistration;

  const requestInput = {
    subscriberId: tskValidateData?.subscriberID || tskPinParams?.subscriberID || tskPinParams?.multiSubId,
    preferedDate: date,
    salesFlag: null,
    assetNumber: tskValidateData?.tskSerial,
    packageName: tskValidateData?.packToAdd,
    boxType: boxTypeSelected,
  };

  dispatch(uiActions.setModalLoader());

  return api
    .post(queries.pickPackAndGetSlotSecondary, requestInput)
    .then((response) => {
      const data = refactorResponse(response);
      if (data?.status) {
        dispatch(commonActions.setErrorMessage(''));
        dispatch(sliceActions.setTimeSlotsData({ ...data?.result }));
      } else {
        dispatch(sliceActions.setTimeSlotsData({}));
        dispatch(commonActions.setErrorMessage(data.message));
      }
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
    })
    .finally(() => {
      dispatch(uiActions.clearLoader());
    });
};
