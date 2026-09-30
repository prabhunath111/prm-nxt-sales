/**
 * it manage all primary tv related actions
 *
 * @module store/sales/actions/primaryTvRegistration
 *
 */
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { sliceActions as etskRegistrationActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions } from 'store/sales/reducer/primaryTvRegistration';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import {
  arePinsUnique,
  filterPackDetails,
  getDisabledCategoryMatch,
  getRechargeFlag,
  getSafeValue,
  isDhamakaCODCategory,
  refactorResponse,
  transformSelectedPacksArray,
} from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import { callAction, extractValues } from 'utils/formBuilderHelper';
import i18next from 'i18next';
import { etskRegSchedularType } from 'store/sales/types/etskRegSchedular';
import { sliceActions as regActions } from 'store/sales/reducer/etskRegSchedular';
import { sliceActions as quoteActions } from 'store/sales/reducer/quotation';
import commonActions from 'store/sales/actions/common';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { MoengageMixpanel } from 'services/moengageMixpanel';

let tskPinTimeoutId: ReturnType<typeof setTimeout>;

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const clearFormPrimaryTv = (): AppThunk => (dispatch, getState) => {
  const { etskTownLocality, isQuotationNavigate } = getState().quotation;
  const { tskValidateData } = getState().primaryTvRegistration;

  dispatch(etskRegistrationActions.etskSetCategorySelected(undefined));
  dispatch(etskRegistrationActions.etskSetDurationSelected(undefined));
  dispatch(etskRegistrationActions.etskSetSelectedPill(STRINGS.NEW_CUSTOMER_BEST_OFFERS));
  if (isQuotationNavigate) {
    dispatch(
      formActions.setUpdatedFormFields({
        town: etskTownLocality,
      }),
    );
    dispatch(formAction.setDropdownData({ data: [etskTownLocality], queryName: QUERY.LocationDropdown }));
  } else {
    dispatch(etskRegistrationActions.etskClearSelectedPacksToBuyData());
    dispatch(formAction.setDropdownData({ data: tskValidateData?.location, queryName: QUERY.LocationDropdown }));
    dispatch(etskRegistrationActions.etskSetPackSelected(''));
  }
};
export const clearFormRepushOrder = (): AppThunk => async (dispatch) => {
  dispatch(etskRegistrationActions.etskSetCategorySelected(undefined));
  dispatch(etskRegistrationActions.etskSetDurationSelected(undefined));
  dispatch(quoteActions.quotationEtskSetIsQuotationNavigate(false));
  dispatch(etskRegistrationActions.etskSetSelectedPill(STRINGS.NEW_CUSTOMER_BEST_OFFERS));
  dispatch(etskRegistrationActions.etskClearSelectedPacksToBuyData());
  dispatch(etskRegistrationActions.etskSetPackSelected(''));
  const noOfConnectionResponse: any = await dispatch(callAction({}, QUERY.ConnectionFilter));
  if (noOfConnectionResponse) {
    dispatch(formAction.setDropdownOptionsData({ data: noOfConnectionResponse?.connectionFilter, queryName: QUERY.ConnectionFilter }));
  }
};

export const validatePrimaryTSK =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch) => {
    dispatch(uiActions.setModalLoader());
    return api
      .post(queries[queryName], {
        input: { pincode: params.pincode, primaryTskPin: params.primaryTskPin },
      })
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status === i18next.t(`strings.true`)) {
          dispatch(sliceActions.setTskValidateData({ pincode: params.pincode }));
          tskPinTimeoutId = setTimeout(() => dispatch(formActions.setUpdatedFormFields({ ...params })), 500);
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationConnectionProceed.moduleName, {
            [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationConnectionProceed.attributes.parimaryTSKPin]: params.primaryTskPin,
            [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationConnectionProceed.attributes.Status]: true,
            [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationConnectionProceed.attributes.primaryBoxType]: params.primaryBoxType,
            [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationConnectionProceed.attributes.pincode]: params.pincode,
          });
          return { status: true, data: data.languageList };
        }
        const errorObj: Record<string, string> = {};

        if (data?.primaryTskPinError) {
          errorObj.primaryTskPin = '';
        }
        if (data?.pinCodeError) {
          errorObj.pincode = '';
        }

        if (Object.keys(errorObj).length > 0) {
          dispatch(formActions.setUpdatedFormFields(errorObj, STATE_KEY.MODAL_STATE));
        }

        dispatch(commonActions.setErrorMessage(data.message));

        MoengageMixpanel.trackEvent(MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationValidateTSK.moduleName, {
          [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationValidateTSK.attributes.parimaryTSKPin]: params.primaryTskPin,
          [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationValidateTSK.attributes.Status]: true,
          [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationValidateTSK.attributes.pincode]: params.pincode,
        });
        return { status: false, data };
      })
      .catch((error) => {
        dispatch(formActions.setUpdatedFormFields({ primaryTskPin: '' }, STATE_KEY.MODAL_STATE));
        dispatch(commonActions.setErrorMessage(error.message));
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationValidateTSK.moduleName, {
          [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationValidateTSK.attributes.parimaryTSKPin]: params.primaryTskPin,
          [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationValidateTSK.attributes.Status]: false,
          [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationValidateTSK.attributes.pincode]: params.pincode,
        });
        return { status: false, data: error };
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };

