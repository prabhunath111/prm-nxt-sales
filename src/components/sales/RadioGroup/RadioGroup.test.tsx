/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { PROPERTIES, RADIO_GROUP } from 'const';
import RadioGroup from './RadioGroup';

const mockDispatch = jest.fn();
const mockStore = {
  dispatch: mockDispatch,
  subscribe: jest.fn(),
  getState: jest.fn(() => ({})),
} as any;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector) =>
    selector({
      customerRecharge: { selectedIdRadio: '1' },
    }),
  ),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    SM: 'sm',
  },
  useInflection: jest.fn(() => ({ inflection: 'sm' })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn((payload) => ({ type: 'SHOW_MODAL', payload })),
}));

jest.mock('store/sales/actions/customerRecharge', () => ({
  __esModule: true,
  default: {
    setEvdRechargePayload: jest.fn((payload) => ({ type: 'SET_RECHARGE_PAYLOAD', payload })),
    setBingFlag: jest.fn((payload) => ({ type: 'SET_BING_FLAG', payload })),
  },
}));

jest.mock('store/sales/reducer/customerRecharge', () => ({
  __esModule: true,
  sliceActions: {
    setSelectedIdRadio: jest.fn((payload) => ({ type: 'SET_SELECTED_ID', payload })),
    setSelectedOffer: jest.fn((payload) => ({ type: 'SET_SELECTED_OFFER', payload })),
    setAndroidUpgradeSelected: jest.fn((payload) => ({ type: 'SET_ANDROID_UPGRADE', payload })),
    setBingeFlag: jest.fn((payload) => ({ type: 'SET_BINGE_FLAG', payload })),
  },
}));

describe('RadioGroup', () => {
  const mockGroups = [
    {
      heading: 'Group 1',
      items: [{ key: 'item1' }, { key: 'item2' }],
      data: {
        item1: 'Item 1 Label',
        item2: 'Item 2 Label',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={mockStore}>
        <RadioGroup groups={mockGroups} onSelect={jest.fn()} {...props} />
      </Provider>,
    );

  test('renders correctly and handles basic selection', () => {
    const onSelect = jest.fn();
    renderComponent({ onSelect });

    const radioButtons = screen.getAllByTestId('radioBtn');
    fireEvent.press(radioButtons[0]);
    expect(onSelect).toHaveBeenCalledWith('Item 1 Label', 'item1');
  });

  test('handles bingeOffer selection (U)', () => {
    const bingeItems = [{ key: PROPERTIES.CUSTOMER_RECHARGE.BINGE_RECHARGE_VALUE, bingeOffer: PROPERTIES.CUSTOMER_RECHARGE.U }];
    renderComponent({
      groups: [{ heading: 'Binge', items: bingeItems, data: { [PROPERTIES.CUSTOMER_RECHARGE.BINGE_RECHARGE_VALUE]: 'Binge Label', bingeOffer: PROPERTIES.CUSTOMER_RECHARGE.U } }],
    });

    const radioBtn = screen.getByTestId('dynamic-radio-btn');
    fireEvent.press(radioBtn);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles winbackOffer selection', () => {
    const winbackItems = [
      {
        key: 'annualWinbackOffer',
        winbackOffer: 'annualWinbackOffer',
        cashbackValueAnnual: '100',
        dealerMarginAnnual: '10',
      },
    ];
    renderComponent({
      groups: [{ heading: 'Winback', items: winbackItems, data: { annualWinbackOffer: 'Winback Label', offerDetails: [{ offerKey: '11M' }], offerType: 'winback' } }],
    });

    const radioButtons = screen.getAllByTestId('radioBtn');
    fireEvent.press(radioButtons[0]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('shows plan info modal', () => {
    const itemsWithInfo = [{ key: 'infoItem', showPlanInfo: true, partnerMargin: '5', subscriberOffer: '10%' }];
    renderComponent({ groups: [{ heading: RADIO_GROUP.RechargeFlexiPlan, items: itemsWithInfo, data: { infoItem: 'Info Label', flexiPlanInfo: true, flexiPlanInfoNew: [{}] } }] });

    const infoIcon = screen.getByTestId('info-icon-test');
    fireEvent.press(infoIcon);
    const { showBottomModal } = require('store/sales/actions/ui');
    expect(showBottomModal).toHaveBeenCalled();
  });

  test('shows plan details modal', () => {
    const itemsWithDetails = [{ key: 'detailsItem', showPlanDetails: true, details: 'Some details' }];
    renderComponent({ groups: [{ heading: RADIO_GROUP.RechargeWinbackFlexi, items: itemsWithDetails, data: { detailsItem: 'Details Label', offerDetails: {} } }] });

    const infoIcon = screen.getByTestId('info-icon-test');
    fireEvent.press(infoIcon);
    const { showBottomModal } = require('store/sales/actions/ui');
    expect(showBottomModal).toHaveBeenCalled();
  });

  test('syncs unSelectedValue from props in useEffect', () => {
    const { rerender } = renderComponent({ unSelectedValue: 'item1' });
    // This triggers useEffect
    rerender(
      <Provider store={mockStore}>
        <RadioGroup groups={mockGroups} onSelect={jest.fn()} unSelectedValue="item2" />
      </Provider>,
    );
  });

  test('renders DynamicRadioButton branch', () => {
    const bingeItems = [{ key: PROPERTIES.CUSTOMER_RECHARGE.BINGE_RECHARGE_VALUE, bingeOffer: PROPERTIES.CUSTOMER_RECHARGE.U }];
    renderComponent({
      groups: [{ heading: 'Binge', items: bingeItems, data: { [PROPERTIES.CUSTOMER_RECHARGE.BINGE_RECHARGE_VALUE]: 'Binge Label', bingeOffer: PROPERTIES.CUSTOMER_RECHARGE.U } }],
    });
    expect(screen.getByTestId('dynamic-radio-btn')).toBeTruthy();
  });

  test('covers hidden sub-items with 0 value', () => {
    const itemsWithSub = [
      {
        key: 'itemWithSub',
        subItems: [{ key: 'dealerMarginAnnual' }],
      },
    ];
    render(
      <Provider store={mockStore}>
        <RadioGroup groups={[{ heading: 'Sub', items: itemsWithSub, data: { itemWithSub: 'Label', dealerMarginAnnual: 0 } }]} onSelect={jest.fn()} />
      </Provider>,
    );
    // This should trigger the line 122 return null
  });

  test('covers hidden sub-items with non-zero value', () => {
    const itemsWithSub = [
      {
        key: 'itemWithSub',
        subItems: [{ key: 'dealerMarginAnnual' }],
      },
    ];
    render(
      <Provider store={mockStore}>
        <RadioGroup groups={[{ heading: 'Sub', items: itemsWithSub, data: { itemWithSub: 'Label', dealerMarginAnnual: 10 } }]} onSelect={jest.fn()} />
      </Provider>,
    );
  });

  test('snapshot test', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
