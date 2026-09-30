/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { ROUTE } from 'const';
import * as formBuilderHelper from 'utils/formBuilderHelper';
import { sliceActions as transactionHistoryActions } from 'store/sales/reducer/transactionHistory';
import { sliceActions as evdActions } from 'store/sales/reducer/evdBalanceInfo';
import uiActions from 'store/sales/actions/ui';
import * as useNavigateHook from 'hooks/useNavigate';
import * as useCurrentRouteHook from 'hooks/useCurrentRoute';
import CustomerDetails from './CustomerDetails';

// Mock react-redux
const mockDispatch = jest.fn((action) => action);
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));
jest.mock('i18next', () => ({ t: (k: string) => k }));

// Mock navigation
jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

// Mock Redux slices/actions structure safely
jest.mock('store/sales/reducer/transactionHistory', () => ({
  sliceActions: {
    setTransactionHistoryDetails: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/evdBalanceInfo', () => ({
  sliceActions: {
    setFilteredBalanceInfo: jest.fn(),
  },
}));

jest.mock('store/sales/actions/evdBalanceInfo/evdBalanceInfo.action', () => ({
  filterSearchEvdBalance: jest.fn(),
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: { showErrorPage: jest.fn() },
}));

// Mock inner application UI components
jest.mock('components/sales', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    TextContainer: ({ data, secondaryStyle }: any) => {
      // Trigger inner format/style computation
      if (typeof secondaryStyle === 'function' && data) {
        Object.keys(data).forEach((key) => secondaryStyle(key));
      }
      return (
        <View testID="TextContainer">
          <Text testID="data-prop">{JSON.stringify(data)}</Text>
        </View>
      );
    },
    Image: ({ iconName }: any) => <View testID={`Image-${iconName}`} />,
    Text: ({ label }: any) => <Text testID="Text-label">{label}</Text>,
    Button: ({ label, onPress }: any) => (
      <TouchableOpacity testID="Button" onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    DynamicTable: ({ data }: any) => (
      <View testID="DynamicTable">
        <Text testID="table-data">{JSON.stringify(data)}</Text>
      </View>
    ),
  };
});