export const clearTskPinTimeout = (): AppThunk => () => {
  if (tskPinTimeoutId) {
    clearTimeout(tskPinTimeoutId);
  }
};

export const handelAlertConfirmation = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setIsBoxMismatchConfirmed(true));
};
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const validateSecondaryTSK =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch, getState) => {
    const { isQuotationNavigate, numberOfConnections, etskboxType, boxType1, boxType2, boxType3 } = getState().quotation;
    const { isBoxMismatchConfirmed } = getState().primaryTvRegistration;
    const reduxBoxes = [etskboxType, boxType1, boxType2, boxType3];
    const paramBoxes = [params?.primaryBoxType, params?.secondaryBoxType1, params?.secondaryBoxType2, params?.secondaryBoxType3];
    const connectionCount = numberOfConnections?.id || 1;

    const mismatchArray = reduxBoxes.slice(0, connectionCount).map((box, index) => box?.id !== paramBoxes[index]?.id);
    const hasMismatch = mismatchArray.includes(true);
    if (isQuotationNavigate) {
      if ((numberOfConnections?.id !== params?.numberOfConnections?.id || hasMismatch) && !isBoxMismatchConfirmed) {
        const alertMessage = i18next.t('errors.boxTypeChangeConfirmation');
        dispatch(
          uiActions.showAlert(
            alertMessage,
            ALERT.CONFIRM,
            {
              primaryText: MODAL.CONFIRM,
              isSecondaryRequire: true,
              queryName: 'handelAlertConfirmation',
              secondaryText: MODAL.CANCEL,
            },
            {},
          ),
        );
        return false;
      }
    }
    if (!arePinsUnique([params?.primaryTskPin, params?.secondaryTskPin1, params?.secondaryTskPin2, params?.secondaryTskPin3])) {
      const message = `${i18next.t('strings.TSKDuplicatePinMsg')}`;
      dispatch(uiActions.showErrorPage(message));
      return false;
    }
    dispatch(uiActions.setLoader());
    const filtered = extractValues(params);

    delete filtered?.submit;
    delete filtered.numberOfConnections;
    const { tskValidateData } = getState().primaryTvRegistration;
    // const { isQuotationNavigate } = getState().quotation;
    filtered.pincode = tskValidateData.pincode;
    filtered.secondaryBoxType1 = getSafeValue(params?.secondaryBoxType1);
    filtered.secondaryBoxType2 = getSafeValue(params?.secondaryBoxType2);
    filtered.secondaryBoxType3 = getSafeValue(params?.secondaryBoxType3);
    const requestInput = {
      input: filtered,
    };
    return api
      .post(queries[queryName], { ...requestInput })
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status === i18next.t(`strings.true`)) {
          dispatch(clearTskPinTimeout());
          dispatch(sliceActions.setIsBoxMismatchConfirmed(true));
          const filteredData = data?.response || {};
          dispatch(sliceActions.setTskValidateData({ ...filteredData }));
          dispatch(etskRegistrationActions.etskSetBoxTypeSelected(filteredData?.primaryBoxType));
          if (!isQuotationNavigate) {
            dispatch(formAction.setDropdownData({ data: filteredData?.location, queryName: QUERY.LocationDropdown }));
          }
          dispatch(formActions.setUpdatedFormFields({ pincode: filteredData?.pinCode, state: filteredData?.state }));
          return { status: true, data: filteredData };
        }
        dispatch(uiActions.showErrorPage(data.message));

        return { status: false, data };
      })
      .catch((error) => {
        dispatch(sliceActions.setIsBoxMismatchConfirmed(true));
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
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const languageList =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) =>
    api
      .post(queries[queryName], { input: { searchKeyword: params?.searchText } })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formAction.setDropdownData({ data: data?.languageList, queryName }));
        return { status: true, data: data.languageList };
      })
      .catch((error: ParentObject) => ({ status: false, data: error }));
