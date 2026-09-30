/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ICONS } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import WoRecreationSuccess from './WoRecreationSuccess';

// Mock dependencies
const mockGoHome = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  goHome: mockGoHome,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'xl' }),
  BreakPoints: { XL: 'xl', LG: 'lg', MD: 'md', SM: 'sm', XS: 'xs' },
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('components/sales', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <TouchableOpacity onPress={onPress} testID="back-home">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    CommonSuccess: ({ iconName, value }: any) => (
      <View testID="common-success">
        <Text testID="icon-name">{iconName}</Text>
        <Text testID="wo-number">{value}</Text>
      </View>
    ),
    CustomerDetailsCard: () => <View testID="customer-card" />,
    Image: ({ iconName }: any) => <View testID={`image-${iconName}`} />,
    Text: ({ children, label }: any) => <Text>{label || children}</Text>,
  };
});

const createMockStore = (state: any) =>
  configureStore({
    reducer: {
      user: (s = state.user) => s,
      woRecreation: (s = state.woRecreation) => s,
    },
  });

describe('WoRecreationSuccess Component', () => {
  const initialState = {
    user: { isRedirection: false },
    woRecreation: {
      woSuccessData: {
        result: { message: 'Success Message', transId: 'T123' },
        woNumber: 'W123',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly and handles back to home', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    expect(screen.getByTestId('woRecreationSuccessTest')).toBeTruthy();
    fireEvent.press(screen.getByTestId('back-home'));
    expect(mockGoHome).toHaveBeenCalledWith(false);
  });

  test('sets correct icon for success with transId', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    await waitFor(() => expect(screen.getByTestId('icon-name').children[0]).toBe(ICONS.CONFIRM_SUCCESS));
  });

  test('sets correct icon for result without transId (warning)', async () => {
    const warningState = {
      ...initialState,
      woRecreation: {
        ...initialState.woRecreation,
        woSuccessData: { result: { message: 'Some Message' } },
      },
    };
    render(
      <Provider store={createMockStore(warningState)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    await waitFor(() => expect(screen.getByTestId('icon-name').children[0]).toBe(ICONS.WARNING_EXCLAMATION));
  });

  test('sets correct icon for null result (warning)', async () => {
    const nullState = {
      ...initialState,
      woRecreation: { woSuccessData: { result: null } },
    };
    render(
      <Provider store={createMockStore(nullState)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    await waitFor(() => expect(screen.getByTestId('icon-name').children[0]).toBe(ICONS.WARNING_EXCLAMATION));
  });

  test('sets correct icon for message only (success)', async () => {
    const msgState = {
      ...initialState,
      woRecreation: { woSuccessData: { message: 'Msg' } },
    };
    render(
      <Provider store={createMockStore(msgState)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    await waitFor(() => expect(screen.getByTestId('icon-name').children[0]).toBe(ICONS.CONFIRM_SUCCESS));
  });

  test('sets default icon for empty woSuccessData', async () => {
    const emptyState = { ...initialState, woRecreation: { woSuccessData: {} } };
    render(
      <Provider store={createMockStore(emptyState)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    await waitFor(() => expect(screen.getByTestId('icon-name').children[0]).toBe(ICONS.CONFIRM_SUCCESS));
  });

  test('displays top-level message if result message is missing', () => {
    const msgState = {
      ...initialState,
      woRecreation: { woSuccessData: { message: 'Top Level Message' } },
    };
    render(
      <Provider store={createMockStore(msgState)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    expect(screen.getByText('Top Level Message')).toBeTruthy();
  });

  test('displays nothing if both messages are missing', () => {
    const noneState = {
      ...initialState,
      woRecreation: { woSuccessData: {} },
    };
    render(
      <Provider store={createMockStore(noneState)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    // Should not crash and render empty text
    expect(screen.getByTestId('woRecreationSuccessTest')).toBeTruthy();
  });

  test('handles null woSuccessData gracefully', () => {
    const nullSData = {
      ...initialState,
      woRecreation: { woSuccessData: null },
    };
    render(
      <Provider store={createMockStore(nullSData)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    expect(screen.getByTestId('woRecreationSuccessTest')).toBeTruthy();
  });

  test('handles download invoice interaction', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <WoRecreationSuccess />
      </Provider>,
    );
    fireEvent.press(screen.getByText('strings.downloadInvoice'));
    expect(callAction).toHaveBeenCalled();
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });
});
