/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/button-has-type */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { STRINGS, FORMS, ROUTE } from 'const';
import * as useCurrentRouteHook from 'hooks/useCurrentRoute';
import * as useNavigateHook from 'hooks/useNavigate';
import * as useTranslationHook from 'react-i18next';
import * as InflectionProvider from 'wrappers/inflection/InflectionProvider';
import { configureStore } from '@reduxjs/toolkit';
import evdBalanceInfoReducer from 'store/sales/reducer/evdBalanceInfo';
import * as formBuilderHelper from 'utils/formBuilderHelper';
import DynamicTable from './DynamicTable';

// Mock components
jest.mock('components/sales/Image', () => {
  const { View: RNView } = require('react-native');
  return () => <RNView testID="mock-image" />;
});

jest.mock('components/sales/Button', () => {
  const { Pressable: RNPressable, Text: RNText } = require('react-native');
  return ({ onPress, label, testID }: any) => (
    <RNPressable onPress={onPress} testID={testID}>
      <RNText>{label}</RNText>
    </RNPressable>
  );
});

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'TEST_ACTION' })),
}));

jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(),
  BreakPoints: {
    XL: 'XL',
    LG: 'LG',
    MD: 'MD',
    SM: 'SM',
    XS: 'XS',
  },
}));

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: {
      evdBalanceInfo: evdBalanceInfoReducer,
      dashboard: (state = {}) => state,
      form: (state = { [FORMS.storeOperationalDetails]: {} }) => state,
    },
    preloadedState: {
      evdBalanceInfo: {
        pageNumber: 1,
        paginationData: { totalPages: 5 },
        balanceInfo: {},
        filteredBalanceInfo: {},
        evdInfo: {},
        isFilterApplied: false,
        radioContainerRed: 'newest',
        durationIdRed: 'all',
        filteredBalanceInfoConf: {},
        filteredConf: {},
        dealerBalanceInput: '',
        consolidatedParams: {},
        isFos: false,
        consolidatedData: [],
        ...initialState,
      } as any,
    },
  });

let mockStore = createMockStore();
const mockUseCurrentRoute = useCurrentRouteHook.default as jest.Mock;
const mockUseNavigate = useNavigateHook.default as jest.Mock;
const mockUseTranslation = useTranslationHook.useTranslation as jest.Mock;
const mockUseInflection = InflectionProvider.useInflection as jest.Mock;

