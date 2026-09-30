import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { ROUTE } from 'const';
import PartnerApprovalSuccess from './PartnerApprovalSuccess';

const mockNavigate = jest.fn();
const mockGoHome = jest.fn();

jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goHome: mockGoHome,
}));

jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: 'partnerApprovalSuccess',
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const createMockStore = (initialState: any) =>
  configureStore({
    reducer: {
      user: () => initialState.user,
      partnerApproval: () => initialState.partnerApproval,
      rechargeWinback: () => ({ winBackSuccessData: {} }),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('Test for the component PartnerApprovalSuccess', () => {
  const initialState = {
    user: { isRedirection: false },
    partnerApproval: {
      partnerApprovalSuccessData: {
        isRejected: false,
        result: { message: 'Success Message' },
      },
      selectedPartner: { partnerName: 'Test Partner' },
      partnerList: [{ id: 1 }, { id: 2 }],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render component PartnerApprovalSuccess with success state', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PartnerApprovalSuccess />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Success Message')).toBeTruthy();
    expect(screen.getByText('Test Partner')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy(); // partnerList.length - 1
  });

  test('render component PartnerApprovalSuccess with rejected state', () => {
    const rejectedState = {
      ...initialState,
      partnerApproval: {
        ...initialState.partnerApproval,
        partnerApprovalSuccessData: {
          isRejected: true,
          result: { message: 'Rejected Message' },
        },
      },
    };

    render(
      <Provider store={createMockStore(rejectedState)}>
        <NavigationContainer>
          <PartnerApprovalSuccess />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Rejected Message')).toBeTruthy();
  });

  test('handles navigation to action another partner request', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PartnerApprovalSuccess />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('strings.actionAnotherPartnerRequest'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.ACTION_PARTNER_REQUEST);
  });

  test('handles navigation to track partner request', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PartnerApprovalSuccess />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('strings.trackPartnerRequest'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.TRACK_PARTNER_REQUEST);
  });

  test('handles back to home button', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PartnerApprovalSuccess />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('strings.backToHome'));
    expect(mockGoHome).toHaveBeenCalledWith(false);
  });

  test('handles back to home button with redirection', () => {
    const redirectionState = {
      ...initialState,
      user: { isRedirection: true },
    };

    render(
      <Provider store={createMockStore(redirectionState)}>
        <NavigationContainer>
          <PartnerApprovalSuccess />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('strings.backToHome'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  test('handles selectedPartner from data property', () => {
    const dataState = {
      ...initialState,
      partnerApproval: {
        ...initialState.partnerApproval,
        selectedPartner: { data: { partnerName: 'Data Partner' } },
      },
    };

    render(
      <Provider store={createMockStore(dataState)}>
        <NavigationContainer>
          <PartnerApprovalSuccess />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Data Partner')).toBeTruthy();
  });

  test('handles empty partnerList', () => {
    const emptyListState = {
      ...initialState,
      partnerApproval: {
        ...initialState.partnerApproval,
        partnerList: [],
      },
    };

    render(
      <Provider store={createMockStore(emptyListState)}>
        <NavigationContainer>
          <PartnerApprovalSuccess />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('0')).toBeTruthy();
  });
});
