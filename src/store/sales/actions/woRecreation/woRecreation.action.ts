/**
 * This is the Reducer for work order recreation
 *
 * @module store/sales/actions/woRecreation
 *
 */
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { sliceActions } from 'store/sales/reducer/woRecreation';
import { sliceActions as multiActions } from 'store/sales/reducer/etskMultiTv';
import { sliceActions as primaryActions } from 'store/sales/reducer/primaryTvRegistration';
import { ParentObject } from 'store/sales/types/common';
import { CHILD_TYPE, CONNECTION_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, PROPERTIES, QUERY, ROUTE } from 'const';
import { sliceActions as etskRegistrationActions } from 'store/sales/reducer/etskRegistration';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import commonActions from 'store/sales/actions/common';
import { filterPackDetails, getDisabledCategoryMatch, getRechargeFlag, refactorResponse, transformSelectedPacksArray } from 'utils/responseHelper';
import formActions from 'store/sales/actions/form';
import i18next from 'i18next';
import { callAction } from 'utils/formBuilderHelper';
import { STATE_KEY, STRINGS, WO_VALIDATION } from 'const/strings';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { MoengageMixpanel } from 'services/moengageMixpanel';

let woRecreationTimeoutId: ReturnType<typeof setTimeout>;

/**
 * Displays the Work order recreation modal.
 *
 * @function customerOfferModal
 * @returns {void}
 */

export const woRecreationOfferModal =
  (params: ParentObject): AppThunk =>
  (dispatch) =>
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.WO_RECREATION,
        showCloseIcon: params?.showCloseIcon || true,
        showHeader: true,
        formName: FORMS.woRecreation,
        headerIcon: ICONS.WORK_ORDER,
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
 * dispatch(getSubscriberTSKDeatils({ exampleParam: 'exampleValue' }));
 */
export const getSubscriberTSKDeatils =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    dispatch(commonActions.setErrorMessage(''));
    const requestInput = {
      subscriberId: params?.subscriberInfo || params?.woMultiSubId,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRecreateWO.moduleName, {
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRecreateWO.attributes.Status]: true,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRecreateWO.attributes.SubscriberID]: params?.subscriberInfo || params?.woMultiSubId,
        });
        if (data?.subscriberList?.length === 1) {
          dispatch(callAction({ subscriberInfo: data?.subscriberList?.[0]?.subscriberId }, QUERY.GetSubscriberTSKDeatils, '', navigate));
          return { status: false, data };
        }
        if (data?.subscriberList !== null) {
          dispatch(formActions.setSubIdList(data?.subscriberList));
          dispatch(uiActions.clearLoader());
          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
              headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
              showCloseIcon: true,
              showHeader: true,
              formName: FORMS.woRecreationSubIdList,
              buttonInfo: {
                goToHome: true,
              },
            }),
          );
          return { status: false, data };
        }
        if (data?.tskDeatils?.length !== 0) {
          const etskSubIdFlgWO = Array.isArray(data?.tskDeatils)
            ? data?.tskDeatils?.some((item: ParentObject) => item.connectionTypeNT === CONNECTION_TYPE.PRIMARY && !item.bookingFormNo)
            : false;
          if (etskSubIdFlgWO) {
            dispatch(callAction({ ...params }, QUERY.GetWorkOrderDetails, '', navigate));
          } else {
            dispatch(commonActions.setErrorMessage(`${i18next.t('strings.woRecreationFunctionalityNotFound')}`));
            dispatch(uiActions.clearLoader());
          }
          if (data?.status) {
            return { response, status: true };
          }
        } else {
          dispatch(commonActions.setErrorMessage(`${i18next.t('strings.woFunctionalityOnlyAvailableForTsk')}`));
          dispatch(uiActions.clearLoader());
          return { status: false };
        }
        return { status: true };
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
 * dispatch(getWorkOrderDetails({ exampleParam: 'exampleValue' }));
 */
export const getWorkOrderDetails =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    const requestInput = {
      subscriberId: params?.subscriberInfo || params?.woMultiSubId,
    };
    dispatch(callAction({}, 'getBoxTypes', '', navigate));
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (PROPERTIES.WO_RECREATION.WO_STATUS.includes(data?.info?.[0]?.wo_status)) {
          dispatch(commonActions.setErrorMessage(`${i18next.t('strings.noCancelledWoDeatils')}`));
          dispatch(uiActions.clearLoader());
          return { response, status: false };
        }
        dispatch(sliceActions.setWorkOrderDetails(data));
        dispatch(callAction({ ...params }, QUERY.GetTskAllDetails, '', navigate));
        return { response, status: true };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
        return { status: false };
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
 * dispatch(getSubscriberTSKDeatils({ exampleParam: 'exampleValue' }));
 */