/**
 * Displays the customer offer modal.
 *
 * @function customerOfferModal
 * @returns {void}
 */

export const primaryTvRegistrationModal =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(quoteActions.quotationEtskSetIsQuotationNavigate(false));
    dispatch(sliceActions.setIsBoxMismatchConfirmed(true));
    dispatch(quoteActions.quotationPrimarySetNumberOfConnections({}));
    dispatch(quoteActions.quotationEtskSetPrimaryBoxSelected({}));
    dispatch(quoteActions.etskSetBoxType1Selected({}));
    dispatch(quoteActions.etskSetBoxType2Selected({}));
    dispatch(quoteActions.etskSetBoxType3Selected({}));
    const dropDownData = {
      connectionFilter: [],
      boxTypesFilter: [],
    };
    dispatch(formAction.setMultipleDropdownOptionsData({ data: dropDownData }));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_FORM,
        headerTitle: HEADER_TITLE.PRIMARY_TV_REGISTRATION,
        showCloseIcon: params?.showCloseIcon || true,
        showHeader: true,
        formName: FORMS.primaryTvRegistration,
        headerIcon: ICONS.PRIMARY_TV_REGISTRATION,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

export const addDasSegmentValue =
  (params: any): AppThunk =>
  (dispatch) => {
    const salesSegment = params?.searchLocally?.object?.salesSegment;
    const value = salesSegment ? `${i18next.t('strings.DAS_SEGMENT')} ${salesSegment}` : i18next.t('strings.NO_DAS_AVAILABLE');
    dispatch(formActions.setUpdatedFormFields({ salesSegment: value }));
  };

/**
 * Validates a subscriber's information.
 *
 * @param {ParentObject} params - The parameters for the validation request.
 * @param {string} queryName - The name of the query to validate the subscriber.
 * @returns {AppThunk} A thunk action for dispatching.
 */

