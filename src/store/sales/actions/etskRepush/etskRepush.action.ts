/**
 * this is the reducer for the etsk repush module
 *
 * @module store/sales/actions/etskRepush
 *
 */
import { sliceActions } from 'store/sales/reducer/etskRepush';
import uiActions from 'store/sales/actions/ui';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions as etskActions } from 'store/sales/reducer/etskRegistration';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse, transformPacksArray, transformSelectedPacksArray } from 'utils/responseHelper';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { ParentObject } from 'store/sales/types/common';
import { sliceActions as regActions } from 'store/sales/reducer/etskRegSchedular';
import { sliceActions as primaryActions } from 'store/sales/reducer/primaryTvRegistration';
import i18next from 'i18next';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Opens the bottom modal to show input for booking form number
 *
 * @function etskRepushModal
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const etskRepushModal =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(etskActions.etskSetCategorySelected(undefined));
    dispatch(etskActions.etskSetDurationSelected(undefined));
    dispatch(etskActions.etskClearSelectedPacksToBuyData());
    dispatch(etskActions.etskSetSelectedPill(STRINGS.NEW_CUSTOMER_BEST_OFFERS));
    dispatch(primaryActions.setTskValidateData({}));
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSK_Repush.eTSKRepush_PageVisit.moduleName, {
      [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_PageVisit.attributes.Status]: true,
    });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.ETSK_REPUSH,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.eTSKRepush,
        headerIcon: ICONS.ETSK_REPUSH_PINK,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

/**
 * Query to not allow special characters in booking form number input
 *
 * @function removeSpecialChar
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const removeSpecialChar =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const cleanValue = params?.char.replace(/[^a-zA-Z0-9]/g, '');
    dispatch(formActions.setUpdatedFormFields({ bookingFormNumberRepush: cleanValue }, STATE_KEY.MODAL_STATE));
  };

/**
 * Query to call api to check the status of request
 *
 * @function etskRepushStatus
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const etskRepushStatus =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    dispatch(commonActions.setErrorMessage(''));
    const { info } = getState().user;
    const requestInput = {
      input: {
        bookingFormNumber: params?.bookingFormNumberRepush,
        userName: info?.userId,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((res) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSK_Repush.eTSKRepush_BookingFormNumberValidation.moduleName, {
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_BookingFormNumberValidation.attributes.Status]: true,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_BookingFormNumberValidation.attributes.bookingFormNumber]: params?.bookingFormNumberRepush,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_BookingFormNumberValidation.attributes.userName]: info?.userId,
        });
        if (res?.status) {
          const data = refactorResponse(res);
          dispatch(sliceActions.etskRepushSetRepushStatusData(data?.response));
          const { response } = data;
          const subscriberData = {
            subscriberId: response?.subID,
            customerName: response?.customerInformation?.name,
            bookingFormNumber: response?.bookingFormNumber,
          };
          dispatch(formAction.setDealerDetails({ data: subscriberData, queryName }));
          dispatch(etskActions.etskSetBoxTypeSelected(response?.boxType?.boxTypeNT));
          if (data?.response?.rechargeSuccess === STRINGS.NO) {
            const filteredBoxTypes = response.boxTypes.filter((box: ParentObject) => box.name !== i18next.t('strings.Android'));
            const filterData = {
              languages: {
                title: i18next.t('strings.languages'),
                data: response.languages,
              },
              genre: {
                title: i18next.t('strings.genres'),
                data: response.geners,
              },
              boxType: {
                title: i18next.t('strings.pictureQuality'),
                data: filteredBoxTypes,
              },
            };
            const monthlyPack = response.packageName?.[0]?.PackageInfo?.filter((pack: ParentObject) => pack.uom === i18next.t('strings.MONTHLY'));
            const { customerInformation } = response;
            const customerInformationeETSK = {
              customerName: customerInformation?.name,
              mobileNo: customerInformation?.primaryMobile,
              emailAddress: customerInformation?.email !== 'NA' ? customerInformation?.email : [],
              language: customerInformation?.primaryLanguage,
              sec_lang: customerInformation?.secondaryLanguage,
              pincode: customerInformation?.pinCode,
              addressLine1: customerInformation?.address,
              state: customerInformation?.state,
              city: customerInformation?.city,
              district: customerInformation?.district !== 'NA' ? customerInformation?.district : '',
            };
            dispatch(etskActions.etskSetCustomerDetailsData(customerInformationeETSK));
            dispatch(etskActions.etskSetAccountCreationSuccessData({ ...response, offerCategories: response?.offerCategories?.slice(0, -1) }));
            dispatch(etskActions.etskSetFiltersData(filterData));
            dispatch(etskActions.etskSetPackSelected(response?.etskSelectedOffer?.etskSelectedOfferNT));
            dispatch(etskActions.etskSetFreePackSelected(monthlyPack?.packNameNT ?? ''));
            dispatch(etskActions.etskSetPrimaryBoxPrice(monthlyPack?.pricePt ?? '0'));
            dispatch(etskActions.etskSetCategoryDropdownData(response.PopularPacks));
            dispatch(etskActions.etskSetDurationDropdownData(response.durations));
            dispatch(uiActions.hideBottomModal());
            MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSK_Repush.eTSKRepush_PickPackPage.moduleName, {
              [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_PickPackPage.attributes.Status]: true,
              [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_PickPackPage.attributes.bookingFormNumber]: params?.bookingFormNumberRepush,
              [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_PickPackPage.attributes.SubscriberID]: response?.subID,
              [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_PickPackPage.attributes.boxType]: response?.boxType?.boxTypeNT,
              [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_PickPackPage.attributes.etskSelectedOffer]: response?.etskSelectedOffer?.etskSelectedOfferNT,
            });
            navigate(ROUTE.WEB.ETSK_REPUSH_CHANNELS);
          } else {
            dispatch(uiActions.hideBottomModal());
            navigate(ROUTE.WEB.ETSK_REPUSH_SEL_PACKS);
          }
          return data;
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(commonActions.setErrorMessage(res.message));
        return { status: false, message: res.message };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Query to fill the data in selected offers autocomplete
 *
 * @function fillInSelectedOffers
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */

