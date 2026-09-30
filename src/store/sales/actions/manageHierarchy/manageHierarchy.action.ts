/**
 * In this reducer we will manage all Manage Hierarchy related items
 *
 * @module store/sales/actions/manageHierarchy
 *
 */
import commonActions from 'store/sales/actions/common';
import { sliceActions } from 'store/sales/reducer/manageHierarchy';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { ALERT, CHILD_TYPE, FORMS, MODAL, PROPERTIES, QUERY, ROUTE, STATE_KEY, STRINGS, VALIDATIONS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import formActions from 'store/sales/actions/form';
import { LOG } from 'config/logger';
import { callAction, downloadCSV, filterByParams, filterTableWithDropDown } from 'utils/formBuilderHelper';
import { isAndroid } from 'utils/platformHelper';
import { UNDER_SCORE, UPPER_CASE_REGEX } from 'const/regexes';
import { Sizing } from 'styles';
import { PARTNER_ROLES, ROLES } from 'const/strings';
import { arePopupsAllowed, handleWebViewUrl } from 'utils/navigationHelper';
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
 * dispatch(manageHierarchyAction({ exampleParam: 'exampleValue' }));
 */
export const evdViewAllChildHierarchy =
  (_params: ParentObject, queryName: string): AppThunk =>
  async (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(uiActions.setLoader());
    dispatch(commonActions.setTableColumnData({ tableColumns: [], result: [] }));
    try {
      const requestInput = {
        formName: FORMS.viewMyTeamDetails,
      };
      const response = await api.post(queries[queryName], { ...requestInput });
      const data = refactorResponse(response);
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ViewAll_PageVisit.moduleName, {
        [MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ViewAll_PageVisit.attributes.Status]: true,
      });
      if (info?.internalRole === PROPERTIES.ROLES.distributer) {
        dispatch(formActions.setMultipleDropdownOptionsData({ roleFilter: PROPERTIES.MANAGE_HIERARCHY.DIST_FILTER }));
      } else if (info?.internalRole === PROPERTIES.ROLES.ad) {
        dispatch(formActions.setMultipleDropdownOptionsData({ roleFilter: PROPERTIES.MANAGE_HIERARCHY.AD_FILTER }));
      } else {
        dispatch(formActions.setMultipleDropdownOptionsData({ roleFilter: {} }));
      }
      if (data?.result?.length > 0) {
        dispatch(commonActions.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.result }));
        return { data, status: true };
      }
      dispatch(commonActions.setErrorMessage(data?.message));
      return { data, status: false };
    } catch (error: any) {
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`${STRINGS.ERROR_OCCURED_WHILE_FETCHING_DATA} ${error}`);
      return { status: false };
    } finally {
      dispatch(uiActions.clearLoader());
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
 * dispatch(downloadDetails({ exampleParam: 'exampleValue' }));
 */
export const downloadDetails =
  (_params: ParentObject, _queryName: string): AppThunk =>
  async (dispatch, getState) => {
    const { tableData, tableColumns } = getState().common;
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ViewAll_ExportToExcel.moduleName, {
      [MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ViewAll_ExportToExcel.attributes.Status]: true,
    });
    const headerMap: Record<string, string> = tableColumns.reduce((acc: Record<string, string>, item: ParentObject) => {
      const originalKey = item.accessorKey as string;
      const snakeKey = originalKey.replace(UPPER_CASE_REGEX, '$1_$2').replace(UNDER_SCORE, '_').toUpperCase();
      acc[originalKey] = snakeKey;
      return acc;
    }, {});

    const headers: string[] = Object.values(headerMap);

    const transformedData = (tableData as Record<string, any>[]).map((row) => {
      const newRow: Record<string, any> = {};
      Object.entries(headerMap).forEach(([originalKey, snakeKey]) => {
        newRow[snakeKey] = row[originalKey];
      });
      return newRow;
    });

    const timestamp = Date.now();
    const result = await downloadCSV(transformedData, headers, `MyReport_Partner_Details_${timestamp}.csv`);

    if (isAndroid()) {
      if (result?.status) {
        dispatch(uiActions.showAlert(STRINGS.FILE_DOWNLOADED_SUCCESSFULLY, ALERT.SUCCESS, { primaryText: MODAL.OK }, {}));
      } else {
        dispatch(uiActions.showAlert(STRINGS.STORAGE_PERMISSION_DENIED, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
      }
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
 * dispatch(searchTeamDetails({ exampleParam: 'exampleValue' }));
 */

export const searchTeamDetails =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { tableData } = getState().common;
    const viewTeamSearch = params?.viewTeamSearch?.length > Sizing.x1 && params?.viewTeamSearch;
    const requestInput = {
      userId: params?.searchText || viewTeamSearch || '',
      nameNT: params?.searchText || viewTeamSearch || '',
      mobile: params?.searchText || viewTeamSearch || '',
      role: params?.searchText || viewTeamSearch || '',
      parentMobile: params?.searchText || viewTeamSearch || '',
      parentName: params?.searchText || viewTeamSearch || '',
      distributorId: params?.searchText || viewTeamSearch || '',
      registrationDate: params?.searchText || viewTeamSearch || '',
      balance: params?.searchText || viewTeamSearch || '',
      channelOutletType: params?.searchText || viewTeamSearch || '',
      thresoldLimit: params?.searchText || viewTeamSearch || '',
      tsraFlag: params?.searchText || viewTeamSearch || '',
      status: params?.searchText || viewTeamSearch || '',
    };

    const requestInputRole = {
      role: params?.role || params?.filterRole || '',
    };
    const finalFilteredData = tableData.filter((item: ParentObject) => {
      const roleMatch = !requestInputRole.role || filterTableWithDropDown([item], requestInputRole).length;
      const searchMatch = (!requestInput.userId && !requestInput.nameNT && !requestInput.mobile) || filterByParams([item], requestInput).length;
      return roleMatch && searchMatch;
    });
    dispatch(commonActions.setTotalListCount(finalFilteredData.length));
    dispatch(commonActions.setTableFilteredData({ result: finalFilteredData }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setTypeOfReportOptions({ exampleParam: 'exampleValue' }));
 */
export const setTypeOfReportOptions =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { dateType } = getState().manageHierarchy;
    if (dateType?.[0]) {
      dispatch(formActions.setUpdatedFormFields({ transactionDate: dateType }, STATE_KEY.FORM_STATE));
    }
    if (params?.searchLocally?.roleId === PARTNER_ROLES.dealer) {
      dispatch(formActions.setRadioContainerOptions(PROPERTIES.MANAGE_HIERARCHY.TYPES_OF_REPORT_FOR_DEALER, queryName));
    } else {
      dispatch(formActions.setRadioContainerOptions(PROPERTIES.MANAGE_HIERARCHY.TYPES_OF_REPORT_FOR_ALL, queryName));
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
 * dispatch(setNewTypeOfReportOptions({ exampleParam: 'exampleValue' }));
 */
export const setNewTypeOfReportOptions =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { reportType } = getState().manageHierarchy;
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ReportPartner_PageVisit.moduleName, {
      [MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ReportPartner_PageVisit.attributes.Status]: true,
    });
    if (!params?.selectReport && reportType) {
      dispatch(formActions.setUpdatedFormFields({ typeOfReport: reportType }));
    }
    if (params?.searchLocally?.roleId === PARTNER_ROLES.dealer) {
      dispatch(formActions.setRadioContainerOptions(PROPERTIES.MANAGE_HIERARCHY.TYPES_OF_REPORT_FOR_DEALER, queryName));
    } else {
      dispatch(formActions.setRadioContainerOptions(PROPERTIES.MANAGE_HIERARCHY.TYPES_OF_REPORT_FOR_ALL, queryName));
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
 * dispatch(getReports({ exampleParam: 'exampleValue' }));
 */
export const getReports =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { dateType } = getState().manageHierarchy;

    const requestInput = {
      input: {
        reportName: params?.typeOfReport,
        startDate: params?.transactionDate?.[0]?.startDate || dateType?.[0]?.startDate,
        endDate: params?.transactionDate?.[0]?.endDate || dateType?.[0]?.endDate,
        partnerMdn: params?.selectPartner?.mobile || '',
        partnerRole: params?.selectPartner?.roleId || '',
      },
    };

    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ReportPartner_Download.moduleName, {
          [MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ReportPartner_Download.attributes.Status]: true,
        });

        if (data?.status && data?.info?.reportURL) {
          if (!arePopupsAllowed()) {
            const reportUrl = data.info.reportURL;
            // Create and trigger a hidden anchor for download
            const link = document.createElement('a');
            link.href = reportUrl;
            link.setAttribute('download', 'report.xlsx');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            handleWebViewUrl(data?.info?.reportURL, true);
          }
          return { response, status: true };
        }
        dispatch(uiActions.hideBottomModal());
        return { status: false };
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
 * dispatch(getCircleUserNameEmail({ exampleParam: 'exampleValue' }));
 */
export const getCircleUserNameEmail =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], { mdn: params?.mdn })
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          dispatch(sliceActions.setManageHierarchyDisDetails(data?.info));
          dispatch(
            formActions.setUpdatedFormFields({
              disCIrcle: data?.info?.[0]?.circleDesc,
            }),
          );
          return { response, status: true };
        }
        dispatch(uiActions.hideBottomModal());
        return { status: false };
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
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
 * dispatch(getCCPartnerDetailsBasedOnRole({ exampleParam: 'exampleValue' }));
 */
export const getCCPartnerDetailsBasedOnRole =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const roleMap: Record<string, string> = {
      dealer: PROPERTIES.ROLES.dealer,
      fos: PROPERTIES.ROLES.fos,
      ad: PROPERTIES.ROLES.ad,
    };

    const role = roleMap[params?.user?.toLowerCase()] || params?.user;
    dispatch(uiActions.setLoader());
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_Role.moduleName, {
      [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_Role.attributes.Status]: true,
      [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_Role.attributes.role]: role,
    });
    if (info?.roleId !== PARTNER_ROLES.fos) {
      return api
        .post(queries[queryName], { role, mdn: params?.mdn })
        .then((response) => {
          const data = refactorResponse(response);
          if (data?.status) {
            dispatch(
              formAction.setMultipleAutoCompleteData({
                data: {
                  nameAndMdnFilter: data?.nameAndMdnFilter,
                  outTypeResponse: data?.outTypeResponse,
                },
              }),
            );
            return { response, status: true };
          }
          dispatch(uiActions.hideBottomModal());
          return { status: false };
        })
        .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
        .finally(() => dispatch(uiActions.clearLoader()));
    }
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
 * dispatch(validateDealerDetailsCCPartner({ exampleParam: 'exampleValue' }));
 */
export const validateDealerDetailsCCPartner =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    if (params?.partner === STRINGS.YES_LOWER && !params?.partnerEmail) {
      dispatch(uiActions.showErrorPage(`${i18next.t('errors.invalidEmailAddress')}` as unknown as string));
      return null;
    }
    dispatch(commonActions.setErrorMessage(''));
    const { manageHierarchyDisDetails, distributerIdData } = getState().manageHierarchy;
    const { info } = getState().user;
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        partnerMdn: params?.partnerNumber,
        pincode: params?.pincode,
        distCircle: manageHierarchyDisDetails?.[0]?.circleDescNT,
        partnerEmail: params?.partnerEmail,
        mdn: distributerIdData?.distMdn || null,
      },
    };
    const requestInputForFos = {
      input: {
        partnerMdn: params?.partnerNumber,
        pincode: params?.pincode,
        distCircle: manageHierarchyDisDetails?.[0]?.circleDescNT,
        partnerEmail: params?.partnerEmail,
        distributorMdn: manageHierarchyDisDetails?.[0]?.distributorMdn,
      },
    };
    dispatch(
      formActions.setUpdatedFormFields({
        townLocality: '',
        outletType: '',
        age: '',
        uniqueTownCode: '',
        educationDetails: '',
        backgroundDetails: '',
        occupationDetails: '',
        secondaryLanguage: '',
        customerDetailsDAS: '',
        primaryLanguage: '',
      }),
    );
    dispatch(formActions.setMultipleDropdownOptionsData({ fosOutletTypesFilter: [], educationDetails: [], backgroundDetails: [], occupationDetails: [] }));
    dispatch(sliceActions.setIsFormModified(false));
    return api
      .post(queries[queryName], info?.roleId === PARTNER_ROLES.fos ? requestInputForFos : requestInput)
      .then((response) => {
        const data = refactorResponse(response);

        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_ValidatePincode.moduleName, {
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_ValidatePincode.attributes.Status]: true,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_ValidatePincode.attributes.distCircle]: manageHierarchyDisDetails?.[0]?.circleDescNT,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_ValidatePincode.attributes.mdn]: distributerIdData?.distMdn || null,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_ValidatePincode.attributes.partnerEmail]: params?.partnerEmail,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_ValidatePincode.attributes.partnerMdn]: params?.partnerNumber,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_ValidatePincode.attributes.pincode]: params?.pincode,
        });
        const location = data?.result?.cityDetails?.[0];
        dispatch(sliceActions.setDealerDetailsCCPartner(data?.result));
        dispatch(formActions.setUpdatedFormFields({ city: location?.billCity, state: location?.billState, district: location?.billDist, townCode: '' }));
        dispatch(formActions.setMultipleDropdownOptionsData(data?.result));
        dispatch(formAction.setDropdownData({ data: data?.result?.townDetailsFilter, queryName: QUERY.TownDetailsFilter, stateKey: STATE_KEY.FORM_STATE }));
        dispatch(uiActions.clearLoader());
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
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
 * dispatch(validateTownCodeCCPartner({ exampleParam: 'exampleValue' }));
 */