describe('DynamicTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = createMockStore();
    mockUseCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.CONSOLIDATED_TRANSACTION });
    mockUseNavigate.mockReturnValue({ navigate: jest.fn() });
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      i18n: { language: STRINGS.EN },
    });
    mockUseInflection.mockReturnValue({ inflection: 'XL' });
  });

  const renderComponent = (props: any = {}) => {
    const defaultProps = {
      columns: [],
      data: [],
      alignLeft: true,
      ...props,
    };
    return render(
      <Provider store={mockStore}>
        <DynamicTable {...defaultProps} />
      </Provider>,
    );
  };

  test('renders basic table structure and default props', () => {
    // Testing alignLeft default (undefined -> true)
    renderComponent({
      columns: [{ accessorKey: 'col1', label: 'Column 1', size: 100 }],
      data: [{ col1: 'Value 1' }],
      alignLeft: undefined,
    });
    expect(screen.getByText('Column 1')).toBeTruthy();
  });

  test('handles alignment variants including null and altRow styles', () => {
    renderComponent({
      columns: [
        { accessorKey: 'c1', label: 'C1', size: 100, alignment: 'center' },
        { accessorKey: 'c2', label: 'C2', size: 100, alignment: 'right' },
        { accessorKey: 'c3', label: 'C3', size: 100, alignment: null },
      ],
      data: [
        { c1: 'v1.1', c2: 'v1.2', c3: 'v1.3' },
        { c1: 'v2.1', c2: 'v2.2', c3: 'v2.3' },
      ],
      alignLeft: false,
    });
    expect(screen.getByTestId('dynamicTable')).toBeTruthy();
  });

  test('handles sorting logic with numbers, strings, and nulls', () => {
    const columns = [{ accessorKey: 'val', label: 'Value', size: 100 }];
    const data = [{ val: 10 }, { val: null }, { val: 2 }, { val: undefined }, { val: 5 }];
    const { getByTestId } = renderComponent({ columns, data, formName: FORMS.storeOperationalDetails });
    const sortBtn = getByTestId('sort-val');
    fireEvent.press(sortBtn); // Asc
    fireEvent.press(sortBtn); // Desc

    const { getByTestId: getByTestId2 } = renderComponent({
      columns: [{ accessorKey: 'name', label: 'Name', size: 100 }],
      data: [{ name: 'B' }, { name: 'A' }, { name: null }],
      formName: FORMS.storeOperationalDetails,
    });
    fireEvent.press(getByTestId2('sort-name'));
    fireEvent.press(getByTestId2('sort-name'));
  });

  test('handleSort returns early if no accessorKey', () => {
    renderComponent({
      columns: [{ label: 'No Accessor', size: 100 }],
      data: [{ name: 'test' }],
      formName: FORMS.storeOperationalDetails,
    });
    fireEvent.press(screen.getByTestId('sort-undefined'));
    expect(screen.getByTestId('dynamicTable')).toBeTruthy();
  });

  test('handles button cell press and null value coalescing', () => {
    const columns = [{ accessorKey: 'act', label: 'Action', size: 100, type: 'button', operation: 'testOp', name: 'Btn' }];
    const data = [{ act: null }]; // Test ?? '' coalescing
    renderComponent({ columns, data });

    fireEvent.press(screen.getByText('Btn'));
    expect(formBuilderHelper.callAction).toHaveBeenCalled();
  });

  test('handles link cell press and "View" default label', () => {
    const onLinkPress = jest.fn();
    const columns = [{ accessorKey: 'link', label: 'Link', size: 100, type: 'link' }];
    renderComponent({ columns, data: [{}], onLinkPress });

    fireEvent.press(screen.getByText('View'));
    expect(onLinkPress).toHaveBeenCalled();
  });

  test('renders custom cell content via renderCell prop', () => {
    const { View: RNView, Text: RNText } = require('react-native');
    const renderCell = jest.fn((item) => (
      <RNView>
        <RNText>{`Custom ${item.val}`}</RNText>
      </RNView>
    ));
    renderComponent({ columns: [{ accessorKey: 'val', label: 'Val', size: 100, renderCell }], data: [{ val: 'Test' }] });
    expect(screen.getByText('Custom Test')).toBeTruthy();
  });

  test('loadMoreData triggers for all mapped routes', () => {
    const routes = [
      ROUTE.WEB.CONSOLIDATED_TRANSACTION,
      ROUTE.WEB.CONSOLIDATED_TRANSACTION_FOS,
      ROUTE.WEB.RECHARGE_TRANSACTION,
      ROUTE.WEB.RECHARGE_TRANSACTION_FOS,
      ROUTE.WEB.OTF_CREDIT_DETAILS,
      ROUTE.WEB.OTF_CREDIT_DETAILS_FOS,
      ROUTE.WEB.BALANCE_TRANSFER_DETAILS,
      ROUTE.WEB.BALANCE_TRANSFER_dETAILS_FOS,
    ];
    routes.forEach((route) => {
      mockStore = createMockStore();
      mockUseCurrentRoute.mockReturnValue({ routeName: route });
      const { unmount } = render(
        <Provider store={mockStore}>
          <DynamicTable columns={[]} data={Array(5).fill({})} />
        </Provider>,
      );
      fireEvent(screen.getByTestId('dynamic-table-flatlist'), 'onEndReached');
      unmount();
    });
    expect(formBuilderHelper.callAction).toHaveBeenCalled();
  });

  test('loadMoreData handles all boundary early returns across routes', () => {
    const mainRoutes = [ROUTE.WEB.CONSOLIDATED_TRANSACTION, ROUTE.WEB.RECHARGE_TRANSACTION, ROUTE.WEB.OTF_CREDIT_DETAILS, ROUTE.WEB.BALANCE_TRANSFER_DETAILS];
    mainRoutes.forEach((route) => {
      mockUseCurrentRoute.mockReturnValue({ routeName: route });
      // pageNumber 0
      mockStore = createMockStore({ pageNumber: 0 });
      const { unmount: u1 } = renderComponent({ columns: [], data: [] });
      fireEvent(screen.getByTestId('dynamic-table-flatlist'), 'onEndReached');
      u1();
      // pageNumber exceeds totalPages
      mockStore = createMockStore({ pageNumber: 10, paginationData: { totalPages: 5 } });
      const { unmount: u2 } = renderComponent({ columns: [], data: [] });
      fireEvent(screen.getByTestId('dynamic-table-flatlist'), 'onEndReached');
      u2();
    });
  });

  test('handles route specific alignment (TRACK_PARTNER_REQUEST)', () => {
    mockUseCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.TRACK_PARTNER_REQUEST });
    renderComponent({
      columns: [{ accessorKey: 'col', label: 'Header', size: 100, alignment: 'center' }],
      data: [{ col: 'Val' }],
    });
    expect(screen.getByText('Val')).toBeTruthy();
  });

  test('handles non-Tamil language and non-desktop inflection', () => {
    mockUseTranslation.mockReturnValue({ t: (k: string) => k, i18n: { language: 'en' } });
    mockUseInflection.mockReturnValue({ inflection: 'SM' });
    renderComponent({ columns: [{ accessorKey: 'c', label: 'H', size: 100 }], data: [{ c: 'V' }] });
    expect(screen.getByTestId('dynamicTable')).toBeTruthy();
  });

  test('handles Tamil language specific header style', () => {
    mockUseTranslation.mockReturnValue({ t: (k: string) => k, i18n: { language: STRINGS.TA } });
    renderComponent({ columns: [{ accessorKey: 'c', label: 'H', size: 100 }], data: [] });
    expect(screen.getByText('H')).toBeTruthy();
  });

  test('snapshot match', () => {
    expect(renderComponent({ columns: [], data: [] }).toJSON()).toMatchSnapshot();
  });
});