export const getTskAllDetails =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const { woTypesFromPropWO } = getState().woRecreation;
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      subscriberId: params?.subscriberInfo || params?.woMultiSubId,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.tskDetails?.length !== 0) {
          let authDealerWO = true;
          let authDealerWORegChk = false;
          const tskDetailsArrWO = data?.tskDetails;
          const registeredDealerDetailsArrayWO = data?.dealerDetails;
          const loginUserId = info?.userId;
          authDealerWO = tskDetailsArrWO.every((item: ParentObject) => item?.DealerCode === loginUserId);
          authDealerWORegChk = registeredDealerDetailsArrayWO.some((item: ParentObject) => item?.dealerCode === loginUserId);
          dispatch(etskRegistrationActions.etskClearSelectedPacksToBuyData());
          dispatch(etskRegistrationActions.etskSetPackSelected(''));
          if (authDealerWO || authDealerWORegChk) {
            dispatch(sliceActions.setTskAllDetails(data));
            if (data?.woDetails?.[0]?.statusNT === WO_VALIDATION.CANCELLED && data?.eaiOrderDetails?.[0]?.statusNT === WO_VALIDATION.OPEN) {
              dispatch(callAction({ ...params }, QUERY.WorkOrderRecreation, '', navigate));
            } else if (
              data?.woDetails?.[0]?.SubType === woTypesFromPropWO[4] ||
              data?.woDetails?.[0]?.SubType === woTypesFromPropWO[12] ||
              data?.woDetails?.[0]?.SubType === woTypesFromPropWO[17]
            ) {
              dispatch(callAction({ ...params, ...data }, QUERY.GetOnlyPricePtForMultiTVInput, '', navigate));
            } else {
              dispatch(callAction({ ...params }, QUERY.GetTskPinDetails, '', navigate));
            }
            dispatch(
              formActions.setDealerDetails({
                subscriberId: params?.subscriberInfo || params?.woMultiSubId,
                customerName: `${data?.accountDetails?.firstName} ${data?.accountDetails?.lastName}`,
              }),
            );
            return { status: false };
          }
          dispatch(commonActions.setErrorMessage(`${i18next.t('strings.dealerNotAuth')}`));
          dispatch(uiActions.clearLoader());
          return { status: false };
        }
        dispatch(commonActions.setErrorMessage(`${i18next.t('strings.noDataFound')}`));
        dispatch(uiActions.clearLoader());
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
 * dispatch(workOrderRecreation({ exampleParam: 'exampleValue' }));
 */
export const workOrderRecreation =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { tskAllDetails } = getState().woRecreation;
    const { info } = getState().user;

    const requestInput = {
      input: {
        dealerCode: info?.userId,
        orderId: tskAllDetails?.eaiOrderDetails?.[0]?.EaiOrderEntryLineItems?.[0]?.orderNumber,
        subscriberId: params?.subscriberInfo || params?.woMultiSubId,
        userName: info?.mdn,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setWoSuccessData(data));
        navigate(ROUTE.WEB.WORK_ORDER_RECREATION_SUCCEESS);
        if (data?.status) {
          return { response, status: true };
        }
        dispatch(uiActions.hideBottomModal());
        return { status: false };
      })
      .catch((error) => dispatch(commonActions.setErrorMessage(error.message)))
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
 * dispatch(getTskPinDetails({ exampleParam: 'exampleValue' }));
 */