export const validateTownCodeCCPartner =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, Sizing.layout.x100);
    const { formNavigationData } = getState().form[STATE_KEY.FORM_STATE];
    const roleMap: Record<string, string> = {
      dealer: PROPERTIES.ROLES.dealer,
      fos: PROPERTIES.ROLES.fos,
      ad: PROPERTIES.ROLES.ad,
    };
    const role = roleMap[formNavigationData?.params?.user?.toLowerCase()] || formNavigationData?.params?.user || ROLES.dealer;
    const requestInput = {
      input: {
        pincode: params?.pincode,
        location: params?.null?.split('~').pop() || params?.townLocality?.split('~').pop(),
        role,
        fosMdn: params?.selectPartnerMobileNumber?.split(' - ').pop() || info?.mdn,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const townCode = data?.result?.townCode?.[0];
        if (role !== PROPERTIES.ROLES.dealer) {
          dispatch(callAction({}, QUERY.ValidateOutletTypeAndFetchAllLanguages));
        }
        // Patch the data before dispatch
        if (!data?.result?.fosOutletTypesFilter && data?.result?.eligibleOutletFilter) {
          data.result.fosOutletTypesFilter = data.result.eligibleOutletFilter;
        }
        const dasValue = `${i18next.t('strings.DAS_SEGMENT')} ${data?.result?.DASResponse}`;
        dispatch(
          formActions.setUpdatedFormFields({
            townCode: `${townCode?.billTown} ~ ${townCode?.uniqueTownCodeTSl}`,
            customerDetailsDAS: dasValue,
            secondaryLanguage: '',
            primaryLanguage: '',
            outletType: '',
          }),
        );
        dispatch(sliceActions.setTownCodeCCPartnerDetials(data?.result));
        dispatch(formActions.setMultipleDropdownOptionsData(data?.result));
        dispatch(uiActions.clearLoader());
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
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
 * dispatch(validateOutletTypeAndFetchAllLanguages({ exampleParam: 'exampleValue' }));
 */
export const validateOutletTypeAndFetchAllLanguages =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { manageHierarchyDisDetails } = getState().manageHierarchy;
    const requestInput = {
      input: {
        outletType: params?.null || params?.outletType || null,
        pincode: params?.pincode || null,
        distCircle: manageHierarchyDisDetails?.[0]?.circleDesc || null,
        townLocality: params?.townLocality?.split('~').pop() || null,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);

        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_OutletType.moduleName, {
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_OutletType.attributes.Status]: true,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_OutletType.attributes.distCircle]: manageHierarchyDisDetails?.[0]?.circleDesc || null,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_OutletType.attributes.outletType]: params?.null || params?.outletType || null,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_OutletType.attributes.townLocality]: params?.townLocality?.split('~').pop() || null,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_OutletType.attributes.pincode]: params?.pincode || null,
        });
        dispatch(sliceActions.setOutletResponseAndLanguages(data?.result));
        dispatch(formActions.setMultipleDropdownOptionsData(data?.result));
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        setTimeout(() => {
          dispatch(formActions.setUpdatedFormFields({ outletType: '' }));
        }, Sizing.x200);

        return { status: false, message: error.message };
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
 * dispatch(submitRequestForOtp({ exampleParam: 'exampleValue' }));
 */
