import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/manageHierarchy';
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import { sliceActions as formReducerActions } from 'store/sales/reducer/form';
import { callAction, downloadCSV, filterByParams } from 'utils/formBuilderHelper';
import { isAndroid } from 'utils/platformHelper';
import { handleWebViewUrl } from 'utils/navigationHelper';
import { PROPERTIES, ROUTE, STATE_KEY, STRINGS } from 'const';
import { PARTNER_ROLES } from 'const/strings';

import * as actions from './manageHierarchy.action';

// Mock ALL modules BEFORE importing actions
jest.mock('services/apolloClient', () => ({
  api: { post: jest.fn(() => Promise.resolve({ status: true, result: [], info: {} })) },
}));

jest.mock('store/sales/reducer/manageHierarchy', () => ({
  sliceActions: {
    setManageHierarchyDisDetails: jest.fn(() => ({ type: 'MH_SET_DIS_DETAILS' })),
    setIsFormModified: jest.fn(() => ({ type: 'MH_SET_FORM_MODIFIED' })),
    setDealerDetailsCCPartner: jest.fn(() => ({ type: 'MH_SET_DEALER_DETAILS' })),
    setTownCodeCCPartnerDetials: jest.fn(() => ({ type: 'MH_SET_TOWN_CODE' })),
    setOutletResponseAndLanguages: jest.fn(() => ({ type: 'MH_SET_OUTLET_RESPONSE' })),
    setManageHierarchyPincodeValidate: jest.fn(() => ({ type: 'MH_SET_PINCODE_VALIDATE' })),
    manageHierarchySuccess: jest.fn(() => ({ type: 'MH_SUCCESS' })),
    setIspCodeValidation: jest.fn(() => ({ type: 'MH_SET_ISP_VALIDATION' })),
    incrementValidationAttempt: jest.fn(() => ({ type: 'MH_INCREMENT_ATTEMPT' })),
    setReportType: jest.fn(() => ({ type: 'MH_SET_REPORT_TYPE' })),
    setDateType: jest.fn(() => ({ type: 'MH_SET_DATE_TYPE' })),
    setDistributerIdData: jest.fn(() => ({ type: 'MH_SET_DIST_ID_DATA' })),
    setDistributerListData: jest.fn(() => ({ type: 'MH_SET_DIST_LIST_DATA' })),
    setSuccessRoleTypeData: jest.fn(() => ({ type: 'MH_SET_SUCCESS_ROLE' })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(() => ({ type: 'UI_SET_LOADER' })),
    clearLoader: jest.fn(() => ({ type: 'UI_CLEAR_LOADER' })),
    showErrorPage: jest.fn(() => ({ type: 'UI_SHOW_ERROR_PAGE' })),
    showAlert: jest.fn(() => ({ type: 'UI_SHOW_ALERT' })),
    hideBottomModal: jest.fn(() => ({ type: 'UI_HIDE_BOTTOM_MODAL' })),
    showBottomModal: jest.fn(() => ({ type: 'UI_SHOW_BOTTOM_MODAL' })),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setTableColumnData: jest.fn(() => ({ type: 'COMMON_SET_TABLE_COLUMN_DATA' })),
    setErrorMessage: jest.fn(() => ({ type: 'COMMON_SET_ERROR_MESSAGE' })),
    setTotalListCount: jest.fn(() => ({ type: 'COMMON_SET_TOTAL_LIST_COUNT' })),
    setTableFilteredData: jest.fn(() => ({ type: 'COMMON_SET_TABLE_FILTERED_DATA' })),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setMultipleDropdownOptionsData: jest.fn(() => ({ type: 'FORM_SET_MULTIPLE_DROPDOWN' })),
    setUpdatedFormFields: jest.fn(() => ({ type: 'FORM_SET_UPDATED_FIELDS' })),
    setRadioContainerOptions: jest.fn(() => ({ type: 'FORM_SET_RADIO_OPTIONS' })),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setMultipleAutoCompleteData: jest.fn(() => ({ type: 'FORM_SET_MULTIPLE_AUTOCOMPLETE' })),
    setDropdownData: jest.fn(() => ({ type: 'FORM_SET_DROPDOWN_DATA' })),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((res) => res),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
  downloadCSV: jest.fn(),
  filterByParams: jest.fn(() => []),
  filterTableWithDropDown: jest.fn(() => []),
}));

jest.mock('utils/platformHelper', () => ({
  isAndroid: jest.fn(() => false),
}));

jest.mock('utils/navigationHelper', () => ({
  arePopupsAllowed: jest.fn(() => true),
  handleWebViewUrl: jest.fn(),
}));

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
  MoengageMixpanelModules: {
    Manage_Hierarchy: {
      Manage_Hierarchy_ViewAll_PageVisit: { moduleName: 'VAPV', attributes: { Status: 'S' } },
      Manage_Hierarchy_ViewAll_ExportToExcel: { moduleName: 'VAETE', attributes: { Status: 'S' } },
      Manage_Hierarchy_ReportPartner_PageVisit: { moduleName: 'RPPV', attributes: { Status: 'S' } },
      Manage_Hierarchy_ReportPartner_Download: { moduleName: 'RPD', attributes: { Status: 'S' } },
      CreateChannelPartner_Role: { moduleName: 'CPRol', attributes: { Status: 'S', role: 'R' } },
      CreateChannelPartner_ValidatePincode: { moduleName: 'CPVP', attributes: { Status: 'S', distCircle: 'DC', mdn: 'M', partnerEmail: 'PE', partnerMdn: 'PM', pincode: 'P' } },
      CreateChannelPartner_OutletType: { moduleName: 'CPOT', attributes: { Status: 'S', distCircle: 'DC', outletType: 'OT', townLocality: 'TL', pincode: 'P' } },
      CreateChannelPartner_OtpConfirmation: { moduleName: 'CPOC', attributes: { Status: 'S', mobile: 'MOB' } },
      CreateChannelPartner_SubmitOtp: { moduleName: 'CPSO', attributes: { Status: 'S', partnerMdn: 'PM', otp: 'OTP' } },
      CreateChannelPartner_SuccessPage: {
        moduleName: 'CPSP',
        attributes: { Status: 'S', outletId: 'OID', parentMdn: 'PMDN', partnerMobileNumber: 'PMN', partnerName: 'PNAME', partnerRole: 'PROLE' },
      },
      Manage_Hierarchy_ReportPartner_Selection: { moduleName: 'RPS', attributes: { Status: 'S', roleId: 'RID' } },
      CreateChannelPartner_Town_Locality: { moduleName: 'CPTL', attributes: { Status: 'S', role: 'R', fosMdn: 'FM', location: 'L', pincode: 'P' } },
    },
  },
}));

