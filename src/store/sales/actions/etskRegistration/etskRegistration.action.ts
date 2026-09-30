/**
 * This is to add the actions for etsk registration module
 *
 * @module store/sales/actions/etskRegistration
 *
 */
import { sliceActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse, filterPackDetails, transformPacksArray, transformSelectedPacksArray, getDisableValue } from 'utils/responseHelper';
import { ALERT, CHILD_TYPE, HEADER_TITLE, MODAL, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import i18next from 'i18next';
import { etskRegSchedularType } from 'store/sales/types/etskRegSchedular';
import { sliceActions as regActions } from 'store/sales/reducer/etskRegSchedular';
import { sliceActions as primaryActions } from 'store/sales/reducer/primaryTvRegistration';
import { sliceActions as multiActions } from 'store/sales/reducer/etskMultiTv';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import commonActions from 'store/sales/actions/common';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(etskRegistrationAction({ exampleParam: 'exampleValue' }));
 */

let finalAmountTimeoutId: ReturnType<typeof setTimeout>;

export const clearFormETSK = (): AppThunk => (dispatch, getState) => {
  MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_PageVisit.moduleName, {
    Status: true,
  });
  const { isQuotationNavigate, etskPincode, etskTownLocality, etskOfferSelected, etskboxType, boxType1, boxType2, boxType3, etskOfferType, numberOfConnections } =
    getState().quotation;
  const { accountCreationSuccessData } = getState().etskRegistration;
  if (isQuotationNavigate) {
    dispatch(
      formActions.setUpdatedFormFields({
        customerDetailsPinCode: etskPincode,
        customerDetailsTownLocality: etskTownLocality,
        customerDetailsOfferType: etskOfferSelected,
        customerDetailsPrimaryBox: etskboxType,
        customerDetailsSecondaryBox1: boxType1,
        customerDetailsSecondaryBox2: boxType2,
        customerDetailsSecondaryBox3: boxType3,
      }),
    );
    dispatch(
      formAction.setMultipleAutoCompleteData({
        data: {
          locationDropdown: [etskTownLocality],
          etskOffersDropDown: etskOfferType,
          primboxTypes: [etskboxType],
          languages: accountCreationSuccessData?.languagesDropdown,
        },
      }),
    );

    finalAmountTimeoutId = setTimeout(() => {
      dispatch(formActions.setFieldsToDisable({ fieldName: STRINGS.CUSTOMER_DETAILS_PINCODE }));
      if (numberOfConnections?.nameNT > 3) {
        dispatch(formActions.setFieldsToShow(['customerDetailsSecondaryBox1', 'customerDetailsSecondaryBox2', 'customerDetailsSecondaryBox3']));
      } else if (numberOfConnections?.nameNT > 2) {
        dispatch(formActions.setFieldsToShow(['customerDetailsSecondaryBox1', 'customerDetailsSecondaryBox2']));
      } else if (numberOfConnections?.nameNT > 1) {
        dispatch(formActions.setFieldsToShow(['customerDetailsSecondaryBox1']));
      }
    }, 200);
  } else {
    dispatch(
      formAction.setUpdatedFormFields({
        customerDetailsTownLocality: '',
        customerDetailsPrimaryLanguage: '',
        customerDetailsSecondaryLanguage: '',
        customerDetailsOfferType: '',
        customerDetailsPrimaryBox: '',
        customerDetailsSecondaryBox1: '',
        customerDetailsSecondaryBox2: '',
        customerDetailsSecondaryBox3: '',
      }),
    );
    dispatch(sliceActions.setEtskAlertConfirm(true));
    dispatch(formAction.setMultipleDropdownOptionsData({ primboxTypes: [], categoryDropdown: [], durationDropdown: [] }));
    dispatch(sliceActions.etskClearSelectedPacksToBuyData());
  }
  dispatch(sliceActions.etskSetCategorySelected(undefined));
  dispatch(sliceActions.etskSetDurationSelected(undefined));
  dispatch(sliceActions.etskSetSelectedPill(STRINGS.NEW_CUSTOMER_BEST_OFFERS));
  dispatch(primaryActions.setTskValidateData({}));
  dispatch(multiActions.etskSetMultiBoxSelectedDetails({}));
};

