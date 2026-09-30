import { sliceActions } from 'store/sales/reducer/partnerApproval';
import uiActions from 'store/sales/actions/ui';
import { api } from 'services/apolloClient';
import formActions from 'store/sales/actions/form';
import { refactorResponse } from 'utils/responseHelper';
import { callAction, filterByParams } from 'utils/formBuilderHelper';
import commonActions from 'store/sales/actions/common';
import {
  getDropDownListAndRejectReasons,
  approvalConfirmation,
  rejectPartnerApproval,
  partnerapprovaltracklistDetails,
  filterSearchTrackPartnerRequest,
  partnerApprovalRejectAndApprove,
  searchForASIDetails,
  setInitialData,
  setSelectedPartner,
  setDropDownDataList,
} from './partnerApproval.action';

jest.mock('store/sales/reducer/partnerApproval', () => ({
  sliceActions: {
    setPartnerList: jest.fn(),
    setShowDynamicNoData: jest.fn(),
    setDropDownListAndRejectReasons: jest.fn(),
    setDropDownDataList: jest.fn(),
    setSelectedPartner: jest.fn(),
    setInitialData: jest.fn(),
    setPartnerApprovalSuccessData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    showErrorPage: jest.fn(),
    showBottomModal: jest.fn(),
    hideBottomModal: jest.fn(),
    setModalLoader: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setMultipleDropdownOptionsData: jest.fn(),
    setFieldsToShow: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((r) => r),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
  filterByParams: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setTableColumnData: jest.fn(),
    setTableFilteredData: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    PartnerApproval: {
      ActionPartnerRequest_PageVisit: {
        moduleName: 'm1',
        attributes: { Status: 's1', AsiCode: 'a1', DirectDis: 'd1', FetchAllData: 'f1', NoFosRequestunderDirectAsi: 'n1', Role: 'r1', UserId: 'u1' },
      },
      TrackPartnerRequest_PageVisit: { moduleName: 'm2', attributes: { Status: 's1', AsiCode: 'a1', DirectDis: 'd1', FetchAllData: 'f1', Role: 'r1', UserId: 'u1' } },
      PartnerApproval_Approve: { moduleName: 'm3', attributes: { Status: 's1', PartnerStatus: 'p1', Remarks: 'r1', UserId: 'u1' } },
      PartnerApproval_Reject_SubmitReason: { moduleName: 'm4', attributes: { Status: 's1', PartnerStatus: 'p1', Remarks: 'r1', UserId: 'u1' } },
    },
  },
}));

jest.mock(
  'store/sales/query',
  () =>
    new Proxy(
      {},
      {
        get: (_, property) => property,
      },
    ),
);

jest.mock('const', () => ({
  CHILD_TYPE: { LABEl: 'LABEl', DYNAMIC_FORM: 'DYNAMIC_FORM' },
  FORMS: { partnerApprovalRejectReasons: 'partnerApprovalRejectReasons', trackPartnerRequest: 'trackPartnerRequest' },
  HEADER_TITLE: { SELECT_REASON_FOR_REJECTION: 'SELECT_REASON_FOR_REJECTION' },
  MODAL: { YES_APPROVE: 'YES_APPROVE', CANCEL: 'CANCEL' },
  PROPERTIES: { ROLES: { asi: 'asi', asm: 'asm', csm: 'csm' } },
  QUERY: {
    PartnerApprovalRejectAndApprove: 'PartnerApprovalRejectAndApprove',
    PartnerapprovaltracklistDetails: 'PartnerapprovaltracklistDetails',
  },
  ROUTE: { WEB: { PARTNER_APPROVAL_SUCCESS: 'PARTNER_APPROVAL_SUCCESS' } },
  STRINGS: {
    DIS_DIRECTLY_MAPPED_TO_CSM: 'DIS_DIRECTLY_MAPPED_TO_CSM',
    YES: 'YES',
    NO: 'NO',
    CONFIRMATION: 'CONFIRMATION',
    ARE_YOU_SURE_WANT_TO_APPROVE_REQUEST: 'ARE_YOU_SURE_WANT_TO_APPROVE_REQUEST',
    ALL: 'ALL',
  },
}));

