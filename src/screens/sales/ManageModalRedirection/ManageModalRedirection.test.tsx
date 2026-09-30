import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTE, PROPERTIES, QUERY } from 'const';
import uiActions from 'store/sales/actions/ui';
import actions from 'store/sales/actions';
import demoBoxDetailsAction from 'store/sales/actions/demoBoxDetails';
import dealerStockAction from 'store/sales/actions/dealerStock';
import * as modalUtils from 'utils/modalWithTransition';
import ManageModalRedirection from './ManageModalRedirection';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  memo: (c: any) => c,
}));

// Mock Hooks
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

let mockRouteName = ROUTE.WEB.DEMO_BOX_DETAIL;
jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: mockRouteName,
}));

// Mock Actions
jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_BOTTOM_MODAL' })),
  setLoader: jest.fn(() => ({ type: 'SET_LOADER' })),
}));

jest.mock('store/sales/actions', () => ({
  customerInvoiceModal: jest.fn(() => ({ type: 'CUSTOMER_INVOICE_MODAL' })),
  primaryTvRegistrationModal: jest.fn(() => ({ type: 'PRIMARY_TV_REGISTRATION_MODAL' })),
  customerOfferModal: jest.fn(() => ({ type: 'CUSTOMER_OFFER_MODAL' })),
  woRecreationOfferModal: jest.fn(() => ({ type: 'WO_RECREATION_OFFER_MODAL' })),
  dealerStockModal: jest.fn(() => ({ type: 'DEALER_STOCK_MODAL' })),
  etskRepushModal: jest.fn(() => ({ type: 'ETSK_REPUSH_MODAL' })),
  modifyPackModal: jest.fn(() => ({ type: 'MODIFY_PACK_MODAL' })),
  activationStatusModal: jest.fn(() => ({ type: 'ACTIVATION_STATUS_MODAL' })),
  manageAppsModal: jest.fn(() => ({ type: 'MANAGE_APPS_MODAL' })),
  quotationModal: jest.fn(() => ({ type: 'QUOTATION_MODAL' })),
  demoAccountCreationModal: jest.fn(() => ({ type: 'DEMO_ACCOUNT_CREATION_MODAL' })),
  storeDashboardRMNModel: jest.fn(() => ({ type: 'STORE_DASHBOARD_RMN_MODEL' })),
  modelForRMN: jest.fn(() => ({ type: 'MODEL_FOR_RMN' })),
  modelForBoxTypeRMN: jest.fn(() => ({ type: 'MODEL_FOR_BOX_TYPE_RMN' })),
  modelForCompetitorDataCapture: jest.fn(() => ({ type: 'MODEL_FOR_COMPETITOR_DATA_CAPTURE' })),
  modelForTskVoucher: jest.fn(() => ({ type: 'MODEL_FOR_TSK_VOUCHER' })),
  tskCancellationModal: jest.fn(() => ({ type: 'TSK_CANCELLATION_MODAL' })),
}));

jest.mock('store/sales/actions/demoBoxDetails', () => ({
  demoBoxDetails: jest.fn(() => ({ type: 'DEMO_BOX_DETAILS_ACTION' })),
}));

jest.mock('store/sales/actions/dealerStock', () => ({
  getProductTypes: jest.fn(() => ({ type: 'GET_PRODUCT_TYPES' })),
}));

jest.mock('../DynamicSalesNext', () => 'DynamicSalesNext');

jest.mock('utils/modalWithTransition', () => ({
  showModalWithTransition: jest.fn(() => ({ type: 'SHOW_MODAL_WITH_TRANSITION' })),
}));

const mockUiActions = uiActions as any;
const mockActions = actions as any;
const mockDemoBoxDetailsAction = demoBoxDetailsAction as any;
const mockDealerStockAction = dealerStockAction as any;