export const validatePincode =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(
      formActions.setUpdatedFormFields({
        customerDetailsTownLocality: '',
        customerDetailsPrimaryLanguage: '',
        customerDetailsSecondaryLanguage: '',
        customerDetailsOfferType: '',
        customerDetailsPrimaryBox: '',
        customerDetailsSecondaryBox1: '',
        customerDetailsSecondaryBox2: '',
        customerDetailsSecondaryBox3: '',
      }),
    );
    dispatch(formActions.setMultipleDropdownOptionsData({ primboxTypes: [] }));
    dispatch(formAction.setMultipleAutoCompleteData({ data: { locationDropdown: [], languages: [], etskOffersDropDown: [] } }));
    if (!params?.customerDetailsPinCode) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.emptyPinCode') as unknown as string));
      return null;
    }
    if (params.customerDetailsPinCode.length !== 6) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.invalidPincode') as unknown as string));
      return null;
    }
    const { info } = getState().user;

    dispatch(uiActions.setLoader());
    const requestInput = {
      pincode: params?.customerDetailsPinCode,
      userName: info.mdn,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (response?.status) {
          const updatedData = {
            ...data,
            locationDropdown: data.locations.dropdown,
          };
          dispatch(sliceActions.etskSetValidatePinCodeSuccessData(updatedData));
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSKRegistration.ValidatePin.moduleName, {
            [MoengageMixpanelModules.eTSKRegistration.ValidatePin.attributes.Status]: true,
            [MoengageMixpanelModules.eTSKRegistration.ValidatePin.attributes.pincode]: params?.customerDetailsPinCode,
            [MoengageMixpanelModules.eTSKRegistration.ValidatePin.attributes.userName]: info.mdn,
          });
          dispatch(formAction.setMultipleAutoCompleteData({ data: updatedData, queryName }));
          return data;
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data.message));
        return { status: false, message: data.message };
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const changeSubBoxTypes =
  (params: any, queryName: string): AppThunk =>
  (dispatch) => {
    if (params?.searchLocally) {
      const boxTypeArr = params?.searchLocally?.BOX_TYPE;
      const updatedOptions = [{ name: i18next.t('strings.PLEASE_SELECT_BOX_TYPE'), value: undefined }, ...boxTypeArr];
      const data = {
        boxTypes: updatedOptions,
        primboxTypes: boxTypeArr,
      };
      dispatch(formActions.setUpdatedFormFields({ customerDetailsPrimaryBox: '', quoteETSKPrimaryBox: '' }));
      dispatch(formAction.setMultipleAutoCompleteData({ data, queryName }));
    }
  };
export const changeCategory =
  (params: string, _queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { accountCreationSuccessData } = getState().etskRegistration;
    const packMap: Record<string, ParentObject[]> = {
      [STRINGS.NEW_CUSTOMER_BEST_OFFERS]: accountCreationSuccessData.PopularPacks,
      [STRINGS.TATAPLAY_BOUQUETS_CATEGORY]: accountCreationSuccessData.TataskyPacks,
      [STRINGS.BROADCASTER_BOUQUETS_CATEGORY]: accountCreationSuccessData.BroadCastPacks,
      [STRINGS.ALACARTE_CHANNEL_CATEGORY]: accountCreationSuccessData.AlacartePacks,
      [STRINGS.BINGE_PLUS_CATEGORY]: accountCreationSuccessData.BingeplusPacks,
    };

    const selectedCategory = packMap[params] || [];

    dispatch(sliceActions.etskSetCategoryDropdownData(selectedCategory));
    dispatch(sliceActions.etskSetDurationDropdownData(accountCreationSuccessData.durations));
  };

