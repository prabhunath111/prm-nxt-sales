/**
 * handle customer recharge api
 *
 * @module store/actions/customerRecharge
 *
 */
import { AppThunk } from 'store';
import uiActions from 'store/sales/actions/ui';
import actions from 'store/sales/actions';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { isValueInRange, refactorResponse } from 'utils/responseHelper';
import { ALERT, CHILD_TYPE, FORMS, MODAL, PROPERTIES, QUERY, STATE_KEY, STRINGS, HEADER_TITLE } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { filterList } from 'utils/formBuilderHelper';
import { sliceActions } from 'store/sales/reducer/customerRecharge';
import { arePopupsAllowed, handleWebViewUrl } from 'utils/navigationHelper';
import i18next from 'i18next';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import commonActions from 'store/sales/actions/common';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { slabListType } from 'store/sales/types/form';
import { openInAppBrowser } from 'utils/externalAppLinkHelper';
import { Platform } from 'react-native';

/**
 * Retrieves the invoice URL for a completed recharge or offer transaction.
 *
 * @param {ParentObject} params - The parameters for generating the invoice URL.
 * @returns {AppThunk} A thunk action for dispatching.
 */

/**
 * Performs a customer recharge.
 *
 * @param {ParentObject} params - The parameters for the recharge request.
 * @param {string} queryName - The name of the query to be executed.
 * @returns {AppThunk} A thunk action for dispatching.
 */
// Interrupt Model for Slab List.
export const slabModel =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.SPECIAL_OFFER,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.slabList,
      }),
    );
  };

type SlabOfferDetail = {
  slabOfferBonus: string;
  slabOfferRechargeAmount: string;
  partnerMargin: string;
  offerName: string;
  subscriberBonus: string;
};

type SlabDetail = {
  slab: string;
  rechargeIdentifier: string;
  slabOfferDetails: SlabOfferDetail[];
};

export const doRecharge =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { bingeFlag, bingeOfferSelected, androidUpgradeSelected, bingeCategorySelected, bingeDurationSelected, dataPacks, selectedOffer } = getState().customerRecharge;
    const { formActionData } = getState().form[STATE_KEY.FORM_STATE];
    const { accountInfo = {} } = formActionData;
    if (androidUpgradeSelected && (!bingeOfferSelected || !bingeCategorySelected || !bingeDurationSelected)) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.bingepluscategory') as unknown as string));
      return null;
    }
    const newParams = {
      amount: Number(params.amount),
      pin: params.pin,
      bingeFlag,
      subscriberInfo: accountInfo?.subIdNT || params?.subscriberInfo,
      tskNumber: params.newCustomer ? params.tskSerial : null,
      rmn: accountInfo?.customerRMN,
      customerName: accountInfo?.customerNameNT,
      bonusAmount: selectedOffer?.cashbackValue,
      offerKey: selectedOffer?.offerKey,
      offerType: selectedOffer?.offerType,
    };

    // Interrupt for slab.
    if (accountInfo?.xtraMileRechargeOffers?.length > 0) {
      const slabList: slabListType[] = [];
      for (let i = 0; i < accountInfo.xtraMileRechargeOffers.length; i += 1) {
        if (isValueInRange(accountInfo.xtraMileRechargeOffers[i].slab, params.amount)) {
          for (let k = 0; k < accountInfo.xtraMileRechargeOffers[i].slabOfferDetails.length; k += 1) {
            const slabListObject: slabListType = {
              label: accountInfo.xtraMileRechargeOffers[i].slabOfferDetails[k].offerName,
              rmn: accountInfo?.customerRMN,
              offer: accountInfo.xtraMileRechargeOffers[i].slabOfferDetails[k].subscriberBonus,
              parterMargin: accountInfo.xtraMileRechargeOffers[i].slabOfferDetails[k].partnerMargin,
              amount: Number(params.amount),
              pin: params.pin,
              subscriberInfo: accountInfo?.subIdNT || params?.subscriberInfo,
              tskNumber: params.newCustomer ? params.tskSerial : null,
              customerName: accountInfo?.customerNameNT,
              enteredAmt: Number(params.amount),
              rechargeIdentifier: accountInfo.xtraMileRechargeOffers[i].rechargeIdentifier,
              prevRechargeIdentifier: bingeFlag,
            };
            slabList.push(slabListObject);
          }

          if (slabList?.length > 0) {
            dispatch(formActions.setSlabList(slabList));
            dispatch(actions.slabModel());
          }

          return null;
        }
      }
    }
    dispatch(uiActions.setLoader());
    dispatch(uiActions.hideBottomModal());
    return api
      .post(queries[queryName], { input: newParams })
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.accountInfo?.subIdList) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.customerRecharge.CustomerRechargeMultiSID.moduleName, {
            Status: true,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeMultiSID.attributes.SubscriberID]: params?.subscriberInfo,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeMultiSID.attributes.Subscriber_RMN]: params?.subscriberInfo,
          });
          dispatch(formActions.setSubIdList(data.accountInfo.subIdList));
        } else {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.moduleName, {
            Status: true,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.SubscriberID]: newParams?.subscriberInfo,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Subscriber_RMN]: newParams?.rmn,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Amount]: newParams?.amount,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Pack]: dataPacks?.bingePlusPack?.[0]?.name,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Recommended_Monthly_Recharge]: dataPacks?.accountInfo?.recommendedMonthlyRecharge,
          });
          dispatch(
            uiActions.showAlert(
              data.message,
              ALERT.SUCCESS,
              { primaryText: MODAL.OK, clearForm: true, showDownloadInvoice: true },
              { data: { ...newParams, ...data, subscriberInfo: data?.accountInfo?.subIdNT }, type: CHILD_TYPE.LIST_DATA, listData: PROPERTIES.CUSTOMER_RECHARGE.CONFIRM_RECHARGE },
            ),
          );
          dispatch(sliceActions.setBingeFlag(PROPERTIES.CUSTOMER_RECHARGE.N));
          dispatch(formActions.setSubIdListDefault());
          dispatch(formActions.setOffersBasisRechargeObject({}));
        }
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(formActions.clearFormData(true));
        dispatch(formActions.setUpdatedFormFields({ subscriberInfo: params?.subscriberId }));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
