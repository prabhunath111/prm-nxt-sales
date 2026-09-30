/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { BreakPoints } from 'wrappers/inflection/InflectionProvider';
import PartnerApprovalCard from './PartnerApprovalCard';

const mockDispatch = jest.fn();
const store = {
  dispatch: mockDispatch,
  subscribe: jest.fn(),
  getState: jest.fn(() => ({})),
} as any;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    SM: 'sm',
    XS: 'xs',
  },
  useInflection: jest.fn(),
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn((payload) => ({ type: 'SHOW_MODAL', payload })),
}));

jest.mock('store/sales/actions/form', () => ({
  setEvdMdnNavigationData: jest.fn((payload) => ({ type: 'SET_NAV_DATA', payload })),
}));

jest.mock('components/sales/List', () => {
  const { View } = require('react-native');
  return (props: any) => <View testID="mock-list">{props.data?.map((item: any, index: number) => <View key={index}>{props.renderItem({ item, index })}</View>)}</View>;
});

jest.mock('components/sales/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return (props: any) => (
    <TouchableOpacity onPress={props.onPress} testID="button-test">
      <Text>{props.label}</Text>
    </TouchableOpacity>
  );
});

describe('PartnerApprovalCard', () => {
  const mockPartnerList = [
    {
      partnerId: 'P123',
      partnerName: 'Partner One',
      oldRmn: '1234567890',
      newRmn: '0987654321',
      requestDate: '2023-10-01',
      requestId: 'R1',
      reason: 'Change requested',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (require('react-redux').useSelector as jest.Mock).mockReturnValue({
      evdMdnPartnerFilteredList: mockPartnerList,
    });
    (require('wrappers/inflection/InflectionProvider').useInflection as jest.Mock).mockReturnValue({
      inflection: BreakPoints.SM,
    });
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={store}>
        <PartnerApprovalCard queryName="testQuery" {...props} />
      </Provider>,
    );

  test('renders empty state when no data', () => {
    (require('react-redux').useSelector as jest.Mock).mockReturnValue({
      evdMdnPartnerFilteredList: [],
    });
    renderComponent();
    expect(screen.getByText('errors.noDataFound')).toBeTruthy();
  });

  test('renders mobile layout (SM) and handles approve/reject', () => {
    renderComponent();
    expect(screen.getAllByTestId('partnerApprovalTest').length).toBeGreaterThan(0);

    const approveButtons = screen.getAllByText('strings.approve');
    fireEvent.press(approveButtons[approveButtons.length - 1]); // Press the one in the list item

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_NAV_DATA' }));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SHOW_MODAL' }));

    const rejectButtons = screen.getAllByText('strings.reject');
    fireEvent.press(rejectButtons[rejectButtons.length - 1]); // Press the one in the list item
    expect(mockDispatch).toHaveBeenCalledTimes(4); // 2 actions per click
  });

  test('renders web layout (XL) and handles approve', () => {
    (require('wrappers/inflection/InflectionProvider').useInflection as jest.Mock).mockReturnValue({
      inflection: BreakPoints.XL,
    });
    renderComponent();

    const approveButtons = screen.getAllByText('strings.approve');
    fireEvent.press(approveButtons[0]);

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_NAV_DATA' }));
  });

  test('renders web layout (LG) and handles reject', () => {
    (require('wrappers/inflection/InflectionProvider').useInflection as jest.Mock).mockReturnValue({
      inflection: BreakPoints.LG,
    });
    renderComponent();

    const rejectButtons = screen.getAllByText('strings.reject');
    fireEvent.press(rejectButtons[0]);

    expect(mockDispatch).toHaveBeenCalled();
  });

  test('renders web layout (MD)', () => {
    (require('wrappers/inflection/InflectionProvider').useInflection as jest.Mock).mockReturnValue({
      inflection: BreakPoints.MD,
    });
    renderComponent();
    expect(screen.getByTestId('partnerApprovalTest')).toBeTruthy();
  });

  test('handles approve with custom queryName', () => {
    renderComponent({ queryName: 'customQuery' });
    const approveButtons = screen.getAllByText('strings.approve');
    fireEvent.press(approveButtons[0]);

    const { showBottomModal } = require('store/sales/actions/ui');
    expect(showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonInfo: expect.objectContaining({
          queryName: 'customQuery',
        }),
      }),
    );
  });

  test('snapshot test', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
