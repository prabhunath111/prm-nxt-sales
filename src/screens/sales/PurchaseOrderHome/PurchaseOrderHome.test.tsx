/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PARTNER_ROLES, QUERY, ROUTE } from 'const/strings';
import { callAction } from 'utils/formBuilderHelper';
import PurchaseOrderHome from './PurchaseOrderHome';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  memo: (c: any) => c,
}));

// Mock Hooks
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goBack: mockGoBack,
}));

// Mock Inflection
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'md' }),
}));

// Mock Translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Styles and Breakpoints
jest.mock('styles', () => ({
  Sizing: {
    layout: {
      x0: 0,
      x1: 1,
      x2: 2,
      x5: 5,
      x9: 9,
      x10: 10,
      x14: 14,
      x16: 16,
      x24: 24,
      x30: 30,
    },
    layoutP: {
      xp100: '100%',
      xp80: '80%',
      xp50: '50%',
      xp40: '40%',
      xp30: '30%',
    },
    flexSize: {
      x100: 1,
    },
  },
  Colors: {
    neutral: {
      white: '#FFFFFF',
    },
  },
  Typography: {
    fontName: {
      medium: { fontSize: 16 },
    },
  },
  Forms: {
    buttonContainer: {
      shadowContainer: {},
    },
  },
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((base) => base),
}));

// Mock Utils
jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

// Mock UI Components
jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <Pressable onPress={onPress} testID={`button-${label}`}>
        <Text>{label}</Text>
      </Pressable>
    ),
    GroupedActionTiles: ({ title, onPress, subTiles }: any) => (
      <View testID={`tiles-group-${title}`}>
        {onPress && (
          <Pressable onPress={onPress} testID={`main-tile-${title}`}>
            <Text>{title}</Text>
          </Pressable>
        )}
        {subTiles?.map((tile: any, index: number) => (
          <Pressable key={index} onPress={tile.onPress} testID={`sub-tile-${tile.label}`}>
            <Text>{tile.label}</Text>
          </Pressable>
        ))}
      </View>
    ),
    Text: ({ label, style }: any) => <Text style={style}>{label}</Text>,
  };
});

describe('PurchaseOrderHome Tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  const renderComponent = (roleId: string, isRedirection = false) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { info: { roleId }, isRedirection },
      }),
    );
    return render(<PurchaseOrderHome />);
  };

  test('should render dealer tiles and handle both submission types', () => {
    renderComponent(PARTNER_ROLES.dealer);

    // Case 1: SUBMIT_NAVIGATION (Raise Request -> EVD)
    const raiseGroup = screen.getByTestId('tiles-group-strings.raiseRequest');
    const evdRaise = within(raiseGroup).getByTestId('sub-tile-strings.evd');
    fireEvent.press(evdRaise);
    expect(callAction).toHaveBeenCalledWith({}, QUERY.DoPosmBalanceEnquiryWeb);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.EVD_RAISE_REQUEST);

    // Case 2: SUBMIT (Track Request -> EVD)
    const trackGroup = screen.getByTestId('tiles-group-strings.trackRequest');
    const evdTrack = within(trackGroup).getByTestId('sub-tile-strings.evd');
    fireEvent.press(evdTrack);
    expect(callAction).toHaveBeenCalledWith({}, QUERY.OpenEVDFormDealer, '', mockNavigate);
  });

  test('should render distributor tiles and handle all submission paths', () => {
    renderComponent(PARTNER_ROLES.dis);

    // Sub-tile press
    const trackGroup = screen.getByTestId('tiles-group-strings.trackRequest');
    fireEvent.press(within(trackGroup).getByTestId('sub-tile-strings.evd'));
    expect(callAction).toHaveBeenCalledWith({}, QUERY.OpenEVDForm, '', mockNavigate);

    // Main tile press (Wallet Options)
    fireEvent.press(screen.getByTestId('main-tile-strings.walletOptions'));
    expect(callAction).toHaveBeenCalledWith({}, QUERY.WalletOptions, '', mockNavigate);

    // Main tile press (Settlements)
    fireEvent.press(screen.getByTestId('main-tile-strings.settlements'));
    expect(callAction).toHaveBeenCalledWith({}, QUERY.NavigateSettlements, '', mockNavigate);
  });

  test('should render FOS tiles and ASM/ASI/CSM tiles with interactions', () => {
    // FOS
    let { unmount } = renderComponent(PARTNER_ROLES.fos);
    fireEvent.press(screen.getByTestId('main-tile-strings.actionRequest'));
    expect(callAction).toHaveBeenCalledWith({}, QUERY.GetPosmDealerId1, '', mockNavigate);

    const trackGroupFos = screen.getByTestId('tiles-group-strings.trackRequest');
    fireEvent.press(within(trackGroupFos).getByTestId('sub-tile-strings.materials'));
    expect(callAction).toHaveBeenCalledWith({}, QUERY.OpenMaterialsFormFos, '', mockNavigate);
    unmount();

    // ASM
    ({ unmount } = renderComponent(PARTNER_ROLES.ASM));
    const trackGroupAsm = screen.getByTestId('tiles-group-strings.trackRequest');
    fireEvent.press(within(trackGroupAsm).getByTestId('sub-tile-strings.evd'));
    expect(callAction).toHaveBeenCalledWith({}, QUERY.OpenEVDFormASM, '', mockNavigate);
    unmount();
  });

  test('should handle back button press', () => {
    renderComponent(PARTNER_ROLES.dealer, true);
    fireEvent.press(screen.getByTestId('button-strings.back'));
    expect(mockGoBack).toHaveBeenCalledWith(true);
  });
});