export const getBonusByOfferName = (slabs: SlabDetail[], label: string): string | undefined => {
  // eslint-disable-next-line no-restricted-syntax
  for (const slab of slabs) {
    const match = slab.slabOfferDetails.find((offer: ParentObject) => offer.offerName === label);

    if (match) {
      return match.slabOfferBonus;
    }
  }
  return undefined;
};
// do recharge duplicate query to call on slablist model's Claim Offer
export const CustomerRechXtraMileRech =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { bingeOfferSelected, androidUpgradeSelected, bingeCategorySelected, bingeDurationSelected, dataPacks } = getState().customerRecharge;
    const { formActionData } = getState().form[STATE_KEY.FORM_STATE];
    const { accountInfo = {} } = formActionData;
    if (androidUpgradeSelected && (!bingeOfferSelected || !bingeCategorySelected || !bingeDurationSelected)) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.bingepluscategory') as unknown as string));
      return null;
    }
    const state = getState();
    const { slabList = [] } = state.form[STATE_KEY.FORM_STATE];
    const regex = /Rs\.?\s*([\d,]+(?:\.\d+)?)/g;
    const matches = [...params.slab_list.matchAll(regex)];
    const offerAmountStr = matches.pop()?.[1] ?? null;
    const offerAmount = offerAmountStr ? Number(offerAmountStr.replace(/,/g, '')) : null;
    const bonusAmount = getBonusByOfferName(accountInfo.xtraMileRechargeOffers, params.slab_list);
    const newParams = {
      amount: Number(offerAmount),
      pin: slabList[0].pin,
      bingeFlag: slabList[0].rechargeIdentifier,
      subscriberInfo: slabList[0].subscriberInfo,
      tskNumber: slabList[0].tskNumber,
      rmn: slabList[0].rmn,
      customerName: slabList[0].customerName,
      bonusAmount,
    };
    const queryName = QUERY.DoRecharge;
    dispatch(uiActions.setLoader());
    dispatch(uiActions.hideBottomModal());
    return api
      .post(queries[queryName], { input: newParams })
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.accountInfo?.subIdList) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.customerRecharge.CustomerRechargeMultiSID.moduleName, {
            Status: true,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeMultiSID.attributes.SubscriberID]: params?.subscriberInfo,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeMultiSID.attributes.Subscriber_RMN]: params?.subscriberInfo,
          });
          dispatch(formActions.setSubIdList(data.accountInfo.subIdList));
        } else {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.moduleName, {
            Status: true,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.SubscriberID]: newParams?.subscriberInfo,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Subscriber_RMN]: newParams?.rmn,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Amount]: newParams?.amount,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Pack]: dataPacks?.bingePlusPack?.[0]?.name,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Recommended_Monthly_Recharge]: dataPacks?.accountInfo?.recommendedMonthlyRecharge,
          });

          dispatch(
            uiActions.showAlert(
              data.message,
              ALERT.SUCCESS,
              { primaryText: MODAL.OK, clearForm: true, showDownloadInvoice: true },
              { data: { ...newParams, ...data, subscriberInfo: data?.accountInfo?.subIdNT }, type: CHILD_TYPE.LIST_DATA, listData: PROPERTIES.CUSTOMER_RECHARGE.CONFIRM_RECHARGE },
            ),
          );
          dispatch(sliceActions.setBingeFlag(PROPERTIES.CUSTOMER_RECHARGE.N));
          dispatch(formActions.setSubIdListDefault());
          dispatch(formActions.setOffersBasisRechargeObject({}));
        }
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(formActions.clearFormData(true));
        dispatch(formActions.setUpdatedFormFields({ subscriberInfo: params?.subscriberId }));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