jest.mock('const/strings', () => ({
  PARTNER_ROLES: { ASM: 'ASM', ASI: 'ASI' },
}));

describe('partnerApproval actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    getState = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('getDropDownListAndRejectReasons success for ASI mapping', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      partnerApproval: { initialData: { result: { asiDetails: [{ fullName: 'DIS_DIRECTLY_MAPPED_TO_CSM', asiCode: 'a1' }] } } },
    });
    const mockData = { status: true, result: { DropdownList: [], partnerApprovalList: [] } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    const promise = getDropDownListAndRejectReasons({ name: 'DIS_DIRECTLY_MAPPED_TO_CSM' })(dispatch, getState, undefined);
    jest.advanceTimersByTime(110);
    await promise;

    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(sliceActions.setPartnerList).toHaveBeenCalledWith([]);
    expect(api.post).toHaveBeenCalled();
    expect(sliceActions.setDropDownListAndRejectReasons).toHaveBeenCalled();
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('getDropDownListAndRejectReasons success for other ASI', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      partnerApproval: { initialData: { result: { asiDetails: [{ fullName: 'Other', userId: 'u2', role: 'asi_role', asiCode: 'a1' }] } } },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: {} });

    await getDropDownListAndRejectReasons({ name: 'Other' })(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('getDropDownListAndRejectReasons catch error', async () => {
    getState.mockReturnValue({
      user: { info: {} },
      partnerApproval: { initialData: {} },
    });
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await getDropDownListAndRejectReasons({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('approvalConfirmation', () => {
    approvalConfirmation({})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('rejectPartnerApproval', () => {
    rejectPartnerApproval({})(dispatch, getState, undefined);
    expect(sliceActions.setSelectedPartner).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('partnerapprovaltracklistDetails for ASM/ASI roles', async () => {
    getState.mockReturnValue({
      user: { info: { roleId: 'ASM', internalRole: 'asm', userId: 'u1' } },
      partnerApproval: { initialData: {} },
    });
    const mockData = { result: { partnerApprovaltrackList: [{ registeredDateNT: '2023-01-02' }, { registeredDateNT: '2023-01-01' }], tableColumns: [] } };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    const promise = partnerapprovaltracklistDetails({}, 'query')(dispatch, getState, undefined);

    jest.advanceTimersByTime(210);
    await promise;

    expect(formActions.setFieldsToShow).toHaveBeenCalledWith(['search']);
    expect(commonActions.setTableColumnData).toHaveBeenCalled();
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('partnerapprovaltracklistDetails for CSM role with other ASI mapping', async () => {
    getState.mockReturnValue({
      user: { info: { internalRole: 'csm', userId: 'u1' } },
      partnerApproval: { initialData: { result: { asiDetails: [{ fullName: 'Other', userId: 'u2', role: 'r1' }] } } },
    });
    const mockData = { result: { partnerApprovaltrackList: [{ registeredDateNT: '2023-01-02' }, { registeredDateNT: '2023-01-01' }], DropdownList: [], asiDetails: true } };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await partnerapprovaltracklistDetails({ null: 'Other' }, 'query')(dispatch, getState, undefined);

    expect(sliceActions.setInitialData).toHaveBeenCalled();
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('partnerapprovaltracklistDetails for CSM role with ASI mapping', async () => {
    getState.mockReturnValue({
      user: { info: { internalRole: 'csm', userId: 'u1' } },
      partnerApproval: { initialData: { result: { asiDetails: [{ fullName: 'DIS_DIRECTLY_MAPPED_TO_CSM', userId: 'u2' }] } } },
    });
    const mockData = { result: { partnerApprovaltrackList: [{ registeredDateNT: '2023-01-02' }, { registeredDateNT: '2023-01-01' }], DropdownList: [], asiDetails: true } };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await partnerapprovaltracklistDetails({ null: 'DIS_DIRECTLY_MAPPED_TO_CSM' }, 'query')(dispatch, getState, undefined);

    expect(sliceActions.setInitialData).toHaveBeenCalled();
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('partnerapprovaltracklistDetails ASM catch error', async () => {
    getState.mockReturnValue({
      user: { info: { roleId: 'ASM', internalRole: 'asm' } },
      partnerApproval: { initialData: {} },
    });
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await partnerapprovaltracklistDetails({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('partnerapprovaltracklistDetails CSM failure', async () => {
    getState.mockReturnValue({
      user: { info: { internalRole: 'csm' } },
      partnerApproval: { initialData: {} },
    });
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    await partnerapprovaltracklistDetails({}, 'query')(dispatch, getState, undefined);
    expect(sliceActions.setShowDynamicNoData).toHaveBeenCalledWith(true);
  });

  test('partnerapprovaltracklistDetails other role', async () => {
    getState.mockReturnValue({
      user: { info: { internalRole: 'other' } },
      partnerApproval: { initialData: {} },
    });
    const result = await partnerapprovaltracklistDetails({}, 'query')(dispatch, getState, undefined);
    expect(result.status).toBe(false);
  });

  test('filterSearchTrackPartnerRequest', () => {
    getState.mockReturnValue({ common: { tableData: [{ statusNT: 'S1', registeredDateNT: '2023-01-01' }] } });
    (filterByParams as jest.Mock).mockImplementation((data) => data);

    jest.spyOn(Date, 'now').mockReturnValue(new Date('2023-01-05').getTime());

    filterSearchTrackPartnerRequest({ status: { id: 'S1' }, createdDateDropdown: { id: '3days' } }, 'query')(dispatch, getState, undefined);

    expect(commonActions.setTableFilteredData).toHaveBeenCalled();
  });

  test('filterSearchTrackPartnerRequest invalid date', () => {
    getState.mockReturnValue({ common: { tableData: [{ registeredDateNT: 'invalid' }] } });
    (filterByParams as jest.Mock).mockImplementation((data) => data);
    filterSearchTrackPartnerRequest({ createdDateDropdown: { id: '3days' } }, 'query')(dispatch, getState, undefined);
    expect(commonActions.setTableFilteredData).toHaveBeenCalledWith({ result: [] });
  });

  test('partnerApprovalRejectAndApprove approve success', async () => {
    getState.mockReturnValue({ partnerApproval: { selectedPartner: { userId: 'u1' } } });
    const mockData = { status: true };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);
    const navigate = jest.fn();

    await partnerApprovalRejectAndApprove({}, 'query', {}, navigate)(dispatch, getState, undefined);

    expect(sliceActions.setPartnerApprovalSuccessData).toHaveBeenCalled();
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('PARTNER_APPROVAL_SUCCESS');
  });

  test('partnerApprovalRejectAndApprove reject success', async () => {
    getState.mockReturnValue({ partnerApproval: {} });
    const mockData = { status: true };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await partnerApprovalRejectAndApprove({ reasons: 'r1', userId: 'u1' }, 'query', {}, jest.fn())(dispatch, getState, undefined);

    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('partnerApprovalRejectAndApprove failure', async () => {
    getState.mockReturnValue({ partnerApproval: {} });
    const mockData = { status: false, message: 'fail' };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await partnerApprovalRejectAndApprove({}, 'query', {}, jest.fn())(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('partnerApprovalRejectAndApprove catch block', async () => {
    getState.mockReturnValue({ partnerApproval: {} });
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    await partnerApprovalRejectAndApprove({}, 'query', {}, jest.fn())(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('helper thunks', () => {
    searchForASIDetails({})(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalled();

    setInitialData({})(dispatch, getState, undefined);
    expect(sliceActions.setInitialData).toHaveBeenCalled();

    setSelectedPartner({})(dispatch, getState, undefined);
    expect(sliceActions.setSelectedPartner).toHaveBeenCalled();

    setDropDownDataList({})(dispatch, getState, undefined);
    expect(sliceActions.setDropDownDataList).toHaveBeenCalled();
  });
});