export const getTskPinDetails =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { tskAllDetails } = getState().woRecreation;
    const requestInput = {
      input: {
        tskPin1: tskAllDetails?.tskDetails?.[0]?.TskSno,
        tskPin2: tskAllDetails?.tskDetails?.[1]?.TskSno || null,
        tskPin3: tskAllDetails?.tskDetails?.[2]?.TskSno || null,
        tskPin4: tskAllDetails?.tskDetails?.[3]?.TskSno || null,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setTskPinDetails(data));
        dispatch(callAction({ ...params }, QUERY.GetAccountDetailsPrimaryAndSecondaryRepush, '', navigate));
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
 * dispatch(getAccountDetailsPrimaryAndSecondaryRepush({ exampleParam: 'exampleValue' }));
 */
export const getAccountDetailsPrimaryAndSecondaryRepush =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { tskPinDetails } = getState().woRecreation;
    const { info } = getState().user;
    const requestInput = {
      input: {
        tskPin: tskPinDetails?.[0]?.TSKPIN,
        tskPin1: tskPinDetails?.[1]?.TSKPIN || null,
        tskPin2: tskPinDetails?.[2]?.TSKPIN || null,
        tskPin3: tskPinDetails?.[3]?.TSKPIN || null,
        type: STRINGS.EVD,
        userName: info?.userId,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.RepushOrder.RepushOrderValidateTSK.moduleName, {
          [MoengageMixpanelModules.RepushOrder.RepushOrderValidateTSK.attributes.userName]: info?.userId,
          [MoengageMixpanelModules.RepushOrder.RepushOrderValidateTSK.attributes.TSKPin]: tskPinDetails?.[0]?.TSKPIN,
          [MoengageMixpanelModules.RepushOrder.RepushOrderValidateTSK.attributes.TSKPin1]: tskPinDetails?.[1]?.TSKPIN || null,
          [MoengageMixpanelModules.RepushOrder.RepushOrderValidateTSK.attributes.TSKPin2]: tskPinDetails?.[2]?.TSKPIN || null,
          [MoengageMixpanelModules.RepushOrder.RepushOrderValidateTSK.attributes.TSKPin3]: tskPinDetails?.[3]?.TSKPIN || null,
        });
        dispatch(sliceActions.setAccountDetailsPrimaryAndSecondaryRepush(data));
        dispatch(formActions.setDealerDetails({ subscriberId: params?.subscriberInfo || params?.woMultiSubId, customerName: `${data.firstName} ${data.lastName}` }));
        dispatch(callAction({ ...params }, QUERY.GetAllPacksProp, '', navigate));
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
 * dispatch(getAllPacksProp({ exampleParam: 'exampleValue' }));
 */
export const getAllPacksProp =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { info } = getState().user;
    const { accountDetailsPrimaryAndSecondaryRepush, tskAllDetails } = getState().woRecreation;
    const requestInput = {
      input: {
        subscriberId: params?.subscriberInfo || params?.woMultiSubId,
        channel: tskAllDetails?.channelName,
        outlet: tskAllDetails?.outletType,
        version: '',
        roleId: info?.roleId,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        let data = refactorResponse(response);
        const filteredBoxTypes = data.boxTypes.filter((box: ParentObject) => box.name !== i18next.t('strings.Android'));
        const filterData = {
          languages: {
            title: i18next.t('strings.languages'),
            data: data.languages,
          },
          genre: {
            title: i18next.t('strings.genres'),
            data: data.geners,
          },
          boxType: {
            title: i18next.t('strings.pictureQuality'),
            data: filteredBoxTypes,
          },
        };
        const pricePointPrimary = accountDetailsPrimaryAndSecondaryRepush?.pricePoint || 0;
        const pricePointSecondary1 = accountDetailsPrimaryAndSecondaryRepush?.secondary_1?.pricePoint || 0;
        const pricePointSecondary2 = accountDetailsPrimaryAndSecondaryRepush?.secondary_2?.pricePoint || 0;
        const pricePointSecondary3 = accountDetailsPrimaryAndSecondaryRepush?.secondary_3?.pricePoint || 0;
        data = { ...data, packageName: accountDetailsPrimaryAndSecondaryRepush?.packageName, pricePointPrimary, pricePointSecondary1, pricePointSecondary2, pricePointSecondary3 };
        const monthlyPack = data?.packageName?.[0]?.PackageInfo?.filter((pack: ParentObject) => pack.uom === i18next.t('strings.MONTHLY'));
        dispatch(primaryActions.setTskValidateData({ pricePointPrimary, pricePointSecondary1, pricePointSecondary2, pricePointSecondary3 }));
        data.offerCategories = data.offerCategories.slice(0, -1);
        dispatch(etskRegistrationActions.etskSetAccountCreationSuccessData(data));
        dispatch(etskRegistrationActions.etskSetFiltersData(filterData));
        dispatch(etskRegistrationActions.etskSetFreePackSelected(monthlyPack?.packNameNT ?? ''));
        dispatch(etskRegistrationActions.etskSetPrimaryBoxPrice(monthlyPack?.pricePt ?? '0'));
        dispatch(etskRegistrationActions.etskSetCategoryDropdownData(data.PopularPacks));
        dispatch(etskRegistrationActions.etskSetDurationDropdownData(data.durations));
        dispatch(uiActions.hideBottomModal());
        navigate(ROUTE.WEB.WO_RECREATION_CHANNELS);
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
 * dispatch(getWoPacks({ exampleParam: 'exampleValue' }));
 */

export const getWoPacks =
  (params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { accountDetailsPrimaryAndSecondaryRepush } = getState().woRecreation;
    const { value, filters } = params;
    const requestInput = {
      category: value.nameNT,
      boxType: accountDetailsPrimaryAndSecondaryRepush?.boxTypeNT,
    };
    return api
      .post(queries.getPacks, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          const filteredData = filterPackDetails(data?.result?.packsDetails, filters);
          dispatch(etskRegistrationActions.etskSetCategorySelectionPacksData(filteredData));
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(data.message));
        return { status: true, data };
      })
      .catch((error) => {
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
 * dispatch(getWoRentalPack({ exampleParam: 'exampleValue' }));
 */

export const getWoRentalPack =
  (_params: any): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    dispatch(commonActions.reSetErrorMessage());
    const { selectedPacksToBuy, freePackSelected } = getState().etskRegistration;
    const { accountDetailsPrimaryAndSecondaryRepush } = getState().woRecreation;
    const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelNameNT);
    const secondBoxType1 = accountDetailsPrimaryAndSecondaryRepush?.secondary_1?.boxType;
    const secondBoxType2 = accountDetailsPrimaryAndSecondaryRepush?.secondary_2?.boxType;
    const secondBoxType3 = accountDetailsPrimaryAndSecondaryRepush?.secondary_3?.boxType;
    if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
      finalPacks.unshift(freePackSelected);
    }
    const finalPrice = selectedPacksToBuy.reduce((sum: number, curr: ParentObject) => sum + Number(curr.price), 0);
    const requestInput = {
      subscriberId: accountDetailsPrimaryAndSecondaryRepush?.subscriberId,
      selectedPacksTogetRentalUniqueArray: finalPacks,
      tskPin: accountDetailsPrimaryAndSecondaryRepush?.tskPin,
      packPriceFe: finalPrice.toString(),
      tskSerialNumber: accountDetailsPrimaryAndSecondaryRepush?.tskSerialNumber,
      tskSerialNumber1: accountDetailsPrimaryAndSecondaryRepush?.secondary_1?.tskSerialNumber || null,
      tskSerialNumber2: accountDetailsPrimaryAndSecondaryRepush?.secondary_2?.tskSerialNumber || null,
      tskSerialNumber3: accountDetailsPrimaryAndSecondaryRepush?.secondary_3?.tskSerialNumber || null,
      boxType: accountDetailsPrimaryAndSecondaryRepush?.boxTypeNT,
      boxType1: accountDetailsPrimaryAndSecondaryRepush?.secondary_1?.boxTypeNT || null,
      boxType2: accountDetailsPrimaryAndSecondaryRepush?.secondary_2?.boxTypeNT || null,
      boxType3: accountDetailsPrimaryAndSecondaryRepush?.secondary_3?.boxTypeNT || null,
    };
    return api
      .post(queries.getWoRentalPack, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationPickPackProceed.moduleName, {
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationPickPackProceed.attributes.Status]: true,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationPickPackProceed.attributes.boxType]: accountDetailsPrimaryAndSecondaryRepush?.boxTypeNT,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationPickPackProceed.attributes.packPriceFe]: finalPrice.toString(),
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationPickPackProceed.attributes.selectedPacksTogetRentalUniqueArray]: finalPacks,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationPickPackProceed.attributes.tskPin]: accountDetailsPrimaryAndSecondaryRepush?.tskPin,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationPickPackProceed.attributes.tskSerialNumber]: accountDetailsPrimaryAndSecondaryRepush?.tskSerialNumber,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationPickPackProceed.attributes.SubscriberID]: accountDetailsPrimaryAndSecondaryRepush?.subscriberId,
        });
        if (response?.status) {
          dispatch(
            etskRegistrationActions.etskSetValidatePacksSuccessData({ ...data?.result, noOfConnection: data?.result?.connections, secondBoxType1, secondBoxType2, secondBoxType3 }),
          );
          return data;
        }
        dispatch(uiActions.showErrorPage(data.message));
        dispatch(commonActions.setErrorMessage(data.message));
        return { status: false, message: data.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
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
 * dispatch(getWoRentalPack({ exampleParam: 'exampleValue' }));
 */
export const woRechargeDetails = (): AppThunk => (dispatch) => {
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: FORMS.rechargeDetails,
      showCloseIcon: true,
      showHeader: true,
      isCenterModal: true,
      formName: FORMS.woRechargeDetails,
      onClose: () => dispatch(commonActions.reSetErrorMessage()),
    }),
  );
};