describe('CustomerDetails Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 800, scale: 1, fontScale: 1 });
    (useNavigateHook.default as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useCurrentRouteHook.default as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.RECHARGE_TRANSACTION });

    const mockState = {
      evdBalanceInfo: { filteredBalanceInfo: null, isFilterApplied: false },
      common: { tableFilteredData: [], tableColumns: [] },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => callback(mockState));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const getDayStr = (offsetStr: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetStr);
    return d.toISOString().split('T')[0];
  };

  test('renders loading or empty state', () => {
    jest.spyOn(formBuilderHelper, 'callAction').mockReturnValue(Promise.resolve({}) as any);
    const { getByText } = render(<CustomerDetails queryName="test" />);
    expect(getByText('errors.noDataAvailable')).toBeTruthy();
  });

  test('fetches and renders transactions and handles reverse action', async () => {
    const mockData = {
      transactions: [{ txnDate: getDayStr(0), creditAmount: 100, subscriberID: 'sub1', transactionID: 'tx1', amount: '+100' }],
    };
    jest.spyOn(formBuilderHelper, 'callAction').mockReturnValue(Promise.resolve(mockData) as any);

    const { queryAllByTestId } = render(<CustomerDetails queryName="testQuery" />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(evdActions.setFilteredBalanceInfo(mockData.transactions));
    });

    const btn = queryAllByTestId('Button')[0];
    expect(btn).toBeTruthy();

    fireEvent.press(btn);
    expect(mockDispatch).toHaveBeenCalledWith(transactionHistoryActions.setTransactionHistoryDetails(expect.any(Object)));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CONFIRM_REVERSAL_INFO);
  });

  test('handles transaction older than 3 days error logic', async () => {
    const mockData = {
      transactions: [{ txnDate: getDayStr(-5), creditAmount: 100, subscriberID: 'sub2', transactionID: 'tx2', amount: '-50' }],
    };
    jest.spyOn(formBuilderHelper, 'callAction').mockReturnValue(Promise.resolve(mockData) as any);
    const { queryAllByTestId } = render(<CustomerDetails queryName="testQuery" />);

    await waitFor(() => {
      expect(queryAllByTestId('Button').length).toBeGreaterThan(0);
    });

    const btn = queryAllByTestId('Button')[0];
    fireEvent.press(btn);
    expect(mockDispatch).toHaveBeenCalledWith(uiActions.showErrorPage('strings.applicableText'));
  });

  test('renders view more/less properly', async () => {
    const mockData = {
      transactions: [{ txnDate: getDayStr(-1), amount: 0, creditAmount: 0 }],
    };
    jest.spyOn(formBuilderHelper, 'callAction').mockReturnValue(Promise.resolve(mockData) as any);
    (useCurrentRouteHook.default as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.OTF_CREDIT_DETAILS });

    const { getByText } = render(<CustomerDetails queryName="otf" button={false} />);

    await waitFor(() => {
      expect(getByText('strings.viewMore')).toBeTruthy();
    });

    fireEvent.press(getByText('strings.viewMore'));
    expect(getByText('strings.viewLess')).toBeTruthy();
    fireEvent.press(getByText('strings.viewLess'));
    expect(getByText('strings.viewMore')).toBeTruthy();
  });

  test('handles BALANCE_TRANSFER_DETAILS routing string formats and positive credits', async () => {
    (useCurrentRouteHook.default as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.BALANCE_TRANSFER_DETAILS });
    const mockData = {
      transactions: [{ txnDate: getDayStr(-1), amount: '+100', creditAmount: undefined }],
    };
    jest.spyOn(formBuilderHelper, 'callAction').mockReturnValue(Promise.resolve(mockData) as any);

    const { getByTestId, queryAllByTestId } = render(<CustomerDetails queryName="bTransfer" button={false} />);
    await waitFor(() => {
      expect(queryAllByTestId('TextContainer')[0]).toBeTruthy();
    });

    const textDataStr = getByTestId('data-prop').props.children;
    expect(textDataStr).toContain('CR : ₹+100');
  });

  test('handles negative amount logic in formatAmountForTransferDetails', async () => {
    (useCurrentRouteHook.default as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.BALANCE_TRANSFER_DETAILS });
    const mockData = {
      transactions: [{ txnDate: getDayStr(-1), amount: -50, debitAmount: 50 }],
    };
    jest.spyOn(formBuilderHelper, 'callAction').mockReturnValue(Promise.resolve(mockData) as any);

    const { queryAllByTestId } = render(<CustomerDetails queryName="bTransfer" button={false} />);
    await waitFor(() => {
      expect(queryAllByTestId('TextContainer')[0]).toBeTruthy();
    });
  });

  test('handles undefined filteredBalanceInfo (initial state without crashing)', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        evdBalanceInfo: { filteredBalanceInfo: undefined, isFilterApplied: false },
        common: { tableFilteredData: [], tableColumns: [] },
      }),
    );
    render(<CustomerDetails queryName="nullFilter" />);
  });

  test('handles valid filteredBalanceInfo and filter applied behavior', () => {
    const mockState = {
      evdBalanceInfo: {
        filteredBalanceInfo: { transactions: [{ transId: null }] },
        isFilterApplied: true,
      },
      common: { tableFilteredData: [], tableColumns: [] },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => callback(mockState));
    jest.spyOn(formBuilderHelper, 'callAction').mockReturnValue(Promise.resolve({}) as any);

    render(<CustomerDetails queryName="filtered" />);
  });

  test('renders DynamicTable on Web', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 1024, height: 768, scale: 1, fontScale: 1 });
    (useCurrentRouteHook.default as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.RECHARGE_TRANSACTION });

    const mockState = {
      evdBalanceInfo: { filteredBalanceInfo: null, isFilterApplied: false },
      common: { tableFilteredData: [{ amount: '+100' }, { amount: '-50' }, { amount: '0' }], tableColumns: [{ id: 'col1' }] },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => callback(mockState));

    const { getByTestId } = render(<CustomerDetails queryName="tableData" />);
    expect(getByTestId('DynamicTable')).toBeTruthy();
  });

  test('handles handleFinalSubmit for FOS route variant', async () => {
    (useCurrentRouteHook.default as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.RECHARGE_TRANSACTION_FOS });
    const mockData = {
      transactions: [{ txnDate: getDayStr(0), creditAmount: 100, subscriberID: 'sub1', transactionID: 'tx1' }],
    };
    jest.spyOn(formBuilderHelper, 'callAction').mockReturnValue(Promise.resolve(mockData) as any);

    const { queryAllByTestId } = render(<CustomerDetails queryName="testQuery" />);
    await waitFor(() => expect(queryAllByTestId('Button')[0]).toBeTruthy());

    fireEvent.press(queryAllByTestId('Button')[0]);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CONFIRM_REVERSAL_INFO_FOS);
  });

  test('handles invalid txnDate logic in isWithinLast3Days gracefully', async () => {
    const mockData = {
      transactions: [{ txnDate: 'invalid-date', creditAmount: 100 }],
    };
    jest.spyOn(formBuilderHelper, 'callAction').mockReturnValue(Promise.resolve(mockData) as any);
    const { queryAllByTestId } = render(<CustomerDetails queryName="testQuery" />);

    await waitFor(() => {
      expect(queryAllByTestId('Button').length).toBeGreaterThan(0);
    });

    const btn = queryAllByTestId('Button')[0];
    fireEvent.press(btn);
    // Invalid date defaults to showing applicable error because it isn't within 3 days
    expect(mockDispatch).toHaveBeenCalledWith(uiActions.showErrorPage('strings.applicableText'));
  });
});