export const handelAlertConfirmationEtsk = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setEtskAlertConfirm(true));
};

export const createAccountETSK =
  (params: any, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { redirectParams, isQuotationNavigate } = getState().quotation;
    const { etskAlertConfirm } = getState().etskRegistration;

    const getBoxId = (box: any) => box?.object?.valueNT ?? null;

    const isBoxChanged =
      getBoxId(redirectParams?.quoteETSKPrimaryBox) !== getBoxId(params?.customerDetailsPrimaryBox) ||
      getBoxId(redirectParams?.quoteETSKSecondaryBox1) !== getBoxId(params?.customerDetailsSecondaryBox1) ||
      getBoxId(redirectParams?.quoteETSKSecondaryBox2) !== getBoxId(params?.customerDetailsSecondaryBox2) ||
      getBoxId(redirectParams?.quoteETSKSecondaryBox3) !== getBoxId(params?.customerDetailsSecondaryBox3);
    if (isQuotationNavigate) {
      if (isBoxChanged && !etskAlertConfirm) {
        const alertMessage = i18next.t('errors.boxTypeChangeConfirmation');

        dispatch(
          uiActions.showAlert(
            alertMessage,
            ALERT.CONFIRM,
            {
              primaryText: MODAL.CONFIRM,
              isSecondaryRequire: true,
              queryName: 'handelAlertConfirmationEtsk',
              secondaryText: MODAL.CANCEL,
            },
            {},
          ),
        );

        return null;
      }
    }
    if (params?.customerDetailsSecondaryBox3?.object?.value) {
      if (!params?.customerDetailsSecondaryBox1?.object?.value) {
        dispatch(uiActions.showErrorPage(i18next.t('strings.sec1sec2BoxEnter') as unknown as string));
        return null;
      }
      if (!params?.customerDetailsSecondaryBox2?.object?.value) {
        dispatch(uiActions.showErrorPage(i18next.t('strings.sec2BoxEnter') as unknown as string));
        return null;
      }
    }
    if (params?.customerDetailsSecondaryBox2?.object?.value && !params?.customerDetailsSecondaryBox1?.object?.value) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.sec1OnlyBoxEnter') as unknown as string));
      return null;
    }
    if (params?.customerDetailsBuilding && params.customerDetailsBuilding?.toLowerCase() === STRINGS.BUILDING) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.pleaseEnterBuilding') as unknown as string));
      return null;
    }
    dispatch(uiActions.setLoader());
    const { validatePinCodeSuccessData, selectedPacksToBuy } = getState().etskRegistration;
    const { info } = getState().user;
    const packPriceFe = selectedPacksToBuy.reduce((sum: number, curr: ParentObject) => sum + Number(curr.price), 0);

    const {
      customerDetailsAddressLine1,
      customerDetailsAddressLine2,
      customerDetailsPrimaryBox,
      customerDetailsBuilding,
      customerDetailsEmailId,
      customerDetailsOfferType,
      customerDetailsFirstName,
      customerDetailsLandmark,
      customerDetailsPrimaryLanguage,
      customerDetailsLastName,
      customerDetailsPrimaryMobileNumber,
      customerDetailsPinCode,
      customerDetailsSecondaryLanguage,
      customerDetailsSecondaryMobileNumber,
      customerDetailsSecondaryBox1,
      customerDetailsSecondaryBox2,
      customerDetailsSecondaryBox3,
      customerDetailsTownLocality,
    } = params;
    const requestInput = {
      input: {
        addressLine1: customerDetailsAddressLine1,
        addressLine2: customerDetailsAddressLine2,
        boxType: customerDetailsPrimaryBox?.object?.valueNT,
        buildingName: customerDetailsBuilding,
        city: validatePinCodeSuccessData.cityNT,
        district: validatePinCodeSuccessData.districtNT,
        emailAddress: customerDetailsEmailId,
        etskSelectedOffer: customerDetailsOfferType.nameNT,
        firstName: customerDetailsFirstName,
        landmark: customerDetailsLandmark,
        language: customerDetailsPrimaryLanguage.nameNT,
        lastName: customerDetailsLastName,
        mobileNo: customerDetailsPrimaryMobileNumber,
        pincode: customerDetailsPinCode,
        sec_lang: customerDetailsSecondaryLanguage?.nameNT,
        secondaryMobileNo: customerDetailsSecondaryMobileNumber,
        secondary_One_BoxType: customerDetailsSecondaryBox1?.object?.valueNT,
        secondary_Three_BoxType: customerDetailsSecondaryBox3?.object?.valueNT,
        secondary_Two_BoxType: customerDetailsSecondaryBox2?.object?.valueNT,
        state: validatePinCodeSuccessData.stateNT,
        town: customerDetailsTownLocality?.locationNT,
        type: STRINGS.EVD,
        userName: info.userId,
        das: customerDetailsTownLocality?.salesSegmentNT,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (response?.status) {
          const subscriberData = {
            subscriberId: data.subID,
            customerName: `${params.customerDetailsFirstName} ${params.customerDetailsLastName}`,
            bookingFormNumber: data.bookingFormNumber,
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
          const monthlyPack = data.packageName?.[0]?.PackageInfo?.filter((pack: ParentObject) => pack.uom === i18next.t('strings.MONTHLY'));
          dispatch(formAction.setDealerDetails({ data: subscriberData, queryName }));
          data.offerCategories = data.offerCategories.slice(0, -1);
          dispatch(sliceActions.etskSetAccountCreationSuccessData(data));
          dispatch(sliceActions.etskSetCustomerDetailsData({ ...requestInput.input, customerName: `${params.customerDetailsFirstName} ${params.customerDetailsLastName}` }));
          dispatch(sliceActions.etskSetFiltersData(filterData));
          dispatch(sliceActions.etskSetPackSelected(params.customerDetailsOfferType.nameNT));
          dispatch(sliceActions.etskSetBoxTypeSelected(customerDetailsPrimaryBox?.object?.valueNT));
          dispatch(sliceActions.etskSetFreePackSelected(monthlyPack?.packNameNT ?? ''));
          dispatch(sliceActions.etskSetPrimaryBoxPrice(monthlyPack?.pricePt ?? '0'));

          dispatch(sliceActions.etskSetCategoryDropdownData(data.PopularPacks));
          dispatch(sliceActions.etskSetDurationDropdownData(data.durations));
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.moduleName, {
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.Status]: true,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.SubscriberID]: data.subID,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.bookingFormNumber]: data.bookingFormNumber,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.boxType]: customerDetailsPrimaryBox?.object?.valueNT,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.etskSelectedOffer]: customerDetailsOfferType.nameNT,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.packPriceFe]: packPriceFe,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.secondary_One_BoxType]: customerDetailsSecondaryBox1?.object?.valueNT,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.secondary_Three_BoxType]: customerDetailsSecondaryBox3?.object?.valueNT,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.secondary_Two_BoxType]: customerDetailsSecondaryBox2?.object?.valueNT,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceed.attributes.selectedPcaksTogetRentalUniqueArray]: '',
          });
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage_Visit.moduleName, {
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage_Visit.attributes.Status]: true,
          });
          return { status: true, data };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data.message));
        return { status: false, message: data.message };
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const doGetPacksETSK =
  (params: any, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { boxTypeSelected, packSelected } = getState().etskRegistration;
    const { value, filters } = params;
    const requestInput = {
      category: value.nameNT,
      boxType: boxTypeSelected,
      etskSelectedOffer: packSelected,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (response?.status) {
          const filteredData = filterPackDetails(data.packDetails, filters);
          dispatch(sliceActions.etskSetCategorySelectionPacksData(filteredData));
          return data;
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data.message));
        return { status: false, message: data.message };
      })
      .catch((error) => {
        dispatch(sliceActions.etskSetCategorySelectionPacksData([]));
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const doGetRentlPackETSK =
  (_params: any, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    dispatch(commonActions.reSetErrorMessage());
    const { accountCreationSuccessData, boxTypeSelected, packSelected, selectedPacksToBuy, freePackSelected } = getState().etskRegistration;
    const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelNameNT);
    if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
      finalPacks.unshift(freePackSelected);
    }
    const finalPrice = selectedPacksToBuy.reduce((sum: number, curr: ParentObject) => sum + Number(curr.price), 0);
    const requestInput = {
      subscriberId: accountCreationSuccessData.subID,
      selectedPcaksTogetRentalUniqueArray: finalPacks,
      boxType: boxTypeSelected,
      bookingFormNumber: accountCreationSuccessData.bookingFormNumber,
      etskSelectedOffer: packSelected,
      packPriceFe: finalPrice,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSK_Repush.eTSKRepush_SummaryPageProceed.moduleName, {
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_SummaryPageProceed.attributes.Status]: true,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_SummaryPageProceed.attributes.SubscriberID]: accountCreationSuccessData?.subID,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_SummaryPageProceed.attributes.bookingFormNumber]: accountCreationSuccessData?.bookingFormNumber,
        });
        if (response?.status) {
          dispatch(sliceActions.etskSetValidatePacksSuccessData(data));
          return data;
        }
        dispatch(uiActions.hideBottomModal());
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