export const otpConfirmtion =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { isFormModified } = getState().manageHierarchy;
    // Show error and return early if form has modified
    if (isFormModified) {
      const errorMessage = `${i18next.t('strings.pleaseValidateAboveDetails')}`;
      dispatch(uiActions.clearLoader());
      dispatch(uiActions.showErrorPage(errorMessage));
      return { status: false, message: errorMessage };
    }
    if (params?.partner === STRINGS.YES_LOWER && !params?.partnerEmail) {
      dispatch(uiActions.showErrorPage(`${i18next.t('errors.invalidEmailAddress')}` as unknown as string));
      return null;
    }
    const alertMessage = `${i18next.t('alertMessages.otpConfirmMsgPartner')}`;
    dispatch(
      uiActions.showAlert(
        alertMessage,
        ALERT.CONFIRM,
        {
          primaryText: MODAL.OK,
          secondaryText: MODAL.CANCEL,
          isSecondaryRequire: true,
          queryName: QUERY.SubmitRequestForOtp,
          queryParams: params,
          clearForm: false,
        },
        {},
      ),
    );
    return null;
  };

export const openSettingsInDevice =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    params?.openSettings().catch((error: any) => {
      dispatch(uiActions.showAlert(error, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
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
 * dispatch(submitRequestForOtp({ exampleParam: 'exampleValue' }));
 */
export const submitRequestForOtp =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    if (!params?.mobile) {
      dispatch(uiActions.setLoader());
    }
    const { isIspValid } = getState().manageHierarchy;
    const { bottomModal } = getState().ui;
    const requestInput = {
      mobile: params?.partnerNumber ?? params?.mobile,
    };
    if ((isIspValid && params?.ispCode) || (!isIspValid && !params?.ispCode)) {
      return api
        .post(queries.generateOTPWithMobile, requestInput)
        .then((response) => {
          const data = refactorResponse(response);
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_OtpConfirmation.moduleName, {
            [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_OtpConfirmation.attributes.Status]: true,
            [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_OtpConfirmation.attributes.mobile]: params?.partnerNumber ?? params?.mobile,
          });
          if (data?.transStatus === STRINGS.SUCCESS) {
            if (!params?.mobile) {
              dispatch(uiActions.clearLoader());
              dispatch(uiActions.hideBottomModal());
            }
            setTimeout(() => {
              dispatch(
                uiActions.showBottomModal({
                  isModalVisible: true,
                  isCenterModal: true,
                  type: CHILD_TYPE.OTP_MODAL,
                  headerTitle: '',
                  data: { mdn: params?.partnerNumber ?? params?.mobile, ...params },
                  showCloseIcon: false,
                  showHeader: true,
                  buttonInfo: {
                    otpButtonLabel: STRINGS.SUBMIT,
                    sentToTitle: STRINGS.SENT_TO_PARTNER_NUMBER,
                    queryName: QUERY.ValidateOTPWithMobile,
                    hasOutline: true,
                    resendOtpQuery: QUERY.SubmitRequestForOtp,
                    resendOtpQueryParams: {
                      partnerNumber: params?.partnerNumber ?? params?.mobile,
                      ...params,
                    },
                  },
                }),
              );
            }, 500);
          }
          return { status: true, data };
        })
        .catch((error: any) => {
          if (bottomModal.isModalVisible) {
            dispatch(commonActions.setErrorMessage(error.message));
          } else {
            dispatch(uiActions.showErrorPage(error.message));
          }
          return { status: false, message: error.message };
        })
        .finally(() => dispatch(uiActions.clearLoader()));
    }
    dispatch(uiActions.clearLoader());
    dispatch(uiActions.showErrorPage(`${i18next.t('strings.pleaseValidateISP')}`));
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
 * dispatch(validateOTPWithMobile({ exampleParam: 'exampleValue' }));
 */
export const validateOTPWithMobile =
  (params: ParentObject, queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch) => {
    const requestInput = {
      input: {
        partnerMdn: params?.mdn,
        otp: params?.otp,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);

        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SubmitOtp.moduleName, {
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SubmitOtp.attributes.Status]: true,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SubmitOtp.attributes.partnerMdn]: params?.mdn,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SubmitOtp.attributes.otp]: params?.otp,
        });

        dispatch(uiActions.clearLoader());
        dispatch(callAction(params, QUERY.CreateChannelPartner, '', navigate));
        return { status: true, data };
      })
      .catch((error: any) => ({ status: false, message: error.message }))
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
 * dispatch(createChannelPartner({ exampleParam: 'exampleValue' }));
 */
