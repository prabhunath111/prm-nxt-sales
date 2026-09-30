/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import EtskRegistrationSummary from './EtskRegistrationSummary';

// Bypass memo for testing
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  memo: (comp: any) => comp,
}));

// Mock env using config path
jest.mock('config/env', () => ({
  ENABLE_REGISTRATION_SCHEDULER: true,
}));

// Reactive mock for route
let mockRouteName = 'eTSKRegistrationSummary';
jest.mock('hooks/useCurrentRoute', () => jest.fn(() => ({ routeName: mockRouteName })));

// Mock dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockGoBack = jest.fn();
const mockReplace = jest.fn();
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  goBack: mockGoBack,
  replace: mockReplace,
  navigate: mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(() => ({ inflection: 'md' })),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => ({})),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => Promise.resolve({ status: true })),
}));

jest.mock('utils/responseHelper', () => ({
  getDhamakaRechargeAmount: jest.fn(),
  getDisabledCategoryMatch: jest.fn(),
  hasDisabledCategory: jest.fn(() => false),
  maskMobileNumber: jest.fn((val) => val),
  getDisabledCategoryMatchEtsk: jest.fn(),
  getDisabledCategoryMatchEtskNew: jest.fn(),
}));

jest.mock('styles/dimentionHelper', () => ({
  getScreenWidth: jest.fn(() => 1024),
}));

// Mock sub-components
jest.mock('components/sales', () => {
  const rn = require('react-native');
  return {
    CustomerDetailsCard: (props: any) => <rn.View testID="customer-details-card" {...props} />,
    Text: (props: any) => <rn.Text {...props}>{props.label || props.children}</rn.Text>,
    DateAndTimeDetails: () => <rn.View testID="date-time-details" />,
    RadioContainer: (_props: any) => <rn.View testID="radio-container" />,
    Checkbox: (_props: any) => <rn.View testID="checkbox" />,
  };
});
jest.mock('components/sales/Tabs', () => (props: any) => {
  const rn = require('react-native');
  if (!props.tabs) return null;
  return (
    <rn.View testID="tabs">
      {props.tabs.map((tab: any) => (
        <rn.View key={tab.key} testID={`tab-${tab.key}`}>
          {tab.component || <rn.View testID={`tab-comp-${tab.key}`} />}
        </rn.View>
      ))}
    </rn.View>
  );
});
jest.mock('components/sales/TextContainer', () => (_props: any) => {
  const rn = require('react-native');
  return <rn.View testID="text-container" />;
});
jest.mock('components/sales/Accordion', () => (props: any) => {
  const rn = require('react-native');
  return (
    <rn.View testID="accordion">
      <rn.Text>{props.title}</rn.Text>
      {props.children}
    </rn.View>
  );
});
jest.mock('components/sales/InformationText', () => (_props: any) => {
  const rn = require('react-native');
  return <rn.View testID="information-text" />;
});
jest.mock('components/sales/Button', () => (props: any) => {
  const rn = require('react-native');
  return (
    <rn.TouchableOpacity testID={props.testID || `button-${props.label}`} onPress={props.onPress}>
      <rn.Text>{props.label}</rn.Text>
    </rn.TouchableOpacity>
  );
});
jest.mock('components/sales/BoxInfoTab', () => (props: any) => {
  const rn = require('react-native');
  return (
    <rn.TouchableOpacity testID="change-pack-btn" onPress={() => props.setIsPackChanged(true)}>
      <rn.Text>Change Pack</rn.Text>
    </rn.TouchableOpacity>
  );
});

