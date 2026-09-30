import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/tskVoucher';
import { api } from 'services/apolloClient';
import commonAction from 'store/sales/actions/common';
import { modelForTskVoucher, getTSKDetails } from './tskVoucher.action';

jest.mock('store/sales/reducer/tskVoucher', () => ({
  sliceActions: {
    tskVoucherDetails: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/quotation', () => ({
  sliceActions: {
    quotationEtskSetPincode: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setDropdownData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showBottomModal: jest.fn(),
    setModalLoader: jest.fn(),
    clearLoader: jest.fn(),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setErrorMessage: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(() => Promise.resolve({})),
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

jest.mock('const', () => ({
  PROPERTIES: { TSK_VOUCHER: { DATA: [] } },
  STATE_KEY: { MODAL_STATE: 'modal' },
  CHILD_TYPE: { REGISTRATION_SALES_NEXT_FORM: 'form' },
  HEADER_TITLE: { TSK_VOUCHER: 'header' },
  ICONS: { TSK_VOUCHER: 'icon' },
  FORMS: { tskVoucher: 'form' },
}));

jest.mock('i18next', () => ({
  t: (k: string) => k,
}));

describe('tskVoucher actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (api.post as jest.Mock).mockImplementation(() => Promise.resolve({}));
    getState = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('modelForTskVoucher', () => {
    modelForTskVoucher()(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('getTSKDetails missing VoucherType', () => {
    const res = getTSKDetails({})(dispatch, getState, undefined);
    expect(res).toBe(false);
    expect(commonAction.setErrorMessage).toHaveBeenCalled();
  });

  test('getTSKDetails success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: {} });
    await getTSKDetails({ VoucherType: { id: 'v1' }, TSKNo: 't1' })(dispatch, getState, undefined);
    expect(sliceActions.tskVoucherDetails).toHaveBeenCalled();
  });

  test('getTSKDetails failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getTSKDetails({ VoucherType: { id: 'v1' }, TSKNo: 't1' })(dispatch, getState, undefined);
    expect(commonAction.setErrorMessage).toHaveBeenCalled();
  });
});