export const createChannelPartner =
  (params: ParentObject, queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, Sizing.x200);
    const { manageHierarchyDisDetails, townCodeCCPartnerDetials, distributerIdData } = getState().manageHierarchy;
    const { formNavigationData } = getState().form[STATE_KEY.FORM_STATE];
    const typeName = params?.outletType?.name;
    const matchedOutlet = townCodeCCPartnerDetials?.fosOutletTypes?.find((outlet: ParentObject) => outlet?.outletType?.toLowerCase() === typeName?.toLowerCase());
    const roleMap: Record<string, string> = {
      dealer: PARTNER_ROLES.dealer,
      fos: PARTNER_ROLES.fos,
      ad: PARTNER_ROLES.ad,
    };
    const location = formNavigationData?.params?.locations;
    const role = roleMap[formNavigationData?.params?.user?.toLowerCase()] || formNavigationData?.params?.user;
    dispatch(sliceActions.setSuccessRoleTypeData({ role: formNavigationData?.params?.user?.toLowerCase(), tsra: params?.partner }));
    const requestInput = {
      input: {
        parentMdn: info?.roleId === PARTNER_ROLES.fos ? info?.mdn : params?.selectPartnerMobileNumber?.name?.split(' - ').pop() || manageHierarchyDisDetails?.[0]?.distributorMdn,
        partnerRole: info?.roleId === PARTNER_ROLES.fos ? PARTNER_ROLES.dealer : role,
        circleId: manageHierarchyDisDetails?.[0]?.cirleId,
        partnerName: params?.partnerName,
        partnerMobileNumber: params?.partnerNumber,
        outletId: matchedOutlet?.outletId ?? (params?.outletType?.id ? String(params.outletType.id) : ''),
        address: params?.addressLine,
        address2: params?.addressLineSecond,
        pincode: params?.pincode,
        email: params?.partnerEmail,
        city: params?.city,
        primaryLanguage: String(params?.primaryLanguage?.id),
        secondaryLanguage: String(params?.secondaryLanguage?.id),
        locality: params?.townLocality?.name?.split('~').pop() || '',
        district: params?.district,
        townCode: params?.townCode?.split(' ~ ').pop() || '',
        age: params?.age || '',
        educationId: params?.educationDetails?.id ? params.educationDetails.id.toString() : '',
        backgroundId: params?.backgroundDetails?.id ? params.backgroundDetails.id.toString() : '',
        occupationId: params?.occupationDetails?.id ? params.occupationDetails.id.toString() : '',
        tsraFlag: (params?.partner && (params?.partner?.toLowerCase() === VALIDATIONS.YES.toLowerCase() ? STRINGS.YES : STRINGS.NO)) || '',
        ispCode: params?.ispCode || '',
        partnerComments: '',
        partnerType: params?.partnerType?.name || '',
        latitude: location?.latitude?.toFixed(6) || params?.geoLatitude,
        longitude: location?.longitude?.toFixed(6) || params?.geoLongitude,
        distId: distributerIdData?.distMdn || null,
      },
    };

    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SuccessPage.moduleName, {
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SuccessPage.attributes.Status]: true,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SuccessPage.attributes.outletId]:
            matchedOutlet?.outletId ?? (params?.outletType?.id ? String(params.outletType.id) : ''),
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SuccessPage.attributes.parentMdn]:
            info?.roleId === PARTNER_ROLES.fos ? info?.mdn : params?.selectPartnerMobileNumber?.name?.split(' - ').pop() || manageHierarchyDisDetails?.[0]?.distributorMdn,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SuccessPage.attributes.partnerMobileNumber]: params?.partnerNumber,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SuccessPage.attributes.partnerName]: params?.partnerName,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_SuccessPage.attributes.partnerRole]: info?.roleId === PARTNER_ROLES.fos ? PARTNER_ROLES.dealer : role,
        });
        dispatch(sliceActions.manageHierarchySuccess(data));
        navigate(ROUTE.WEB.MANAGE_HIERARCHY_SUCCESS);
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
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
 * dispatch(validateISPCode({ exampleParam: 'exampleValue' }));
 */