jest.mock('const', () => ({
  PROPERTIES: {
    ROLES: { distributer: 'Distributor', ad: 'AD', dealer: 'Dealer', fos: 'FOS', employee: 'Employee' },
    MANAGE_HIERARCHY: {
      DIST_FILTER: [],
      AD_FILTER: [],
      TYPES_OF_REPORT_FOR_DEALER: [],
      TYPES_OF_REPORT_FOR_ALL: [],
    },
  },
  ROUTE: { WEB: { MANAGE_HIERARCHY_SUCCESS: 'manageHierSuccess' } },
  STATE_KEY: { FORM_STATE: 'FORM_STATE' },
  STRINGS: {
    SUCCESS: 'SUCCESS',
    YES: 'Y',
    NO: 'N',
    YES_LOWER: 'yes',
    FILE_DOWNLOADED_SUCCESSFULLY: 'downloaded',
    STORAGE_PERMISSION_DENIED: 'denied',
    ERROR_OCCURED_WHILE_FETCHING_DATA: 'error',
    SENT_TO_PARTNER_NUMBER: 'sent',
    SUBMIT: 'submit',
    DAS_SEGMENT: 'das',
    ERROR_OCCURED_WHILE_FETCHING_ISP: 'isp_error',
  },
  VALIDATIONS: { YES: 'yes' },
  ALERT: { SUCCESS: 'success', ERROR: 'error', CONFIRM: 'confirm' },
  MODAL: { OK: 'ok', CANCEL: 'cancel' },
  QUERY: {
    CreateChannelPartner: 'createChannelPartner',
    ValidateOutletTypeAndFetchAllLanguages: 'validateOutletTypeAndFetchAllLanguages',
    ValidateOTPWithMobile: 'validateOTPWithMobile',
    GetCCPartnerDetailsBasedOnRole: 'getCCPartnerDetailsBasedOnRole',
    GetCircleUserNameEmail: 'getCircleUserNameEmail',
    DistCodeAndName: 'distCodeAndName',
    SubmitRequestForOtp: 'submitRequestForOtp',
    ValidateTownCodeCCPartner: 'validateTownCodeCCPartner',
  },
  FORMS: { viewMyTeamDetails: 'viewMyTeamDetails' },
  CHILD_TYPE: { OTP_MODAL: 'otp_modal' },
}));

