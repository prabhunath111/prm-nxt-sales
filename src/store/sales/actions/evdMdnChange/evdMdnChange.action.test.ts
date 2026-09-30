import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { STRINGS, ROUTE } from 'const';
import { sliceActions } from 'store/sales/reducer/evdMdnChange';
import {
  generateOTP,
  updateEvdMdn,
  mdnChangePartnerList,
  searchEvdMdnChangePartnerList,
  mdnChangeAppOrRejList,
  evdMdnfilter,
  partnerConfirmation,
  evdMdnChangeStatus,
  searchTrackEvdMdnChange,
  resetEvdMdnDistSuccessData,
  resetEvdMdnPartnerList,
  approveOTPforEVDChange,
} from './evdMdnChange.action';

jest.mock('store/sales/reducer/evdMdnChange', () => ({
  sliceActions: {
    evdMdnChangeSuccess: jest.fn(),
    setEvdMdnPartnerList: jest.fn(),
    resetEvdMdnPartnerList: jest.fn(),
    setEvdMdnPartnerFilteredList: jest.fn(),
    setEvdMdnDistSuccessData: jest.fn(),
    resetEvdMdnDistSuccessData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  clearLoader: jest.fn(),
  showBottomModal: jest.fn(),
  showAlert: jest.fn(),
  showErrorPage: jest.fn(),
  setLoader: jest.fn(),
  hideBottomModal: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setTableColumnData: jest.fn(),
  setErrorMessage: jest.fn(),
  setTableFilteredData: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setMultipleDropdownOptionsData: jest.fn(),
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('utils/formBuilderHelper', () => ({
  extractValues: jest.fn((params) => params),
  filterByParams: jest.fn(() => []),
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

describe('evdMdnChange actions', () => {
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({
    user: { info: { mdn: '123' } },
    evdMdnChange: { evdMdnPartnerList: [] },
    common: { customFormData: {}, tableData: [] },
    form: { evdMdnNavigationData: { data: { partnerName: 'p', partnerId: 'id', oldRmn: 'old', newRmn: 'new', mdnStatus: 's', requestId: 'r' } } },
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const flushPromises = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  };

  test('generateOTP success', async () => {
    const mockData = { transStatusNT: STRINGS.SUCCESS };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    generateOTP({}, 'query')(dispatch, getState, undefined);
    await flushPromises();

    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('generateOTP failure from data', async () => {
    const mockData = { transStatusNT: 'FAILED', message: 'ERROR' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    generateOTP({}, 'query')(dispatch, getState, undefined);
    await flushPromises();

    expect(uiActions.showAlert).toHaveBeenCalledWith('ERROR', expect.any(String), expect.any(Object), expect.any(Object));
  });

  test('generateOTP catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    generateOTP({}, 'query')(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('updateEvdMdn success without distributor', async () => {
    const mockData = { status: true, message: 'msg' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    const result = await updateEvdMdn({ type: 'OTHER' }, 'query')(dispatch, getState, undefined);
    expect(result.status).toBe(true);
    expect(uiActions.showAlert).not.toHaveBeenCalled();
  });

  test('updateEvdMdn success with distributor', async () => {
    const mockData = { status: true, message: 'msg' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await updateEvdMdn({ type: STRINGS.DISTRIBUTOR }, 'query')(dispatch, getState, undefined);

    expect(sliceActions.evdMdnChangeSuccess).toHaveBeenCalled();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('updateEvdMdn failure branch with distributor', async () => {
    const mockData = { status: false };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await updateEvdMdn({ type: STRINGS.DISTRIBUTOR }, 'query')(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
    expect(sliceActions.evdMdnChangeSuccess).not.toHaveBeenCalled();
  });

  test('updateEvdMdn catch error with distributor', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await updateEvdMdn({ type: STRINGS.DISTRIBUTOR }, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('updateEvdMdn catch error without distributor', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await updateEvdMdn({ type: 'OTHER' }, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).not.toHaveBeenCalled();
  });

  test('mdnChangePartnerList success', async () => {
    const mockData = { info: [{}] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await mdnChangePartnerList({})(dispatch, getState, undefined);
    expect(sliceActions.setEvdMdnPartnerList).toHaveBeenCalledWith(mockData);
  });

  test('mdnChangePartnerList empty', async () => {
    const mockData = { info: [] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await mdnChangePartnerList({})(dispatch, getState, undefined);
    expect(sliceActions.resetEvdMdnPartnerList).toHaveBeenCalled();
  });

  test('mdnChangePartnerList catch', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await mdnChangePartnerList({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('searchEvdMdnChangePartnerList', () => {
    searchEvdMdnChangePartnerList({ searchText: 't' })(dispatch, getState, undefined);
    expect(sliceActions.setEvdMdnPartnerFilteredList).toHaveBeenCalled();
  });

  test('mdnChangeAppOrRejList success', async () => {
    const mockData = { info: [{}] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await mdnChangeAppOrRejList({ daysFilter: '7' }, 'query')(dispatch, getState, undefined);
    expect(commonActions.setTableColumnData).toHaveBeenCalled();
  });

  test('mdnChangeAppOrRejList custom date range', async () => {
    (getState as jest.Mock).mockReturnValueOnce({
      common: { customFormData: { evdMdnChangeFilter: { customDateRange: 'custom' } } },
    });
    const mockData = { info: [] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await mdnChangeAppOrRejList({ daysFilter: STRINGS.CUSTOM_DATE_RANGE }, 'query')(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('mdnChangeAppOrRejList custom date range falsy', async () => {
    (getState as jest.Mock).mockReturnValueOnce({
      common: { customFormData: { evdMdnChangeFilter: { customDateRange: null } } },
    });
    const mockData = { info: [] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await mdnChangeAppOrRejList({ daysFilter: STRINGS.CUSTOM_DATE_RANGE }, 'query')(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ input: expect.objectContaining({ days: STRINGS.CUSTOM_DATE_RANGE }) }));
  });

  test('mdnChangeAppOrRejList error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await mdnChangeAppOrRejList({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('evdMdnfilter success', async () => {
    const mockData = {};
    (api.get as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await evdMdnfilter({}, 'query')(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
  });

  test('evdMdnfilter error', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await evdMdnfilter({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('partnerConfirmation approve', async () => {
    const mockData = { transStatus: STRINGS.SUCCESS };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await partnerConfirmation({ actionType: STRINGS.MDN_CHANGE_APPROVE, input: { newRmn: '1' } }, 'q')(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('partnerConfirmation approve failure', async () => {
    const mockData = { transStatus: 'FAIL' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await partnerConfirmation({ actionType: STRINGS.MDN_CHANGE_APPROVE, input: { newRmn: '1' } }, 'q')(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showBottomModal).not.toHaveBeenCalled();
  });

  test('partnerConfirmation reject', async () => {
    await partnerConfirmation({ actionType: STRINGS.MDN_CHNAGE_REJECT }, 'q')(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('partnerConfirmation other', async () => {
    await partnerConfirmation({ actionType: 'OTHER' }, 'q')(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).not.toHaveBeenCalled();
  });

  test('partnerConfirmation error', async () => {
    const originalPost = api.post;
    api.post = (() => {
      throw new Error('sync fail');
    }) as any;
    await partnerConfirmation({ actionType: STRINGS.MDN_CHANGE_APPROVE }, 'q')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
    api.post = originalPost;
  });

  test('evdMdnChangeStatus success', async () => {
    const mockData = {};
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    await evdMdnChangeStatus({})(dispatch, getState, undefined);
    expect(sliceActions.setEvdMdnDistSuccessData).toHaveBeenCalled();
  });

  test('evdMdnChangeStatus error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await evdMdnChangeStatus({})(dispatch, getState, undefined);
    // no specific action on error in the file, just logs
  });

  test('searchTrackEvdMdnChange', () => {
    searchTrackEvdMdnChange({})(dispatch, getState, undefined);
    expect(commonActions.setTableFilteredData).toHaveBeenCalled();
  });

  test('reset actions', () => {
    resetEvdMdnDistSuccessData()(dispatch, getState, undefined);
    expect(sliceActions.resetEvdMdnDistSuccessData).toHaveBeenCalled();
    resetEvdMdnPartnerList()(dispatch, getState, undefined);
    expect(sliceActions.resetEvdMdnPartnerList).toHaveBeenCalled();
  });

  test('approveOTPforEVDChange success', async () => {
    const mockData = {};
    const response = { status: true };
    (api.post as jest.Mock).mockResolvedValue(response);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    const result = await approveOTPforEVDChange({ actionType: STRINGS.MDN_CHANGE_APPROVE, input: {} })(dispatch, getState, undefined);
    expect(result.routeName).toBe(ROUTE.WEB.EVD_MDN_DISTRIBUTER_SUCCESS);
  });

  test('approveOTPforEVDChange success without response status', async () => {
    const mockData = {};
    const response = { status: false };
    (api.post as jest.Mock).mockResolvedValue(response);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    const result = await approveOTPforEVDChange({ actionType: STRINGS.MDN_CHANGE_APPROVE, input: {} })(dispatch, getState, undefined);
    expect(result.status).toBe(true);
    expect(result.routeName).toBeUndefined();
  });

  test('approveOTPforEVDChange other actionType', async () => {
    const result = await approveOTPforEVDChange({ actionType: 'OTHER' })(dispatch, getState, undefined);
    expect(result.status).toBe(true);
  });

  test('approveOTPforEVDChange error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await approveOTPforEVDChange({ actionType: STRINGS.MDN_CHANGE_APPROVE })(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });
});
