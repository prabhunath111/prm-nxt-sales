/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { ROUTE, STATE_KEY } from 'const';

import actions from 'store/sales/actions';
import PackageOffersWrapper from './PackageOffersWrapper';

// Mocking dependencies
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('store/sales/actions', () => {
  const mockActions = {
    setWinBackPack: jest.fn((offer: any) => (dispatch: any) => dispatch({ type: 'SET_PACK', payload: offer })),
  };
  return {
    __esModule: true,
    default: mockActions,
    ...mockActions,
  };
});

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn((_params, query) => (_dispatch: any) => {
    // QUERY.GetOfferPackDetails is 'getOfferPackDetails'
    if (query === 'getOfferPackDetails') {
      return Promise.resolve({ status: true });
    }
    return Promise.resolve({ status: false });
  }),
  filterByParams: jest.fn((array: any[], criteria: any) =>
    array.filter((item: any) =>
      Object.keys(criteria).some((key) => {
        const value = criteria[key];
        return String(item[key] || '')
          .toLowerCase()
          .includes(String(value || '').toLowerCase());
      }),
    ),
  ),
}));

jest.mock('config/i18n', () => ({
  i18n: { t: (s: string) => s },
  default: { t: (s: string) => s },
  getDeviceLanguage: () => 'en',
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

const mockDispatch: any = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(mockDispatch, () => mockStoreState);
  }
  return action;
});

const mockWinBackPacks = {
  winbackOffers: {
    packs: [
      {
        id: '1',
        name: 'Pack 1',
        friendlyName: 'Pack 1 Friendly',
        nameNT: 'Pack 1 NT',
        packNameNT: 'Pack 1 NT',
        stdPriUnit: 100,
        uom: 'Monthly',
        boxType: 'Dhamaka',
        margin: '10',
        packPrice: '100',
      },
      { id: '2', name: 'Pack 2', friendlyName: 'Pack 2 Friendly', nameNT: 'Pack 2 NT', packNameNT: 'Pack 2 NT', stdPriUnit: 200, uom: 'Annual', boxType: 'HD' },
      {
        id: '3',
        name: 'Premium Pack',
        friendlyName: 'Premium Friendly',
        nameNT: 'Premium Pack NT',
        packNameNT: 'Premium Pack NT',
        stdPriUnit: 500,
        uom: 'Monthly',
        boxType: 'Android',
      },
    ],
  },
  accountInfo: {
    boxDetails: [{ boxType: 'Standard' }],
  },
};

const mockStoreState = {
  rechargeWinback: {
    winBackPacks: mockWinBackPacks,
  },
  form: {
    [STATE_KEY.FORM_STATE]: {
      radioContainerOptions: {},
    },
  },
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => selector(mockStoreState),
}));

const mockStore = configureStore({
  reducer: {
    rechargeWinback: (state = mockStoreState.rechargeWinback) => state,
    form: (state = mockStoreState.form) => state,
  },
});

describe('PackageOffersWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <PackageOffersWrapper {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('renders and filters by boxType (Standard filters out HD)', () => {
    renderComponent();
    expect(screen.getByTestId('packageOfferTest')).toBeTruthy();
    expect(screen.getByText('Pack 1 Friendly')).toBeTruthy();
    expect(screen.queryByText('Pack 2 Friendly')).toBeNull();
  });

  test('handles duration filter change', async () => {
    renderComponent();
    fireEvent.press(screen.getByTestId('radio-item-Annual'));
    expect(screen.getByText('errors.searchResultText')).toBeTruthy();
  });

  test('shows all packs when boxType is not Standard', () => {
    const nonStandardState = {
      ...mockStoreState,
      rechargeWinback: {
        winBackPacks: {
          ...mockWinBackPacks,
          accountInfo: { boxDetails: [{ boxType: 'HD' }] },
        },
      },
    };
    jest.spyOn(require('react-redux'), 'useSelector').mockImplementation((selector: any) => selector(nonStandardState));

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <PackageOffersWrapper />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Pack 2 Friendly')).toBeTruthy();
  });

  test('filters by search value', () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText('strings.searchPackage');
    fireEvent.changeText(searchInput, 'Premium');
    expect(screen.getByText('Premium Friendly')).toBeTruthy();
    expect(screen.queryByText('Pack 1 Friendly')).toBeNull();
  });

  test('handles offer selection and removal', async () => {
    const onItemSelect = jest.fn();
    const onRemove = jest.fn();
    renderComponent({ onItemSelect, onRemove });

    const addButtons = screen.getAllByText('strings.add');
    fireEvent.press(addButtons[0]);
    expect(onItemSelect).toHaveBeenCalled();
    expect(actions.setWinBackPack).toHaveBeenCalled();

    // Test remove
    fireEvent.press(screen.getByText('strings.remove'));
    expect(onRemove).toHaveBeenCalled();
  });

  test('handles view details', async () => {
    renderComponent();
    const imageTests = screen.getAllByTestId('image-test');
    // Index 0 is search, 1 is first offer info
    fireEvent.press(imageTests[1]);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_WIN_BACK_VIEW_DETAILS));
  });

  test('handles empty results', () => {
    const emptyState = {
      ...mockStoreState,
      rechargeWinback: {
        winBackPacks: { winbackOffers: { packs: [] } },
      },
    };
    jest.spyOn(require('react-redux'), 'useSelector').mockImplementation((selector: any) => selector(emptyState));

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <PackageOffersWrapper />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('errors.searchResultText')).toBeTruthy();
  });

  test('snapshot tests', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