describe('EtskRegistrationSummary Component', () => {
  const mockDispatch = jest.fn();
  let currentMockState: any;

  const deepCloneState = (state: any) => ({
    ...state,
    etskRegistration: {
      ...state.etskRegistration,
      validatePacksSuccessData: { ...state.etskRegistration.validatePacksSuccessData },
      selectedPacksToBuy: [...state.etskRegistration.selectedPacksToBuy],
      customerDetails: { ...state.etskRegistration.customerDetails },
      accountCreationSuccessData: { ...state.etskRegistration.accountCreationSuccessData },
    },
    woRecreation: { ...state.woRecreation },
    primaryTvRegistration: { ...state.primaryTvRegistration },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteName = 'eTSKRegistrationSummary';
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    currentMockState = {
      etskRegistration: {
        validatePacksSuccessData: {
          flexiPackPrice: 100,
          flexiDealerIncentiveAnnual: 10,
          flexiDealerIncentiveSemiAnnual: 5,
          flexiPackPriceAnn: 1200,
          flexiPackPriceSemi: 600,
          flexiPackPriceSemiBonus: 50,
          noOfConnection: 2,
          priBoxType: 'HD',
          multiTvPackList: [{ packName: 'Pack 1' }, { packName: 'strings.network' }],
          vcLvlPackDtls: [{ packDtls: [{ productPrice: 10, numberOfChannels: 100 }] }],
          secondaryNCF: 150,
          secondNCFPrice: 150,
          dhamakaETSK: 'Dhamaka',
          dhamakaReqRechAmtETSK: 2000,
          offerTypeFromBE: 'Dhamaka-Offer',
        },
        customerDetails: { customerName: 'Test', mobileNo: '1234567890' },
        accountCreationSuccessData: { ocsFlag: 'Y', bookingFormNumber: 'BFN123' },
        primaryBoxPrice: 1000,
        selectedPacksToBuy: [{ price: 50 }],
        packSelected: {},
      },
      woRecreation: { accountDetailsPrimaryAndSecondaryRepush: { ocsFlag: 'Y' } },
      primaryTvRegistration: { tskValidateData: { pricePointPrimary: 500, pricePointSecondary1: 300 } },
      common: { errorMessage: '' },
      user: { info: { roleId: '1', internalRole: 'Dealer' } },
      quotation: {},
      ui: { isLoading: false },
    };

    const mockGetState = () => currentMockState;
    mockDispatch.mockImplementation((action: any) => {
      if (typeof action === 'function') return action(mockDispatch, mockGetState);
      return Promise.resolve({ status: true });
    });

    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(currentMockState));
  });

  const TestWrapper = ({ route, state }: { route: string; state: any }) => {
    mockRouteName = route;
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) => selector(state));
    return <EtskRegistrationSummary />;
  };

  test('exhaustive interaction verify', () => {
    const { rerender } = render(<TestWrapper route="eTSKRegistrationSummary" state={currentMockState} />);

    fireEvent.press(screen.getAllByTestId('button-strings.addPacks')[0]);
    expect(mockGoBack).toHaveBeenCalled();

    // Change pack state
    fireEvent.press(screen.getAllByTestId('change-pack-btn')[0]);

    // Flexi plans
    fireEvent.press(screen.getByText(/strings.flexiPlanAnnual/i));
    fireEvent.press(screen.getByText(/strings.flexiPlanSemiAnnual/i));
    fireEvent.press(screen.getByText(/strings.recommendedRecharge/i));

    // Quotation routes
    rerender(<TestWrapper route="quotationPrimarySummary" state={deepCloneState(currentMockState)} />);
    fireEvent.press(screen.getByTestId('button-strings.proceedRegister'));
    fireEvent.press(screen.getByTestId('button-strings.sendQuote'));
    fireEvent.press(screen.getByTestId('button-strings.changeBoxType'));
    fireEvent.press(screen.getByTestId('button-strings.cancel'));

    rerender(<TestWrapper route="quotationETSKSummary" state={deepCloneState(currentMockState)} />);
    fireEvent.press(screen.getByTestId('button-strings.proceedRegister'));
    fireEvent.press(screen.getByTestId('button-strings.sendQuote'));
    fireEvent.press(screen.getByTestId('button-strings.changeBoxType'));
    fireEvent.press(screen.getByTestId('button-strings.cancel'));

    // Submit routes
    const routes = ['primaryRegistrationSummary', 'rePushOrderSummary', 'woRecreationSummary', 'boxTypeSummary', 'eTSKRepushSummary', 'eTSKRegistrationSummary'];
    routes.forEach((route) => {
      rerender(<TestWrapper route={route} state={deepCloneState(currentMockState)} />);
      fireEvent.press(screen.getAllByTestId('change-pack-btn')[0]);
      fireEvent.press(screen.getByTestId('button-strings.proceed'));
    });

    // ocsFlag: N
    currentMockState.etskRegistration.accountCreationSuccessData.ocsFlag = 'N';
    currentMockState.woRecreation.accountDetailsPrimaryAndSecondaryRepush.ocsFlag = 'N';
    routes.forEach((route) => {
      rerender(<TestWrapper route={route} state={deepCloneState(currentMockState)} />);
      fireEvent.press(screen.getAllByTestId('change-pack-btn')[0]);
      fireEvent.press(screen.getByTestId('button-strings.proceed'));
    });

    // Dhamaka false, matched pack true
    const { getDhamakaRechargeAmount, getDisabledCategoryMatch, hasDisabledCategory } = require('utils/responseHelper');
    currentMockState.etskRegistration.validatePacksSuccessData.dhamakaETSK = '';
    getDhamakaRechargeAmount.mockReturnValue(null);
    getDisabledCategoryMatch.mockReturnValue({ rechargeAmount: 400, category: 'CAT1' });
    hasDisabledCategory.mockReturnValue(true);
    rerender(<TestWrapper route="eTSKRegistrationSummary" state={deepCloneState(currentMockState)} />);

    // matched pack false (Else branch)
    getDisabledCategoryMatch.mockReturnValue(null);
    hasDisabledCategory.mockReturnValue(false);
    rerender(<TestWrapper route="eTSKRegistrationSummary" state={deepCloneState(currentMockState)} />);

    // Mobile view
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(300);
    rerender(<TestWrapper route="eTSKRegistrationSummary" state={deepCloneState(currentMockState)} />);
  });
});
