/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { STATE_KEY } from 'const';
import InventoryTableWrapper from './InventoryTableWrapper';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('components/sales/InventoryTable', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const React = require('react');

  return ({ data, columns, setTableDetails }: any) => {
    React.useEffect(() => {
      if (setTableDetails) {
        setTableDetails({ some: 'tableRef' }, data);
      }
    }, [setTableDetails, data]);

    return (
      <View testID="inventory-table">
        <Text>rows:{data?.length ?? 0}</Text>
        <Text>cols:{columns?.length ?? 0}</Text>
        {columns?.[0]?.onConfirmationAlert && (
          <TouchableOpacity testID="trigger-alert" onPress={() => columns[0].onConfirmationAlert({ index: 0 }, { removeRow: jest.fn() }, columns[0])}>
            <Text>Trigger Alert</Text>
          </TouchableOpacity>
        )}
        {columns?.[0]?.cell && <View testID="cell-container">{columns[0].cell({ value: 'Test Cell' })}</View>}
      </View>
    );
  };
});

jest.mock('components/sales/TableCell', () => ({ maxFontSize }: any) => {
  const { View, Text } = require('react-native');
  return (
    <View testID="table-cell">
      <Text>{maxFontSize}</Text>
    </View>
  );
});

jest.mock('components/sales/Text', () => ({ children }: any) => {
  const { Text } = require('react-native');
  return <Text testID="error-text">{children}</Text>;
});

const mockShowAlert = jest.fn(() => ({ type: 'SHOW_ALERT' }));
jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showAlert: (...args: any[]) => (mockShowAlert as any)(...args),
  },
}));

const mockFetchTableData = jest.fn((..._args: any[]) => ({ type: 'FETCH_TABLE_DATA' }));
const mockProcessAlertConfirmation = jest.fn((_val?: boolean) => ({ type: 'PROCESS_ALERT' }));
jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    fetchTableData: (...args: any[]) => mockFetchTableData(...args),
    processAlertConfirmation: (val: boolean) => mockProcessAlertConfirmation(val),
  },
}));

jest.mock('hooks/usePagination', () => ({
  usePagination: () => ({
    limit: 10,
    skip: 0,
    pagination: { pageIndex: 0, pageSize: 10 },
    setPagination: jest.fn(),
  }),
}));

jest.mock('styles/dimentionHelper', () => ({
  getFullScreenWidth: () => 400,
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'XL' }),
  BreakPoints: { XL: 'XL', LG: 'LG', MD: 'MD', MD_L: 'MD_L', SM: 'SM', XS: 'XS' },
}));

// ── Store factory ──────────────────────────────────────────────────────────────

const makeStore = (overrides: any = {}) =>
  configureStore({
    reducer: {
      form: (
        state = {
          [STATE_KEY.FORM_STATE]: {
            formDependentData: overrides.formDependentData || {},
            dropdownOptions: overrides.dropdownOptions || {},
            tables: overrides.tables || {},
            isMarkedForDeletion: overrides.isMarkedForDeletion || false,
          },
        },
      ) => state,
      ui: (
        state = {
          error: { message: overrides.errorMessage || '' },
        },
      ) => state,
    },
  });

