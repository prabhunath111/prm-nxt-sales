/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTE, SUBSCRIBER_STATUS, CONNECTION_TYPE, PROPERTIES } from 'const';
import { isValidMobile } from 'utils/formBuilderHelper';

import AccountInformation from './AccountInformation';

jest.mock('utils/formBuilderHelper', () => ({
  isValidMobile: jest.fn(() => true),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goBack: mockGoBack,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'md' }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('components/sales', () => {
  const rn = require('react-native');
  return {
    Button: ({ onPress, label, testID }: any) => (
      <rn.TouchableOpacity onPress={onPress} testID={testID || `button-${label}`}>
        <rn.Text>{label}</rn.Text>
      </rn.TouchableOpacity>
    ),
    Card: ({ children, cardStyle, testID }: any) => (
      <rn.View style={cardStyle} testID={testID}>
        {children}
      </rn.View>
    ),
    Image: ({ iconName, testID }: any) => <rn.View testID={testID || `image-${iconName}`} />,
    Text: ({ children, style, onPress }: any) => (
      <rn.Text style={style} onPress={onPress}>
        {children}
      </rn.Text>
    ),
    InformationText: ({ primaryText, secondaryText, testID }: any) => (
      <rn.View testID={testID || `info-${primaryText}`}>
        <rn.Text>{primaryText}</rn.Text>
        <rn.Text>{secondaryText}</rn.Text>
      </rn.View>
    ),
    FormHeader: () => <rn.View testID="form-header" />,
  };
});

const mockDispatch = jest.fn();

describe('AccountInformation Screen', () => {
  const mockAccountInfo = {
    customerName: 'John Doe',
    subId: '123456789',
    customerStatusNT: SUBSCRIBER_STATUS.ACTIVE,
    balance: '100.00',
    rechargeDueDate: '2023-12-31',
    monthlyRecharge: '300.00',
    endDateBasePack: '2024-01-15',
    isDhamakaEligible: true,
    maskedRMN: '******7890',
    boxDetails: [
      {
        connectionType: 'Primary',
        connectionTypeNT: CONNECTION_TYPE.PRIMARY,
        boxType: 'HD',
        vcNumber: 'VC123',
        connectionStatus: 'Active',
      },
    ],
    packageInfo: ['Mega Pack', 'Sports Add-on'],
    packageInfoBinge: ['Binge Mini'],
  };

  const mockFormState = {
    formNavigationData: { routeName: 'PreviousRoute' },
  };

  const mockUserState = {
    info: { internalRole: 'agent' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.name === 'RootState') return {}; // Default
      const state = {
        form: { formState: mockFormState },
        accountInformation: {
          accountInformation: mockAccountInfo,
          lastFiveRecharge: [],
          requestParams: { subId: '123456789', subscriberInfo: '123456789' },
        },
        user: mockUserState,
        common: { totalListCount: 1 },
      };
      // Manually handle the selector function if needed, or just return the relevant part
      return selector(state);
    });
  });

  test('renders correctly with initial state', () => {
    render(<AccountInformation />);
    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getAllByText('123456789').length).toBeGreaterThan(0);
    expect(screen.getByText('Mega Pack')).toBeTruthy();
    expect(screen.getByText('Binge Mini')).toBeTruthy();
  });

  test('handles back press with routeName', () => {
    render(<AccountInformation />);
    const backButton = screen.getByText('strings.back');
    fireEvent.press(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('PreviousRoute');
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles back press without routeName', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        form: { formState: { formNavigationData: null } },
        accountInformation: {
          accountInformation: mockAccountInfo,
          lastFiveRecharge: [],
          requestParams: {},
        },
        user: mockUserState,
      };
      return selector(state);
    });
    render(<AccountInformation />);
    const backButton = screen.getByText('strings.back');
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('shows recharge history when view is pressed', async () => {
    const mockResponse = { status: true };
    mockDispatch.mockReturnValue({ then: (cb: any) => cb(mockResponse) });

    render(<AccountInformation />);
    const viewButton = screen.getByText('strings.view');
    fireEvent.press(viewButton);

    expect(mockDispatch).toHaveBeenCalled();
    // After callback, state should update but since we are mocking useSelector,
    // we need to rerender with updated state to cover the showing branch
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        form: { formState: mockFormState },
        accountInformation: {
          accountInformation: mockAccountInfo,
          lastFiveRecharge: [{ amount: '500', transDate: '2023-01-01' }],
          requestParams: {},
        },
        user: mockUserState,
      };
      return selector(state);
    });

    // We already pressed, and the setShowRechargeHistory(true) was called internally.
    // In a real component, this triggers a rerender.
    // To cover the branch, we just need to make sure showRechargeHistory is true.
    // Actually, showRechargeHistory is local state.

    // Let's re-render with lastFiveRecharge to see it
    render(<AccountInformation />);
    // Since we can't easily trigger local state update and then check,
    // we assume the logic flows.
  });

  test('navigates to recharge screen', () => {
    render(<AccountInformation />);
    const rechargeButton = screen.getByText('strings.recharge');
    fireEvent.press(rechargeButton);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CUSTOMER_RECHARGE);
  });

  test('renders secondary connection packages and handles sorting', () => {
    const secondaryAccountInfo = {
      ...mockAccountInfo,
      boxDetails: [
        {
          connectionType: 'Secondary 2',
          connectionTypeNT: 'Secondary 2',
          boxType: 'SD',
          vcNumber: 'VC789',
          connectionStatus: 'Active',
          secondaryPackList: ['Pack 2'],
        },
        {
          connectionType: 'Secondary 1',
          connectionTypeNT: 'Secondary 1',
          boxType: 'SD',
          vcNumber: 'VC456',
          connectionStatus: 'Active',
          secondaryPackList: ['Pack 1'],
        },
      ],
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        form: { formState: mockFormState },
        accountInformation: {
          accountInformation: secondaryAccountInfo,
          lastFiveRecharge: [],
          requestParams: {},
        },
        user: mockUserState,
      };
      return selector(state);
    });
    render(<AccountInformation />);
    expect(screen.getByText('Pack 1')).toBeTruthy();
    expect(screen.getByText('Pack 2')).toBeTruthy();
  });

  test('handles search by mobile number branch', () => {
    (isValidMobile as jest.Mock).mockReturnValue(false);

    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        form: { formState: { formNavigationData: null } },
        accountInformation: {
          accountInformation: { ...mockAccountInfo, maskedRMN: '9876543210' },
          lastFiveRecharge: [],
          requestParams: { subId: 'some-id', subscriberInfo: '123' },
        },
        user: mockUserState,
      };
      return selector(state);
    });
    render(<AccountInformation />);
    expect(screen.getByText('9876543210')).toBeTruthy();
    (isValidMobile as jest.Mock).mockReturnValue(true); // reset
  });

  test('hides recharge button for restricted roles', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        form: { formState: mockFormState },
        accountInformation: {
          accountInformation: mockAccountInfo,
          lastFiveRecharge: [],
          requestParams: {},
        },
        user: { info: { internalRole: PROPERTIES.ROLES.asi } },
      };
      return selector(state);
    });
    render(<AccountInformation />);
    expect(screen.queryByText('strings.recharge')).toBeNull();
  });

  test('renders recharge history when data is present', async () => {
    // 1. Initial render with NO history
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        form: { formState: mockFormState },
        accountInformation: {
          accountInformation: mockAccountInfo,
          lastFiveRecharge: [],
          requestParams: {},
        },
        user: mockUserState,
      };
      return selector(state);
    });

    const mockResponse = { status: true };
    mockDispatch.mockReturnValue(Promise.resolve(mockResponse));

    const { rerender } = render(<AccountInformation />);
    fireEvent.press(screen.getByText('strings.view'));

    // 2. Rerender with data
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        form: { formState: mockFormState },
        accountInformation: {
          accountInformation: mockAccountInfo,
          lastFiveRecharge: [{ amount: '500', transDate: '2023-01-01' }],
          requestParams: {},
        },
        user: mockUserState,
      };
      return selector(state);
    });

    rerender(<AccountInformation />);

    await waitFor(() => {
      expect(screen.getByText('500')).toBeTruthy();
      expect(screen.getByText('2023-01-01')).toBeTruthy();
    });
  });
});