describe('ManageModalRedirection Tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: {
          info: { internalRole: PROPERTIES.ROLES.fos, userId: 'testUser' },
          navigation: {
            dashboard: [
              { path: ROUTE.WEB.DEMO_BOX_DETAIL, isDisable: false },
              { path: 'disabledRoute', isDisable: true },
            ],
          },
        },
        ui: { bottomModal: { isModalVisible: false } },
      }),
    );
  });

  const renderComponent = (props = {}) => render(<ManageModalRedirection {...props} />);

  test('should hide bottom modal if it is visible on mount', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: {
          info: { internalRole: PROPERTIES.ROLES.fos, userId: 'testUser' },
          navigation: { dashboard: [] },
        },
        ui: { bottomModal: { isModalVisible: true } },
      }),
    );
    renderComponent();
    expect(mockDispatch).toHaveBeenCalledWith(mockUiActions.hideBottomModal());
  });

  test('should handle ROUTE.WEB.DEMO_BOX_DETAIL for dealer', () => {
    mockRouteName = ROUTE.WEB.DEMO_BOX_DETAIL;
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: {
          info: { internalRole: PROPERTIES.ROLES.dealer, userId: 'dealerId' },
          navigation: { dashboard: [] },
        },
        ui: { bottomModal: { isModalVisible: false } },
      }),
    );
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockDemoBoxDetailsAction.demoBoxDetails).toHaveBeenCalledWith({ evdCode: 'dealerId' }, QUERY.DemoBoxDetails);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.DEMO_BOX_DETAILS);
  });

  test('should handle ROUTE.WEB.CUSTOMER_INVOICE', () => {
    mockRouteName = ROUTE.WEB.CUSTOMER_INVOICE;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.customerInvoiceModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.PRIMARY_TV_REGISTRATION', () => {
    mockRouteName = ROUTE.WEB.PRIMARY_TV_REGISTRATION;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.primaryTvRegistrationModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.CUSTOMER_OFFERS', () => {
    mockRouteName = ROUTE.WEB.CUSTOMER_OFFERS;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.customerOfferModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.WORK_ORDER_RECREATION', () => {
    mockRouteName = ROUTE.WEB.WORK_ORDER_RECREATION;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.woRecreationOfferModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.DEALER_STOCK for dealer', () => {
    mockRouteName = ROUTE.WEB.DEALER_STOCK;
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: {
          info: { internalRole: PROPERTIES.ROLES.dealer, userId: 'dealerId' },
          navigation: { dashboard: [] },
        },
        ui: { bottomModal: { isModalVisible: false } },
      }),
    );
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockDispatch).toHaveBeenCalledWith(mockUiActions.setLoader());
    expect(mockDealerStockAction.getProductTypes).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.DEALER_STOCK_LIST);
  });

  test('should handle ROUTE.WEB.DEALER_STOCK for non-dealer', () => {
    mockRouteName = ROUTE.WEB.DEALER_STOCK;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.dealerStockModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.ETSK_REPUSH', () => {
    mockRouteName = ROUTE.WEB.ETSK_REPUSH;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.etskRepushModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.MODIFY_PACK', () => {
    mockRouteName = ROUTE.WEB.MODIFY_PACK;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.modifyPackModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.ACTIVATION_STATUS', () => {
    mockRouteName = ROUTE.WEB.ACTIVATION_STATUS;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.activationStatusModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.MANAGE_APPS', () => {
    mockRouteName = ROUTE.WEB.MANAGE_APPS;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.manageAppsModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.QUOTATION', () => {
    mockRouteName = ROUTE.WEB.QUOTATION;
    renderComponent();
    expect(mockActions.quotationModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.DEMO_ACCOUNT', () => {
    mockRouteName = ROUTE.WEB.DEMO_ACCOUNT;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.demoAccountCreationModal).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.STORE_DASHBOARD', () => {
    mockRouteName = ROUTE.WEB.STORE_DASHBOARD;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.storeDashboardRMNModel).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.BOX_UPGRADE', () => {
    mockRouteName = ROUTE.WEB.BOX_UPGRADE;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.modelForRMN).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.BOX_TYPE_CHANGE', () => {
    mockRouteName = ROUTE.WEB.BOX_TYPE_CHANGE;
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockActions.modelForBoxTypeRMN).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.COMPETITOR_DATA_CAPTURE', () => {
    mockRouteName = ROUTE.WEB.COMPETITOR_DATA_CAPTURE;
    renderComponent();
    expect(mockActions.modelForCompetitorDataCapture).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.TSK_VOUCHER', () => {
    mockRouteName = ROUTE.WEB.TSK_VOUCHER;
    renderComponent();
    expect(mockActions.modelForTskVoucher).toHaveBeenCalled();
  });

  test('should handle ROUTE.WEB.TSK_CANCELLATION', () => {
    mockRouteName = ROUTE.WEB.TSK_CANCELLATION;
    renderComponent();
    expect(mockActions.tskCancellationModal).toHaveBeenCalled();
  });

  test('should show modal for disabled menu cards in default case', () => {
    mockRouteName = 'disabledRoute';
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(modalUtils.showModalWithTransition).toHaveBeenCalled();
  });

  test('should do nothing in default case if menu card is not disabled', () => {
    mockRouteName = 'enabledRoute';
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: {
          info: { internalRole: PROPERTIES.ROLES.fos, userId: 'testUser' },
          navigation: {
            dashboard: [{ path: 'enabledRoute', isDisable: false }],
          },
        },
        ui: { bottomModal: { isModalVisible: false } },
      }),
    );
    renderComponent();
    act(() => {
      jest.runAllTimers();
    });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(modalUtils.showModalWithTransition).not.toHaveBeenCalled();
  });

  test('should render additional text if provided', () => {
    renderComponent({ text: 'Extra Text' });
    expect(screen.getByText('Extra Text')).toBeTruthy();
  });

  test('should clear timeouts on unmount', () => {
    const { unmount } = renderComponent();
    unmount();
  });
});