export const registrationDetailsSubmit =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch, getState) => {
    if (params?.buildingName && params.buildingName?.toLowerCase() === STRINGS.BUILDING) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.pleaseEnterBuilding') as unknown as string));
      return null;
    }
    const { tskValidateData } = getState().primaryTvRegistration;
    const { selectedPacksToBuy } = getState().etskRegistration;
    const townObject = params?.town?.object;
    const townObj = params?.town;
    const filterParam = { ...(extractValues(params) || {}) };
    filterParam.type = 'evd';
    filterParam.flag = '';
    filterParam.subId = '';
    filterParam.tskSerialNumber = '';
    filterParam.tskPin = tskValidateData?.primaryTskPin;
    filterParam.secondaryTskPin1 = tskValidateData?.secondaryTskPin1 || '';
    filterParam.secondaryTskPin2 = tskValidateData?.secondaryTskPin2 || '';
    filterParam.secondaryTskPin3 = tskValidateData?.secondaryTskPin3 || '';

    filterParam.tskSerialNumber1 = '';
    filterParam.tskSerialNumber2 = '';
    filterParam.tskSerialNumber3 = '';

    filterParam.secondaryTskPin1 = tskValidateData?.secondaryTskPin1 || '';
    filterParam.secondaryTskPin2 = tskValidateData?.secondaryTskPin2 || '';
    filterParam.secondaryTskPin3 = tskValidateData?.secondaryTskPin3 || '';

    filterParam.secondaryBoxType1 = tskValidateData?.secondaryBoxType1NT || '';
    filterParam.secondaryBoxType2 = tskValidateData?.secondaryBoxType2NT || '';
    filterParam.secondaryBoxType3 = tskValidateData?.secondaryBoxType3NT || '';

    filterParam.boxType = tskValidateData?.primaryBoxTypeNT;
    filterParam.das = townObject?.salesSegmentNT || townObj?.salesSegmentNT;
    filterParam.town = townObject?.location || townObj?.locationNT;
    filterParam.district = townObject?.district || townObj?.districtNT;
    filterParam.city = townObject?.city || townObj?.cityNT;
    filterParam.state = townObject?.state || townObj?.stateNT;
    filterParam.pincode = townObject?.pincode || townObj?.pincode;
    delete filterParam.salesSegment;

    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], { input: { ...filterParam } })
      .then((response) => {
        const data = refactorResponse(response);
        if (response?.status) {
          const monthlyPack = data.packageName?.[0]?.PackageInfo?.filter((pack: ParentObject) => pack.uom === i18next.t('strings.MONTHLY'));
          const subscriberData = {
            subscriberId: data.subId,
            customerName: `${params.firstName} ${params.lastName}`,
          };
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
          data.offerCategories = data.offerCategories.slice(0, -1);
          dispatch(formAction.setDealerDetails({ data: subscriberData, queryName }));
          // Just for testing need to be removed once testing is done
          // data.ocsFlag = 'Y';
          dispatch(
            etskRegistrationActions.etskSetAccountCreationSuccessData({
              ...data,
              pricePointPrimary: tskValidateData?.pricePointPrimary,
              pricePointSecondary1: tskValidateData?.pricePointSecondary1,
              pricePointSecondary2: tskValidateData?.pricePointSecondary2,
              pricePointSecondary3: tskValidateData?.pricePointSecondary3,
            }),
          );
          dispatch(etskRegistrationActions.etskSetCustomerDetailsData({ ...filterParam, customerName: `${params.firstName} ${params.lastName}` }));
          dispatch(etskRegistrationActions.etskSetFiltersData(filterData));
          dispatch(etskRegistrationActions.etskSetFreePackSelected(monthlyPack?.packNameNT ?? ''));
          dispatch(etskRegistrationActions.etskSetPrimaryBoxPrice(monthlyPack?.pricePt ?? '0'));

          dispatch(etskRegistrationActions.etskSetCategoryDropdownData(data.PopularPacks));
          dispatch(etskRegistrationActions.etskSetDurationDropdownData(data.durations));
          const popularPackNames = data.PopularPacks.map((p: ParentObject) => p.nameNT);
          selectedPacksToBuy
            .filter((item: ParentObject) => item?.pill === STRINGS.NEW_CUSTOMER_BEST_OFFERS && !popularPackNames.includes(item?.category?.nameNT))
            .forEach((item: ParentObject) => dispatch(etskRegistrationActions.etskRemoveSelectedPacksToBuyData(item)));
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationCustomerdetailsProceed.moduleName, {
            [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationCustomerdetailsProceed.attributes.input]: filterParam,
            [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationCustomerdetailsProceed.attributes.Status]: true,
          });
          return { status: true, data };
        }

        dispatch(uiActions.showErrorPage(data?.message));
        return { status: false, data };
      })
      .catch((error) => {
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
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const getPacks =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { packSelected, accountCreationSuccessData } = getState().etskRegistration;
    const { value, filters } = params;
    const requestInput = {
      category: value.nameNT,
      boxType: accountCreationSuccessData?.boxTypeNT || accountCreationSuccessData?.boxType,
      etskSelectedOffer: packSelected,
    };
    return api
      .post(queries[queryName], requestInput)
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
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const getRentalPackNew =
  (_params: any, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    dispatch(commonActions.reSetErrorMessage());
    const { tskValidateData } = getState().primaryTvRegistration;
    const { accountCreationSuccessData, packSelected, selectedPacksToBuy, freePackSelected } = getState().etskRegistration;
    const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelNameNT);
    if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
      finalPacks.unshift(freePackSelected);
    }
    const finalPrice = selectedPacksToBuy.reduce((sum: number, curr: ParentObject) => sum + Number(curr.price), 0);

    const requestInput = {
      subscriberId: accountCreationSuccessData.subId || accountCreationSuccessData.subscriberId,
      selectedPacksTogetRentalUniqueArray: finalPacks,
      boxType: tskValidateData?.primaryBoxType || accountCreationSuccessData?.boxTypeNT || accountCreationSuccessData?.boxType,
      bookingFormNumber: accountCreationSuccessData.bookingFormNumber,
      etskSelectedOffer: packSelected,
      packPriceFe: String(finalPrice),
      tskSerialNumber: accountCreationSuccessData.tskSerialNumber,
      tskPin: accountCreationSuccessData?.tskPin,

      tskSerialNumber1: accountCreationSuccessData?.tskSerialNumber1,
      tskSerialNumber2: accountCreationSuccessData?.tskSerialNumber2,
      tskSerialNumber3: accountCreationSuccessData?.tskSerialNumber3,

      boxType1: accountCreationSuccessData?.secondaryBoxType1NT,
      boxType2: accountCreationSuccessData?.secondaryBoxType2NT,
      boxType3: accountCreationSuccessData?.secondaryBoxType3NT,
    };

    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          dispatch(etskRegistrationActions.etskSetValidatePacksSuccessData({ ...data?.result, noOfConnection: data?.result?.connections }));
          return true;
        }
        dispatch(uiActions.showErrorPage(data.message));
        dispatch(commonActions.setErrorMessage(data.message));
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationPickPackProceed.moduleName, {
          [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationPickPackProceed.attributes.Status]: true,
          [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationPickPackProceed.attributes.variables]: requestInput,
        });
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.RepushOrder.RepushOrderPickPackProceed.moduleName, {
          [MoengageMixpanelModules.RepushOrder.RepushOrderPickPackProceed.attributes.Status]: true,
          [MoengageMixpanelModules.RepushOrder.RepushOrderPickPackProceed.attributes.variables]: requestInput,
        });
        return false;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(commonActions.setErrorMessage(error.message));

        return false;
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
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const primaryTvRegSubmissionConfirmation =
  (params: etskRegSchedularType): AppThunk =>
  (dispatch, getState) => {
    const { evdPin, rechargeAmount } = params;
    const message = i18next.t('strings.amountDeductionMsg', { amount: rechargeAmount });
    const { accountCreationSuccessData, finalPrice, selectedPacksToBuy, freePackSelected, validatePacksSuccessData } = getState().etskRegistration;

    dispatch(etskRegistrationActions.etskSetPaidPrice(Math.ceil(Number(rechargeAmount)).toString()));
    const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelNameNT);
    if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
      finalPacks.unshift(freePackSelected);
    }
    const isDhamakaoffer = isDhamakaCODCategory(selectedPacksToBuy);

    const { selectedSlot, timeSlotsData } = getState().etskRegSchedular || {};

    const selectedPacksArray = transformSelectedPacksArray(selectedPacksToBuy);
    const disableLDPPacks = accountCreationSuccessData?.disableLDPPacks || [];
    const rechargeFlag = getRechargeFlag(selectedPacksToBuy, disableLDPPacks);
    selectedPacksArray.unshift(`${freePackSelected}~BasicPacks`);

    const [startTime, endTime] = (selectedSlot ?? '').split(' - ');
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationSummaryProceed.moduleName, {
      [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationSummaryProceed.attributes.Status]: true,
      [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationSummaryProceed.attributes.SubscriberID]:
        accountCreationSuccessData.subId || accountCreationSuccessData.subscriberId,
      [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationSummaryProceed.attributes.packageName]: freePackSelected,
      [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationSummaryProceed.attributes.rechargeAmount]: String(rechargeAmount),
      [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationSummaryProceed.attributes.requiredRechargeAmount]: finalPrice,
    });
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.RepushOrder.RepushOrderSummaryProceed.moduleName, {
      [MoengageMixpanelModules.RepushOrder.RepushOrderSummaryProceed.attributes.Status]: true,
      [MoengageMixpanelModules.RepushOrder.RepushOrderSummaryProceed.attributes.packageName]: accountCreationSuccessData.subId || accountCreationSuccessData.subscriberId,
      [MoengageMixpanelModules.RepushOrder.RepushOrderSummaryProceed.attributes.rechargeAmount]: String(rechargeAmount),
      [MoengageMixpanelModules.RepushOrder.RepushOrderSummaryProceed.attributes.requiredRechargeAmount]: finalPrice,
      [MoengageMixpanelModules.RepushOrder.RepushOrderSummaryProceed.attributes.subscriberId]: accountCreationSuccessData.subId || accountCreationSuccessData.subscriberId,
    });
    const requestInput = {
      subscriberId: accountCreationSuccessData.subId || accountCreationSuccessData.subscriberId,
      packageName: freePackSelected,
      finalValidatedPacksArray: finalPacks,
      rechargeAmount: String(rechargeAmount),
      tskSerialNumber: accountCreationSuccessData.tskSerialNumber,
      tskSerialNumber1: accountCreationSuccessData?.tskSerialNumber1 || null,
      tskSerialNumber2: accountCreationSuccessData?.tskSerialNumber2 || null,
      tskSerialNumber3: accountCreationSuccessData?.tskSerialNumber3 || null,
      orderId: timeSlotsData?.orderId ?? null,
      package1: validatePacksSuccessData?.noOfConnection > 1 ? validatePacksSuccessData?.packToAdd : null,
      package2: validatePacksSuccessData?.noOfConnection > 2 ? validatePacksSuccessData?.packToAdd : null,
      package3: validatePacksSuccessData?.noOfConnection > 3 ? validatePacksSuccessData?.packToAdd : null,
      requiredRechargeAmount: finalPrice,
      selectedPackAndCategoriesArray: selectedPacksArray,
      rechargeEvdPin: evdPin,
      // recharge flag will added as per pack category like ['S', 'D2', 'Binge', 'N]
      rechargeFlag,
      flexiFlag: '0',
      bingeSelected: accountCreationSuccessData.bingeEligible,
      typeUser: 'EVD',
      // when ocsFlag true only then need to send
      ocsFlag: accountCreationSuccessData.ocsFlag,
      startTime: startTime || null,
      endTime: endTime || null,
      taskId: timeSlotsData?.taskId ?? null,
      isDhamakaoffer,
    };
    dispatch(etskRegistrationActions.etskSetEvdPin(evdPin));
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
          queryName: QUERY.PrimaryTskSchedular,
          queryParams: { ...requestInput },
          secondaryQueryName: QUERY.RechargeDetails,
          secondaryQueryParams: FORMS.primaryRechargeDetails,
          hasOutline: true,
        },
      }),
    );
    return { params, status: true };
  };

