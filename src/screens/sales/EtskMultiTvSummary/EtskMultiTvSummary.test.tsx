/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { FORMS, QUERY, ROUTE } from 'const';
import { PARTNER_ROLES } from 'const/strings';
import { installationDetails, rechargeDetails } from 'store/sales/actions/etskRegSchedular/etskRegSchedular.action';
import { callAction } from 'utils/formBuilderHelper';
import EtskMultiTvSummary from './EtskMultiTvSummary';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => jest.fn());
jest.mock('hooks/useCurrentRoute', () => jest.fn());

jest.mock('store/sales/actions/etskRegSchedular/etskRegSchedular.action', () => ({
  installationDetails: jest.fn(() => ({ type: 'INSTALLATION_DETAILS' })),
  rechargeDetails: jest.fn(() => ({ type: 'RECHARGE_DETAILS' })),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'sm' }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('components/sales', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    CustomerDetailsCard: () => <Text>CustomerDetailsCard</Text>,
    Accordion: ({ title, children, subDetails }: any) => (
      <View>
        <Text>{title}</Text>
        <Text>{subDetails}</Text>
        {children}
      </View>
    ),
    TextContainer: () => <Text>TextContainer</Text>,
    InformationText: ({ primaryText, secondaryText }: any) => (
      <View>
        <Text>{primaryText}</Text>
        <Text>{secondaryText}</Text>
      </View>
    ),
    BoxInfoTab: () => <Text>BoxInfoTab</Text>,
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`button-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Text: ({ label, children, style }: any) => <Text style={style}>{label || children}</Text>,
  };
});

jest.mock('components/sales/Tabs', () => {
  const { View, Text } = require('react-native');
  return ({ tabs }: any) => (
    <View>
      {tabs.map((tab: any) => (
        <View key={tab.key}>
          <Text>{tab.title}</Text>
          {tab.component}
        </View>
      ))}
    </View>
  );
});

describe('EtskMultiTvSummary Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockGoHome = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue({ navigate: mockNavigate, goHome: mockGoHome, replace: mockReplace });
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.ETSK_MULTI_TV_SUMMARY });
  });

  const baseState = {
    etskRegistration: {
      customerDetails: {
        customerName: 'John Doe',
        mobileNo: '9876543210',
        emailAddress: ['john@example.com'],
        addressLine1: 'Line 1',
        addressLine2: 'Line 2',
        state: 'State',
        city: 'City',
        district: 'District',
        pincode: '123456',
      },
    },
    quotation: { multiTvSubID: 'S123' },
    etskMultiTv: {
      boxSelectedDetails: {
        packageNameArray: [
          { packName: 'Pack 1', packPrice: 100 },
          { packName: 'strings.network', packPrice: 50 },
        ],
        multiTVAddBoxsPrice: 500,
        pricePoint: 1000,
        ocsFlag: 'N',
      },
      boxType: 'Box Type',
    },
    user: { isRedirection: false, info: { roleId: PARTNER_ROLES.fos } },
  };

  const renderWithState = (stateOverride = {}) => {
    const finalState = { ...baseState, ...stateOverride };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(finalState));
    return render(<EtskMultiTvSummary />);
  };

  it('renders correctly and handles handleFinalSubmit for default route', () => {
    renderWithState();
    expect(screen.getByText('strings.SUMMARY')).toBeTruthy();

    fireEvent.press(screen.getByTestId('button-strings.proceed'));
    expect(rechargeDetails).toHaveBeenCalledWith(FORMS.etskMultiTvRechargeDetails);
  });

  it('handles handleFinalSubmit for WO_MULTI_TV_SUMMARY and ocsFlag YES', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.WO_MULTI_TV_SUMMARY });
    renderWithState({
      etskMultiTv: {
        boxType: 'Box Type',
        boxSelectedDetails: {
          packageNameArray: [],
          multiTVAddBoxsPrice: 500,
          pricePoint: 1000,
          ocsFlag: 'Y',
        },
      },
    });

    fireEvent.press(screen.getByTestId('button-strings.proceed'));
    expect(installationDetails).toHaveBeenCalled();
  });

  it('handles handleFinalSubmit for BOX_TYPE_MULTI_TV_SUMMARY', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY });
    renderWithState();

    fireEvent.press(screen.getByTestId('button-strings.proceed'));
    expect(rechargeDetails).toHaveBeenCalledWith(FORMS.multiTvRechargeDetails);
  });

  it('handles handleFinalSubmit for MULTI_TV_REGISTRATION_SUMMARY', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.MULTI_TV_REGISTRATION_SUMMARY });
    renderWithState();

    fireEvent.press(screen.getByTestId('button-strings.proceed'));
    expect(rechargeDetails).toHaveBeenCalledWith(FORMS.multiTvRechargeDetails);
  });

  it('handles cancel/goHome', () => {
    renderWithState();
    fireEvent.press(screen.getByTestId('button-strings.cancel'));
    expect(mockGoHome).toHaveBeenCalledWith(false);
  });

  it('renders correctly for QUOTATION_MULTITV_SUMMARY', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.QUOTATION_MULTITV_SUMMARY });
    renderWithState();

    expect(screen.queryByTestId('button-strings.proceed')).toBeNull();

    fireEvent.press(screen.getByTestId('button-strings.proceedRegister'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.MULTI_TV_REGISTRATION);

    fireEvent.press(screen.getByTestId('button-strings.sendQuote'));
    expect(callAction).toHaveBeenCalledWith({}, QUERY.multiTVmobileAndEmail);

    fireEvent.press(screen.getByTestId('button-strings.changeBoxType'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.QUOTATION_MULTITV_SELECTION);

    fireEvent.press(screen.getByTestId('button-strings.cancel'));
    expect(mockReplace).toHaveBeenCalledWith(ROUTE.WEB.QUOTATION_MULTITV_SELECTION);
  });

  it('hides proceedRegister for CSM/ASM/ASI roles in Quotation route', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.QUOTATION_MULTITV_SUMMARY });
    renderWithState({ user: { isRedirection: false, info: { roleId: PARTNER_ROLES.CSM } } });

    expect(screen.queryByTestId('button-strings.proceedRegister')).toBeNull();
  });

  it('handles unique packs logic and all branch fallbacks', () => {
    renderWithState({
      etskRegistration: {
        customerDetails: {
          customerName: 'Name',
          mobileNo: '123',
          emailAddress: null, // Test || []
          addressLine1: 'L1',
          addressLine2: null, // Test || ''
        },
      },
      etskMultiTv: {
        boxType: 'Box Type',
        boxSelectedDetails: {
          packageNameArray: null, // Test || [] branch
          multiTVAddBoxsPrice: null, // Test ?? 0
          pricePoint: null, // Test ?? 0
        },
      },
    });
    expect(screen.getByText('strings.SUMMARY')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = renderWithState().toJSON();
    expect(tree).toMatchSnapshot();
  });
});