export const validateISPCode =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { dealerDetailsCCPartner } = getState().manageHierarchy;
    const requestInput = {
      input: {
        ISPCode: params?.ispCode,
        dealerState: dealerDetailsCCPartner?.cityDetails?.[0]?.billState,
      },
    };
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const { partnerCode, name, state } = data.result[0];
        const ispIdValue = `${i18next.t('strings.ispId')} : ${partnerCode}`;
        const ispNameValue = `${i18next.t('strings.ispName')} : ${name}`;
        const ispStateValue = `${i18next.t('strings.ispState')} : ${state}`;
        dispatch(formActions.setUpdatedFormFields({ ispName: ispNameValue, ispState: ispStateValue, ispId: ispIdValue }));
        dispatch(sliceActions.setIspCodeValidation(true));
        dispatch(uiActions.clearLoader());
        dispatch(sliceActions.incrementValidationAttempt());
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(sliceActions.incrementValidationAttempt());
        dispatch(sliceActions.setIspCodeValidation(false));
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(
          formActions.setUpdatedFormFields({
            ispName: '',
            ispState: '',
            ispId: '',
          }),
        );
        return { status: false, message: error.message };
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
 * dispatch(captureLocationAction({ exampleParam: 'exampleValue' }));
 */
export const captureLocationAction =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(formActions.setUpdatedFormFields({ geoLatitude: params?.locations?.latitude?.toFixed(6), geoLongitude: params?.locations?.longitude?.toFixed(6) }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(validateUpdate({ exampleParam: 'exampleValue' }));
 */
export const validateUpdate = (): AppThunk => (dispatch) =>
  Promise.resolve()
    .then(() => {
      dispatch(
        formActions.setMultipleDropdownOptionsData({
          cityDetails: [],
          townDetailsFilter: [],
          fosOutletTypesFilter: [],
          educationDetails: [],
          backgroundDetails: [],
          occupationDetails: [],
        }),
      );
      dispatch(sliceActions.setIsFormModified(true));
      return { status: true, message: '' };
    })
    .finally(() => dispatch(uiActions.clearLoader()));

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(storeRadioValue({ exampleParam: 'exampleValue' }));
 */
export const storeRadioValue =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setReportType(params?.report));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(storeDateValue({ exampleParam: 'exampleValue' }));
 */
export const storeDateValue =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setDateType(params));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(storeDateValue({ exampleParam: 'exampleValue' }));
 */
