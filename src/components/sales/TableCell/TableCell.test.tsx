/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { STRINGS, ICONS } from 'const';
import TableCell from './TableCell';

const mockUpdateData = jest.fn();
const mockOnTableDataSubmit = jest.fn();
const mockUpdateUserInput = jest.fn();

jest.mock('const', () => ({
  STRINGS: {
    TEXT: 'TEXT',
    ICON_FORMATTER: 'ICON_FORMATTER',
    CENTERED_TEXT: 'CENTERED_TEXT',
    LEFT_ALIGNED_TEXT: 'LEFT_ALIGNED_TEXT',
    STATUS: 'STATUS',
  },
  ICONS: {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
  },
  PLATFORM: {
    I_OS: 'ios',
    WEB: 'web',
    IPAD_OS: 'ios',
    IOS: 'ios',
  },
  ALERT: {
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
  },
  MODAL: {
    YES: 'YES',
    NO: 'NO',
  },
  ROUTE: {
    WEB: {
      TSK_VOUCHER: 'TSK_VOUCHER',
    },
  },
  KEYBOARD_TYPE: {
    DEFAULT: 'default',
    NUMBER_PAD: 'number-pad',
    NUMERIC: 'numeric',
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

const mockUseInflection = jest.fn(() => ({ inflection: 'md' }));
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => mockUseInflection(),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector: any) => selector({}),
}));

jest.mock('utils/tableHelper', () => ({
  updateUserInput: (val: any) => mockUpdateUserInput(val),
}));

jest.mock('components/sales/TextInput', () => (props: any) => {
  const rn = require('react-native');
  return <rn.TextInput testID={`input-${props.id}`} value={props.value} onChangeText={(text: string) => props.onChange({ nativeEvent: { text } })} onBlur={props.onBlur} />;
});

jest.mock('components/sales/Text', () => ({ children, style }: any) => {
  const rn = require('react-native');
  return <rn.Text style={style}>{children}</rn.Text>;
});

jest.mock('components/sales/Image', () => ({ iconName }: any) => {
  const rn = require('react-native');
  return <rn.View testID={`image-${iconName}`} />;
});

describe('TableCell Component', () => {
  const defaultProps = {
    getValue: () => 'Initial Value',
    row: { index: 0 },
    column: {
      columnDef: {
        accessorKey: 'testKey',
        type: STRINGS.TEXT,
        isRowFormatter: true,
      },
    },
    table: {
      options: {
        meta: {
          updateData: mockUpdateData,
        },
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TEXT type correctly with initial value', () => {
    render(<TableCell {...defaultProps} />);
    expect(screen.getByDisplayValue('Initial Value')).toBeTruthy();
  });

  test('updates value on input change', () => {
    mockUpdateUserInput.mockImplementation((val) => val);
    render(<TableCell {...defaultProps} />);

    const input = screen.getByTestId('input-testKey');
    fireEvent.changeText(input, 'New Value');

    expect(mockUpdateUserInput).toHaveBeenCalledWith('New Value');
    expect(screen.getByDisplayValue('New Value')).toBeTruthy();
  });

  test('calls updateData and onTableDataSubmit on blur', () => {
    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          ...defaultProps.column.columnDef,
          onTableDataSubmit: mockOnTableDataSubmit,
        },
      },
    };

    render(<TableCell {...props} />);
    const input = screen.getByTestId('input-testKey');
    fireEvent(input, 'blur');

    expect(mockUpdateData).toHaveBeenCalledWith(0, 'testKey', 'Initial Value', true, expect.any(Function));

    // Trigger the callback passed to updateData
    const callback = mockUpdateData.mock.calls[0][4];
    callback([]);
    expect(mockOnTableDataSubmit).toHaveBeenCalled();
  });

  test('renders icons when isAddRemoveRequired is true', () => {
    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          ...defaultProps.column.columnDef,
          isAddRemoveRequired: true,
        },
      },
    };

    render(<TableCell {...props} />);
    expect(screen.getByTestId(`image-${ICONS.ADD}`)).toBeTruthy();
    expect(screen.getByTestId(`image-${ICONS.REMOVE}`)).toBeTruthy();
  });

  test('handles icon press for ADD/REMOVE', () => {
    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          ...defaultProps.column.columnDef,
          isAddRemoveRequired: true,
        },
      },
    };

    render(<TableCell {...props} />);
    const addIcon = screen.getByTestId(`image-${ICONS.ADD}`).parent!;
    fireEvent.press(addIcon);
    expect(mockUpdateUserInput).toHaveBeenCalled();
  });

  test('renders ICON_FORMATTER type correctly', () => {
    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          type: STRINGS.ICON_FORMATTER,
          icon: 'test-icon',
          isRowFormatter: true,
        },
      },
    };

    render(<TableCell {...props} />);
    expect(screen.getByTestId('image-test-icon')).toBeTruthy();
  });

  test('renders CENTERED_TEXT type correctly', () => {
    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          type: STRINGS.CENTERED_TEXT,
          isRowFormatter: true,
        },
      },
    };

    render(<TableCell {...props} />);
    expect(screen.getByText('Initial Value')).toBeTruthy();
  });

  test('renders LEFT_ALIGNED_TEXT type correctly', () => {
    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          type: STRINGS.LEFT_ALIGNED_TEXT,
          isRowFormatter: true,
        },
      },
    };

    render(<TableCell {...props} />);
    expect(screen.getByText('Initial Value')).toBeTruthy();
  });

  test('renders STATUS type correctly', () => {
    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          type: STRINGS.STATUS,
          isRowFormatter: true,
        },
      },
    };

    render(<TableCell {...props} />);
    expect(screen.getByText('Initial Value')).toBeTruthy();
  });

  test('returns default text if not isRowFormatter', () => {
    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          isRowFormatter: false,
        },
      },
    };

    render(<TableCell {...props} />);
    expect(screen.getByText('Initial Value')).toBeTruthy();
  });

  test('returns null for unknown type in row formatter', () => {
    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          type: 'UNKNOWN',
          isRowFormatter: true,
        },
      },
    };

    const { toJSON } = render(<TableCell {...props} />);
    expect(toJSON()).toBeNull();
  });

  test('syncs value with initialValue from props', () => {
    const { rerender } = render(<TableCell {...defaultProps} />);
    expect(screen.getByDisplayValue('Initial Value')).toBeTruthy();

    const newProps = {
      ...defaultProps,
      getValue: () => 'Updated Value',
    };
    rerender(<TableCell {...newProps} />);
    expect(screen.getByDisplayValue('Updated Value')).toBeTruthy();
  });

  test('handles small inflection for icon size', () => {
    mockUseInflection.mockReturnValue({ inflection: 'xs' });

    const props = {
      ...defaultProps,
      column: {
        columnDef: {
          type: STRINGS.ICON_FORMATTER,
          icon: 'test-icon',
          isRowFormatter: true,
        },
      },
    };

    render(<TableCell {...props} />);
    expect(screen.getByTestId('image-test-icon')).toBeTruthy();
  });
});