// Skip offer
export const CustomerRechXtraMileRechSkipOffer =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { bingeOfferSelected, androidUpgradeSelected, bingeCategorySelected, bingeDurationSelected, dataPacks } = getState().customerRecharge;
    if (androidUpgradeSelected && (!bingeOfferSelected || !bingeCategorySelected || !bingeDurationSelected)) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.bingepluscategory') as unknown as string));
      return null;
    }
    const state = getState();
    const { slabList = [] } = state.form[STATE_KEY.FORM_STATE];
    const newParams = {
      amount: slabList[0].enteredAmt,
      pin: slabList[0].pin,
      bingeFlag: slabList[0].prevRechargeIdentifier,
      subscriberInfo: slabList[0].subscriberInfo,
      tskNumber: slabList[0].tskNumber,
      rmn: slabList[0].rmn,
      customerName: slabList[0].customerName,
    };
    const queryName = QUERY.DoRecharge;
    dispatch(uiActions.setLoader());
    dispatch(uiActions.hideBottomModal());
    return api
      .post(queries[queryName], { input: newParams })
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.accountInfo?.subIdList) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.customerRecharge.CustomerRechargeMultiSID.moduleName, {
            Status: true,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeMultiSID.attributes.SubscriberID]: params?.subscriberInfo,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeMultiSID.attributes.Subscriber_RMN]: params?.subscriberInfo,
          });
          dispatch(formActions.setSubIdList(data.accountInfo.subIdList));
        } else {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.moduleName, {
            Status: true,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.SubscriberID]: newParams?.subscriberInfo,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Subscriber_RMN]: newParams?.rmn,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Amount]: newParams?.amount,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Pack]: dataPacks?.bingePlusPack?.[0]?.name,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeProceed.attributes.Recommended_Monthly_Recharge]: dataPacks?.accountInfo?.recommendedMonthlyRecharge,
          });

          dispatch(
            uiActions.showAlert(
              data.message,
              ALERT.SUCCESS,
              { primaryText: MODAL.OK, clearForm: true, showDownloadInvoice: true },
              { data: { ...newParams, ...data, subscriberInfo: data?.accountInfo?.subIdNT }, type: CHILD_TYPE.LIST_DATA, listData: PROPERTIES.CUSTOMER_RECHARGE.CONFIRM_RECHARGE },
            ),
          );
          dispatch(sliceActions.setBingeFlag(PROPERTIES.CUSTOMER_RECHARGE.N));
          dispatch(formActions.setSubIdListDefault());
          dispatch(formActions.setOffersBasisRechargeObject({}));
        }
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(formActions.clearFormData(true));
        dispatch(formActions.setUpdatedFormFields({ subscriberInfo: params?.subscriberId }));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

const transformWinbackOffers = (accountInfo: any) => {
  const offerDetails = accountInfo?.winbackFlexiOffers?.offerDetails ?? [];

  const quarter = offerDetails.find((offer: any) => offer.offerKey.includes('3M'));

  const semi = offerDetails.find((offer: any) => offer.offerKey.includes('6M'));

  const annual = offerDetails.find((offer: any) => offer.offerKey.includes('11M'));

  return {
    ...accountInfo,
    winbackFlexiOffers: {
      ...accountInfo.winbackFlexiOffers,

      annualWinbackOffer: annual?.rechargeAmount ?? 'NA',
      semiAnnualWinbackOffer: semi?.rechargeAmount ?? 'NA',
      quarterWinbackOffer: quarter?.rechargeAmount ?? 'NA',

      dealerMarginAnnual: annual?.dealerMargin ?? 'NA',
      dealerMarginSemi: semi?.dealerMargin ?? 'NA',
      dealerMarginQuarter: quarter?.dealerMargin ?? 'NA',

      cashbackValueAnnual: annual?.cashbackValue ?? 'NA',
      cashbackValueSemi: semi?.cashbackValue ?? 'NA',
      cashbackValueQuarter: quarter?.cashbackValue ?? 'NA',
    },
  };
};

