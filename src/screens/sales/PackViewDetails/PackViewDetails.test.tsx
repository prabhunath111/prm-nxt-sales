/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { ROUTE } from 'const';
import formAction from 'store/sales/actions/form';
import { BreakPoints } from 'wrappers/inflection/InflectionProvider';
import PackViewDetails from './PackViewDetails';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goBack: mockGoBack,
}));

let mockRouteName = ROUTE.WEB.PACK_VIEW_DETAILS;
jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: mockRouteName,
}));

let mockInflection = BreakPoints.XS;
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: mockInflection,
  }),
  BreakPoints: {
    XS: 'xs',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('store/sales/actions/form', () => ({
  setFormDependentDefault: jest.fn((data) => ({ type: 'SET_FORM_DEFAULT', payload: data })),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Accordion: ({ children, title, subDetails }: any) => (
      <View testID={`accordion-${title}`}>
        <Text>{title}</Text>
        <Text>{subDetails}</Text>
        {children}
      </View>
    ),
    Button: ({ onPress, label }: any) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    InformationText: ({ primaryText, secondaryText }: any) => (
      <View>
        <Text>{primaryText}</Text>
        <Text>{secondaryText}</Text>
      </View>
    ),
    Image: ({ iconName }: any) => <View testID={`image-${iconName}`} />,
    Text: ({ children, style, label }: any) => <Text style={style}>{label || children}</Text>,
  };
});

const createMockStore = (initialState: any) =>
  configureStore({
    reducer: {
      form: (state = initialState.form) => state,
      customerRecharge: (state = initialState.customerRecharge) => state,
      user: (state = initialState.user) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('PackViewDetails Component', () => {
  const getInitialState = (menuName: any = ROUTE.WEB.PACK_VIEW_DETAILS): any => ({
    form: {
      formState: {
        formNavigationData: {
          params: {
            packFriendlyName: 'Friendly Pack',
            packName: 'Full Pack Name',
            packPrice: '100',
            sdCount: '10',
            hdCount: '5',
            bouquetChannels: [
              {
                id: 'cat1',
                packName: 'Category 1',
                packItems: [
                  {
                    subChannels: [
                      { channelName: 'CH 1', hdOrSd: 'HD', imageURL: 'img1', epgNumber: '101' },
                      { channelName: 'CH 2', hdOrSd: 'SD', imageURL: 'img2', epgNumber: '102' },
                      { channelName: 'CH 3', hdOrSd: 'HD', imageURL: 'img3', epgNumber: '103' },
                      { channelName: 'CH 4', hdOrSd: 'SD', imageURL: 'img4', epgNumber: '104' },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    },
    customerRecharge: { navigationId: 'NAV123' },
    user: {
      isRedirection: false,
      navigation: {
        routes: [{ path: mockRouteName, menuName }],
      },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteName = ROUTE.WEB.PACK_VIEW_DETAILS;
    mockInflection = BreakPoints.XS;
  });

  const renderComponent = (state: any = getInitialState(), props: any = {}) =>
    render(
      <Provider store={createMockStore(state)}>
        <NavigationContainer>
          <PackViewDetails {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('renders correctly and handles View More/Less toggle', () => {
    renderComponent();
    expect(screen.getByText('Friendly Pack')).toBeTruthy();

    // Toggle View More
    fireEvent.press(screen.getByText('strings.viewMore'));
    expect(screen.getByText('CH 4')).toBeTruthy();

    // Toggle View Less
    fireEvent.press(screen.getByText('strings.viewLess'));
    expect(screen.queryByText('CH 4')).toBeNull();
  });

  test('covers full packName routes', () => {
    mockRouteName = ROUTE.WEB.ETSK_OFFERS_VIEW_DETAILS;
    renderComponent(getInitialState());
    expect(screen.getByText('Full Pack Name')).toBeTruthy();
  });

  test('handles back button and navigation mapping', () => {
    const stateWithRecharge = getInitialState(ROUTE.WEB.CUSTOMER_RECHARGE_VIEW_DETAILS);
    renderComponent(stateWithRecharge);
    fireEvent.press(screen.getByText('strings.back'));
    expect(formAction.setFormDependentDefault).toHaveBeenCalledWith('NAV123');
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('covers line 42 branch (customerRecharge null vs navigationId empty)', () => {
    // Case 1: customerRecharge exists but navigationId is missing/empty
    const stateEmpty = getInitialState(ROUTE.WEB.CUSTOMER_RECHARGE_VIEW_DETAILS);
    stateEmpty.customerRecharge = { navigationId: undefined };
    const { unmount: unmount1 } = renderComponent(stateEmpty);
    fireEvent.press(screen.getByText('strings.back'));
    expect(formAction.setFormDependentDefault).toHaveBeenCalledWith(undefined);
    unmount1();

    // Case 2: customerRecharge has empty navigationId
    const stateEmptyId = getInitialState(ROUTE.WEB.CUSTOMER_RECHARGE_VIEW_DETAILS);
    stateEmptyId.customerRecharge = { navigationId: '' };
    renderComponent(stateEmptyId);
    fireEvent.press(screen.getByText('strings.back'));
    expect(formAction.setFormDependentDefault).toHaveBeenCalledWith('');
  });

  test('inflection breakpoints coverage', () => {
    [BreakPoints.MD, BreakPoints.LG, BreakPoints.XL].forEach((bp) => {
      mockInflection = bp;
      const { unmount } = renderComponent();
      unmount();
    });
  });

  test('handles empty bouquetChannels gracefully', () => {
    const state = getInitialState();
    state.form.formState.formNavigationData.params.bouquetChannels = null;
    renderComponent(state);
    expect(screen.queryByText('Category 1')).toBeNull();
  });
});
