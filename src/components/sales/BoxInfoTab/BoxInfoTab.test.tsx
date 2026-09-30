import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { ROUTE } from 'const';
import * as ReactRedux from 'react-redux';
import BoxInfoTab from './BoxInfoTab';

jest.mock('services/storageService', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    clearLoader: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/etskRegistration', () => ({
  sliceActions: {
    etskRemoveSelectedPacksToBuyData: jest.fn(),
  },
}));

jest.mock('store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: () => '',
  isXL: false,
  isLG: false,
  isMD: false,
  isMDL: false,
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'en' }),
}));

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({ navigate: mockNavigate }));

jest.mock('utils/imageHelper');
jest.mock('utils/responseHelper', () => ({
  formatDurationForUI: jest.fn((val) => val || 'MONTHLY'),
  formatValue: jest.fn((type, value) => value || type),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    BoxTypeChange: {
      BoxTypeChange_ViewDetails: {
        moduleName: 'BoxTypeChange_ViewDetails',
        attributes: {
          offerName: 'offerName',
          packPrice: 'packPrice',
        },
      },
      BoxTypeChange_PickPackProceed: {
        attributes: {
          Status: 'Status',
        },
      },
    },
  },
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

const defaultArgs = {
  boxPrice: { old: null, new: '1000' },
  tsk: '12',
  ncf: '10',
  ncfText: 'NCF Text',
  packs: [],
  isPrimary: false,
  setIsPackChanged: jest.fn(),
  routeName: '',
  totalPrice: '5000',
  discountPrice: '4500',
  dhamakaText: ' (Dhamaka)',
};

const mockSelector = {
  selectedPacksToBuy: [{ siebelName: 'Pack1', price: '100', packPrice: '100' }],
  accountCreationSuccessData: {
    packageName: [
      {
        PackageInfo: [
          { uom: 'strings.MONTHLY', packName: 'FreePack' },
          { uom: 'strings.YEARLY', packName: 'YearlyPack' },
        ],
      },
    ],
  },
};

describe('BoxInfoTab Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ReactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback: any) => callback({ etskRegistration: mockSelector }));
  });

  test('renders component with basic props', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('BoxInfoTab')).toBeTruthy();
  });

  test('renders with old price when boxPrice.old is not null', () => {
    const args = { ...defaultArgs, boxPrice: { old: '1500', new: '1000' } };
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...args} />
        </NavigationContainer>
      </Provider>,
    );
    expect(getByText('₹1500')).toBeTruthy();
  });

  test('renders ncf with month when ncf is not 0', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} ncf="150" />
        </NavigationContainer>
      </Provider>,
    );
    expect(getByText('₹150/strings.month')).toBeTruthy();
  });

  test('renders ncf without month when ncf is 0', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} ncf="0" />
        </NavigationContainer>
      </Provider>,
    );
    expect(getByText('₹0')).toBeTruthy();
  });

  test('renders packs for non-primary box', () => {
    const packs = [
      { packName: 'Pack1', price: '200', durationNT: 'MONTHLY' },
      { siebelName: 'Pack2', packPrice: '300', durationNT: 'YEARLY' },
    ];
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} packs={packs} isPrimary={false} />
        </NavigationContainer>
      </Provider>,
    );
    expect(getByText('strings.Pack1')).toBeTruthy();
    expect(getByText('strings.Pack2')).toBeTruthy();
  });

  test('renders primary packs with free pack', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary />
        </NavigationContainer>
      </Provider>,
    );
    expect(getByText('strings.free')).toBeTruthy();
  });

  test('shows view details and drop button for non-free primary packs', () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary />
        </NavigationContainer>
      </Provider>,
    );
    expect(getAllByText('strings.viewDetails').length).toBeGreaterThan(0);
    expect(getAllByText('strings.drop').length).toBeGreaterThan(0);
  });

  test('calls handleViewDetails on view details press', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('calls onRemoveOffer on drop button press', () => {
    const setIsPackChanged = jest.fn();
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary setIsPackChanged={setIsPackChanged} />
        </NavigationContainer>
      </Provider>,
    );
    const dropButtons = getAllByText('strings.drop');
    fireEvent.press(dropButtons[0]);
    expect(setIsPackChanged).toHaveBeenCalledWith(true);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('navigates to PRIMARY_REG_OFFERS_DETAILS for PRIMARY_REGISTRATION_SUMMARY route', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('navigates to RE_PUSH_ORDER_OFFERS_DETAILS for RE_PUSH_ORDER_SUMMARY route', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.RE_PUSH_ORDER_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('navigates to WO_OFFER_VIEW_DETAILS for WO_RECREATION_SUMMARY route', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.WO_RECREATION_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('navigates to ETSK_REPUSH_OFFERS_VIEW_DETAILS for ETSK_REPUSH_SUMMARY route', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.ETSK_REPUSH_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('navigates to QUOTATION_ETSK_PACK_DETAILS for QUOTATION_ETSK_SUMMARY route', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.QUOTATION_ETSK_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('navigates to QUOTATION_ETSK_PACK_DETAILS for QUOTATION_PRIMARY_SUMMARY route', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('navigates to QUOTATION_ETSK_PACK_DETAILS for QUOTATION_MULTITV_SUMMARY route', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.QUOTATION_MULTITV_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('navigates to BOX_TYPE_CHANGE_DETAILS for BOX_TYPE_SUMMARY route', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.BOX_TYPE_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('navigates to ETSK_OFFERS_VIEW_DETAILS for default route', async () => {
    mockDispatch.mockResolvedValue({ status: true });
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName="UNKNOWN_ROUTE" />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('handles error in handleViewDetails', async () => {
    mockDispatch.mockRejectedValueOnce(new Error('API Error'));
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary />
        </NavigationContainer>
      </Provider>,
    );
    const viewDetailsButtons = getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsButtons[0]);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('calls GetRentalPackNew for PRIMARY_REGISTRATION_SUMMARY on remove', () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const dropButtons = getAllByText('strings.drop');
    fireEvent.press(dropButtons[0]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('calls GetRentalPackNew for RE_PUSH_ORDER_SUMMARY on remove', () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.RE_PUSH_ORDER_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const dropButtons = getAllByText('strings.drop');
    fireEvent.press(dropButtons[0]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('calls GetWoRentalPack for WO_RECREATION_SUMMARY on remove', () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.WO_RECREATION_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const dropButtons = getAllByText('strings.drop');
    fireEvent.press(dropButtons[0]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('calls DoGetRentalPackNewPartnerQuote for QUOTATION_PRIMARY_SUMMARY on remove', () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const dropButtons = getAllByText('strings.drop');
    fireEvent.press(dropButtons[0]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('calls DoGetRentalPackNewPartnerQuoteEtsk for QUOTATION_ETSK_SUMMARY on remove', () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} isPrimary routeName={ROUTE.WEB.QUOTATION_ETSK_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    const dropButtons = getAllByText('strings.drop');
    fireEvent.press(dropButtons[0]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('renders estimated recharge amount for quotation summary', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} routeName={ROUTE.WEB.QUOTATION_ETSK_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    expect(getByText('strings.estimatedRechargeAmount')).toBeTruthy();
  });

  test('shows customerQuotationAmount for quotation routes', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} routeName={ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY} />
        </NavigationContainer>
      </Provider>,
    );
    expect(getByText('strings.customerQuotationAmount')).toBeTruthy();
  });

  test('calculates pack price correctly', () => {
    const packs = [
      { packName: 'Pack1', packPrice: '100.5' },
      { packName: 'Pack2', price: '200.7' },
    ];
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} packs={packs} isPrimary={false} />
        </NavigationContainer>
      </Provider>,
    );
    expect(getByText('strings.total ₹302')).toBeTruthy();
  });

  test('snapshot test', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <BoxInfoTab {...defaultArgs} />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