export const setDistributerID =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      formAction.setMultipleAutoCompleteData({
        nameAndMdnFilter: [],
      }),
    );
    dispatch(
      formActions.setUpdatedFormFields({
        selectPartnerMobileNumber: '',
      }),
    );
    if (params?.searchLocally?.distMdn) {
      dispatch(sliceActions.setDistributerIdData(params?.searchLocally || params?.distributerDropdown));
      dispatch(callAction({ user: PROPERTIES.ROLES.dealer, mdn: params?.searchLocally?.distMdn || params?.distributerDropdown?.distMdn }, QUERY.GetCCPartnerDetailsBasedOnRole));
      dispatch(callAction({ mdn: params?.searchLocally?.distMdn || params?.distributerDropdown?.distMdn }, QUERY.GetCircleUserNameEmail));
    } else {
      dispatch(
        formActions.setUpdatedFormFields({
          disCIrcle: '',
          selectPartnerMobileNumber: '',
        }),
      );
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
 * dispatch(storeDateValueUpdate({ exampleParam: 'exampleValue' }));
 */
export const storeDateValueUpdate =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setDateType([]));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(searchForPartnerRoles({ exampleParam: 'exampleValue' }));
 */
export const searchForPartnerRoles =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const role = params?.role || '';
    const roleMapping = {
      Dealer: PARTNER_ROLES.dealer,
      AD: PARTNER_ROLES.ad,
      FOS: PARTNER_ROLES.fos,
    } as const;
    const payload = {
      roleId: (role && roleMapping[role as keyof typeof roleMapping]) || role,
    };
    return api
      .post(queries.searchPartner, { input: { searchKeyword: params?.searchText }, ...payload })
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ReportPartner_Selection.moduleName, {
          [MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ReportPartner_Selection.attributes.Status]: true,
          [MoengageMixpanelModules.Manage_Hierarchy.Manage_Hierarchy_ReportPartner_Selection.attributes.roleId]: (role && roleMapping[role as keyof typeof roleMapping]) || role,
        });
        dispatch(formActions.setUpdatedFormFields({ selectPartner: '' }));
        dispatch(formAction.setDropdownData({ data: data?.info, queryName }));
        return { status: true, data: data.info };
      })
      .catch((error: any) => {
        dispatch(formAction.setDropdownData({ data: [], queryName }));
        LOG.info(error);
        return { status: false, data: [] };
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
 * dispatch(viewDistributorListForASM({ exampleParam: 'exampleValue' }));
 */
export const viewDistributorListForASM =
  (_params: ParentObject, queryName: string, _stateKey: any, _navigate: any): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      userRole: null,
      userIdValue: null,
      createChannelPartner: true,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formAction.setDropdownData({ data: data?.result?.distCodeAndName, queryName: QUERY.DistCodeAndName }));
        dispatch(sliceActions.setDistributerListData(data?.result));
        dispatch(uiActions.clearLoader());
        return { status: true, data };
      })
      .catch((error: any) => ({ status: false, message: error.message }))
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const townDetailsFilter =
  (_params: ParentObject, _queryName: string): AppThunk =>
  () => {};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(validateTownCodeCCPartner({ exampleParam: 'exampleValue' }));
 */