jest.mock('const/strings', () => ({
  PARTNER_ROLES: { fos: '02', dealer: '03', ad: '08' },
  ROLES: { dealer: 'Dealer' },
}));

jest.mock('styles', () => ({
  Sizing: { layout: { x100: 100 }, x1: 1, x200: 200 },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_t, p) => p }),
}));

const flushPromises = () => Promise.resolve();

describe('manageHierarchy actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(() => ({
      user: { info: { internalRole: 'default', roleId: 'fos', mdn: '123' } },
      common: { tableData: [{ k: 'v' }], tableColumns: [{ accessorKey: 'k', header: 'H' }] },
      manageHierarchy: {
        dateType: [{ startDate: '2023-01-01', endDate: '2023-01-31' }],
        reportType: 'rep',
        isFormModified: false,
        manageHierarchyDisDetails: [{ circleDesc: 'C', circleDescNT: 'CNT', distributorMdn: 'DM', cirleId: 'ID' }],
        distributerIdData: { distMdn: '123' },
        dealerDetailsCCPartner: { cityDetails: [{ billState: 'S' }] },
        townCodeCCPartnerDetials: { fosOutletTypes: [{ outletType: 'T', outletId: 'I' }], eligibleOutletFilter: [] },
        isIspValid: false,
      },
      form: { [STATE_KEY.FORM_STATE]: { formNavigationData: { params: { user: 'Dealer', locations: { latitude: 0, longitude: 0 } } } } },
      ui: { bottomModal: { isModalVisible: false } },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    }) as any;
  });

  test('evdViewAllChildHierarchy success', async () => {
    getState.mockReturnValue({ ...getState(), user: { info: { internalRole: PROPERTIES.ROLES.distributer } } });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: [{ id: 1 }], tableColumns: [] });
    const result = await actions.evdViewAllChildHierarchy({}, 'q')(dispatch, getState, undefined);
    expect(result.status).toBe(true);
  });

  test('evdViewAllChildHierarchy failure', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false });
    const result = await actions.evdViewAllChildHierarchy({}, 'q')(dispatch, getState, undefined);
    expect(result.status).toBe(false);
  });

  test('downloadDetails success', async () => {
    (isAndroid as jest.Mock).mockReturnValue(true);
    (downloadCSV as jest.Mock).mockResolvedValue({ status: true });
    await actions.downloadDetails({}, 'q')(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('searchTeamDetails', () => {
    (filterByParams as jest.Mock).mockReturnValue([{ id: 1 }]);
    actions.searchTeamDetails({ searchText: 'S' })(dispatch, getState, undefined);
    expect(commonActions.setTotalListCount).toHaveBeenCalledWith(1);
  });

  test('getReports success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, info: { reportURL: 'url' } });
    await actions.getReports({ typeOfReport: 'rep' }, 'q')(dispatch, getState, undefined);
    expect(handleWebViewUrl).toHaveBeenCalledWith('url', true);
  });

  test('getCircleUserNameEmail success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, info: [{ circleDesc: 'C' }] });
    await actions.getCircleUserNameEmail({ mdn: '1' }, 'q')(dispatch, getState, undefined);
    expect(sliceActions.setManageHierarchyDisDetails).toHaveBeenCalled();
  });

  test('getCCPartnerDetailsBasedOnRole non-fos', async () => {
    getState.mockReturnValue({ ...getState(), user: { info: { roleId: '01' } } });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.getCCPartnerDetailsBasedOnRole({ user: 'Dealer' }, 'q')(dispatch, getState, undefined);
    expect(formReducerActions.setMultipleAutoCompleteData).toHaveBeenCalled();
  });

  test('validateDealerDetailsCCPartner missing email', () => {
    const res = actions.validateDealerDetailsCCPartner({ partner: 'yes' }, 'q')(dispatch, getState, undefined);
    expect(res).toBeNull();
  });

  test('validateTownCodeCCPartner success', async () => {
    jest.useFakeTimers();
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { townCode: [{}] } });
    const p = actions.validateTownCodeCCPartner({}, 'q')(dispatch, getState, undefined);
    await flushPromises();
    jest.runAllTimers();
    await p;
    expect(sliceActions.setTownCodeCCPartnerDetials).toHaveBeenCalled();
    jest.useRealTimers();
  });

  test('submitRequestForOtp SUCCESS', async () => {
    jest.useFakeTimers();
    getState.mockReturnValue({ ...getState(), manageHierarchy: { ...getState().manageHierarchy, isIspValid: true } });
    (api.post as jest.Mock).mockResolvedValueOnce({ transStatus: STRINGS.SUCCESS });
    const p = actions.submitRequestForOtp({ mobile: '1', ispCode: '1' })(dispatch, getState, undefined);
    await flushPromises();
    jest.advanceTimersByTime(500);
    await p;
    expect(uiActions.showBottomModal).toHaveBeenCalled();
    jest.useRealTimers();
  });

  test('createChannelPartner success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.createChannelPartner({ outletType: { name: 'T' } }, 'q', null, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.MANAGE_HIERARCHY_SUCCESS);
  });

  test('validateISPCode success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ result: [{ partnerCode: 'C', name: 'N', state: 'S' }] });
    const res = await actions.validateISPCode({ ispCode: '1' }, 'q')(dispatch, getState, undefined);
    expect(res.status).toBe(true);
  });

  test('validateTownCodeCCPartnerForDistributor sequence', async () => {
    jest.useFakeTimers();
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { eligibleOutletFilter: [{}], townCode: [{}] } });
    actions.validateTownCodeCCPartnerForDistributor({ searchLocally: {} }, 'q')(dispatch, getState, undefined);
    await flushPromises();
    jest.runAllTimers();
    await flushPromises();
    expect(sliceActions.setTownCodeCCPartnerDetials).toHaveBeenCalled();
    jest.useRealTimers();
  });

  test('various small thunks', async () => {
    actions.setTypeOfReportOptions({ searchLocally: { roleId: PARTNER_ROLES.dealer } }, 'q')(dispatch, getState, undefined);
    actions.setNewTypeOfReportOptions({ reportType: 'R' }, 'q')(dispatch, getState, undefined);
    actions.storeRadioValue({ report: 'R' })(dispatch, getState, undefined);
    actions.storeDateValue({})(dispatch, getState, undefined);
    actions.storeDateValueUpdate({})(dispatch, getState, undefined);
    actions.captureLocationAction({ locations: { latitude: 0, longitude: 0 } })(dispatch, getState, undefined);
    await actions.validateUpdate()(dispatch, getState, undefined);
    actions.setDistributerID({ searchLocally: { distMdn: '1' } })(dispatch, getState, undefined);
    actions.openSettingsInDevice({ openSettings: () => Promise.resolve() })(dispatch, getState, undefined);
    actions.townDetailsFilter({}, 'q')(dispatch, getState, undefined);
    expect(sliceActions.setReportType).toHaveBeenCalled();
  });

  test('searchForPartnerRoles success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, info: [] });
    await actions.searchForPartnerRoles({ role: 'Dealer' }, 'q')(dispatch, getState, undefined);
    expect(formReducerActions.setDropdownData).toHaveBeenCalled();
  });

  test('viewDistributorListForASM success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ result: { distCodeAndName: [] } });
    await actions.viewDistributorListForASM({}, 'q', null, null)(dispatch, getState, undefined);
    expect(sliceActions.setDistributerListData).toHaveBeenCalled();
  });

  test('validateOTPWithMobile success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.validateOTPWithMobile({ mdn: '1', otp: '1' }, 'q', null, navigate)(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalled();
  });

  test('validateOutletTypeAndFetchAllLanguages success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: {} });
    await actions.validateOutletTypeAndFetchAllLanguages({}, 'q')(dispatch, getState, undefined);
    expect(sliceActions.setOutletResponseAndLanguages).toHaveBeenCalled();
  });
});
