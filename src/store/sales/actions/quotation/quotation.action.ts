/**
 * this is the reducer for the quotation module
 *
 * @module store/sales/actions/quotation
 *
 */
// import { sliceActions } from 'store/sales/reducer/quotation';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
// import { quotationType } from 'store/sales/types/quotation';
import { convertTo62Func, generateRandom12DigitNumber, refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import commonActions from 'store/sales/actions/common';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions as regActions } from 'store/sales/reducer/etskRegSchedular';
import formActions from 'store/sales/actions/form';
import i18next, { t } from 'i18next';
import { ACCORDION_TYPE, ALERT, CHILD_TYPE, CONNECTION_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, PROPERTIES, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import { sliceActions } from 'store/sales/reducer/quotation';
import { sliceActions as etskActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as primaryActions } from 'store/sales/reducer/primaryTvRegistration';
import { callAction } from 'utils/formBuilderHelper';
import { sliceActions as etskMultitvActions } from 'store/sales/reducer/etskMultiTv';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { MoengageMixpanel } from 'services/moengageMixpanel';

let finalAmountTimeoutId: ReturnType<typeof setTimeout>;
/**
 * Opens the bottom modal to show radio buttons to select module
 *
 * @function quotationModal
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const quotationModal =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { isWalkIn, isMultiTv } = getState().quotation;
    dispatch(sliceActions.setRedirectParams({}));
    dispatch(sliceActions.quotationPrimarySetTskTypeData({}));
    dispatch(etskActions.etskClearSelectedPacksToBuyData());
    if (!isWalkIn) {
      dispatch(sliceActions.quotationEtskSetPincode(''));
    }
    if (isWalkIn && isMultiTv) {
      dispatch(formActions.setUpdatedFormFields({ etskQuotRadioContainer: STRINGS.MULTI_TV_REGISTRATION }, STATE_KEY.MODAL_STATE));
    }
    dispatch(sliceActions.setIsMultiTv(false));
    dispatch(sliceActions.quotationEtskSetIsQuotationNavigate(false));
    dispatch(sliceActions.quotationEtskSetIsEtskEdit(false));
    dispatch(sliceActions.quotationPrimarySetIsPrimaryEdit(false));
    dispatch(primaryActions.setTskValidateData({}));
    const dropDownData = {
      connectionFilter: [],
      boxTypesFilter: [],
    };
    dispatch(formAction.setMultipleDropdownOptionsData({ data: dropDownData }));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.QUOTATION,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.quotation,
        headerIcon: ICONS.OLD_QUOTATION,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

/**
 * Checks if the user is eligible for the kind of option he selected
 *
 * @function quotationValidate
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */

export const quotationValidate =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.moduleName, {
      [MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.attributes.Status]: true,
      [MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.attributes.formName]: params?.etskQuotRadioContainer || params?.nonEtskQuotRadioContainer,
    });
    if (params?.etskQuotRadioContainer === STRINGS.PRIMARY_TV_REGISTRATION || params?.nonEtskQuotRadioContainer === STRINGS.PRIMARY_TV_REGISTRATION) {
      dispatch(uiActions.setLoader());

      return api
        .post(queries[QUERY.GetTskTypesFromProp], {})
        .then(async (response) => {
          if (response?.status) {
            const data = refactorResponse(response);
            dispatch(sliceActions.quotationPrimarySetTskTypeData(data?.result));
            dispatch(callAction({}, QUERY.RetrieveMultiTvBoxType));
            const { boxTypeData } = getState().quotation;
            const noOfConnectionResponse: any = await dispatch(callAction({}, QUERY.ConnectionFilter));
            const dropdownData = {
              connectionFilter: noOfConnectionResponse?.connectionFilter || [],
              boxTypesFilter: boxTypeData || [],
            };
            dispatch(formAction.setMultipleDropdownOptionsData({ data: dropdownData }));
            if (noOfConnectionResponse) {
              dispatch(sliceActions.quotationPrimarySetNumberOfConnections(noOfConnectionResponse?.connectionFilter?.[0]));
              dispatch(sliceActions.quotationPrimarySetNoOfConnectionsData(noOfConnectionResponse?.connectionFilter));
            }
            dispatch(
              uiActions.showBottomModal({
                isModalVisible: true,
                isCenterModal: true,
                type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
                headerTitle: HEADER_TITLE.QUOTATION,
                showCloseIcon: true,
                showHeader: true,
                formName: FORMS.quotationPrimaryPincode,
                headerIcon: ICONS.OLD_QUOTATION,
                buttonInfo: {
                  goToHome: true,
                },
              }),
            );
            return { data, status: true };
          }
          dispatch(commonActions.setErrorMessage(response.message));
          return { status: false, message: response.message };
        })
        .catch((error) => dispatch(commonActions.setErrorMessage(error.message)))
        .finally(() => dispatch(uiActions.clearLoader()));
    }
    if (params?.etskQuotRadioContainer === STRINGS.MULTI_TV_REGISTRATION || params?.nonEtskQuotRadioContainer === STRINGS.MULTI_TV_REGISTRATION) {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.moduleName, {
        [MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.attributes.Status]: true,
        [MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.attributes.formName]: params?.etskQuotRadioContainer || params?.nonEtskQuotRadioContainer,
      });
      dispatch(sliceActions.setIsMultiTv(true));
      return dispatch(callAction({ ...params }, QUERY.modalForQuotationMultiTV, '', navigate));
    }
    if (params?.etskQuotRadioContainer === STRINGS.ETSK_REGISTRATION) {
      dispatch(uiActions.setModalLoader());
      return api
        .post(queries[QUERY.ValidateEligibilityForETSK], {})
        .then((response) => {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.moduleName, {
            [MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.attributes.Status]: true,
            [MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.attributes.formName]: params?.etskQuotRadioContainer || params?.nonEtskQuotRadioContainer,
          });
          if (response?.status) {
            const data = refactorResponse(response);
            dispatch(sliceActions.quotationEtskSetOfferType(data?.result?.etskOffersDropDown));
            dispatch(sliceActions.quotationEtskSetPincode(''));
            dispatch(
              uiActions.showBottomModal({
                isModalVisible: true,
                isCenterModal: true,
                type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
                headerTitle: HEADER_TITLE.QUOTATION,
                showCloseIcon: true,
                showHeader: true,
                formName: FORMS.quotationETSKPincode,
                headerIcon: ICONS.OLD_QUOTATION,
                buttonInfo: {
                  goToHome: true,
                },
              }),
            );
            return { data, status: true };
          }
          dispatch(commonActions.setErrorMessage(response.message));
          return { status: false, message: response.message };
        })
        .catch((error) => dispatch(commonActions.setErrorMessage(error.message)))
        .finally(() => dispatch(uiActions.clearLoader()));
    }
    return null;
  };

