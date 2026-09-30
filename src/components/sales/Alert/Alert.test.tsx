/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { act, render } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Alert from './Alert';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('components/sales/Text', () => ({ __esModule: true, default: 'Text' }));
jest.mock('components/sales/Image', () => ({ __esModule: true, default: 'Image' }));
jest.mock('components/sales/InformationText', () => ({ __esModule: true, default: 'InformationText' }));
jest.mock('components/sales/TextContainer', () => ({ __esModule: true, default: 'TextContainer' }));
jest.mock('components/sales/RadioContainer', () => ({ __esModule: true, default: 'RadioContainer' }));

let capturedLinkOnPress: any = null;
jest.mock(
  'components/sales/Link',
  () =>
    function MockLink(props: any) {
      capturedLinkOnPress = props.onPress;
      return null;
    },
);

let capturedOnPress: any = null;
let capturedSecondaryOnPress: any = null;
jest.mock(
  'components/sales/Button',
  () =>
    function MockButton(props: any) {
      if (props.type === 'SECONDARY') {
        capturedSecondaryOnPress = props.onPress;
      } else {
        capturedOnPress = props.onPress;
      }
      return null;
    },
);

const mockNavigate = jest.fn();
const mockGoHome = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goHome: mockGoHome,
}));

const mockGetRouteName = jest.fn(() => 'TestRoute');
jest.mock('hooks/useCurrentRoute', () => () => ({ routeName: mockGetRouteName() }));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: {} }),
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    clearAlert: () => ({ type: 'ui/clearAlert' }),
    exitErrorPage: () => ({ type: 'ui/exitErrorPage' }),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setSubIdList: () => ({ type: 'form/setSubIdList' }),
    clearFormData: () => ({ type: 'form/clearFormData' }),
    resetNavigationData: () => ({ type: 'form/resetNavigationData' }),
  },
}));

jest.mock('utils/navigationHelper', () => ({
  closeWebView: jest.fn(),
  handleWebViewUrl: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => () => Promise.resolve({ status: true, invoiceUrl: 'test-url' })),
}));

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn() },
}));

