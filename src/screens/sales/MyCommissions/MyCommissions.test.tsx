import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyCommissions from './MyCommissions';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn(), language: 'en' },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useDispatch: () => mockDispatch,
  };
});

const makeMockStore = (overrides = {}) => {
  const state = {
    homePage: {
      commissionsData: [
        { month: 'January', commissions: '1000' },
        { month: 'February', commissions: '1500' },
      ],
      transactionData: {
        date: '2025-09-19',
        totalCommissions: '2500',
      },
    },
    evdBalanceInfo: {
      pageNumber: 1,
      paginationData: { totalPages: 1 },
    },
    ...overrides,
  };

  return {
    getState: () => state,
    subscribe: jest.fn(),
    dispatch: mockDispatch,
    replaceReducer: jest.fn(),
    [Symbol.observable]: jest.fn(),
  };
};

const renderComponent = (overrides = {}) =>
  render(
    <Provider store={makeMockStore(overrides) as any}>
      <NavigationContainer>
        <MyCommissions />
      </NavigationContainer>
    </Provider>,
  );

describe('MyCommissions Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component successfully', () => {
    renderComponent();
  });

  test('renders transaction date', () => {
    renderComponent();
    expect(screen.getByText('2025-09-19')).toBeTruthy();
  });

  test('renders total commission value', () => {
    renderComponent();
    expect(screen.getByText('2500')).toBeTruthy();
  });

  test('renders DynamicTable with commission data', () => {
    renderComponent();
    expect(screen.getByText('January')).toBeTruthy();
    expect(screen.getByText('1000')).toBeTruthy();
    expect(screen.getByText('February')).toBeTruthy();
    expect(screen.getByText('1500')).toBeTruthy();
  });

  test('matches snapshot', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