/**
 * Validates a subscriber's information.
 *
 * @param {ParentObject} params - The parameters for the validation request.
 * @param {string} queryName - The name of the query to validate the subscriber.
 * @returns {AppThunk} A thunk action for dispatching.
 */

export const validateSubscriber =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    dispatch(formActions.setFormActionDefault({}));
    dispatch(formActions.setOffersBasisRechargeObject({}));
    dispatch(sliceActions.setIsBingeSelected(false));
    dispatch(sliceActions.setRadioSelected(false));
    dispatch(sliceActions.setSelectedId(undefined));
    dispatch(sliceActions.setSelectedIdRadio(undefined));
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data.accountInfo?.subIdList) {
          dispatch(formActions.setSubIdList(data.accountInfo.subIdList));
        } else {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.customerRecharge.CustomerRechargeValidate.moduleName, {
            Status: true,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeValidate.attributes.SubscriberID]: data?.accountInfo?.subId,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeValidate.attributes.Subscriber_RMN]: data?.accountInfo?.customerRMN,
            [MoengageMixpanelModules.customerRecharge.CustomerRechargeValidate.attributes.Recommended_Monthly_Recharge]: data?.accountInfo?.recommendedMonthlyRecharge,
          });

          const updatedAccountInfo = transformWinbackOffers(data?.accountInfo);

          dispatch(formActions.setFormActionDefault({ ...data, accountInfo: updatedAccountInfo }));
          dispatch(sliceActions.setDataPacks(data));
          dispatch(sliceActions.setNavigationID(params));
          dispatch(formActions.setUpdatedFormFields({ amount: data.accountInfo.monthlyRecharge })); // update amount field in form after validating subscriber
          dispatch(formActions.setSubIdListDefault());
        }
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Performs an offer recharge.
 *
 * @param {ParentObject} params - The parameters for the offer recharge.
 * @param {string} queryName - The name of the query to execute.
 * @returns {AppThunk} A thunk action for dispatching.
 */

/**
 * Performs an offer recharge.
 *
 * @param {ParentObject} params - The parameters for the offer recharge.
 * @param {string} queryName - The name of the query to execute.
 * @returns {AppThunk} A thunk action for dispatching.
 */

export const doOfferRecharge =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { formActionData } = getState().form[STATE_KEY.FORM_STATE];
    const { accountInfo = {}, fdoStatus } = formActionData;
    if (fdoStatus) {
      dispatch(uiActions.showAlert(i18next.t(`strings.fdoMessage`), ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
      return params;
    }

    if (!params?.evdPin) {
      dispatch(
        sliceActions.setMainFormData({
          ...params,
          noRecharge: !!params.otp,
        }),
      );

      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
          headerTitle: FORMS.securityCheck,
          showCloseIcon: true,
          showHeader: true,
          isCenterModal: true,
          formName: FORMS.proceedToOffer,
        }),
      );

      return params;
    }

    const { mainFormData } = getState().customerRecharge;

    const finalRequest = {
      ...mainFormData,
      evdPin: params?.evdPin,
      ...(accountInfo?.subId && { subscriberId: accountInfo.subId }),
      balance: accountInfo.balance,
      isDhamakaEligible: accountInfo.isDhamakaEligible,
      rmn: accountInfo?.customerRMN,
      customerName: accountInfo?.customerName,
    };
    dispatch(uiActions.setModalLoader());

    return api
      .post(queries[queryName], { input: finalRequest })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(
          uiActions.showAlert(
            data.message,
            ALERT.SUCCESS,
            {
              primaryText: MODAL.OK,
              secondaryText: MODAL.CANCEL,
              isPrimaryRequire: true,
              isSecondaryRequire: false,
              primaryAction: MODAL.CLOSE,
              showDownloadInvoice: true,
            },
            {
              data: { invoiceTransactionId: data?.mobTransId, subscriberInfo: data?.accountInfo?.subIdNT, amount: mainFormData?.amount, ...data },
              type: CHILD_TYPE.LIST_DATA,
              listData: PROPERTIES.CUSTOMER_RECHARGE.CONFIRM_OFFER_RECHARGE,
            },
          ),
        );
        dispatch(formActions.clearFormData(true));
        dispatch(formActions.setOffersBasisRechargeObject({}));
        dispatch(uiActions.hideBottomModal());
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(formActions.setUpdatedFormFields({ subscriberInfo: mainFormData?.subscriberId }));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Generates an OTP for adding an offer.
 *
 * @param {ParentObject} params - The parameters for OTP generation.
 * @returns {AppThunk} A thunk action for dispatching.
 */