export const getPackagesURLsTrai =
  (params: any, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const addDasValue =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const value = params?.searchLocally?.salesSegment ? `${i18next.t('strings.DAS_SEGMENT')} ${params?.searchLocally?.salesSegment}` : i18next.t('strings.NO_DAS_AVAILABLE');
    dispatch(formActions.setUpdatedFormFields({ customerDetailsDAS: value }));
  };
export const avoidZero =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const mobileFields = [
      { key: 'primaryNumber', field: 'customerDetailsPrimaryMobileNumber' },
      { key: 'secondaryNumber', field: 'customerDetailsSecondaryMobileNumber' },
    ];

    mobileFields.forEach(({ key, field }) => {
      if (params?.[key]?.startsWith('0')) {
        dispatch(formActions.setUpdatedFormFields({ [field]: '' }));
      }
    });
  };

export const fillAmount =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { finalPrice, flexiPlan, evdPin, paidPrice, packSelected } = getState().etskRegistration;
    const { boxSelectedDetails } = getState().etskMultiTv;
    let toBeFilledAmount = finalPrice;
    if (Number(paidPrice) > 0) {
      toBeFilledAmount = paidPrice;
    }
    const hasMatchedPack = getDisableValue(packSelected);

    dispatch(formActions.setUpdatedFormFields({ rechargeAmount: toBeFilledAmount, evdPin }, STATE_KEY.MODAL_STATE));
    if (flexiPlan !== 0 || boxSelectedDetails?.disableEditRechDhamakaMultiTV === STRINGS.YES || hasMatchedPack === STRINGS.NO) {
      finalAmountTimeoutId = setTimeout(() => {
        dispatch(formActions.setFieldsToDisable({ fieldName: STRINGS.RECHARGE_AMOUNT_FIELD }, STATE_KEY.MODAL_STATE));
      }, 200);
    }
  };