export const woRecreationFillAmount =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { finalPrice, accountCreationSuccessData, selectedPacksToBuy, evdPin, paidPrice } = getState().etskRegistration;
    const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
    const hasMatchedPack = getDisabledCategoryMatch(selectedPacksToBuy, disabledPacks);
    let rechargeAmount = finalPrice;
    if (Number(paidPrice) > 0) {
      rechargeAmount = paidPrice;
    }
    dispatch(formActions.setUpdatedFormFields({ rechargeAmount, evdPin }, STATE_KEY.MODAL_STATE));
    if (hasMatchedPack?.rechargeEnabled === STRINGS.NO) {
      woRecreationTimeoutId = setTimeout(() => {
        dispatch(formActions.setFieldsToDisable({ fieldName: STRINGS.RECHARGE_AMOUNT_FIELD }, STATE_KEY.MODAL_STATE));
      }, 200);
    }
  };
/**
 * Represents an asynchronous action to confirm the recharge
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(confirmWoRechargeModal({ exampleParam: 'exampleValue' }));
 */
export const confirmWoRechargeModal =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    const message = i18next.t('strings.amountDeductionMsg', { amount: params?.rechargeAmount });
    dispatch(etskRegistrationActions.etskSetEvdPin(params?.evdPin));
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationSummaryProceed.moduleName, {
      [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationSummaryProceed.attributes.Status]: true,
    });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.LABEl,
        headerTitle: HEADER_TITLE.CONFIRMATION,
        showCloseIcon: true,
        showHeader: true,
        onClose: () => dispatch(commonActions.reSetErrorMessage()),
        buttonInfo: {
          primaryButtonLabel: MODAL.CONFIRM,
          secondaryButtonLabel: MODAL.MODIFY,
          childData: message,
          queryName: QUERY.DoPickPackAndWorkOrderCreationPrimaryAndSecondary,
          queryParams: { ...params },
          secondaryQueryName: QUERY.WoRechargeDetails,
          hasOutline: true,
        },
      }),
    );
  };