export const getOtpToAddOffer =
  (params: ParentObject): AppThunk =>
  (dispatch) =>
    api
      .post(queries.generateOtp, {
        input: {
          subscriberId: params.input.subscriberId,
        },
      })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(
          uiActions.showBottomModal({
            isModalVisible: true,
            type: CHILD_TYPE.OTP_MODAL,
            headerTitle: '',
            data: { ...params.input, mdn: params.mdn },
            showCloseIcon: false,
            showHeader: false,
            isCenterModal: true,
            buttonInfo: {
              otpButtonLabel: MODAL.CONFRIM_RECHARGE,
              queryName: QUERY.AddUppOffer,
              sentToTitle: STRINGS.SENTTO,
            },
          }),
        );

        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));

/**
 * Searches for Maha Bumper Offers.
 *
 * @param {ParentObject} params - The search parameters.
 * @returns {void}
 */

export const searchMahaBumperOffers =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { formActionData } = getState().form[STATE_KEY.FORM_STATE];
    const searchKeys = PROPERTIES.CUSTOMER_RECHARGE.OFFER_SEARCH_KEYS;

    const filteredDealers = filterList(formActionData?.regionOffers?.wbldpPackOffersList, searchKeys, params.searchText);

    dispatch(formActions.setSearchBarItems(filteredDealers, params.queryName));
  };

/**
 * Searches for Winback Offers.
 *
 * @param {ParentObject} params - The search parameters.
 * @returns {void}
 */

export const searchWinbackOffers =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { formActionData } = getState().form[STATE_KEY.FORM_STATE];
    const searchKeys = PROPERTIES.CUSTOMER_RECHARGE.OFFER_SEARCH_KEYS;

    const filteredDealers = filterList(formActionData?.winBackOffers?.d30WinBackPacksList, searchKeys, params.searchText);

    dispatch(formActions.setSearchBarItems(filteredDealers, params.queryName));
  };

/**
 * Searches for dynamic offers based on category.
 *
 * @param {ParentObject} params - The search parameters.
 * @returns {void}
 */

export const searchDynamicOffers =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { formActionData } = getState().form[STATE_KEY.FORM_STATE];
    const dynamicOffer = formActionData?.regionOffers?.dynamicOffersList?.find((offer: { offerCategoryNT: string }) => offer.offerCategoryNT === params.queryName);

    const searchKeys = PROPERTIES.CUSTOMER_RECHARGE.DYNAMIC_OFFER_SEARCH_KEYS;

    const filteredDealers = filterList(dynamicOffer?.offerList, searchKeys, params.searchText);

    dispatch(formActions.setSearchBarItems(filteredDealers, params.queryName));
  };

/**
 * Displays a confirmation alert before proceeding with recharge.
 *
 * @param {ParentObject} params - The parameters for confirmation.
 * @returns {void}
 */

export const showRechargeConfirmation =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    if (params.radioValue === STRINGS.WITHOUT_RECHARGE && params.otpConfigForWithoutChange === STRINGS.YES) {
      // show otp modal
      dispatch(
        uiActions.showAlert(
          params.withoutRechargeMessage,
          ALERT.CONFIRM,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
            isSecondaryRequire: true,
            queryName: QUERY.GetOtpToAddOffer,
            queryParams: params,
            clearForm: false,
          },
          {},
        ),
      );
    } else {
      dispatch(
        uiActions.showAlert(
          params.withRechargeMessage,
          ALERT.CONFIRM,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
            isSecondaryRequire: true,
            queryName: QUERY.AddUppOffer,
            queryParams: { ...params.input },
            clearForm: false,
          },
          {},
        ),
      );
    }
  };

/**
 * Fetches details of a specific offer pack.
 *
 * @param {ParentObject} params - The parameters for fetching pack details.
 * @returns {AppThunk} A thunk action for dispatching.
 */