export const clearFinalAmountTimeout = (): AppThunk => () => {
  if (finalAmountTimeoutId) {
    clearTimeout(finalAmountTimeoutId);
  }
};

export const eTskRegSubmissionConfirmation =
  (params: etskRegSchedularType): AppThunk =>
  (dispatch, getState) => {
    const amount = params.rechargeAmount;
    const { validatePacksSuccessData } = getState().etskRegistration;

    if (Math.ceil(Number(amount)) < Number(validatePacksSuccessData?.eTSKMinRechargeAmount ?? '0')) {
      dispatch(commonActions.setErrorMessage(`${i18next.t('strings.minRechargeAmount')} ${Number(validatePacksSuccessData?.eTSKMinRechargeAmount ?? '0')}`));
      dispatch(formActions.setUpdatedFormFields({ rechargeAmount: Number(validatePacksSuccessData?.eTSKMinRechargeAmount ?? '0').toString() }, STATE_KEY.MODAL_STATE));
      return null;
    }
    const { evdPin } = params;
    const message = i18next.t('strings.amountDeductionMsg', { amount });
    const { accountCreationSuccessData, packSelected, finalPrice, selectedPacksToBuy, freePackSelected, primaryBoxPrice, flexiPlan } = getState().etskRegistration;
    const { date } = getState().etskSchedular || {};
    const { selectedSlot, timeSlotsData } = getState().etskRegSchedular || {};
    const { info } = getState().user;

    const selectedPacksArray = transformPacksArray(selectedPacksToBuy);
    selectedPacksArray.unshift({
      Packs: freePackSelected,
      Price: primaryBoxPrice,
    });
    const selectedAllPacksCategoryETSKBE = transformSelectedPacksArray(selectedPacksToBuy);
    selectedAllPacksCategoryETSKBE.unshift(`${freePackSelected}~BasicPacks`);
    const requestInput = {
      input: {
        bookingFormNumber: accountCreationSuccessData.bookingFormNumber,
        subID: accountCreationSuccessData.subID,
        bingeSelected: STRINGS.NO,
        etskSelectedOffer: packSelected,
        multiTVArr: validatePacksSuccessData?.multiTvPackList,
        ocsFlag: accountCreationSuccessData.ocsFlag,
        prefereddate: date ?? '',
        rechargeAmount: Math.ceil(Number(amount)).toString(),
        rechargeEvdPin: evdPin,
        requiredRechargeAmount: finalPrice,
        selectedAllPacksCategoryETSKBE,
        selectedPacksArray,
        slotSelection: selectedSlot ?? '',
        taskId: timeSlotsData?.taskId ?? '',
        flexiFlag: flexiPlan,
        UserName: info.mdn,
        userEvdID: info.userId,
      },
    };
    dispatch(sliceActions.etskSetEvdPin(evdPin));
    dispatch(sliceActions.etskSetPaidPrice(Math.ceil(Number(amount)).toString()));
    clearFinalAmountTimeout();
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
          queryName: QUERY.EtskSchedular,
          queryParams: { ...requestInput },
          secondaryQueryName: QUERY.RechargeDetails,
          hasOutline: true,
        },
      }),
    );
    return { params, status: true };
  };

