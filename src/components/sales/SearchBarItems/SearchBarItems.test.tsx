/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useInflection, BreakPoints } from 'wrappers/inflection/InflectionProvider';
import useNavigate from 'hooks/useNavigate';
import { SEARCH_LIST, STATE_KEY, STRINGS, PROPERTIES, ROUTE, MODAL } from 'const';
import autoEvdActions from 'store/sales/actions/autoEvd';
import customerOfferActions from 'store/sales/actions/customerOffers';
import { callAction } from 'utils/formBuilderHelper';
import { handleWebViewUrl } from 'utils/navigationHelper';
import SearchBarItems from './SearchBarItems';

// Mocking dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(),
  BreakPoints: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
}));

jest.mock('hooks/useNavigate', () => jest.fn());

jest.mock('store/sales/actions/form', () => ({
  setFormValues: jest.fn(),
  setUpdatedFormFields: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setDealerDetails: jest.fn(),
}));

jest.mock('store/sales/actions/autoEvd', () => ({
  setAutoEvdNavigationData: jest.fn(),
  setAutoEvdCurrentValues: jest.fn(),
}));

jest.mock('store/sales/actions/customerOffers', () => ({
  handleRemoveOffer: jest.fn(),
  setCustomerOffersData: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('utils/navigationHelper', () => ({
  handleWebViewUrl: jest.fn(),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => 'mockedStyle'),
}));

jest.mock('components/sales/List', () => {
  const { View } = require('react-native');
  return (props: any) => (
    <View testID={props.testID || 'mock-list'} {...props}>
      {props.data && props.data.length > 0
        ? props.data.map((item: any, index: number) => (
            <View key={index} testID={`item-${index}`}>
              {props.renderItem({ item, index })}
            </View>
          ))
        : props.ListEmptyComponent}
    </View>
  );
});

jest.mock('components/sales/DealerEvdDetails', () => {
  const { View, Button } = require('react-native');
  return (props: any) => (
    <View testID="mock-dealer-evd-details">
      <Button testID="dealer-details-button" title="Details" onPress={() => props.onButtonPress(props.data)} />
    </View>
  );
});

jest.mock('components/sales/AddPackageOffer', () => {
  const { View, Button } = require('react-native');
  return (props: any) => (
    <View testID="mock-add-package-offer">
      <Button title="Add" onPress={() => props.onAddOffer(props.data)} />
      <Button title="Remove" onPress={() => props.onRemoveOffer()} />
      <Button title="ViewDetails" onPress={() => props.onViewDetails(props.data)} />
    </View>
  );
});

jest.mock('components/sales/InvoiceTransactions', () => {
  const { View } = require('react-native');
  return () => <View testID="mock-invoice-transactions" />;
});

jest.mock('components/sales/Text', () => {
  const { Text } = require('react-native');
  return (props: any) => <Text {...props}>{props.children || props.label}</Text>;
});

jest.mock('components/sales/Button', () => {
  const { View, Pressable, Text } = require('react-native');
  return (props: any) => (
    <View testID="mock-button">
      <Pressable onPress={props.onPress}>
        <Text>{props.label}</Text>
      </Pressable>
    </View>
  );
});

describe('SearchBarItems', () => {
  const mockDispatch = jest.fn((action) => (typeof action === 'function' ? action() : action));
  const mockNavigate = jest.fn();
  const mockOnItemSelect = jest.fn();
  const mockT = jest.fn((key) => {
    if (key === 'strings.autoEvdDealers') return SEARCH_LIST.AUTO_EVD_DEALERS;
    if (key === 'strings.customerOffers') return SEARCH_LIST.CUSTOMER_OFFERS;
    if (key === 'strings.invoiceTransaction') return SEARCH_LIST.INVOICE_TRANSACTION;
    return key;
  });
  const mockI18n = { language: 'en' };

  const defaultState = {
    form: {
      [STATE_KEY.FORM_STATE]: {
        searchBarItems: {
          testQuery: [{ name: 'Item 1' }],
          autoEvdDealers: [{ name: 'Dealer 1', userId: 'D1', thresholdSetNT: 'N', nameNT: 'Dealer N' }],
          invoiceTransaction: [{ transactionId: 'T1' }],
        },
      },
    },
    customerOffers: {
      offersData: { accountInfo: { isDhamakaEligible: false }, offers: [], actStatusNT: STRINGS.YES, balance: '0' },
      isOfferRemoved: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as unknown as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useTranslation as unknown as jest.Mock).mockReturnValue({ t: mockT, i18n: mockI18n });
    (useInflection as unknown as jest.Mock).mockReturnValue({ inflection: BreakPoints.LG });
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(defaultState));
  });

  test('should render properly with autoEvdDealers list type', () => {
    const { getAllByText } = render(<SearchBarItems listType={SEARCH_LIST.AUTO_EVD_DEALERS} queryName="autoEvdDealers" onItemSelect={mockOnItemSelect} selectedItem={{}} />);
    expect(getAllByText('strings.setAutoEvd')).toBeTruthy();
  });

  test('should handle handleButtonPress for autoEvdDealers (N and Y)', () => {
    const { getAllByText, rerender } = render(
      <SearchBarItems listType={SEARCH_LIST.AUTO_EVD_DEALERS} queryName="autoEvdDealers" onItemSelect={mockOnItemSelect} selectedItem={{}} />,
    );
    fireEvent.press(getAllByText('strings.setAutoEvd')[0]);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.SET_AUTO_EVD);
    expect(autoEvdActions.setAutoEvdNavigationData).toHaveBeenCalledWith(expect.objectContaining({ dealerName: 'Dealer N' }));

    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        ...defaultState,
        form: { [STATE_KEY.FORM_STATE]: { searchBarItems: { autoEvdDealers: [{ thresholdSetNT: MODAL.Y, userId: 'D1' }] } } },
      }),
    );
    rerender(<SearchBarItems listType={SEARCH_LIST.AUTO_EVD_DEALERS} queryName="autoEvdDealers" onItemSelect={mockOnItemSelect} selectedItem={{}} />);
    fireEvent.press(getAllByText('strings.updateAutoEvd')[0]);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.UPDATE_AUTO_EVD);
  });

  test('should handle handleAddOffer for various scenarios', () => {
    const testCases = [
      { item: { isRechargeReqNT: STRINGS.YES, isOtpReqNT: STRINGS.YES, stdPriUnit: '100' }, expected: [0, 1, 2, 4] },
      { item: { isRechargeReqNT: STRINGS.YES, isOtpReqNT: STRINGS.NO, stdPriUnit: '300' }, expected: [0, 1, 4] },
      { item: { isOtpReqNT: STRINGS.YES, stdPriUnit: '100' }, expected: [0, 2, 4] },
      { item: { stdPriUnit: '50' }, expected: [0, 3, 4] },
      { item: { isRechargeReqNT: STRINGS.YES, isOtpReqNT: STRINGS.NO, stdPriUnit: '100' }, expected: [0, 1, 4] },
      { query: PROPERTIES.CUSTOMER_OFFERS.MY_OFFERS_KEY, item: { isRechargeReqNT: STRINGS.YES, stdPriUnit: '100' }, expected: [0, 3, 4] },
    ];

    testCases.forEach((tc) => {
      mockOnItemSelect.mockClear();
      const { getAllByText } = render(
        <SearchBarItems listType={SEARCH_LIST.CUSTOMER_OFFERS} queryName={tc.query || 'testQuery'} onItemSelect={mockOnItemSelect} selectedItem={{}} itemsArr={[tc.item]} />,
      );
      fireEvent.press(getAllByText('Add')[0]);
      expect(mockOnItemSelect.mock.calls[0][1]).toEqual(tc.expected);
    });
  });

  test('should handle handleAddOffer for Winback and Dhamaka', () => {
    const winbackQuery = PROPERTIES.CUSTOMER_OFFERS.WINBACK_OFFERS_KEY;
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        ...defaultState,
        customerOffers: {
          offersData: {
            accountInfo: { isDhamakaEligible: true },
            offers: [{ offerCategoryNT: winbackQuery, balance: '-50', withoutRechargeFlagNT: STRINGS.YES, otpConfigForWithoutChangeNT: STRINGS.YES }],
          },
        },
      }),
    );

    const { getAllByText } = render(
      <SearchBarItems listType={SEARCH_LIST.CUSTOMER_OFFERS} queryName={winbackQuery} onItemSelect={mockOnItemSelect} selectedItem={{}} itemsArr={[{ stdPriUnit: '100' }]} />,
    );
    fireEvent.press(getAllByText('Add')[0]);
    expect(mockOnItemSelect.mock.calls[0][1]).toEqual([0, 1, 4]);
  });

  test('should handle handleViewDetails success and failure', async () => {
    (callAction as jest.Mock).mockReturnValue(Promise.resolve({ status: true }));
    const { getAllByText, rerender } = render(
      <SearchBarItems listType={SEARCH_LIST.CUSTOMER_OFFERS} queryName="testQuery" onItemSelect={mockOnItemSelect} selectedItem={{}} itemsArr={[{ nameNT: 'Pack 1' }]} />,
    );
    await act(async () => {
      fireEvent.press(getAllByText('ViewDetails')[0]);
    });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.MY_OFFERS_VIEW_DETAILS);

    (callAction as jest.Mock).mockReturnValue(Promise.resolve({ status: false }));
    rerender(<SearchBarItems listType={SEARCH_LIST.CUSTOMER_OFFERS} queryName="testQuery" onItemSelect={mockOnItemSelect} selectedItem={{}} itemsArr={[{ nameNT: 'Pack 2' }]} />);
    await act(async () => {
      fireEvent.press(getAllByText('ViewDetails')[0]);
    });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('should handle handleDownloadInvoice success and failure', async () => {
    (callAction as jest.Mock).mockReturnValue(Promise.resolve({ status: true, invoiceUrl: 'https://test.com' }));
    const { getAllByText, rerender } = render(
      <SearchBarItems listType={SEARCH_LIST.INVOICE_TRANSACTION} queryName="invoiceTransaction" onItemSelect={mockOnItemSelect} selectedItem={{}} />,
    );
    await act(async () => {
      fireEvent.press(getAllByText('strings.downloadInvoice')[0]);
    });
    expect(handleWebViewUrl).toHaveBeenCalledWith('https://test.com', true);

    (callAction as jest.Mock).mockReturnValue(Promise.resolve({ status: false }));
    rerender(<SearchBarItems listType={SEARCH_LIST.INVOICE_TRANSACTION} queryName="invoiceTransaction" onItemSelect={mockOnItemSelect} selectedItem={{}} />);
    await act(async () => {
      fireEvent.press(getAllByText('strings.downloadInvoice')[0]);
    });
    expect(handleWebViewUrl).toHaveBeenCalledTimes(1);
  });

  test('should handle effects for selectedItem and isOfferRemoved', () => {
    const { rerender } = render(<SearchBarItems listType={SEARCH_LIST.AUTO_EVD_DEALERS} queryName="autoEvdDealers" onItemSelect={mockOnItemSelect} selectedItem={{}} />);
    rerender(<SearchBarItems listType={SEARCH_LIST.AUTO_EVD_DEALERS} queryName="autoEvdDealers" onItemSelect={mockOnItemSelect} selectedItem={null as any} />);
    expect(mockOnItemSelect).toHaveBeenCalledWith(null, []);

    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        ...defaultState,
        customerOffers: { ...defaultState.customerOffers, isOfferRemoved: true },
      }),
    );
    rerender(<SearchBarItems listType={SEARCH_LIST.AUTO_EVD_DEALERS} queryName="autoEvdDealers" onItemSelect={mockOnItemSelect} selectedItem={{}} />);
    expect(customerOfferActions.handleRemoveOffer).toHaveBeenCalledWith(false);
  });

  test('should handle layout changes and mobile view', () => {
    (useInflection as unknown as jest.Mock).mockReturnValue({ inflection: BreakPoints.XS });
    const { getByTestId } = render(<SearchBarItems listType={SEARCH_LIST.AUTO_EVD_DEALERS} queryName="autoEvdDealers" onItemSelect={mockOnItemSelect} selectedItem={{}} />);
    expect(getByTestId('mock-dealer-evd-details')).toBeTruthy();

    const list = getByTestId('searchBarItemTest');
    act(() => {
      list.props.onLayout({ nativeEvent: { layout: { height: 100 } } });
      list.props.onContentSizeChange(100, 200);
    });
  });

  test('should handle handleViewDetails for BINGLE_FLEXI_LITE', async () => {
    const { getAllByText } = render(
      <SearchBarItems
        listType={SEARCH_LIST.CUSTOMER_OFFERS}
        queryName="testQuery"
        onItemSelect={mockOnItemSelect}
        selectedItem={{}}
        itemsArr={[{ heading: PROPERTIES.CUSTOMER_OFFERS.BINGLE_FLEXI_LITE }]}
      />,
    );
    await act(async () => {
      fireEvent.press(getAllByText('ViewDetails')[0]);
    });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.BINGE_VIEW_DETAILS);
  });

  test('should handle deactivated status for standard offers in handleAddOffer', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        ...defaultState,
        customerOffers: {
          offersData: { accountInfo: { isDhamakaEligible: false }, offers: [], actStatusNT: STRINGS.DEACTIVATED, balance: '-50' },
        },
      }),
    );

    const { getAllByText } = render(
      <SearchBarItems
        listType={SEARCH_LIST.CUSTOMER_OFFERS}
        queryName="testQuery"
        onItemSelect={mockOnItemSelect}
        selectedItem={{}}
        itemsArr={[{ isRechargeReqNT: STRINGS.YES, isOtpReqNT: STRINGS.NO, packPrice: '100' }]}
      />,
    );
    fireEvent.press(getAllByText('Add')[0]);
    expect(mockOnItemSelect.mock.calls[0][1]).toEqual([0, 1, 4]);
  });

  test('should handle remove offer manually from AddPackageOffer', () => {
    const { getAllByText } = render(
      <SearchBarItems listType={SEARCH_LIST.CUSTOMER_OFFERS} queryName="testQuery" onItemSelect={mockOnItemSelect} selectedItem={{}} itemsArr={[{ nameNT: 'Pack 1' }]} />,
    );
    fireEvent.press(getAllByText('Remove')[0]);
    expect(mockOnItemSelect).toHaveBeenCalledWith(null, []);
  });

  test('should return null for unknown listType', () => {
    const { queryByTestId } = render(
      <SearchBarItems listType="unknown" queryName="testQuery" onItemSelect={mockOnItemSelect} selectedItem={{}} itemsArr={[{ nameNT: 'Pack 1' }]} />,
    );
    expect(queryByTestId('mock-list')).toBeNull();
  });
});