export const primaryTskSchedular =
  (params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    const { accountCreationSuccessData } = getState().etskRegistration;
    dispatch(uiActions.setModalLoader());
    dispatch(etskRegistrationActions.etskSetEvdPin(''));
    return api
      .post(queries.doPickPackAndWorkOrderCreationPrimaryAndSecondary, params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          dispatch(regActions.setCreateWoEtskSuccessData({ response: { ...data?.result, woNumber: data?.woNumber } }));
          let routeToRedirect = ROUTE.WEB.PRIMARY_TV_REG_SUCCESS;
          if (['07', '08', '09', '10'].includes(accountCreationSuccessData?.code)) {
            routeToRedirect = ROUTE.WEB.RE_PUSH_ORDER_SUCCESS;
          }
          navigate(routeToRedirect);
          return { status: true, routeName: routeToRedirect };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data?.message));
        return { status: false, message: data?.message };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error?.message));
        return { status: false, message: error?.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const primaryTvFillAmount =
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
    if (hasMatchedPack?.rechargeEnabled === 'N') {
      tskPinTimeoutId = setTimeout(() => {
        dispatch(formActions.setFieldsToDisable({ fieldName: STRINGS.RECHARGE_AMOUNT_FIELD }, STATE_KEY.MODAL_STATE));
      }, 200);
    }
  };

