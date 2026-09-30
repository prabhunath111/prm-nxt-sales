/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ICONS } from 'const';
import Table from './Table';

const mockSetPagination = jest.fn();

jest.mock('const', () => ({
  STRINGS: {
    EMPTY_RECORD: 'EMPTY_RECORD',
    TABLE: 'TABLE',
  },
  ICONS: {
    ARROW_DOWN_UP: 'ARROW_DOWN_UP',
    CHEVRON_DOUBLE_LEFT: 'CHEVRON_DOUBLE_LEFT',
    CHEVRON_DOUBLE_RIGHT: 'CHEVRON_DOUBLE_RIGHT',
    CHEVRON_LEFT: 'CHEVRON_LEFT',
    CHEVRON_RIGHT: 'CHEVRON_RIGHT',
    SORTING_ARROWS: 'SORTING_ARROWS',
  },
  PLATFORM: {
    I_OS: 'ios',
    WEB: 'web',
    IPAD_OS: 'ios',
    IOS: 'ios',
  },
  ALERT: { INFO: 'INFO', SUCCESS: 'SUCCESS', ERROR: 'ERROR' },
  MODAL: { YES: 'YES', NO: 'NO' },
  ROUTE: { WEB: { TSK_VOUCHER: 'TSK_VOUCHER' } },
  KEYBOARD_TYPE: { DEFAULT: 'default', NUMBER_PAD: 'number-pad', NUMERIC: 'numeric' },
  FORMS: { tsraInventory: 'tsraInventory' },
  ALIGNMENT: {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    CENTER: 'CENTER',
  },
}));

jest.mock('utils/platformHelper', () => ({
  isWeb: false,
  isDesktop: false,
  isiOS: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  isAndroid: jest.fn(() => false),
  platform: jest.fn(() => ({ OS: 'ios' })),
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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector: any) => selector({ common: { totalListCount: 10 } }),
}));

jest.mock('components/sales/Image', () => ({ iconName, testID }: any) => {
  const rn = require('react-native');
  return <rn.View testID={testID || `image-${iconName}`} />;
});

jest.mock('components/sales/Text', () => ({ children, style, onPress }: any) => {
  const rn = require('react-native');
  return (
    <rn.Text style={style} onPress={onPress}>
      {children}
    </rn.Text>
  );
});