export const validateTownCodeCCPartnerForDistributor =
  (params: ParentObject, _queryName: string): AppThunk =>
  (dispatch, getState) => {
    if (!params?.searchLocally) {
      dispatch(
        formActions.setUpdatedFormFields({
          townCode: '',
        }),
      );
      return;
    }
    const { info } = getState().user;
    setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, Sizing.layout.x100);
    const { formNavigationData } = getState().form[STATE_KEY.FORM_STATE];
    const roleMap: Record<string, string> = {
      dealer: PROPERTIES.ROLES.dealer,
      fos: PROPERTIES.ROLES.fos,
      ad: PROPERTIES.ROLES.ad,
    };
    const role = roleMap[formNavigationData?.params?.user?.toLowerCase()] || formNavigationData?.params?.user || ROLES.dealer;

    const requestInput = {
      input: {
        pincode: params?.pincode,
        location: params?.null?.split('~').pop() || params?.searchLocally?.object?.valueNT?.split('~').pop(),
        role,
        fosMdn: params?.selectPartnerMobileNumber?.name?.split(' - ').pop() || info?.mdn,
      },
    };
    api
      .post(queries.validateTownCodeCCPartner, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_Town_Locality.moduleName, {
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_Town_Locality.attributes.Status]: true,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_Town_Locality.attributes.role]: role,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_Town_Locality.attributes.fosMdn]: params?.selectPartnerMobileNumber?.name?.split(' - ').pop() || info?.mdn,
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_Town_Locality.attributes.location]:
            params?.null?.split('~').pop() || params?.searchLocally?.object?.valueNT?.split('~').pop(),
          [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_Town_Locality.attributes.pincode]: params?.pincode,
        });
        const townCode = data?.result?.townCode?.[0];
        if (role !== PROPERTIES.ROLES.dealer) {
          dispatch(callAction({}, QUERY.ValidateOutletTypeAndFetchAllLanguages));
        }
        // Patch the data before dispatch
        if (!data?.result?.fosOutletTypesFilter && data?.result?.eligibleOutletFilter) {
          data.result.fosOutletTypesFilter = data.result.eligibleOutletFilter;
        }
        const dasValue = `${i18next.t('strings.DAS_SEGMENT')} ${data?.result?.DASResponse}`;
        dispatch(
          formActions.setUpdatedFormFields({
            townCode: `${townCode?.billTown} ~ ${townCode?.uniqueTownCodeTSl}`,
            customerDetailsDAS: dasValue,
            secondaryLanguage: '',
            primaryLanguage: '',
            outletType: '',
          }),
        );
        dispatch(sliceActions.setTownCodeCCPartnerDetials(data?.result));
        dispatch(formActions.setMultipleDropdownOptionsData(data?.result));
        dispatch(uiActions.clearLoader());
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
