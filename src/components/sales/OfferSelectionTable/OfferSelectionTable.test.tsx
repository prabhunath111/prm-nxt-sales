/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { Linking } from 'react-native';
import { getPackagesURLsTrai } from 'store/sales/actions/etskRegistration/etskRegistration.action';
import { sliceActions } from 'store/sales/reducer/etskRegistration';
import { STATE_KEY } from 'const';
import OfferSelectionTable from './OfferSelectionTable';

// Mock the i18n config directly to prevent locale detection crashes
jest.mock('config/i18n', () => ({
  i18n: { t: (s: string) => s },
  default: { t: (s: string) => s },
  getDeviceLanguage: () => 'en',
}));

jest.mock('utils/platformHelper', () => ({
  isAndroid: jest.fn(() => true),
  isiOS: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  isWeb: false,
  platform: jest.fn(() => ({ OS: 'android' })),
}));

const mockDispatch: any = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(mockDispatch, () => mockStoreState);
  }
  return action;
});

const mockPackageName = [
  {
    OfferCategory: 'Category 1',
    PackageInfo: [
      { productLine: 'PL1', uom: 'MONTHLY', pricePt: '100', packName: 'Pack 1', packNameNT: 'Pack1NT' },
      { productLine: 'PL1', uom: 'YEARLY', pricePt: '1000', packName: 'Pack 2', packNameNT: 'Pack2NT' },
    ],
  },
  {
    OfferCategory: 'Category 2',
    PackageInfo: [{ productLine: 'PL2', uom: 'MONTHLY', pricePt: '200', packName: 'Pack 3', packNameNT: 'Pack3NT' }],
  },
];

const mockStoreState = {
  etskRegistration: {
    accountCreationSuccessData: {
      packageName: mockPackageName,
    },
  },
  form: {
    [STATE_KEY.FORM_STATE]: {
      dropdownOptions: {},
    },
  },
  common: {
    errorMessage: '',
  },
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => selector(mockStoreState),
}));

jest.mock('store/sales/actions/etskRegistration/etskRegistration.action', () => ({
  getPackagesURLsTrai: jest.fn(),
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'strings.MONTHLY') return 'MONTHLY';
      return key;
    },
  }),
}));

const mockStore = configureStore({
  reducer: {
    etskRegistration: (state = mockStoreState.etskRegistration) => state,
    form: (state = mockStoreState.form) => state,
    common: (state = mockStoreState.common) => state,
  },
});

describe('OfferSelectionTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (getPackagesURLsTrai as jest.Mock).mockReturnValue(() => Promise.resolve({ urls: 'http://example.com' }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <OfferSelectionTable placeholder1="Duration" placeholder2="Category" placeholder3="Offer" />
        </NavigationContainer>
      </Provider>,
    );

  test('renders and populates dropdowns based on Redux state', () => {
    renderComponent();
    expect(screen.getByTestId('OfferSelectionTable')).toBeTruthy();
    expect(screen.getByDisplayValue('Category 1')).toBeTruthy();
    expect(screen.getByDisplayValue('MONTHLY')).toBeTruthy();
    expect(screen.getByDisplayValue('Pack 1')).toBeTruthy();
  });

  test('handles category change', async () => {
    renderComponent();
    const categoryDropdown = screen.getByDisplayValue('Category 1');
    fireEvent.press(categoryDropdown);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('Category 2')).toBeTruthy();
    fireEvent.press(screen.getByText('Category 2'));
  });

  test('handles duration change', async () => {
    renderComponent();
    const durationDropdown = screen.getByDisplayValue('MONTHLY');
    fireEvent.press(durationDropdown);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('YEARLY')).toBeTruthy();
    fireEvent.press(screen.getByText('YEARLY'));
    expect(mockDispatch).toHaveBeenCalledWith(sliceActions.etskClearSelectedPacksToBuyData());
  });

  test('handles pack name change', async () => {
    renderComponent();
    const packDropdown = screen.getByDisplayValue('Pack 1');
    fireEvent.press(packDropdown);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('Pack 1')).toBeTruthy();
    fireEvent.press(screen.getByText('Pack 1'));
  });

  test('navigates to package details', async () => {
    renderComponent();
    const link = screen.getByText('strings.clickToKnowPackageDetails');
    fireEvent.press(link);
    await act(async () => {
      await Promise.resolve();
    });
    await waitFor(() => expect(Linking.openURL).toHaveBeenCalledWith('http://example.com'));
  });

  test('handles navigation error', async () => {
    (Linking.openURL as jest.Mock).mockRejectedValue(new Error('Link error'));
    renderComponent();
    const link = screen.getByText('strings.clickToKnowPackageDetails');
    fireEvent.press(link);
    await act(async () => {
      await Promise.resolve();
    });
  });

  test('snapshot tests', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