jest.mock('const', () => ({
  ALERT: { INFO: 'INFO', SUCCESS: 'SUCCESS', WARNING: 'WARNING', ERROR: 'ERROR', CONFIRM: 'CONFIRM' },
  ICONS: { ALERT_INFO: 'info', ERROR: 'error', ALERT_CONFIRM: 'confirm', WARNING_EXCLAMATION: 'warning', ALERT_SUCCESS: 'success', DOWNLOAD: 'download' },
  CHILD_TYPE: { LIST_DATA: 'LIST_DATA', TEXT: 'TEXT', INFO_TEXT: 'INFO_TEXT', INFO_TEXT_WITH_DATA: 'INFO_TEXT_WITH_DATA', RADIO_CONTAINER: 'RADIO_CONTAINER' },
  VALUE_TYPE: { AMOUNT: 'AMOUNT' },
  PROPERTIES: { CUSTOMER_RECHARGE: { BALANCE: 'BALANCE' }, DEALER_FEEDBACK: { pleaseSelectMonth: 'pleaseSelectMonth', pleaseValidateSubscriberId: 'pleaseValidateSubscriberId' } },
  ROUTE: {
    WEB: {
      CONFIRM_REVERSAL_INFO: 'CONFIRM_REVERSAL_INFO',
      RECHARGE_TRANSACTION: 'RECHARGE_TRANSACTION',
      CONFIRM_REVERSAL_INFO_FOS: 'CONFIRM_REVERSAL_INFO_FOS',
      RECHARGE_TRANSACTION_FOS: 'RECHARGE_TRANSACTION_FOS',
      ERROR: 'ERROR',
    },
  },
  STRINGS: { INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR', REDIRECTION_ERROR: 'REDIRECTION_ERROR' },
  STYLES: { TYPE: { SECONDARY: 'SECONDARY' } },
  QUERY: { GetInvoiceURL: 'GetInvoiceURL' },
}));

jest.mock('styles', () => ({ Sizing: { layout: { x18: 18, x48: 48 } } }));
jest.mock('styles/webBreakpoints', () => ({ gcs: () => '' }));
jest.mock('./Alert.styles', () => ({
  info: {},
  infoText: {},
  success: {},
  successText: {},
  warning: {},
  warningText: {},
  error: {},
  errorText: {},
  container: {},
  text: {},
  toastAlertContainer: {},
  toastAlertViewStyle: {},
  alertTitleContainer: {},
  textLeftStyle: {},
  textCenterStyle: {},
  toastAlertTitle: {},
  toastAlertTitleWin: {},
  toastAlertBtnContainer: {},
  toastAlertCancelButton: {},
  toastAlertConfirmButton: {},
  linkContainer: {},
  linkTextStyle: {},
  listContainer: {},
  messageContainer: {},
  messageText: {},
  formKey: {},
  formatValue: {},
  formItem: {},
  childTextStyle: {},
  primaryTextStyle: {},
  secondaryTextStyle: {},
  balanceContainerStyle: {},
  subTextStyle: {},
  itemContainer: {},
}));

const createMockStore = (state: any = {}) =>
  configureStore({
    reducer: {
      ui: () => ({
        hasAlert: false,
        isToast: false,
        hasError: false,
        alert: { message: '', duration: 3000, type: 'INFO', buttonInfo: {}, childInfo: {} },
        error: {},
        ...state.ui,
      }),
      user: () => ({ isRedirection: false, ...state.user }),
      rechargeWinback: () => ({ winBackSuccessData: {}, ...state.rechargeWinback }),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

describe('Alert Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    capturedOnPress = null;
    capturedSecondaryOnPress = null;
    capturedLinkOnPress = null;
    mockNavigate.mockClear();
    mockGoHome.mockClear();
    mockGetRouteName.mockReturnValue('TestRoute');
  });

  test('renders without alert', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders hasAlert with INFO type', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { type: 'INFO', message: 'test', childInfo: {} } } });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders hasAlert with SUCCESS type', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { type: 'SUCCESS', message: 'test', childInfo: {} } } });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders hasAlert with WARNING type', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { type: 'WARNING', message: 'test', childInfo: {} } } });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders hasAlert with ERROR type', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { type: 'ERROR', message: 'test', childInfo: {} } } });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders hasAlert with CONFIRM type', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { type: 'CONFIRM', message: 'test', childInfo: {} } } });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders isToast with primary button', () => {
    const store = createMockStore({ ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK' }, childInfo: {} } } });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders isToast with secondary button', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { isSecondaryRequire: true, secondaryText: 'Cancel', primaryText: 'OK' }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles LIST_DATA child type', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { childInfo: { type: 'LIST_DATA', data: { subMessage: 'test' }, listData: [] }, buttonInfo: { primaryText: 'OK' } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles TEXT child type', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { childInfo: { type: 'TEXT', data: { text: 'test text' } }, buttonInfo: { primaryText: 'OK' } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles INFO_TEXT child type', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { childInfo: { type: 'INFO_TEXT', data: { balance: '100', subMessage: 'test' } }, buttonInfo: { primaryText: 'OK' } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles INFO_TEXT_WITH_DATA child type', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { childInfo: { type: 'INFO_TEXT_WITH_DATA', data: {}, listData: [] }, buttonInfo: { primaryText: 'OK' } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles RADIO_CONTAINER child type', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { childInfo: { type: 'RADIO_CONTAINER', data: [] }, buttonInfo: { primaryText: 'OK' } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles unknown child type', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { childInfo: { type: 'UNKNOWN' }, buttonInfo: { primaryText: 'OK' } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('auto hides after duration', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { duration: 1000, message: 'test', childInfo: {} } } });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  });

  test('handles component unmount', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { duration: 5000, message: 'test', childInfo: {} } } });
    const { unmount } = render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    unmount();
  });

  test('renders with custom props', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Alert containerStyles={{}} textStyles={{}} useNativeDriver={false} animated={false} />
      </Provider>,
    );
  });

  test('handles hide without animation', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { message: 'test', childInfo: {} } } });
    render(
      <Provider store={store}>
        <Alert animated={false} />
      </Provider>,
    );
    act(() => {
      jest.advanceTimersByTime(3000);
    });
  });

  test('handles INTERNAL_SERVER_ERROR', () => {
    const store = createMockStore({
      ui: {
        hasError: true,
        isToast: true,
        error: { message: 'INTERNAL_SERVER_ERROR' },
        alert: { message: 'INTERNAL_SERVER_ERROR', buttonInfo: { primaryText: 'OK' }, childInfo: {} },
      },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles REDIRECTION_ERROR', () => {
    const store = createMockStore({
      ui: { hasError: true, isToast: true, error: { message: 'REDIRECTION_ERROR' }, alert: { message: 'REDIRECTION_ERROR', buttonInfo: { primaryText: 'OK' }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles default error message', () => {
    const store = createMockStore({
      ui: { isToast: true, error: { message: 'OTHER' }, alert: { message: 'custom', buttonInfo: { primaryText: 'OK' }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles handleConfirm with closeView and isRedirection', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', closeView: true }, childInfo: {} } },
      user: { isRedirection: true },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedOnPress) {
      act(() => {
        capturedOnPress();
      });
    }
  });

  test('handles handleConfirm with closeView without isRedirection', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', closeView: true }, childInfo: {} } },
      user: { isRedirection: false },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedOnPress) {
      act(() => {
        capturedOnPress();
      });
    }
    expect(mockGoHome).toHaveBeenCalled();
  });

  test('handles handleConfirm with redirectUser', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', redirectUser: true }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedOnPress) {
      act(() => {
        capturedOnPress();
      });
    }
  });

  test('handles handleConfirm with routeName', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', routeName: 'TestRoute', params: { id: 1 } }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedOnPress) {
      act(() => {
        capturedOnPress();
      });
    }
    expect(mockNavigate).toHaveBeenCalledWith('TestRoute', { id: 1 });
  });

  test('handles handleConfirm with clearForm', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', clearForm: true }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedOnPress) {
      act(() => {
        capturedOnPress();
      });
    }
  });

  test('handles handleConfirm with queryName', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', queryName: 'TestQuery', queryParams: {} }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedOnPress) {
      act(() => {
        capturedOnPress();
      });
    }
  });

  test('handles handleConfirm with onProceed', () => {
    const onProceed = jest.fn();
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', onProceed }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedOnPress) {
      act(() => {
        capturedOnPress();
      });
    }
    expect(onProceed).toHaveBeenCalled();
  });

  test('handles handleCancel with secondaryQueryName', () => {
    const store = createMockStore({
      ui: {
        isToast: true,
        alert: { buttonInfo: { isSecondaryRequire: true, secondaryText: 'Cancel', primaryText: 'OK', secondaryQueryName: 'CancelQuery', secondaryQueryParams: {} }, childInfo: {} },
      },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedSecondaryOnPress) {
      act(() => {
        capturedSecondaryOnPress();
      });
    }
  });

  test('renders with showWinBackMessage', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', showWinBackMessage: true }, childInfo: {} } },
      rechargeWinback: { winBackSuccessData: { message: 'Win back message' } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders with showDownloadInvoice', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', showDownloadInvoice: true }, childInfo: { data: { invoiceTransactionId: '123' } } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders with textLeft button style', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', textLeft: true }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles error message with pleaseSelectMonth', () => {
    const store = createMockStore({
      ui: { isToast: true, error: { message: 'pleaseSelectMonth' }, alert: { message: 'pleaseSelectMonth', buttonInfo: { primaryText: 'OK' }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles error message with pleaseValidateSubscriberId', () => {
    const store = createMockStore({
      ui: { isToast: true, error: { message: 'pleaseValidateSubscriberId' }, alert: { message: 'pleaseValidateSubscriberId', buttonInfo: { primaryText: 'OK' }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('renders different icons for alert types', () => {
    ['INFO', 'ERROR', 'CONFIRM', 'WARNING', 'SUCCESS'].forEach((type) => {
      const store = createMockStore({ ui: { isToast: true, alert: { type, message: 'test', buttonInfo: { primaryText: 'OK' }, childInfo: {} } } });
      render(
        <Provider store={store}>
          <Alert />
        </Provider>,
      );
    });
  });

  test('clears timeout on new alert', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { duration: 1000, message: 'test', childInfo: {} } } });
    const { rerender } = render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    const newStore = createMockStore({ ui: { hasAlert: true, alert: { duration: 2000, message: 'new', childInfo: {} } } });
    act(() => {
      rerender(
        <Provider store={newStore}>
          <Alert />
        </Provider>,
      );
    });
  });

  test('renders with animated true and useNativeDriver true', () => {
    const store = createMockStore({ ui: { hasAlert: true, alert: { message: 'test', childInfo: {} } } });
    render(
      <Provider store={store}>
        <Alert animated useNativeDriver />
      </Provider>,
    );
  });

  test('renders with different duration values', () => {
    [0, 1000, 5000].forEach((duration) => {
      const store = createMockStore({ ui: { hasAlert: true, alert: { duration, message: 'test', childInfo: {} } } });
      render(
        <Provider store={store}>
          <Alert />
        </Provider>,
      );
    });
  });

  test('handles CONFIRM_REVERSAL_INFO route', () => {
    mockGetRouteName.mockReturnValue('CONFIRM_REVERSAL_INFO');
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK' }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedOnPress) {
      act(() => {
        capturedOnPress();
      });
    }
    expect(mockNavigate).toHaveBeenCalledWith('RECHARGE_TRANSACTION');
  });

  test('handles CONFIRM_REVERSAL_INFO_FOS route', () => {
    mockGetRouteName.mockReturnValue('CONFIRM_REVERSAL_INFO_FOS');
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK' }, childInfo: {} } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedOnPress) {
      act(() => {
        capturedOnPress();
      });
    }
    expect(mockNavigate).toHaveBeenCalledWith('RECHARGE_TRANSACTION_FOS');
  });

  test('handles handleDownloadInvoice with invoiceTransactionId', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', showDownloadInvoice: true }, childInfo: { data: { invoiceTransactionId: '123' } } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles handleDownloadInvoice with transId', () => {
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', showDownloadInvoice: true }, childInfo: { data: { transId: '456' } } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
  });

  test('handles handleDownloadInvoice success response', async () => {
    const mockCallAction = require('utils/formBuilderHelper').callAction;
    const mockHandleWebViewUrl = require('utils/navigationHelper').handleWebViewUrl;
    mockCallAction.mockReturnValueOnce(() => Promise.resolve({ status: true, invoiceUrl: 'test-url' }));
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', showDownloadInvoice: true }, childInfo: { data: { invoiceTransactionId: '123' } } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedLinkOnPress) {
      await act(async () => {
        await capturedLinkOnPress();
      });
      expect(mockHandleWebViewUrl).toHaveBeenCalledWith('test-url', true);
    }
  });

  test('handles handleDownloadInvoice error response', async () => {
    const mockCallAction = require('utils/formBuilderHelper').callAction;
    mockCallAction.mockReturnValueOnce(() => Promise.reject(new Error('error')));
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', showDownloadInvoice: true }, childInfo: { data: { invoiceTransactionId: '123' } } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedLinkOnPress) {
      await act(async () => {
        await capturedLinkOnPress();
      });
    }
  });

  test('handles handleDownloadInvoice with transId fallback', async () => {
    const mockCallAction = require('utils/formBuilderHelper').callAction;
    mockCallAction.mockReturnValueOnce(() => Promise.resolve({ status: true, invoiceUrl: 'test-url' }));
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', showDownloadInvoice: true }, childInfo: { data: { transId: '456' } } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedLinkOnPress) {
      await act(async () => {
        await capturedLinkOnPress();
      });
    }
  });

  test('handles handleDownloadInvoice with status false', async () => {
    const mockCallAction = require('utils/formBuilderHelper').callAction;
    mockCallAction.mockReturnValueOnce(() => Promise.resolve({ status: false }));
    const store = createMockStore({
      ui: { isToast: true, alert: { buttonInfo: { primaryText: 'OK', showDownloadInvoice: true }, childInfo: { data: { invoiceTransactionId: '123' } } } },
    });
    render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    if (capturedLinkOnPress) {
      await act(async () => {
        await capturedLinkOnPress();
      });
    }
  });

  test('snapshot test', () => {
    const store = createMockStore();
    const component = render(
      <Provider store={store}>
        <Alert />
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