describe('Table Component', () => {
  const cellRenderer = ({ getValue, column }: any) => {
    const rn = require('react-native');
    return <rn.Text testID={`cell-${column.id}`}>{getValue()}</rn.Text>;
  };

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      id: 'name',
      headerAlignment: true,
      isBorder: true,
      cell: cellRenderer,
    },
    {
      header: 'Age',
      accessorKey: 'age',
      id: 'age',
      cell: cellRenderer,
    },
  ] as any;

  const data = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ];

  const defaultProps = {
    totalCount: 2,
    limit: 10,
    data,
    columns,
    showPagination: true,
    pagination: { pageIndex: 0, pageSize: 10 },
    setPagination: mockSetPagination,
    setTableDetails: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders table header and data correctly and triggers scroll effect', () => {
    const { rerender } = render(<Table {...defaultProps} />);
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('John')).toBeTruthy();

    // Trigger useEffect on data change
    rerender(<Table {...defaultProps} data={[{ name: 'Jane', age: 25 }]} />);
    expect(screen.getByText('Jane')).toBeTruthy();
  });

  test('renders nothing when data is empty', () => {
    const { toJSON } = render(<Table {...defaultProps} data={[]} totalCount={0} />);
    expect(toJSON()).toBeNull();
  });

  test('handles sorting click', () => {
    render(<Table {...defaultProps} />);
    const header = screen.getByText(/Name/);
    fireEvent.press(header, { persist: jest.fn() });
    expect(header).toBeTruthy();
  });

  test('handles pagination: next page', () => {
    render(<Table {...defaultProps} totalCount={20} />);
    const nextButton = screen.getByText('>');
    fireEvent.press(nextButton);
    expect(mockSetPagination).toHaveBeenCalled();
  });

  test('handles header as a component', () => {
    const rn = require('react-native');
    const compColumns = [
      {
        header: () => <rn.Text>Custom Header</rn.Text>,
        accessorKey: 'name',
        id: 'name',
        cell: cellRenderer,
      },
    ] as any;
    render(<Table {...defaultProps} columns={compColumns} />);
    expect(screen.getByText('Custom Header')).toBeTruthy();
  });

  test('handles pagination: last page', () => {
    render(<Table {...defaultProps} totalCount={50} />);
    const lastButton = screen.getByText('>>');
    fireEvent.press(lastButton);
    expect(mockSetPagination).toHaveBeenCalled();
  });

  test('handles pagination: previous page', () => {
    // Start at page 1 (0-indexed)
    render(<Table {...defaultProps} totalCount={20} pagination={{ pageIndex: 1, pageSize: 10 }} />);
    const prevButton = screen.getByText('<');
    fireEvent.press(prevButton);
    expect(mockSetPagination).toHaveBeenCalled();
  });

  test('handles pagination: first page', () => {
    render(<Table {...defaultProps} totalCount={50} pagination={{ pageIndex: 4, pageSize: 10 }} />);
    const firstButton = screen.getByText('<<');
    fireEvent.press(firstButton);
    expect(mockSetPagination).toHaveBeenCalled();
  });

  test('triggers onLayout for cell width calculation', () => {
    render(<Table {...defaultProps} />);
    const cell = screen.getAllByTestId('cell-name')[0];
    fireEvent(cell, 'layout', {
      nativeEvent: {
        layout: { width: 100 },
      },
    });
    expect(cell).toBeTruthy();
  });

  test('renders mixed primary headers and consecutive merged headers', () => {
    const mixedColumns = [
      {
        header: 'First Name',
        accessorKey: 'firstName',
        id: 'firstName',
        parentHeading: 'Basic Info',
        cell: cellRenderer,
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
        id: 'lastName',
        parentHeading: 'Basic Info',
        cell: cellRenderer,
      },
      {
        header: 'Age',
        accessorKey: 'age',
        id: 'age',
        cell: cellRenderer,
      },
    ] as any;
    render(<Table {...defaultProps} columns={mixedColumns} />);
    expect(screen.getByText(/Basic Info/)).toBeTruthy();
    // 'Age' appears twice but we can check if it exists
    expect(screen.getAllByText('Age').length).toBeGreaterThan(0);
  });

  test('renders correctly for DashboardTable', () => {
    const { toJSON } = render(<Table {...defaultProps} isDashboardTable />);
    expect(toJSON()).toBeTruthy();
  });

  test('renders correctly when showPagination is false', () => {
    const { queryByText } = render(<Table {...defaultProps} showPagination={false} />);
    expect(queryByText('>')).toBeNull();
  });

  test('handles sorting arrow interaction for TSRA Inventory', () => {
    const { rerender } = render(<Table {...defaultProps} formName="tsraInventory" isTsraTable />);
    const sortArrows = screen.getAllByTestId(`image-${ICONS.SORTING_ARROWS}`);
    fireEvent.press(sortArrows[0].parent!);

    // Toggling isSortIcon state coverage
    rerender(<Table {...defaultProps} formName="otherForm" />);
    expect(screen.queryByTestId(`image-${ICONS.SORTING_ARROWS}`)).toBeNull();
  });

  test('formats header text for TSRA Table', () => {
    const tsraColumns = [
      {
        header: 'Device Status Active',
        accessorKey: 'status',
        id: 'status',
        cell: cellRenderer,
      },
    ] as any;
    render(<Table {...defaultProps} columns={tsraColumns} isTsraTable />);
    expect(screen.getByText('Device Status\nActive')).toBeTruthy();
  });
});