export const etskSchedular =
  (params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    const amount = params.rechargeAmount;
    const { accountCreationSuccessData, packSelected, flexiPlan, validatePacksSuccessData, evdPin, finalPrice, selectedPacksToBuy, freePackSelected } = getState().etskRegistration;
    const { selectedSlot, timeSlotsData } = getState().etskRegSchedular || {};
    const { info } = getState().user;
    dispatch(uiActions.setModalLoader());
    dispatch(sliceActions.etskSetEvdPin(''));
    return api
      .post(queries.etskShedular, params)
      .then((response) => {
        const data = refactorResponse(response);
        if (response?.status) {
          const selectedPacksArray = transformPacksArray(selectedPacksToBuy);
          selectedPacksArray.unshift({
            Packs: freePackSelected,
            Price: '0',
          });
          const selectedAllPacksCategoryETSKBE = transformSelectedPacksArray(selectedPacksToBuy);
          selectedAllPacksCategoryETSKBE.unshift(`${freePackSelected}~BasicPacks`);

          MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.moduleName, {
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.Status]: true,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.SubscriberID]: accountCreationSuccessData?.subID,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.UserName]: info?.mdn,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.bingeSelected]: STRINGS.NO,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.bookingFormNumber]:
              accountCreationSuccessData?.bookingFormNumber,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.etskSelectedOffer]: packSelected,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.flexiFlag]: flexiPlan,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.multiTVArr]: validatePacksSuccessData?.multiTvPackList,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.ocsFlag]: accountCreationSuccessData?.ocsFlag,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.rechargeAmount]: Math.ceil(Number(amount)).toString(),
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.rechargeEvdPin]: evdPin,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.requiredRechargeAmount]: finalPrice,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.selectedAllPacksCategoryETSKBE]: selectedAllPacksCategoryETSKBE,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.selectedPacksArray]: selectedPacksArray,
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.slotSelection]: selectedSlot ?? '',
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.taskId]: timeSlotsData?.taskId ?? '',
            [MoengageMixpanelModules.eTSKRegistration.ETSKRegistration_ConnectionProceedConfirmationPage.attributes.userEvdID]: info?.userId,
          });
          dispatch(regActions.setCreateWoEtskSuccessData(data));
          navigate(ROUTE.WEB.ETSK_REG_SUCCESS);
          return { status: true, routeName: ROUTE.WEB.ETSK_REG_SUCCESS };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data.message));
        return { status: false, message: data.message };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