export const getOfferPackDetails =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    if (params.isModal) {
      dispatch(uiActions.setModalLoader());
    } else {
      dispatch(uiActions.setLoader());
    }

    const requestObject = {
      offerName: params.offerName,
      packPrice: params.packPrice,
    };

    return api
      .post(queries.getOfferPackDetails, requestObject)
      .then((response) => {
        const data = refactorResponse(response);

        dispatch(formActions.setNavigationData(data, '', '', ''));

        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const getInvoiceURL =
  (params: ParentObject): AppThunk =>
  async (dispatch) => {
    if (params?.isDownload === false) {
      dispatch(uiActions.setModalLoader());
    } else {
      dispatch(uiActions.setLoader());
    }

    const isNative = Platform.OS === 'android' || Platform.OS === 'ios';
    const isWeb = Platform.OS === 'web';
    const isCordova = window.webkit?.messageHandlers?.cordova_iab;

    const newTab = isWeb && !isCordova ? window.open('', '_blank') : null;

    try {
      const response = await api.post(queries.getInvoiceURL, params);
      const data = refactorResponse(response);
      const { invoiceUrl } = data;

      if (!invoiceUrl) return undefined;

      if (isNative) {
        return openInAppBrowser(invoiceUrl);
      }

      if (isCordova) {
        return handleWebViewUrl(invoiceUrl, true);
      }

      // Regular Web
      if (!arePopupsAllowed()) {
        if (newTab) newTab.location.href = invoiceUrl;
        return undefined;
      }

      newTab?.close();
      return handleWebViewUrl(invoiceUrl, true);
    } catch (error: any) {
      newTab?.close?.();

      if (params?.isDownload === false) {
        dispatch(commonActions.setErrorMessage(error.message));
      } else {
        dispatch(uiActions.showErrorPage(error.message));
      }

      return undefined;
    } finally {
      dispatch(uiActions.clearLoader());
    }
  };

/**
 * set setBingFlag
 *
 * @param {string} setBingFlag - The parameters for set setBingFlag.
 * @returns {AppThunk} A thunk action for dispatching.
 */

export const setBingFlag =
  (bingeFlag: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setBingeFlag(bingeFlag));
  };

/**
 * set setBingFlag
 *
 * @param {string} setBingFlag - The parameters for set setBingFlag.
 * @returns {AppThunk} A thunk action for dispatching.
 */
export const toggleAccordion =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(formActions.setOffersBasisRechargeObject({}));
    dispatch(formActions.setOffersBasisRechargeValue([]));
    dispatch(
      formActions.setOffersBasisRechargeObject({
        ...params,
        offerList: [...(params.offerList ?? [])], // clone to change reference
      }),
    );
    dispatch(formActions.setOffersBasisRechargeValueType(params?.offerType));
    dispatch(uiActions.hideBottomModal());
  };

/**
 * Searches for Maha Bumper Offers.
 *
 * @param {ParentObject} params - The search parameters.
 * @returns {void}
 */

export const searchOffersBasisRechargeValue =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { offersBasisRechargeValue } = getState().form[STATE_KEY.FORM_STATE];
    const searchKeys = PROPERTIES.CUSTOMER_RECHARGE.DYNAMIC_OFFER_SEARCH_KEYS;

    const filteredDealers = filterList(offersBasisRechargeValue, searchKeys, params.searchText);

    dispatch(formActions.setSearchBarItems(filteredDealers, params.queryName));
  };

export const fetchBingePlusPack =
  (_params: any, queryName: string): AppThunk =>
  (dispatch, _getState) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        boxtype: STRINGS.ANDROID,
        duration: STRINGS.MONTHLY,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (response?.status) {
          const transformed = data?.details.map((item: ParentObject, index: number) => ({
            id: index + 1,
            name: `${item.siebelName} Rs-${item.price}`,
            value: item.siebelName,
            duration: item.duration,
          }));
          dispatch(sliceActions.setBingeCatgeoryData(transformed));
          dispatch(sliceActions.setBingeDurationData(PROPERTIES.CUSTOMER_RECHARGE.DURATION_DATA));

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

export const clearBinge = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setIsBingeSelected(false));
  dispatch(sliceActions.setRadioSelected(false));
};
export const removeAndroidSelection = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setAndroidUpgradeSelected(false));
  dispatch(sliceActions.setBingeCatgeoryData(undefined));
  dispatch(sliceActions.setBingeDurationData(undefined));
  dispatch(sliceActions.setIsBingeSelected(false));
  dispatch(sliceActions.setSelectedId(undefined));
};