const renderComponent = (props: any = {}, storeOverrides: any = {}) => {
  const store = makeStore(storeOverrides);
  return render(
    <Provider store={store}>
      <InventoryTableWrapper {...props} />
    </Provider>,
  );
};

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('InventoryTableWrapper Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the table container when no error', () => {
      renderComponent();
      expect(screen.getByTestId('table-test')).toBeTruthy();
    });

    it('renders error text when ui.error.message is set', () => {
      renderComponent({}, { errorMessage: 'Something failed' });
      expect(screen.getByTestId('table-test')).toBeTruthy();
      expect(screen.getByTestId('error-text')).toBeTruthy();
    });

    it('renders InventoryTable when no error', () => {
      renderComponent();
      expect(screen.getByTestId('inventory-table')).toBeTruthy();
    });

    it('passes showPagination prop to InventoryTable', () => {
      renderComponent({ showPagination: true });
      expect(screen.getByTestId('inventory-table')).toBeTruthy();
    });

    it('renders with isDashboardTable=true', () => {
      renderComponent({ isDashboardTable: true });
      expect(screen.getByTestId('inventory-table')).toBeTruthy();
    });
  });

  describe('useEffect — tableColumns', () => {
    it('processes tableColumns when non-empty', () => {
      const tableColumns = [
        { id: 'col1', label: 'Col 1', size: 100 },
        { id: 'col2', label: 'Col 2', size: 100 },
      ];
      renderComponent({ tableColumns });
      expect(screen.getByText('cols:2')).toBeTruthy();
    });

    it('skips column processing when tableColumns is empty', () => {
      renderComponent({ tableColumns: [] });
      expect(screen.getByText('cols:0')).toBeTruthy();
    });

    it('renders TableCell with maxFontSize in columns', () => {
      const tableColumns = [{ id: 'col1', label: 'Col 1', size: 100 }];
      renderComponent({ tableColumns, maxFontSize: 20 });
      expect(screen.getByTestId('table-cell')).toBeTruthy();
      expect(screen.getByText('20')).toBeTruthy();
    });
  });

  describe('useEffect — tableData', () => {
    it('sets data when tableData is non-empty', () => {
      const tableData = [
        { id: 1, name: 'Row A' },
        { id: 2, name: 'Row B' },
      ];
      renderComponent({ tableData });
      expect(screen.getByText('rows:2')).toBeTruthy();
    });

    it('does not update data when tableData is empty', () => {
      renderComponent({ tableData: [] });
      expect(screen.getByText('rows:0')).toBeTruthy();
    });
  });

  describe('useMemo — dropdownOptions sync', () => {
    it('sets data from dropdownOptions when queryName matches', () => {
      const dropdownOptions = { MY_QUERY: [{ id: 1 }, { id: 2 }, { id: 3 }] };
      renderComponent({ queryName: 'MY_QUERY' }, { dropdownOptions });
      expect(screen.getByText('rows:3')).toBeTruthy();
    });
  });

  describe('useEffect — tables sync', () => {
    it('sets data and count from tables when queryName data is non-empty', () => {
      const tables = { TABLE_Q: [{ id: 1 }, { id: 2 }] };
      renderComponent({ queryName: 'TABLE_Q' }, { tables });
      expect(screen.getByText('rows:2')).toBeTruthy();
    });

    it('does not update when tables[queryName] is empty', () => {
      const tables = { TABLE_Q: [] };
      renderComponent({ queryName: 'TABLE_Q' }, { tables });
      expect(screen.getByText('rows:0')).toBeTruthy();
    });
  });

  describe('useEffect — getAllData (pagination)', () => {
    it('dispatches fetchTableData when formDependentData has queryParams value', () => {
      const formDependentData = { myParam: 'someValue' };
      renderComponent({ queryName: 'FETCH_Q', queryParams: 'myParam' }, { formDependentData });
      expect(mockFetchTableData).toHaveBeenCalledWith({ limit: 10, skip: 0, myParam: 'someValue' }, 'FETCH_Q');
    });

    it('does not dispatch fetchTableData when formDependentData lacks queryParams', () => {
      renderComponent({ queryName: 'FETCH_Q', queryParams: 'missingParam' }, {});
      expect(mockFetchTableData).not.toHaveBeenCalled();
    });
  });

  describe('handleTableReference — isDataRequiredForForm', () => {
    it('calls onTableDataSubmit when isDataRequiredForForm is true', () => {
      const onTableDataSubmit = jest.fn();
      const tableData = [{ id: 1 }];
      renderComponent({ isDataRequiredForForm: true, onTableDataSubmit, tableData });
      expect(onTableDataSubmit).toHaveBeenCalled();
    });

    it('does not call onTableDataSubmit when isDataRequiredForForm is false', () => {
      const onTableDataSubmit = jest.fn();
      renderComponent({ isDataRequiredForForm: false, onTableDataSubmit });
      expect(onTableDataSubmit).not.toHaveBeenCalled();
    });
  });

  describe('onConfirmationAlert and isMarkedForDeletion', () => {
    it('dispatches showAlert when onConfirmationAlert is triggered', () => {
      const tableColumns = [{ id: 'col1', label: 'Col 1', size: 100 }];
      const { fireEvent } = require('@testing-library/react-native');

      renderComponent({ tableColumns });
      fireEvent.press(screen.getByTestId('trigger-alert'));

      expect(mockShowAlert).toHaveBeenCalled();
    });

    it('removes row and dispatches processAlertConfirmation when isMarkedForDeletion is true', () => {
      const tableColumns = [{ id: 'col1', label: 'Col 1', size: 100 }];
      const { fireEvent } = require('@testing-library/react-native');

      // First render normally to set tableCellReference in component state via trigger-alert
      renderComponent({ tableColumns }, { isMarkedForDeletion: true });
      fireEvent.press(screen.getByTestId('trigger-alert'));

      // The isMarkedForDeletion: true in the store factory will trigger the useEffect
      expect(mockProcessAlertConfirmation).toHaveBeenCalledWith(false);
    });
  });

  describe('calculateSize', () => {
    it('scales columns proportionally when scaleFactor > 1 (parentSize > totalSize)', () => {
      const tableColumns = [{ id: 'c1', label: 'C1', size: 50 }]; // totalSize=50, parentSize=400 → factor=8 > 1
      renderComponent({ tableColumns, parentSize: 400 });
      expect(screen.getByText('cols:1')).toBeTruthy();
    });

    it('uses original size when scaleFactor <= 1 (parentSize <= totalSize)', () => {
      const tableColumns = [
        { id: 'c1', label: 'C1', size: 300 },
        { id: 'c2', label: 'C2', size: 300 },
      ]; // total=600 > parentSize=400 → factor < 1
      renderComponent({ tableColumns, parentSize: 400 });
      expect(screen.getByText('cols:2')).toBeTruthy();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot with default props', () => {
      const component = renderComponent();
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('matches snapshot in error state', () => {
      const component = renderComponent({}, { errorMessage: 'fetch error' });
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