/**
 * validates the pincode entered by user
 *
 * @function validatePinCodePartnerQuote
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const validatePinCodePartnerQuote =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { isPrimaryEdit, isEtskEdit } = getState().quotation;
    const requestInput = {
      pincode: params?.etskQuotePincode || params?.primaryQuotePincode,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteValidatePincode.moduleName, {
          [MoengageMixpanelModules.Quotation.QuoteValidatePincode.attributes.Status]: response?.status,
          [MoengageMixpanelModules.Quotation.QuoteValidatePincode.attributes.pincode]: params?.etskQuotePincode || params?.primaryQuotePincode,
        });
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(sliceActions.setisWalkIn(false));
          dispatch(sliceActions.quotationEtskSetLocationData(data?.result));
          dispatch(sliceActions.quotationEtskSetPincode(params?.etskQuotePincode || params?.primaryQuotePincode));
          dispatch(sliceActions.quotationEtskSetTownLocality(undefined));
          dispatch(sliceActions.quotationPrimarySetTskTypeObject({}));
          dispatch(sliceActions.quotationEtskSetPrimaryBoxSelected({}));
          dispatch(sliceActions.quotSetTSKtype1SelectedObject({}));
          dispatch(sliceActions.etskSetBoxType1Selected({}));
          dispatch(sliceActions.quotSetTSKtype2SelectedObject({}));
          dispatch(sliceActions.etskSetBoxType2Selected({}));
          dispatch(sliceActions.quotSetTSKtype3SelectedObject({}));
          dispatch(sliceActions.etskSetBoxType3Selected({}));
          if (isEtskEdit) {
            dispatch(callAction({}, QUERY.FillInOfferAndLocation));
          }
          if (isPrimaryEdit) {
            dispatch(callAction({}, QUERY.FillInTskTypeAndLocation));
          }
          return { status: true, data };
        }
        dispatch(commonActions.setErrorMessage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * fill in the offer and location autocomplete
 *
 * @function fillInOfferAndLocation
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const fillInOfferAndLocation =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { etskOfferType, etskLocationData, redirectParams } = getState().quotation;
    dispatch(sliceActions.setRedirectUrl(ACCORDION_TYPE.ETSK));
    if (redirectParams && Object.keys(redirectParams).length > 0) {
      dispatch(
        formActions.setUpdatedFormFields({
          customerDetailsDAS: redirectParams?.customerDetailsDAS,
          quoteETSKTownLocality: redirectParams?.quoteETSKTownLocality,
        }),
      );
      dispatch(sliceActions.setRedirectParams({}));
      const dropDownData = {
        locationDropdown: etskLocationData,
        etskOffersDropDown: etskOfferType,
      };
      dispatch(formAction.setMultipleAutoCompleteData({ data: dropDownData }));
      return;
    }
    dispatch(
      formActions.setUpdatedFormFields({
        customerDetailsDAS: '',
        quoteETSKTownLocality: null,
        // quoteETSKOfferType: '',
        // quoteETSKPrimaryBox: '',
        // quoteETSKSecondaryBox1: '',
        // quoteETSKSecondaryBox2: '',
        // quoteETSKSecondaryBox3: '',
      }),
    );
    const dropDownData = {
      locationDropdown: etskLocationData,
      etskOffersDropDown: etskOfferType,
    };
    dispatch(formAction.setMultipleAutoCompleteData({ data: dropDownData }));
  };

/**
 * fill in the locations, tsk tpe data, number of connections and box type data in dropdowns
 *
 * @function fillInTskTypeAndLocation
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const fillInTskTypeAndLocation =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { etskLocationData, tskTypesData, numberOfConnectionsData, boxTypeData, redirectParams } = getState().quotation;
    dispatch(sliceActions.setRedirectUrl(CONNECTION_TYPE.PRIMARY));
    if (redirectParams && Object.keys(redirectParams).length > 0) {
      dispatch(
        formActions.setUpdatedFormFields({
          customerDetailsDAS: redirectParams?.customerDetailsDAS,
          quoteETSKTownLocality: redirectParams?.quoteETSKTownLocality?.object,
          numberOfConnectionsQuote: redirectParams?.numberOfConnectionsQuote,
          primaryBoxTypeQuote: redirectParams?.primaryBoxTypeQuote,
          primaryTskPinQuote: redirectParams?.primaryTskPinQuote,
        }),
      );
      dispatch(sliceActions.setRedirectParams({}));
      const autoCompleteData = {
        locationDropdown: etskLocationData,
        tskTypeDropdown: tskTypesData?.tskType,
      };
      dispatch(formAction.setMultipleAutoCompleteData({ data: autoCompleteData }));
      const dropdownData = {
        connectionFilter: numberOfConnectionsData,
        boxTypesFilter: boxTypeData,
      };
      dispatch(formAction.setMultipleDropdownOptionsData({ data: dropdownData }));
      dispatch(sliceActions.setRedirectParams({}));
      return;
    }
    dispatch(
      formActions.setUpdatedFormFields({
        customerDetailsDAS: '',
        quoteETSKTownLocality: '',
      }),
    );
    const autoCompleteData = {
      locationDropdown: etskLocationData,
      tskTypeDropdown: tskTypesData?.tskType,
    };
    dispatch(formAction.setMultipleAutoCompleteData({ data: autoCompleteData }));
    const dropdownData = {
      connectionFilter: numberOfConnectionsData,
      boxTypesFilter: boxTypeData,
    };
    dispatch(formAction.setMultipleDropdownOptionsData({ data: dropdownData }));
  };

/**
 * fill in the pincode if user tried to edit the pincode
 *
 * @function fillInPincodeEtsk
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const fillInPincodeEtsk =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { etskPincode } = getState().quotation;
    dispatch(
      formActions.setUpdatedFormFields(
        {
          etskQuotePincode: etskPincode,
        },
        STATE_KEY.MODAL_STATE,
      ),
    );
  };
/**
 * fill in the pincode if user tried to edit the pincode
 *
 * @function fillInPincodePrimary
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const fillInPincodePrimary =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { etskPincode } = getState().quotation;
    dispatch(
      formActions.setUpdatedFormFields(
        {
          primaryQuotePincode: etskPincode,
        },
        STATE_KEY.MODAL_STATE,
      ),
    );
  };

/**
 * opens up the pincode modal for etsk sub module
 *
 * @function quotationETSKPincodeModal
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const quotationETSKPincodeModal =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.quotationEtskSetIsEtskEdit(true));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: false,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.QUOTATION,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.quotationETSKPincode,
        headerIcon: ICONS.OLD_QUOTATION,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

/**
 * opens up the pincode modal for multi tv sub module
 *
 * @function multiTVRMNmodal
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const multiTVRMNmodal = (): AppThunk => (dispatch) => {
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.QUOTATION,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.quotationMultiTVRMN,
      headerIcon: ICONS.OLD_QUOTATION,
      buttonInfo: {
        goToHome: true,
      },
    }),
  );
};

/**
 * get the summary details of the box selected
 *
 * @function getMultiTVDetails
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const getMultiTVDetails =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      subId: params?.subscriberInfo,
      boxType: params?.boxType,
      bingeplusSelectedoffer: params?.bingeplusSelectedoffer,
    };

    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const { result } = refactorResponse(response);
        if (result?.subIdList?.length > 0) {
          dispatch(formActions.setSubIdList(result?.subIdList));
          return dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
              headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
              showCloseIcon: true,
              showHeader: true,
              formName: FORMS.quotationMultiTVsubIDList,
              buttonInfo: {
                goToHome: true,
              },
            }),
          );
        }
        dispatch(formActions.setDealerDetails({ subscriberId: result?.subId, customerName: result?.customerName }));
        dispatch(sliceActions.quotationMultiTVSetSubID(result?.subId));
        dispatch(uiActions.hideBottomModal());
        navigate(ROUTE.WEB.QUOTATION_MULTITV_SELECTION);
        return { status: true };
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
 * get the summary details of the box selected
 *
 * @function retrieveMultiTvBoxTypeQuotation
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const retrieveMultiTvBoxTypeQuotation =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    api
      .post(queries.getMultiTvBoxType, params)
      .then((response) => {
        const data = refactorResponse(response);
        const dropdownDataName = data?.result?.boxType;
        dispatch(formAction.setDropdownOptionsData({ data: dropdownDataName, queryName: QUERY.getBoxTypeQuotationMultiTV }));
        dispatch(callAction({ ...params }, QUERY.retrieveMultiTvTskTypeQuotation, '', navigate));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(uiActions.clearLoader());
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };

/**
 * get the tsk type data
 *
 * @function retrieveMultiTvTskTypeQuotation
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const retrieveMultiTvTskTypeQuotation =
  (params: ParentObject, _queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { redirectParams } = getState().quotation;
    if (redirectParams && Object.keys(redirectParams).length > 0) {
      dispatch(
        formActions.setUpdatedFormFields({
          secondaryBoxType: redirectParams?.secondaryBoxType,
          secondaryTskType: redirectParams?.secondaryTskType,
        }),
      );
      dispatch(sliceActions.setRedirectParams({}));
    }
    api
      .post(queries.getTskType, params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.quotationTskTypeforMultiTv(data?.result));
        dispatch(formAction.setDropdownOptionsData({ data: data?.result?.tskType, queryName: QUERY.getTskTypeQuotationMultiTV }));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

/**
 * api that allow uer to see billing when clicked on proceed
 *
 * @function proccedWithMultiTV
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const proccedWithMultiTV =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { multiTvSubID } = getState().quotation;
    dispatch(uiActions.setLoader());
    dispatch(sliceActions.setRedirectParams(params));
    const requestInput = {
      subId: multiTvSubID,
      boxType: params?.secondaryBoxType?.name,
      bingeplusSelectedoffer: params?.bingeplusSelectedoffer,
    };
    dispatch(sliceActions.quotationMultiTVsetBoxType(params?.secondaryBoxType));
    dispatch(etskMultitvActions.etskMultiTvSetBoxTypeSelected(params?.secondaryBoxType?.name));
    dispatch(sliceActions.setSelectedTskPrice(params?.secondaryTskType?.price));
    api
      .post(queries.getMultiTVDetails, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (!response.status) {
          return dispatch(uiActions.showErrorPage(response.message));
        }
        dispatch(sliceActions.quotationSetMultiTVDetails(data?.result));
        const customerInformation = data?.result?.customerInformation;
        const customerInformationeETSK = {
          customerName: customerInformation?.customerName,
          mobileNo: customerInformation?.mobileNo,
          emailAddress: customerInformation?.emailAddress !== STRINGS.NA ? customerInformation?.email : [],
          language: customerInformation?.language,
          sec_lang: customerInformation?.secondaryLang,
          pincode: customerInformation?.pincode,
          addressLine1: customerInformation?.addressLine1,
          state: customerInformation?.state,
          city: customerInformation?.city,
          district: customerInformation?.district !== STRINGS.NA ? customerInformation?.district : '',
        };
        const modifiedResult = {
          ...data?.result,
          pricePoint: (params?.secondaryTskType?.price || 0) * 100,
        };
        dispatch(etskActions.etskSetCustomerDetailsData(customerInformationeETSK));
        dispatch(etskMultitvActions.etskSetMultiBoxSelectedDetails(modifiedResult));
        dispatch(etskActions.etskSetValidatePacksSuccessData(modifiedResult));
        navigate(ROUTE.WEB.QUOTATION_MULTITV_SUMMARY);
        return { status: false };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(uiActions.clearLoader());
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };

/**
 * open the email and mobile pop up
 *
 * @function multiTVmobileAndEmail
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const multiTVmobileAndEmail = (): AppThunk => (dispatch) => {
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.SEND_QUOTE,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.quotationMultiTVMobEmailModal,
    }),
  );
};

/**
 * calls the api to send otp to customer mobile
 *
 * @function sendOTPMultiTV
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const sendOTPMultiTV =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    const mob = params?.mobileNumber;
    dispatch(sliceActions.quotationEtskSetMobile(mob));
    dispatch(sliceActions.quotationEtskSetEmail(params?.emailID));
    api
      .post(queries.sendOtpMultiTV, { mobile: mob })
      .then((response) => {
        const { status } = refactorResponse(response);
        if (status) {
          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              isCenterModal: true,
              type: CHILD_TYPE.OTP_MODAL,
              headerTitle: '',
              data: { mdn: mob, ...params },
              showCloseIcon: false,
              showHeader: true,
              buttonInfo: {
                otpButtonLabel: STRINGS.SUBMIT,
                sentToTitle: STRINGS.SENTTO,
                queryName: QUERY.validateOTPQuotationMultiTv,
                hasOutline: true,
                resendOtpQuery: QUERY.sendOtpMultiTV,
                resendOtpQueryParams: {
                  mobileNumber: mob,
                  emailID: params?.emailID,
                },
              },
            }),
          );
          return { status: true };
        }
        dispatch(commonActions.setErrorMessage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * api to validate the otp entered by user
 *
 * @function ValidateOTPWithMobile
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const ValidateOTPWithMobile =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { multiTVDetails } = getState().quotation;
    const secondaryPrice = multiTVDetails?.multiTVAddBoxsPrice || 0;
    const packPrice = multiTVDetails?.secondaryPackPrice || 0;
    const ncfPrice = multiTVDetails?.secondaryNCF || 0;

    const totalFinal = Number(secondaryPrice) + Number(packPrice) + Number(ncfPrice);
    dispatch(sliceActions.setTotalPrice(totalFinal.toString()));
    dispatch(uiActions.setModalLoader());
    const resquestInput = {
      input: {
        partnerMdn: params.mdn,
        otp: params.otp,
      },
    };
    return api
      .post(queries.verifyOtp, resquestInput)
      .then((response) => {
        const { status } = refactorResponse(response);
        if (status) {
          dispatch(callAction({ ...params }, QUERY.InsertRentalPackNewPartnerQuoteMod, '', navigate));
          return { status: true };
        }
        dispatch(commonActions.setErrorMessage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error: any) => ({ status: false, message: error.message }))
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };

/**
 * api to send sms to user mobile
 *
 * @function multiTvSendSms
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const multiTvSendSms =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { multiTvTskProps, multiTVDetails, mobileNo, multiTvBoxType, urlLastPart } = getState().quotation;

    const smsStartMsg = multiTvTskProps?.smsStartMsg?.trim() || '';
    const smsEndMsg = multiTvTskProps?.smsEndMsg?.trim() || '';
    const secondaryType = multiTvBoxType?.name || '';
    const secondaryPrice = multiTVDetails?.multiTVAddBoxsPrice || 0;
    const packPrice = multiTVDetails?.secondaryPackPrice || 0;
    const ncfPrice = multiTVDetails?.secondaryNCF || 0;
    const totalFinal = Math.ceil(Number(secondaryPrice) + Number(packPrice) + Number(ncfPrice));
    const detailsUrl = multiTvTskProps?.smsUrl?.trim() || '';
    const urlLastPart62 = convertTo62Func(urlLastPart);

    const consolidatedMsgSmsMulti = `Secondary = ${secondaryType} = Rs.${secondaryPrice}, Pack = Rs.${packPrice}, NCF = Rs.${ncfPrice}. Total = Rs.${totalFinal}`;

    const msg = `${smsStartMsg}. ${consolidatedMsgSmsMulti} - Tata Play. Details: ${detailsUrl}${urlLastPart62}. ${smsEndMsg}`.replace(/\s{2,}/g, ' ').trim();
    const rmn = mobileNo;

    return api
      .post(queries.sendSmsMultiTV, { msg, rmn })
      .then((response) => {
        const { status } = refactorResponse(response);
        if (status) {
          dispatch(regActions.setCreateWoEtskSuccessData({ response: { message: t(`strings.quotationSent`), transId: true } }));
          navigate(ROUTE.WEB.QUOTATION_MULTITV_SUCCESS);
          return { status: true, routeName: ROUTE.WEB.QUOTATION_ETSK_SUCCESS };
        }
        return { status: false };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(uiActions.clearLoader());
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };

/**
 * fill in multi tv data when user navigates to multi tv module
 *
 * @function setMultiTvData
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const setMultiTvData = (): AppThunk => (dispatch, getState) => {
  const { multiTvSubID, multiTvBoxType } = getState().quotation;
  dispatch(sliceActions.quotationsetMultiTVRegistration(true));
  dispatch(formActions.setUpdatedFormFields({ subscriberID: multiTvSubID }));
  dispatch(formAction.setDropdownOptionsData({ data: multiTvBoxType, queryName: QUERY.retrieveMultiTvBoxType }));
  dispatch(sliceActions.setRedirectUrl(STRINGS.MULTI));
  dispatch(callAction({}, QUERY.ChangeBoxTypeQuotation));
};

/**
 * get all the data to be filled in pick pack screen
 *
 * @function retrieveBasePackBsStateWithoutSubId
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const retrieveBasePackBsStateWithoutSubId =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(sliceActions.setRedirectParams(params));
    if (params?.quoteETSKSecondaryBox3?.object?.valueNT) {
      if (!params?.quoteETSKSecondaryBox1?.object?.valueNT) {
        dispatch(uiActions.showErrorPage(i18next.t('strings.sec1sec2BoxEnter') as unknown as string));
        return null;
      }
      if (!params?.quoteETSKSecondaryBox2?.object?.valueNT) {
        dispatch(uiActions.showErrorPage(i18next.t('strings.sec2BoxEnter') as unknown as string));
        return null;
      }
    }
    if (params?.quoteETSKSecondaryBox2?.object?.valueNT && !params?.quoteETSKSecondaryBox1?.object?.valueNT) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.sec1OnlyBoxEnter') as unknown as string));
      return null;
    }
    dispatch(uiActions.setLoader());
    const { etskPincode } = getState().quotation;
    const { selectedPacksToBuy } = getState().etskRegistration;
    const requestInput = {
      pincode: etskPincode,
      boxType: params?.quoteETSKPrimaryBox?.object?.valueNT,
      etskSelectedOffer: params?.quoteETSKOfferType?.nameNT,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        if (response?.status) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteValidatePincode.moduleName, {
            [MoengageMixpanelModules.Quotation.QuoteValidatePincode.attributes.Status]: response?.status,
            [MoengageMixpanelModules.Quotation.QuoteValidatePincode.attributes.pincode]: etskPincode,
          });
          const data = refactorResponse(response)?.result;
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
          data.offerCategories = data.offerCategories.slice(0, -1);
          dispatch(etskActions.etskSetAccountCreationSuccessData(data));
          dispatch(etskActions.etskSetFiltersData(filterData));
          dispatch(etskActions.etskSetPackSelected(params?.quoteETSKOfferType?.nameNT));
          dispatch(etskActions.etskSetBoxTypeSelected(params?.quoteETSKPrimaryBox?.object?.valueNT));
          dispatch(
            etskActions.etskSetValidatePinCodeSuccessData({
              cityNT: params?.quoteETSKTownLocality?.cityNT,
              stateNT: params?.quoteETSKTownLocality?.stateNT,
              districtNT: params?.quoteETSKTownLocality?.districtNT,
            }),
          );

          dispatch(sliceActions.quotationEtskSetTownLocality(params?.quoteETSKTownLocality));
          dispatch(sliceActions.quotationEtskSetOfferSelected(params?.quoteETSKOfferType));
          dispatch(sliceActions.quotationEtskSetPrimaryBoxSelected(params?.quoteETSKPrimaryBox));

          dispatch(sliceActions.etskSetBoxType1Selected(params?.quoteETSKSecondaryBox1));
          dispatch(sliceActions.etskSetBoxType2Selected(params?.quoteETSKSecondaryBox2));
          dispatch(sliceActions.etskSetBoxType3Selected(params?.quoteETSKSecondaryBox3));

          dispatch(etskActions.etskSetFreePackSelected(monthlyPack?.packNameNT ?? ''));
          dispatch(etskActions.etskSetPrimaryBoxPrice(monthlyPack?.pricePt ?? '0'));

          dispatch(etskActions.etskSetCategoryDropdownData(data.PopularPacks));
          dispatch(etskActions.etskSetDurationDropdownData(data.durations));
          dispatch(etskActions.etskSetCategorySelected(undefined));
          dispatch(etskActions.etskSetDurationSelected(undefined));
          dispatch(etskActions.etskSetSelectedPill(STRINGS.NEW_CUSTOMER_BEST_OFFERS));
          const popularPackNames = data.PopularPacks?.map((p: ParentObject) => p?.nameNT);
          const tataskyPackNames = data.TataskyPacks?.map((p: ParentObject) => p?.nameNT);
          const broadCastPackNames = data.BroadCastPacks?.map((p: ParentObject) => p?.nameNT);
          const alacartePackNames = data.AlacartePacks?.map((p: ParentObject) => p?.nameNT);
          const allowedPackNames = new Set([...(popularPackNames ?? []), ...(tataskyPackNames ?? []), ...(broadCastPackNames ?? []), ...(alacartePackNames ?? [])]);
          const packsToRemove = selectedPacksToBuy.filter((item: ParentObject) => !allowedPackNames.has(item?.category?.nameNT));
          packsToRemove.forEach((item: ParentObject) => {
            dispatch(etskActions.etskRemoveSelectedPacksToBuyData(item));
          });
          if (packsToRemove.length > 0) {
            const alertMessage = t('errors.packsNotAvailable');

            dispatch(
              uiActions.showAlert(
                alertMessage,
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                },
                {},
              ),
            );
          }

          return { status: true, data };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * get all billing summary once user selected the pack
 *
 * @function doGetRentalPackNewPartnerQuoteEtsk
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const doGetRentalPackNewPartnerQuoteEtsk =
  (_params: any, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { boxTypeSelected, packSelected, selectedPacksToBuy, freePackSelected } = getState().etskRegistration;
    const { etskPincode, boxType1, boxType2, boxType3 } = getState().quotation;
    const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelNameNT);
    if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
      finalPacks.unshift(freePackSelected);
    }
    const finalPrice = selectedPacksToBuy.reduce((sum: number, curr: ParentObject) => sum + Number(curr.price), 0).toString();
    const noOfConnection = [boxTypeSelected, boxType1?.object?.valueNT, boxType2?.object?.valueNT, boxType3?.object?.valueNT].filter(Boolean).length.toString();

    const requestInput = {
      noOfConnection,
      packPriceFe: finalPrice,
      etskSelectedOffer: packSelected,
      pincode: etskPincode,
      boxType4: boxType3?.object?.valueNT,
      boxType3: boxType2?.object?.valueNT,
      boxType2: boxType1?.object?.valueNT,
      boxType: boxTypeSelected,
      selectedPcaksTogetRentalUniqueArray: finalPacks,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuotePickPackProceed.moduleName, {
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.Status]: response?.status,
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.boxType]: boxTypeSelected,
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.pincode]: etskPincode,
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.tskPin]: etskPincode,
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.tskSerialNumber]: etskPincode,
        });
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(etskActions.etskSetValidatePacksSuccessData(data?.result));
          dispatch(sliceActions.quotationPrimarySetNumberOfConnections({ nameNT: noOfConnection }));
          return data;
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * opens the modal for entering email and mobile
 *
 * @function openEmailMobileModal
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const openEmailMobileModal =
  (formName?: string): AppThunk =>
  (dispatch) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.SEND_QUOTE,
        showCloseIcon: true,
        showHeader: true,
        formName: formName || FORMS.quotationETSKSendQuote,
      }),
    );
  };

/**
 * api to send otp to user mobile number
 *
 * @function sendOTPToCustomer
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const sendOTPToCustomer =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      mobile: params?.quoteETSKmobileNumber ?? params?.mobile,
    };
    dispatch(sliceActions.quotationEtskSetMobile(params?.quoteETSKmobileNumber ?? params?.mobile));
    dispatch(sliceActions.quotationEtskSetEmail(params?.emailID ?? params?.email));
    return api
      .post(queries.generateOTPWithMobile, requestInput)
      .then((response) => {
        if (response?.status) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteSendQuotation.moduleName, {
            [MoengageMixpanelModules.Quotation.QuoteSendQuotation.attributes.Status]: response?.status,
            [MoengageMixpanelModules.Quotation.QuoteSendQuotation.attributes.mobileNumber]: params?.quoteETSKmobileNumber ?? params?.mobile,
          });
          const data = refactorResponse(response);
          if (data?.transStatus === STRINGS.SUCCESS) {
            dispatch(uiActions.clearLoader());
            dispatch(
              uiActions.showBottomModal({
                isModalVisible: true,
                isCenterModal: true,
                type: CHILD_TYPE.OTP_MODAL,
                headerTitle: '',
                data: { mdn: params?.quoteETSKmobileNumber ?? params?.mobile, ...params },
                showCloseIcon: false,
                showHeader: true,
                buttonInfo: {
                  otpButtonLabel: STRINGS.SUBMIT,
                  sentToTitle: STRINGS.SENTTO,
                  queryName: QUERY.ValidateOTPForQuote,
                  hasOutline: true,
                  resendOtpQuery: QUERY.SendOTPToCustomer,
                  resendOtpQueryParams: {
                    mobile: params?.quoteETSKmobileNumber ?? params?.mobile,
                    email: params?.emailID ?? params?.email,
                  },
                },
              }),
            );
          }
          return { status: true, data };
        }
        dispatch(commonActions.setErrorMessage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * api to verify otp entered by the user
 *
 * @function validateOTPForQuote
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const validateOTPForQuote =
  (params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch) => {
    const requestInput = {
      input: {
        partnerMdn: params?.mdn,
        otp: params?.otp,
      },
    };
    return api
      .post(queries.validateOTPWithMobile, requestInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteSubmitOTP.moduleName, {
          [MoengageMixpanelModules.Quotation.QuoteSubmitOTP.attributes.Status]: response?.status,
          [MoengageMixpanelModules.Quotation.QuoteSubmitOTP.attributes.otp]: params?.otp,
          [MoengageMixpanelModules.Quotation.QuoteSubmitOTP.attributes.partnerMDN]: params?.mdn,
        });
        if (response?.status) {
          dispatch(callAction({}, QUERY.InsertRentalPackNewPartnerQuoteMod, '', navigate));
          return { status: true, message: response.message };
        }
        dispatch(commonActions.setErrorMessage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error: any) => {
        dispatch(commonActions.setErrorMessage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * method to open modal for pincode in primary tv sub module
 *
 * @function quotationPrimaryPincodeModal
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const quotationPrimaryPincodeModal =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.quotationPrimarySetIsPrimaryEdit(true));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: false,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.QUOTATION,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.quotationPrimaryPincode,
        headerIcon: ICONS.OLD_QUOTATION,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

/**
 * get all the packs data to be filled in pick pack screen
 *
 * @function getAllCategoryPacks
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const getAllCategoryPacks =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { etskPincode } = getState().quotation;
    dispatch(sliceActions.setRedirectUrl(CONNECTION_TYPE.PRIMARY));
    const { selectedPacksToBuy } = getState().etskRegistration;
    dispatch(sliceActions.setRedirectParams(params));
    const requestInput = {
      boxType: params?.primaryBoxTypeQuote?.object?.value,
      priTskType: params?.primaryTskPinQuote?.object?.valueNT,
      noOfBoxes: params?.numberOfConnectionsQuote?.nameNT.toString(),
      state: params?.quoteETSKTownLocality?.stateNT,
      das: params?.quoteETSKTownLocality?.salesSegmentNT,
      sec1BoxType: params?.secondaryBoxType1Quote?.object?.value,
      sec2BoxType: params?.secondaryBoxType2Quote?.object?.value,
      sec3BoxType: params?.secondaryBoxType3Quote?.object?.value,
    };

    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteConnectionProceed.moduleName, {
          [MoengageMixpanelModules.Quotation.QuoteConnectionProceed.attributes.Status]: response?.status,
          [MoengageMixpanelModules.Quotation.QuoteConnectionProceed.attributes.boxType]: params?.primaryBoxTypeQuote?.object?.value,
          [MoengageMixpanelModules.Quotation.QuoteConnectionProceed.attributes.das]: params?.quoteETSKTownLocality?.salesSegmentNT,
          [MoengageMixpanelModules.Quotation.QuoteConnectionProceed.attributes.noOfBoxes]: params?.numberOfConnectionsQuote?.nameNT.toString(),
          [MoengageMixpanelModules.Quotation.QuoteConnectionProceed.attributes.priTSKType]: params?.primaryTskPinQuote?.object?.valueNT,
          [MoengageMixpanelModules.Quotation.QuoteConnectionProceed.attributes.state]: params?.quoteETSKTownLocality?.stateNT,
        });
        if (response?.status) {
          const data = refactorResponse(response)?.result;
          const filteredBoxTypes = data?.boxTypes?.filter((box: ParentObject) => box.name !== i18next.t('strings.Android'));
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
          data.offerCategories = data.offerCategories.slice(0, -1);
          dispatch(etskActions.etskSetAccountCreationSuccessData({ ...data, boxTypeNT: params?.primaryBoxTypeQuote?.object?.value }));
          dispatch(etskActions.etskSetFiltersData(filterData));
          dispatch(etskActions.etskSetBoxTypeSelected(params?.primaryBoxTypeQuote?.object?.value));
          dispatch(
            primaryActions.setTskValidateData({
              pincode: etskPincode,
              pricePointPrimary: (params?.primaryTskPinQuote?.price ?? 0) * 100,
              pricePointSecondary1: (params?.secondaryTskPin1Quote?.price ?? 0) * 100,
              pricePointSecondary2: (params?.secondaryTskPin2Quote?.price ?? 0) * 100,
              pricePointSecondary3: (params?.secondaryTskPin3Quote?.price ?? 0) * 100,
            }),
          );

          dispatch(sliceActions.quotationPrimarySetNumberOfConnections(params?.numberOfConnectionsQuote));
          dispatch(sliceActions.quotationPrimarySetTskType(params?.primaryTskPinQuote?.object?.valueNT));
          dispatch(sliceActions.quotationPrimarySetTskTypeObject(params?.primaryTskPinQuote));
          dispatch(sliceActions.quotationEtskSetTownLocality(params?.quoteETSKTownLocality));
          dispatch(sliceActions.quotationEtskSetPrimaryBoxSelected(params?.primaryBoxTypeQuote));

          dispatch(sliceActions.etskSetBoxType1Selected(params?.secondaryBoxType1Quote));
          dispatch(sliceActions.etskSetBoxType2Selected(params?.secondaryBoxType2Quote));
          dispatch(sliceActions.etskSetBoxType3Selected(params?.secondaryBoxType3Quote));

          dispatch(sliceActions.quotSetTSKtype1SelectedObject(params?.secondaryTskPin1Quote));
          dispatch(sliceActions.quotSetTSKtype2SelectedObject(params?.secondaryTskPin2Quote));
          dispatch(sliceActions.quotSetTSKtype3SelectedObject(params?.secondaryTskPin3Quote));

          dispatch(etskActions.etskSetFreePackSelected(monthlyPack?.packNameNT ?? ''));
          dispatch(etskActions.etskSetPrimaryBoxPrice(monthlyPack?.pricePt ?? '0'));

          dispatch(etskActions.etskSetCategoryDropdownData(data.PopularPacks));
          dispatch(etskActions.etskSetDurationDropdownData(data.durations));
          dispatch(etskActions.etskSetCategorySelected(undefined));
          dispatch(etskActions.etskSetDurationSelected(undefined));
          dispatch(etskActions.etskSetSelectedPill(STRINGS.NEW_CUSTOMER_BEST_OFFERS));
          dispatch(etskActions.etskSetPackSelected(''));
          const popularPackNames = data.PopularPacks?.map((p: ParentObject) => p?.nameNT);
          const tataskyPackNames = data.TataskyPacks?.map((p: ParentObject) => p?.nameNT);
          const broadCastPackNames = data.BroadCastPacks?.map((p: ParentObject) => p?.nameNT);
          const alacartePackNames = data.AlacartePacks?.map((p: ParentObject) => p?.nameNT);
          const allowedPackNames = new Set([...(popularPackNames ?? []), ...(tataskyPackNames ?? []), ...(broadCastPackNames ?? []), ...(alacartePackNames ?? [])]);
          const packsToRemove = selectedPacksToBuy.filter((item: ParentObject) => !allowedPackNames.has(item?.category?.nameNT));
          packsToRemove.forEach((item: ParentObject) => {
            dispatch(etskActions.etskRemoveSelectedPacksToBuyData(item));
          });
          if (packsToRemove.length > 0) {
            const alertMessage = t('errors.packsNotAvailable');

            dispatch(
              uiActions.showAlert(
                alertMessage,
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                },
                {},
              ),
            );
          }

          return { status: true, data };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * api to get all the billing details based on pack selected
 *
 * @function getAllCategoryPacks
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const doGetRentalPackNewPartnerQuote =
  (_params: any, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { boxTypeSelected, selectedPacksToBuy, freePackSelected } = getState().etskRegistration;
    const { etskPincode, boxType1, boxType2, boxType3, primaryTskType, numberOfConnections } = getState().quotation;
    const finalPacks = selectedPacksToBuy.map((item: ParentObject) => item.siebelNameNT);
    if (freePackSelected && finalPacks?.[0] !== freePackSelected) {
      finalPacks.unshift(freePackSelected);
    }
    const requestInput = {
      subscriberId: '1234567890',
      selectedPacksTogetRentalUniqueArray: finalPacks,
      tskSerialNumber: generateRandom12DigitNumber(),
      tskSerialNumber1: numberOfConnections?.nameNT > 1 ? generateRandom12DigitNumber() : null,
      tskSerialNumber2: numberOfConnections?.nameNT > 2 ? generateRandom12DigitNumber() : null,
      tskSerialNumber3: numberOfConnections?.nameNT > 3 ? generateRandom12DigitNumber() : null,
      boxType: boxTypeSelected,
      boxType1: boxType1?.object?.value,
      boxType2: boxType2?.object?.value,
      boxType3: boxType3?.object?.value,
      tskPin: primaryTskType,
      pincode: etskPincode,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuotePickPackProceed.moduleName, {
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.Status]: response?.status,
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.boxType]: boxTypeSelected,
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.SubscriberID]: '1234567890',
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.pincode]: etskPincode,
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.tskPin]: primaryTskType,
          [MoengageMixpanelModules.Quotation.QuotePickPackProceed.attributes.tskSerialNumber]: generateRandom12DigitNumber(),
        });
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(
            etskActions.etskSetValidatePacksSuccessData({
              ...data?.result,
              noOfConnection: numberOfConnections?.nameNT,
              priBoxType: boxTypeSelected,
              secondBoxType2: boxType1?.object?.value,
              secondBoxType3: boxType2?.object?.value,
              secondBoxType4: boxType3?.object?.value,
            }),
          );
          return data;
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * method to fill in data in primary tv when user navigates to primary tv sub module
 *
 * @function fillInQuoteData
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const fillInQuoteData =
  (_params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    const { isQuotationNavigate, numberOfConnections, etskboxType, boxType1, boxType2, boxType3 } = getState().quotation;
    if (isQuotationNavigate) {
      const boxData: any = await dispatch(callAction({}, QUERY.RetrieveMultiTvBoxType));
      const noOfConnectionResponse: any = await dispatch(callAction({}, QUERY.ConnectionFilter));
      const dropDownData = {
        connectionFilter: noOfConnectionResponse?.connectionFilter,
        boxTypesFilter: boxData?.data?.result?.boxType,
      };
      dispatch(formAction.setMultipleDropdownOptionsData({ data: dropDownData }));
      finalAmountTimeoutId = setTimeout(() => {
        if (numberOfConnections?.nameNT > 3) {
          dispatch(
            formActions.setFieldsToShow([
              'secondaryBoxType1',
              'secondaryTskPin1',
              'secondaryBoxType2',
              'secondaryTskPin2',
              'secondaryBoxType3',
              'secondaryTskPin3',
              'secondaryBox1TSK',
              'secondaryBox2TSK',
              'secondaryBox3TSK',
            ]),
          );
        } else if (numberOfConnections?.nameNT > 2) {
          dispatch(formActions.setFieldsToShow(['secondaryBoxType1', 'secondaryTskPin1', 'secondaryBoxType2', 'secondaryTskPin2', 'secondaryBox1TSK', 'secondaryBox2TSK']));
        }
        if (numberOfConnections?.nameNT > 1) {
          dispatch(formActions.setFieldsToShow(['secondaryBoxType1', 'secondaryTskPin1', 'secondaryBox1TSK']));
        }
      }, 200);
      dispatch(
        formActions.setUpdatedFormFields({
          numberOfConnections,
          primaryBoxType: etskboxType,
          secondaryBoxType1: boxType1,
          secondaryBoxType2: boxType2,
          secondaryBoxType3: boxType3,
        }),
      );
    } else {
      dispatch(callAction({}, QUERY.RetrieveMultiTvBoxType));
      const noOfConnectionResponse: any = await dispatch(callAction({}, QUERY.ConnectionFilter));
      if (noOfConnectionResponse) {
        dispatch(formAction.setDropdownOptionsData({ data: noOfConnectionResponse?.connectionFilter, queryName: QUERY.ConnectionFilter }));
      }
    }
  };

export const clearFinalAmountTimeout = (): AppThunk => () => {
  if (finalAmountTimeoutId) {
    clearTimeout(finalAmountTimeoutId);
  }
};
/**
 * method to get the number of connections data
 *
 * @function connectionFilter
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const connectionFilter =
  (_params: ParentObject): AppThunk =>
  (dispatch) =>
    api
      .post(queries.connectionFilter, {})
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          return data;
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));

export const sendSMSQuotation =
  (_params: ParentObject, _queryName: string, _stateKey: any, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { mobileNo, numberOfConnections, boxPriceFinal, tskTypesData, totalPrice, urlLastPart } = getState().quotation;
    const { accountCreationSuccessData, boxTypeSelected, validatePacksSuccessData, selectedPacksToBuy } = getState().etskRegistration;

    const packPrice = Math.ceil(
      selectedPacksToBuy.reduce((total: number, pack: ParentObject) => {
        const price = parseFloat(pack.price) || 0;
        return total + price;
      }, 0),
    ).toString();

    const ncf = validatePacksSuccessData?.vcLvlPackDtls?.[0]?.packDtls?.[0]?.productPrice ?? '0';
    const sourceData = tskTypesData && Object.keys(tskTypesData).length > 0 ? tskTypesData : accountCreationSuccessData;
    const { smsStartMsg, nextLineChar, smsUrl, smsEndMsg } = sourceData || {};
    const urlLastPart62 = convertTo62Func(urlLastPart);

    const consolidatedMsgSmsPriExt1 =
      numberOfConnections?.nameNT > 1
        ? `, Secondary1 = ${validatePacksSuccessData?.secondBoxType2} = Rs.${boxPriceFinal === 0 ? '0' : validatePacksSuccessData?.multiTVAddBoxsPrice1}, Pack = Rs.${validatePacksSuccessData?.secondaryPack ?? validatePacksSuccessData?.secondPackPrice}, NCF = Rs.${validatePacksSuccessData?.secondaryNCF ?? validatePacksSuccessData?.secondNCFPrice}`
        : '';
    const consolidatedMsgSmsPriExt2 =
      numberOfConnections?.nameNT > 2
        ? `, Secondary2 = ${validatePacksSuccessData?.secondBoxType3} = Rs.${boxPriceFinal === 0 ? '0' : validatePacksSuccessData?.multiTVAddBoxsPrice2}, Pack = Rs.${validatePacksSuccessData?.secondaryPack ?? validatePacksSuccessData?.secondPackPrice2}, NCF = Rs.${validatePacksSuccessData?.secondaryNCF ?? validatePacksSuccessData?.secondNCFPrice2}`
        : '';
    const consolidatedMsgSmsPriExt3 =
      numberOfConnections?.nameNT > 3
        ? `, Secondary3 = ${validatePacksSuccessData?.secondBoxType4} = Rs.${boxPriceFinal === 0 ? '0' : validatePacksSuccessData?.multiTVAddBoxsPrice3}, Pack = Rs.${validatePacksSuccessData?.secondaryPack ?? validatePacksSuccessData?.secondPackPrice3}, NCF = Rs.${validatePacksSuccessData?.secondaryNCF ?? validatePacksSuccessData?.secondNCFPrice3}`
        : '';

    const consolidatedMsgSmsPri = ` No. of connections = ${numberOfConnections?.nameNT}. Primary = ${boxTypeSelected} = Rs.${boxPriceFinal}, Pack = Rs.${packPrice}, NCF = Rs.${ncf}${consolidatedMsgSmsPriExt1}${consolidatedMsgSmsPriExt2}${consolidatedMsgSmsPriExt3}. Total = Rs.${totalPrice} - Tata Play.`;
    const msg = `${smsStartMsg + consolidatedMsgSmsPri + nextLineChar}Details: ${smsUrl}${urlLastPart62}. ${smsEndMsg}`;
    const requestBody = {
      msg,
      rmn: mobileNo,
    };
    return api
      .post(queries.sendSMSQuotation, requestBody)
      .then((response) => {
        if (response?.status) {
          dispatch(regActions.setCreateWoEtskSuccessData({ response: { message: 'Quotation sent!', transId: true } }));
          dispatch(uiActions.hideBottomModal());
          if (tskTypesData && Object.keys(tskTypesData).length > 0) {
            navigate(ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS);
            return { status: true, routeName: ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS };
          }
          navigate(ROUTE.WEB.QUOTATION_ETSK_SUCCESS);
          return { status: true, routeName: ROUTE.WEB.QUOTATION_ETSK_SUCCESS };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * method to fill in data in primary tv when user navigates to primary tv sub module
 *
 * @function insertRentalPackNewPartnerQuoteSecInsMod
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const insertRentalPackNewPartnerQuoteSecInsMod =
  (params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  async (dispatch) => {
    dispatch(uiActions.setLoader());

    return api
      .post(queries.insertRentalPackNewPartnerQuoteSecInsMod, params)
      .then((response) => {
        if (response?.status) {
          dispatch(callAction({}, QUERY.SendSMSQuotation, '', navigate));
          return { status: true, message: response.message };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * method to fill in data in primary tv when user navigates to primary tv sub module
 *
 * @function insertRentalPackNewPartnerQuoteSecInsModMultiTV
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const insertRentalPackNewPartnerQuoteSecInsModMultiTV =
  (_params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  async (dispatch, getState) => {
    const { urlLastPart, multiTvBoxType, multiTVDetails } = getState().quotation;
    dispatch(uiActions.setLoader());
    const filteredPack = multiTVDetails?.packageNameArray.filter((item: ParentObject) => !item.packName.toLowerCase().includes('network'));

    const requestedBody = {
      packageDetails: [
        {
          reqNum: urlLastPart,
          attrVal: `S1_Secondary connection||${multiTvBoxType?.name}`,
          attrPrice: multiTVDetails?.multiTVAddBoxsPrice.toString(),
          attrType: 'S1_BOXACTFEE',
        },
        {
          reqNum: urlLastPart,
          attrVal: 'NCF',
          attrPrice: multiTVDetails?.secondaryNCF,
          attrType: 'S1_RENTAL',
        },
        {
          reqNum: urlLastPart,
          attrVal: filteredPack[0]?.packName,
          attrPrice: multiTVDetails?.secondaryPackPrice,
          attrType: 'S1_ADDON',
        },
      ],
    };

    return api
      .post(queries.insertRentalPackNewPartnerQuoteSecInsMod, requestedBody)
      .then((response) => {
        if (response?.status) {
          dispatch(callAction({}, QUERY.multiTvSendSms, '', navigate));
          return { status: true, message: response.message };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * method to fill in data in primary tv when user navigates to primary tv sub module
 *
 * @function insertRentalPackNewPartnerQuoteMod
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const insertRentalPackNewPartnerQuoteMod =
  (_params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { mobileNo, email, totalPrice, boxPriceFinal, numberOfConnections, isMultiTv } = getState().quotation;
    const { boxTypeSelected, validatePacksSuccessData, freePackSelected, selectedPacksToBuy } = getState().etskRegistration;
    const { info } = getState().user;

    const requestInput = {
      mobileNumber: mobileNo,
      name: info?.name,
      email,
      totalPrice,
    };
    return api
      .post(queries.insertRentalPackNewPartnerQuoteMod, requestInput)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          const reqNum = data?.result?.requestNumber;
          dispatch(sliceActions.setURLLastPart(reqNum));
          const requestBody = {
            packageDetails: [
              {
                reqNum,
                attrVal: 'NCF',
                attrPrice: validatePacksSuccessData?.vcLvlPackDtls?.[0]?.packDtls?.[0]?.productPrice ?? '0',
                attrType: 'P_RENTAL',
              },
              {
                reqNum,
                attrVal: `Primary connection||${boxTypeSelected}`,
                attrPrice: boxPriceFinal.toString(),
                attrType: 'P_BOXACTFEE',
              },
              {
                reqNum,
                attrVal: freePackSelected,
                attrPrice: '0',
                attrType: 'P_BASEPACK',
              },
            ],
          };
          selectedPacksToBuy.forEach((elem: ParentObject) => {
            requestBody.packageDetails.push({
              reqNum,
              attrVal: elem?.siebelNameNT,
              attrPrice: elem?.price,
              attrType: 'P_ADDON',
            });
          });
          if (numberOfConnections?.nameNT > 1) {
            requestBody.packageDetails.push(
              {
                reqNum,
                attrVal: `S1_Secondary connection 1||${validatePacksSuccessData?.secondBoxType2}`,
                attrPrice: boxPriceFinal === 0 ? '0' : validatePacksSuccessData?.multiTVAddBoxsPrice1,
                attrType: 'S1_BOXACTFEE',
              },
              {
                reqNum,
                attrVal: 'NCF',
                attrPrice: validatePacksSuccessData?.secondaryNCF ?? validatePacksSuccessData?.secondNCFPrice,
                attrType: 'S1_RENTAL',
              },
              {
                reqNum,
                attrVal: validatePacksSuccessData?.packToAdd,
                attrPrice: validatePacksSuccessData?.secondaryPack ?? validatePacksSuccessData?.secondPackPrice,
                attrType: 'S1_ADDON',
              },
            );
          }
          if (numberOfConnections?.nameNT > 2) {
            requestBody.packageDetails.push(
              {
                reqNum,
                attrVal: `S2_Secondary connection 2||${validatePacksSuccessData?.secondBoxType3}`,
                attrPrice: boxPriceFinal === 0 ? '0' : validatePacksSuccessData?.multiTVAddBoxsPrice2,
                attrType: 'S2_BOXACTFEE',
              },
              {
                reqNum,
                attrVal: 'NCF',
                attrPrice: validatePacksSuccessData?.secondaryNCF ?? validatePacksSuccessData?.secondNCFPrice2,
                attrType: 'S2_RENTAL',
              },
              {
                reqNum,
                attrVal: validatePacksSuccessData?.packToAdd,
                attrPrice: validatePacksSuccessData?.secondaryPack ?? validatePacksSuccessData?.secondPackPrice2,
                attrType: 'S2_ADDON',
              },
            );
          }
          if (numberOfConnections?.nameNT > 3) {
            requestBody.packageDetails.push(
              {
                reqNum,
                attrVal: `S3_Secondary connection 3||${validatePacksSuccessData?.secondBoxType4}`,
                attrPrice: boxPriceFinal === 0 ? '0' : validatePacksSuccessData?.multiTVAddBoxsPrice3,
                attrType: 'S3_BOXACTFEE',
              },
              {
                reqNum,
                attrVal: 'NCF',
                attrPrice: validatePacksSuccessData?.secondaryNCF ?? validatePacksSuccessData?.secondNCFPrice3,
                attrType: 'S3_RENTAL',
              },
              {
                reqNum,
                attrVal: validatePacksSuccessData?.packToAdd,
                attrPrice: validatePacksSuccessData?.secondaryPack ?? validatePacksSuccessData?.secondPackPrice3,
                attrType: 'S3_ADDON',
              },
            );
          }
          const Query = isMultiTv ? QUERY.InsertRentalPackNewPartnerQuoteSecInsModMultiTV : QUERY.InsertRentalPackNewPartnerQuoteSecInsMod;
          dispatch(callAction(requestBody, Query, '', navigate));
          return { status: true, message: response.message };
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const changeBoxTypeQuotation =
  (_params: ParentObject, _queryName: string, _stateKey: any, _navigate: any): AppThunk =>
  (dispatch) => {
    dispatch(formActions.setRadioContainerOptions(PROPERTIES.QUOTATION.CONNECTION_TYPE, 'getBoxTypeData'));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.QUOTATION,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.quotationChangeBox,
        headerIcon: ICONS.OLD_QUOTATION,
      }),
    );
  };

export const changeBoxTypeQuotationProceed =
  (params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    const { redirectUrl } = getState().quotation;
    dispatch(uiActions.hideBottomModal());
    if (redirectUrl === STRINGS.MULTI && params?.campaign === STRINGS.EXITSING_BOX) {
      navigate(ROUTE.WEB.MULTI_TV_REGISTRATION);
      return;
    }
    if (redirectUrl === STRINGS.MULTI) {
      navigate(ROUTE.WEB.QUOTATION_MULTITV_SELECTION);
      return;
    }
    if (redirectUrl === ACCORDION_TYPE.ETSK && params?.campaign === STRINGS.EXITSING_BOX) {
      navigate(ROUTE.WEB.ETSK_REGISTRATION);
      return;
    }
    if (redirectUrl === ACCORDION_TYPE.ETSK) {
      navigate(ROUTE.WEB.QUOTATION_ETSK_OFFER);
      return;
    }
    if (params?.campaign === STRINGS.EXITSING_BOX) {
      navigate(ROUTE.WEB.SECONDARY_TSK_REGISTRATION);
      return;
    }
    navigate(ROUTE.WEB.QUOTATION_PRIMARY_OFFER);
  };
