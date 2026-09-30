import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { QUERY, ROUTE } from 'const';
import * as navigationHelper from 'utils/navigationHelper';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import InvoiceTransactions from './InvoiceTransactions';

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('utils/navigationHelper', () => ({
  handleWebViewUrl: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    rechargeWinback: {
      Winback_DownloadInvoice: {
        moduleName: 'Winback_DownloadInvoice',
        attributes: {
          Status: 'Status',
          transactionId: 'transactionId',
        },
      },
    },
  },
}));

const mockDispatch: any = jest.fn((val) => {
  if (typeof val === 'function') {
    return val(mockDispatch, () => ({}));
  }
  return val;
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('const', () => ({
  ...jest.requireActual('const'),
  ROUTE: {
    WEB: {
      RECHARGE_WIN_BACK_OFFERS: true,
    },
  },
}));

const mockStore = configureStore({
  reducer: {
    dummy: (state = {}) => state,
  },
});

describe('Test for the component InvoiceTransactions', () => {
  const defaultData = {
    subscriberId: '3897065301',
    amount: '50',
    transactionId: 'TV2501061000190334',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <InvoiceTransactions data={defaultData} {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('render component InvoiceTransactions', () => {
    renderComponent();
    expect(screen.getByTestId('text-test')).toBeTruthy();
  });

  test('snapshot tests for InvoiceTransactions', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('toggles showMore state when View More/Less button is pressed', () => {
    renderComponent();

    // Initially shows View More
    const viewMoreBtn = screen.getByText('strings.viewMore');
    expect(viewMoreBtn).toBeTruthy();

    fireEvent.press(viewMoreBtn);

    // After click shows View Less
    expect(screen.getByText('strings.viewLess')).toBeTruthy();

    fireEvent.press(screen.getByText('strings.viewLess'));
    expect(screen.getByText('strings.viewMore')).toBeTruthy();
  });

  test('handles successful invoice download', async () => {
    const mockResponse = { status: true, invoiceUrl: 'http://example.com/invoice.pdf' };
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve(mockResponse));

    renderComponent();
    const downloadBtn = screen.getByText('strings.downloadInvoice');

    await act(async () => {
      fireEvent.press(downloadBtn);
    });

    expect(callAction).toHaveBeenCalledWith({ transactionID: defaultData.transactionId, isDownload: true }, QUERY.GetInvoiceTransactions);
    expect(navigationHelper.handleWebViewUrl).toHaveBeenCalledWith(mockResponse.invoiceUrl, true);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  test('handles failed invoice download', async () => {
    const mockResponse = { status: false };
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve(mockResponse));

    renderComponent();
    const downloadBtn = screen.getByText('strings.downloadInvoice');

    await act(async () => {
      fireEvent.press(downloadBtn);
    });

    expect(navigationHelper.handleWebViewUrl).not.toHaveBeenCalled();
    expect(MoengageMixpanel.trackEvent).not.toHaveBeenCalled();
  });

  test('does not track event if RECHARGE_WIN_BACK_OFFERS is false', async () => {
    const originalValue = ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS;
    (ROUTE as any).WEB.RECHARGE_WIN_BACK_OFFERS = false;

    const mockResponse = { status: true, invoiceUrl: 'http://example.com/invoice.pdf' };
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve(mockResponse));

    renderComponent();
    const downloadBtn = screen.getByText('strings.downloadInvoice');

    await act(async () => {
      fireEvent.press(downloadBtn);
    });

    expect(navigationHelper.handleWebViewUrl).toHaveBeenCalledWith(mockResponse.invoiceUrl, true);
    expect(MoengageMixpanel.trackEvent).not.toHaveBeenCalled();

    (ROUTE as any).WEB.RECHARGE_WIN_BACK_OFFERS = originalValue;
  });
});