export const fillInSelectedOffers =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { repushStatusData } = getState().etskRepush;
    const updatedSelectedPacks = repushStatusData?.selectedPacks?.map((pack: ParentObject) => ({
      ...pack,
      disabled: true,
    }));
    dispatch(formAction.setDropdownData({ data: updatedSelectedPacks, queryName: QUERY.eTskRepushOfferDropdown }));
    dispatch(formActions.setUpdatedFormFields({ customerBookingFormNumber: repushStatusData?.bookingFormNumber }));
  };

/**
 * Query to call api to create a WO in case recahrge is already done
 *
 * @function etskRepush
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const etskRepush =
  (_params: ParentObject, queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    const { repushStatusData } = getState().etskRepush;
    const selectedPacksBE = repushStatusData?.selectedPacks?.map((pack: ParentObject) => `${pack.nameNT}~${STRINGS.BASIC_PACKS}`);
    const requestInput = {
      input: {
        bookingFormNumber: repushStatusData?.bookingFormNumber,
        subscriberId: repushStatusData?.subID,
        selectedAllPacksCategoryETSKRepBE: selectedPacksBE ?? [],
        userName: info.mdn,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (response?.status) {
          dispatch(regActions.setCreateWoEtskSuccessData(data));
          dispatch(etskActions.etskSetPaidPrice(data?.response?.rechargeAmount));
          navigate(ROUTE.WEB.ETSK_REPUSH_SUCCESS);
          return { status: true, routeName: ROUTE.WEB.ETSK_REPUSH_SUCCESS };
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

/**
 * Query to call api to show confirmation message to the user by opening the modal
 *
 * @function eTskRepushSubmissionConfirmation
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const eTskRepushSubmissionConfirmation =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const amount = params.rechargeAmount;
    const { validatePacksSuccessData } = getState().etskRegistration;

    if (Math.ceil(Number(amount)) < Number(validatePacksSuccessData?.eTSKMinRechargeAmount ?? '0')) {
      dispatch(commonActions.setErrorMessage(`${i18next.t('strings.minRechargeAmount')} ${Number(validatePacksSuccessData?.eTSKMinRechargeAmount ?? '0')}`));
      dispatch(formActions.setUpdatedFormFields({ rechargeAmount: Number(validatePacksSuccessData?.eTSKMinRechargeAmount ?? '0') }, STATE_KEY.MODAL_STATE));
      return null;
    }
    const { evdPin } = params;
    const message = i18next.t('strings.amountDeductionMsg', { amount });
    const { accountCreationSuccessData, packSelected, finalPrice, selectedPacksToBuy, freePackSelected, primaryBoxPrice } = getState().etskRegistration;
    const { date } = getState().etskSchedular || {};
    const { selectedSlot, timeSlotsData } = getState().etskRegSchedular || {};
    const { info } = getState().user;

    const selectedPacksArray = transformPacksArray(selectedPacksToBuy);
    selectedPacksArray.unshift({
      Packs: freePackSelected,
      Price: primaryBoxPrice.toString(),
    });
    const selectedAllPacksCategoryETSKBE = transformSelectedPacksArray(selectedPacksToBuy);
    selectedAllPacksCategoryETSKBE.unshift(`${freePackSelected}~BasicPacks`);
    dispatch(etskActions.etskSetEvdPin(evdPin));
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
        flexiFlag: 0,
        UserName: info.mdn,
        userEvdID: info.userId,
      },
    };
    dispatch(etskActions.etskSetPaidPrice(Math.ceil(Number(amount)).toString()));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.LABEl,
        headerTitle: HEADER_TITLE.CONFIRMATION,
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: {
          primaryButtonLabel: MODAL.CONFIRM,
          secondaryButtonLabel: MODAL.MODIFY,
          childData: message,
          queryName: QUERY.EtskRepushSchedular,
          queryParams: { ...requestInput },
          secondaryQueryName: QUERY.RechargeDetails,
          secondaryQueryParams: FORMS.eTSKRepushRechargeDetails,
          hasOutline: true,
        },
      }),
    );
    return { params, status: true };
  };

/**
 * Query to call api to create WO with all packs added in case the recharge is not successful
 *
 * @function etskRepushSchedular
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const etskRepushSchedular =
  (params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    dispatch(etskActions.etskSetEvdPin(''));
    return api
      .post(queries.etskShedular, params)
      .then((response) => {
        const data = refactorResponse(response);

        MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSK_Repush.eTSKRepush_RechargeConfirm.moduleName, {
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_RechargeConfirm.attributes.Status]: true,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_RechargeConfirm.attributes.bookingFormNumber]: params?.bookingFormNumber,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_RechargeConfirm.attributes.SubscriberID]: params?.subID,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_RechargeConfirm.attributes.etskSelectedOffer]: params?.etskSelectedOffer,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_RechargeConfirm.attributes.bingeSelected]: params?.bingeSelected,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_RechargeConfirm.attributes.rechargeAmount]: params?.rechargeAmount,
          [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_RechargeConfirm.attributes.requiredRechargeAmount]: params?.requiredRechargeAmount,
        });
        if (response?.status) {
          dispatch(regActions.setCreateWoEtskSuccessData(data));
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.eTSK_Repush.eTSKRepush_SuccessPage.moduleName, {
            [MoengageMixpanelModules.eTSK_Repush.eTSKRepush_SuccessPage.attributes.Status]: true,
          });
          navigate(ROUTE.WEB.ETSK_REPUSH_SUCCESS);
          return { status: true, routeName: ROUTE.WEB.ETSK_REPUSH_SUCCESS };
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