export const clearTskPinTimeout = (): AppThunk => () => {
  if (woRecreationTimeoutId) {
    clearTimeout(woRecreationTimeoutId);
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
 * dispatch(getWoRentalPack({ exampleParam: 'exampleValue' }));
 */
export const doPickPackAndWorkOrderCreationPrimaryAndSecondary =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { accountCreationSuccessData, selectedPacksToBuy, freePackSelected, finalPrice, validatePacksSuccessData } = getState().etskRegistration;
    const { accountDetailsPrimaryAndSecondaryRepush } = getState().woRecreation;
    const reqDetails = accountDetailsPrimaryAndSecondaryRepush;
    const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelNameNT);
    const { selectedSlot, timeSlotsData } = getState().etskRegSchedular || {};
    const [startTime, endTime] = (selectedSlot ?? '').split(' - ');
    if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
      finalPacks.unshift(freePackSelected);
    }
    const disableLDPPacks = accountCreationSuccessData?.disableLDPPacks || [];
    const rechargeFlag = getRechargeFlag(selectedPacksToBuy, disableLDPPacks);
    const selectedPacksArray = transformSelectedPacksArray(selectedPacksToBuy);
    selectedPacksArray.unshift(`${freePackSelected}~BasicPacks`);
    clearTskPinTimeout();

    const requestInput = {
      subscriberId: reqDetails?.subscriberId,
      packageName: freePackSelected,
      finalValidatedPacksArray: finalPacks,
      rechargeAmount: String(params?.rechargeAmount),
      tskSerialNumber: reqDetails?.tskSerialNumber,
      orderId: STRINGS.CHNAGE_TBL,
      tskSerialNumber1: accountDetailsPrimaryAndSecondaryRepush?.secondary_1?.tskSerialNumber || null,
      tskSerialNumber2: accountDetailsPrimaryAndSecondaryRepush?.secondary_2?.tskSerialNumber || null,
      tskSerialNumber3: accountDetailsPrimaryAndSecondaryRepush?.secondary_3?.tskSerialNumber || null,
      package1: validatePacksSuccessData?.noOfConnection > 1 ? validatePacksSuccessData?.packToAdd : null,
      package2: validatePacksSuccessData?.noOfConnection > 2 ? validatePacksSuccessData?.packToAdd : null,
      package3: validatePacksSuccessData?.noOfConnection > 3 ? validatePacksSuccessData?.packToAdd : null,
      requiredRechargeAmount: finalPrice,
      selectedPackAndCategoriesArray: selectedPacksArray,
      rechargeEvdPin: params?.evdPin,
      rechargeFlag,
      flexiFlag: '0',
      bingeSelected: accountDetailsPrimaryAndSecondaryRepush?.bingeEligibility ? STRINGS.YES : STRINGS.NO,
      typeUser: STRINGS.EVD,
      startTime: startTime || null,
      endTime: endTime || null,
      ocsFlag: reqDetails?.ocsFlag,
      taskId: timeSlotsData?.taskId ?? null,
      moduleName: STRINGS.WO_RECREATION,
    };
    dispatch(etskRegistrationActions.etskSetEvdPin(''));
    return api
      .post(queries.doPickPackAndWorkOrderCreationPrimaryAndSecondary, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.moduleName, {
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.attributes.Status]: true,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.attributes.SubscriberID]: reqDetails?.subscriberId,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.attributes.finalValidatedPacksArray]: finalPacks,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.attributes.rechargeAmount]: String(params?.rechargeAmount),
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.attributes.rechargeEvdPin]: params?.evdPin,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.attributes.requiredRechargeAmount]: finalPrice,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.attributes.selectedPackAndCategoriesArray]: selectedPacksArray,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.attributes.taskId]: timeSlotsData?.taskId ?? null,
          [MoengageMixpanelModules.WorkOrderRecreation.WorkorderRecreationRechargeConfirm.attributes.tskSerialNumber]: reqDetails?.tskSerialNumber,
        });
        dispatch(sliceActions.setWoSuccessData(data));
        dispatch(uiActions.hideBottomModal());
        if (data?.status) {
          navigate(ROUTE.WEB.WORK_ORDER_RECREATION_SUCCEESS);
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
 * dispatch(getOnlyPricePtForMultiTVInput({ exampleParam: 'exampleValue' }));
 */

export const getOnlyPricePtForMultiTVInput =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  async (dispatch) => {
    const requestInput = {
      input: {
        tskSerialNo: params?.tskDetails?.[0]?.TskSno,
      },
    };
    return api
      .post(queries.getOnlyPricePtForMultiTV, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          dispatch(sliceActions.setOnlyPricePtForMultiTVInput(data));
          dispatch(multiActions.etskMultiTvSetBoxTypeSelected(data?.boxType));
          dispatch(callAction({ ...params, ...data }, QUERY.GetSecMultiTVDtlsOrg, '', navigate));
          return { status: true, data };
        }
        dispatch(commonActions.setErrorMessage(data.message));
        dispatch(uiActions.clearLoader());
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(commonActions.setErrorMessage(error.message));
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
 * dispatch(getSecMultiTVDtlsOrg({ exampleParam: 'exampleValue' }));
 */

export const getSecMultiTVDtlsOrg =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  async (dispatch, getState) => {
    const { onlyPricePtForMultiTVInput } = getState().woRecreation;
    const requestInput = {
      input: {
        subscriberId: params?.subscriberInfo,
        boxType: params?.boxType,
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
            pricePoint: onlyPricePtForMultiTVInput?.pricePoints?.[0]?.PRICEPOINT,
            disableEditRechDhamakaMultiTV: data?.disableEditRechDhamakaMultiTVBoxChange,
          }),
        );
        navigate(ROUTE.WEB.WO_MULTI_TV_SUMMARY);
        return { status: true, data };
      })
      .catch((error) => {
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
 * dispatch(getSecMultiTVDtlsOrg({ exampleParam: 'exampleValue' }));
 */

export const getBoxTypes =
  (_params: ParentObject): AppThunk =>
  async (dispatch) =>
    api
      .post(queries.getBoxTypesFromProps, {})
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setWoTypesFromPropWO(data?.data?.woType));
        if (data?.status) {
          return { status: true, data };
        }
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