const getAllSelectedPackCategories = (selectedPacks: any[], freePack: string): string[] => {
  const result = transformSelectedPacksArray(selectedPacks);
  result.unshift(`${freePack}~BasicPacks`);
  return result;
};

const validateBingePlusConditions = (selectedPacks: string[], bingePlusPacks: any[], notApplicablePacks: any[]): string => {
  const selectedPackIds = selectedPacks.map((item) => item.split('~')[1]);

  const foundBingePlus = selectedPackIds.some((id) => bingePlusPacks.some((pack) => pack?.nameNT === id));

  const foundNotApplicable = selectedPackIds.some((id) => notApplicablePacks.some((pack) => pack?.nameNT === id));

  if (!foundNotApplicable && !foundBingePlus) {
    return STRINGS.MISSING_BINGE_PLUS;
  }

  if (foundBingePlus && foundNotApplicable) {
    return STRINGS.BOTH_PRESENT;
  }

  return STRINGS.OK;
};

export const checkRentalPackFlag =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { accountCreationSuccessData, customerDetails, selectedPacksToBuy, freePackSelected } = getState().etskRegistration;

    const { notapplicableboxBingeplus, bingepluspayablebox: bingeplusBox, BingeplusPacks } = accountCreationSuccessData;

    const { boxType, secondary_One_BoxType: secondaryOneBoxType, secondary_Three_BoxType: secondaryThreeBoxType, secondary_Two_BoxType: secondaryTwoBoxType } = customerDetails;

    const selectedAllPacksCategoryETSKBE = getAllSelectedPackCategories(selectedPacksToBuy, freePackSelected);

    const isAnyBoxBingePlus = [boxType, secondaryOneBoxType, secondaryThreeBoxType, secondaryTwoBoxType].includes(bingeplusBox);

    if (isAnyBoxBingePlus) {
      const bingePlusValidationResult = validateBingePlusConditions(selectedAllPacksCategoryETSKBE, BingeplusPacks, notapplicableboxBingeplus);

      if (bingePlusValidationResult === STRINGS.MISSING_BINGE_PLUS) {
        dispatch(uiActions.showErrorPage(i18next.t('strings.bingePlusPack') as unknown as string));
        return null;
      }
      if (bingePlusValidationResult === STRINGS.BOTH_PRESENT) {
        dispatch(uiActions.showErrorPage(i18next.t('strings.bingeNetflixAndbingepluspack') as unknown as string));
        return null;
      }
    }

    dispatch(uiActions.setLoader());

    return api
      .post(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (response?.status) {
          return data;
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data.message));
        return { status: false, message: data.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const doCheckRentalPackFlagPrice =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (response?.status) {
          return data;
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(data.message));
        return { status: false, message: data.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
