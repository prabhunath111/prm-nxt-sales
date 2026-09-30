/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ICONS, ROUTE } from 'const';
import TsraApprovalSuccess from './TsraApprovalSuccess';

// Mock dependencies
const mockNavigate = jest.fn();
const mockGoHome = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
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

jest.mock('components/sales', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <TouchableOpacity onPress={onPress} testID="back-home">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    CommonSuccess: ({ iconName, primaryText }: any) => (
      <View testID="common-success">
        <Text testID="icon-name">{iconName}</Text>
        <Text testID="primary-text">{primaryText}</Text>
      </View>
    ),
    Image: ({ iconName }: any) => <View testID={`image-${iconName}`} />,
    Text: ({ children, label }: any) => <Text>{label || children}</Text>,
  };
});

const createMockStore = (state: any) =>
  configureStore({
    reducer: {
      user: (s = state.user) => s,
      tsraApproval: (s = state.tsraApproval) => s,
    },
  });

describe('TsraApprovalSuccess Component', () => {
  const initialState = {
    user: { isRedirection: false },
    tsraApproval: {
      tsraSuccessData: { message: 'Success Approved', isRejected: false },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly and handles home and navigation', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TsraApprovalSuccess />
      </Provider>,
    );
    expect(screen.getByTestId('tsraSuccess')).toBeTruthy();
    expect(screen.getByTestId('icon-name').children[0]).toBe(ICONS.CONFIRM_SUCCESS);

    fireEvent.press(screen.getByTestId('back-home'));
    expect(mockGoHome).toHaveBeenCalledWith(false);

    fireEvent.press(screen.getByText('strings.raiseNewActionTsraRequest'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.ACTION_TSRA_REQUEST);

    fireEvent.press(screen.getByText('strings.trackTsraRequest'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.TRACK_TSRA_REQUEST);
  });

  test('shows warning icon when rejected', () => {
    const rejectedState = {
      ...initialState,
      tsraApproval: { tsraSuccessData: { message: 'Rejected', isRejected: true } },
    };
    render(
      <Provider store={createMockStore(rejectedState)}>
        <TsraApprovalSuccess />
      </Provider>,
    );
    expect(screen.getByTestId('icon-name').children[0]).toBe(ICONS.WARNING_EXCLAMATION);
  });
});
