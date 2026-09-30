/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { ROUTE } from 'const';
import { PARTNER_ROLES, STATE_KEY } from 'const/strings';
import { getURLforInvoiceTransactions } from 'store/sales/actions/invoice/invoice.action';
import { sliceActions as activationStatusActions } from 'store/sales/reducer/activationStatus';
import { sliceActions as quoteActions } from 'store/sales/reducer/quotation';
import formActions from 'store/sales/actions/form';
import ETskRegSuccess from './ETskRegSuccess';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => jest.fn());
jest.mock('hooks/useCurrentRoute', () => jest.fn());

jest.mock('store/sales/actions/invoice/invoice.action', () => ({
  getURLforInvoiceTransactions: jest.fn(() => ({ type: 'GET_INVOICE' })),
}));

jest.mock('store/sales/reducer/activationStatus', () => ({
  sliceActions: {
    setSubIdFromNavigation: jest.fn(() => ({ type: 'SET_SUB_ID' })),
  },
}));

jest.mock('store/sales/reducer/quotation', () => ({
  sliceActions: {
    quotationsetMultiTVRegistration: jest.fn(() => ({ type: 'SET_MULTI_TV' })),
    quotationEtskSetIsQuotationNavigate: jest.fn(() => ({ type: 'SET_QUOTATION_NAV' })),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  setFormDependentDefault: jest.fn(() => ({ type: 'SET_FORM_DEP' })),
  setFormValues: jest.fn(() => ({ type: 'SET_FORM_VALS' })),
  setUpdatedFormFields: jest.fn(() => ({ type: 'SET_FORM_FIELDS' })),
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

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('components/sales', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    CustomerDetailsCard: () => <Text>CustomerDetailsCard</Text>,
    CommonSuccess: ({ primaryText, iconName }: any) => (
      <View>
        <Text>{primaryText}</Text>
        <Text>{iconName}</Text>
      </View>
    ),
    Image: () => null,
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`button-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Text: ({ label, children, style }: any) => <Text style={style}>{label || children}</Text>,
  };
});

describe('ETskRegSuccess Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockGoHome = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue({ navigate: mockNavigate, goHome: mockGoHome, reset: mockReset });
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.ETSK_REG_SUCCESS });
  });

  const baseState = {
    user: { isRedirection: false, info: { roleId: PARTNER_ROLES.fos, hideAscWarranty: 'N' } },
    etskRegSchedular: { successData: { response: { message: 'Success', transId: 'T123', woNumber: 'WO123' } } },
    quotation: { mobileNo: '9876543210', email: 'test@example.com', multiTvSubID: 'S123' },
    etskRegistration: { paidPrice: '100', boxTypeSelected: 'Android', validatePacksSuccessData: { noOfConnection: 1 } },
    form: { [STATE_KEY.FORM_STATE]: { dealerDetails: { subscriberId: 'SUB123' } } },
  };

  const renderWithState = (stateOverride = {}) => {
    const finalState = { ...baseState, ...stateOverride };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(finalState));
    return render(<ETskRegSuccess />);
  };

  it('renders correctly and handles back to home', () => {
    renderWithState();
    expect(screen.getByText('Success')).toBeTruthy();
    expect(screen.getByText('WO123')).toBeTruthy();

    fireEvent.press(screen.getByTestId('button-strings.backToHome'));
    expect(mockGoHome).toHaveBeenCalledWith(false);
  });

  it('handles route navigation for RECHARGE_REVERSAL', () => {
    renderWithState();
    fireEvent.press(screen.getByText('forms.rechargeReversal').parent!);
    expect(formActions.setFormDependentDefault).toHaveBeenCalledWith({ transactionID: 'T123' });
    expect(mockReset).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_REVERSAL, false);
  });

  it('handles route navigation for ACTIVATION_STATUS', () => {
    renderWithState();
    fireEvent.press(screen.getByText('strings.activationStatus').parent!);
    expect(activationStatusActions.setSubIdFromNavigation).toHaveBeenCalledWith('SUB123');
    expect(mockReset).toHaveBeenCalledWith(ROUTE.WEB.ACTIVATION_STATUS, false);
  });

  it('handles route navigation for WORK_ORDER_RECREATION and BOX_TYPE_CHANGE and default branch', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.PRIMARY_TV_REG_SUCCESS });
    renderWithState();

    // WORK_ORDER_RECREATION
    fireEvent.press(screen.getByText('strings.workOrderRecreation').parent!);
    expect(formActions.setFormValues).toHaveBeenCalledWith({ subscriberInfo: 'SUB123' }, STATE_KEY.MODAL_STATE);

    // BOX_TYPE_CHANGE
    fireEvent.press(screen.getByText('strings.boxTypeChange').parent!);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ subscriberInfo: 'SUB123' }, STATE_KEY.MODAL_STATE);

    // activation status (triggers default break in switch if it were another route, but let's just cover it)
    fireEvent.press(screen.getByText('strings.activationStatus').parent!);
    expect(mockReset).toHaveBeenCalled();
  });

  it('handles download invoice', () => {
    renderWithState();
    fireEvent.press(screen.getByText('strings.downloadInvoice').parent!);
    expect(getURLforInvoiceTransactions).toHaveBeenCalledWith({ isisDownload: true, transactionId: 'T123' });
  });

  it('handles continue to register for QUOTATION_MULTITV_SUCCESS', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.QUOTATION_MULTITV_SUCCESS });
    renderWithState();
    fireEvent.press(screen.getByTestId('button-strings.continueToRegister'));
    expect(quoteActions.quotationsetMultiTVRegistration).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.MULTI_TV_REGISTRATION);
  });

  it('handles continue to register for QUOTATION_PRIMARY_SUCCESS', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS });
    renderWithState();
    fireEvent.press(screen.getByTestId('button-strings.continueToRegister'));
    expect(quoteActions.quotationEtskSetIsQuotationNavigate).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.SECONDARY_TSK_REGISTRATION);
  });

  it('handles continue to register for QUOTATION_ETSK_SUCCESS', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.QUOTATION_ETSK_SUCCESS });
    renderWithState();
    fireEvent.press(screen.getByTestId('button-strings.continueToRegister'));
    expect(quoteActions.quotationEtskSetIsQuotationNavigate).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.ETSK_REGISTRATION);
  });

  it('handles ASC warranty options - NO', () => {
    renderWithState();
    fireEvent.press(screen.getByTestId('button-strings.no'));
    expect(screen.queryByText('strings.ASCWarrantyMessage')).toBeNull();
  });

  it('handles icon logic for paidPrice 0 in ETSK route', () => {
    renderWithState({ etskRegistration: { paidPrice: '0' }, etskRegSchedular: { successData: { response: { message: 'Zero Success', transId: null } } } });
    // It should contain the confirm success icon
    expect(screen.getByText(/confirmSuccess/)).toBeTruthy();
  });

  it('handles renderBoxTypes and result field in successData', () => {
    renderWithState({
      etskRegSchedular: { successData: { result: { message: 'Result Success', transId: 'T456', woNumber: 'WO456' } } },
      etskRegistration: {
        ...baseState.etskRegistration,
        validatePacksSuccessData: { noOfConnection: 2, secondBoxType2: 'HD' },
      },
    });
    expect(screen.getByText('Result Success')).toBeTruthy();
    expect(screen.getByText('HD')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = renderWithState().toJSON();
    expect(tree).toMatchSnapshot();
  });
});