// ====================== Re-push order ======================
/**
 * Validates a tsk pin's to complete re-push order.
 *
 * @param {ParentObject} params - The parameters for the validation request.
 * @param {string} queryName - The name of the query to validate the subscriber.
 * @returns {AppThunk} A thunk action for dispatching.
 */

export const getDetailsRepush =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch, getState) => {
    if (!arePinsUnique([params?.tskPin, params?.tskPin1, params?.tskPin2, params?.tskPin3])) {
      const message = `${i18next.t('strings.TSKDuplicatePinMsg')}`;
      dispatch(uiActions.showErrorPage(message));
      return false;
    }

    const filterParam = {
      userName: '',
      type: '',
      tskPin: params?.tskPin ?? null,
      tskPin1: params?.tskPin1 ?? null,
      tskPin2: params?.tskPin2 ?? null,
      tskPin3: params?.tskPin3 ?? null,
      flowName: STRINGS.REPUSH_ORDER,
    };

    const { info } = getState().user;
    filterParam.userName = info?.userId;
    filterParam.type = 'EVD';

    dispatch(uiActions.setLoader());

    try {
      const response = await api.post(queries[queryName], {
        input: { ...filterParam },
      });

      let data = refactorResponse(response);

      const code = data?.code;

      if (['01', '03', '04', '05', '06'].includes(code)) {
        return { status: false, data };
      }
      if (code === '00' || code === '11') {
        dispatch(uiActions.showErrorPage(data?.message));
        return { status: false, data };
        // } else if (['09', '10'].includes(code)) {
        // setOrderID(res.orderId || '');
        // setActiveScreen('packs');
        // openScreenThreeFilled(res);
        // return { status: true, data, routeName: ROUTE.WEB.RE_PUSH_ORDER_SUMMARY };
        // } else if (code === '08') {
        // setOrderID('');
        // setActiveScreen('packs');
        // openScreenThreeFilled(res);
        // return { status: true, data, routeName: ROUTE.WEB.RE_PUSH_ORDER_SUMMARY };
      }
      if (['07', '08', '09', '10'].includes(code)) {
        const requestObject = {
          subscriberId: data?.subscriberId,
          channel: data?.channelName,
          outlet: data?.outletType,
          version: null,
          roleId: info?.roleId,
        };

        const packResponse: any = await dispatch(callAction({ ...requestObject }, QUERY.GetAllRePushPacksProp));

        data = { ...data, ...packResponse?.data };

        const subscriberData = {
          subscriberId: data.subscriberId,
          customerName: `${data.firstName} ${data.lastName}`,
        };
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
        const pricePointPrimary = data?.pricePoint || 0;
        const pricePointSecondary1 = data?.secondary_1?.pricePoint || 0;
        const pricePointSecondary2 = data?.secondary_2?.pricePoint || 0;
        const pricePointSecondary3 = data?.secondary_3?.pricePoint || 0;
        dispatch(sliceActions.setTskValidateData({ pricePointPrimary, pricePointSecondary1, pricePointSecondary2, pricePointSecondary3 }));
        data = { ...data, pricePointPrimary, pricePointSecondary1, pricePointSecondary2, pricePointSecondary3 };
        data.offerCategories = data.offerCategories.slice(0, -1);
        // Just for testing need to be removed once testing is done
        // data.ocsFlag = 'Y';
        dispatch(formAction.setDealerDetails({ data: subscriberData, queryName }));
        dispatch(
          etskRegistrationActions.etskSetAccountCreationSuccessData({
            ...data,
            tskSerialNumber1: data?.secondary_1?.tskSerialNumber,
            tskSerialNumber2: data?.secondary_2?.tskSerialNumber,
            tskSerialNumber3: data?.secondary_3?.tskSerialNumber,
            secondaryBoxType1: data?.secondary_1?.boxType,
            secondaryBoxType2: data?.secondary_2?.boxType,
            secondaryBoxType3: data?.secondary_3?.boxType,
            secondaryBoxType1NT: data?.secondary_1?.boxTypeNT,
            secondaryBoxType2NT: data?.secondary_2?.boxTypeNT,
            secondaryBoxType3NT: data?.secondary_3?.boxTypeNT,
          }),
        );

        dispatch(
          etskRegistrationActions.etskSetCustomerDetailsData({
            customerName: `${data?.firstName} ${data?.lastName}`,
            district: data?.district,
            city: data?.city,
            state: data?.state,
            ...data?.accInfo,
          }),
        );

        dispatch(etskRegistrationActions.etskSetFiltersData(filterData));
        dispatch(etskRegistrationActions.etskSetCategoryDropdownData(data.PopularPacks));
        dispatch(etskRegistrationActions.etskSetDurationDropdownData(data.durations));
        dispatch(etskRegistrationActions.etskSetBoxTypeSelected(data?.boxType));

        return { status: true, data, routeName: ROUTE.WEB.RE_PUSH_ORDER_CHANNELS };
      }
      // ✅ This ensures a return in all code paths
      return { status: false, message: data?.message };
    } catch (error: any) {
      dispatch(uiActions.showErrorPage(error.message));
      return { status: false, error: error.message };
    } finally {
      dispatch(uiActions.clearLoader());
    }
  };

/**
 * Adds an offer pack for a customer by making an API call.
 *
 * @function getAllRePushPacksProp
 * @param {ParentObject} params - The parameters required to add the offer pack.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */

export const getAllRePushPacksProp =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    return api
      .post(queries.getAllRePushPacksProp, { input: params })
      .then((response) => {
        const data = refactorResponse(response);
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
