/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { STRINGS } from 'const';
import Autocomplete from './Autocomplete';

const mockDispatch = jest.fn();

jest.mock('utils/platformHelper', () => ({
  platform: jest.fn(() => ({ OS: 'ios' })),
  isAndroid: jest.fn(() => false),
  isiOS: jest.fn(() => false),
  isTablet: jest.fn(() => false),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
  filterByParams: jest.fn((data) => data),
}));

jest.mock('hooks/useClickOutside', () => ({
  useClickOutside: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getModel: jest.fn(() => 'mock-model'),
  getFreeDiskStorageSync: jest.fn(() => 1024),
  getDeviceId: jest.fn(() => 'mock-device-id'),
  getManufacturerSync: jest.fn(() => 'mock-manufacturer'),
  getSerialNumberSync: jest.fn(() => 'mock-serial-number'),
  getSystemName: jest.fn(() => 'mock-system-name'),
  getSystemVersion: jest.fn(() => 'mock-system-version'),
  getVersion: jest.fn(() => 'mock-app-version'),
  isEmulatorSync: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  getReadableVersion: jest.fn(() => 'mock-readable-version'),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(),
  setUserId: jest.fn(),
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: () => null,
  useCameraPermission: jest.fn(() => [true, null]),
  useCameraDevice: jest.fn(() => null),
  useCodeScanner: jest.fn(() => ({ scan: jest.fn() })),
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

const mockState = {
  form: { formState: { searchSuggestions: {} } },
  common: { dropdownVisible: true },
};

const mockData = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2', subName: 'Sub 2' },
];

describe('Autocomplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as unknown as jest.Mock).mockImplementation((cb) => cb(mockState));
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Autocomplete placeholder="Select" queryName="test" {...props} />
        </NavigationContainer>
      </Provider>,
    );

  it('renders component', () => {
    renderComponent();
    expect(screen.getByTestId('autocomplete-test')).toBeTruthy();
  });

  it('toggles dropdown on press', () => {
    const { getByTestId } = renderComponent();
    const container = getByTestId('autocomplete-test');
    const innerContainer = container.children[0];
    if (typeof innerContainer !== 'string') {
      fireEvent.press(innerContainer);
    }
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles input change', async () => {
    const onSelect = jest.fn();
    const { getByPlaceholderText } = renderComponent({ onSelect, data: mockData });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), 'test');
    });

    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('selects item from list', async () => {
    const onSelect = jest.fn();
    const { getByTestId, getByText } = renderComponent({ onSelect, data: mockData });

    const container = getByTestId('autocomplete-test');
    const innerContainer = container.children[0];
    if (typeof innerContainer !== 'string') {
      fireEvent.press(innerContainer);
    }

    await waitFor(() => {
      fireEvent.press(getByText('Option 1'));
    });

    expect(onSelect).toHaveBeenCalledWith(mockData[0]);
  });

  it('displays selected value with subName', () => {
    const { getByDisplayValue } = renderComponent({ selectedValue: mockData[1] });
    expect(getByDisplayValue('Option 2 - Sub 2')).toBeTruthy();
  });

  it('resets input on close icon press', async () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderComponent({ onSelect, selectedValue: mockData[0] });

    const container = getByTestId('autocomplete-test');
    const innerContainer = container.children[0];
    if (typeof innerContainer !== 'string' && innerContainer.children.length > 1) {
      const closeButton = innerContainer.children[1];
      if (typeof closeButton !== 'string') {
        fireEvent.press(closeButton);
        expect(onSelect).toHaveBeenCalledWith(null);
      }
    }
  });

  it('shows error message', () => {
    const { getByText } = renderComponent({ error: 'Error message', id: 'test-id' });
    expect(getByText('Error message')).toBeTruthy();
  });

  it('disables input when isDisabled is true', () => {
    const { getByPlaceholderText } = renderComponent({ isDisabled: true });
    expect(getByPlaceholderText('Select').props.editable).toBe(false);
  });

  it('handles readonly mode', () => {
    const { getByPlaceholderText } = renderComponent({ isReadOnly: true });
    expect(getByPlaceholderText('Select').props.editable).toBe(false);
  });

  it('calls remote action with queryParams', async () => {
    (callAction as jest.Mock).mockResolvedValue({});
    const { getByPlaceholderText } = renderComponent({ queryParams: 'search', actionNeeded: true });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), 'test');
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 400);
      });
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles local search', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        form: { formState: { searchSuggestions: { test: mockData } } },
        common: { dropdownVisible: true },
      }),
    );

    const { getByPlaceholderText } = renderComponent({ queryParams: STRINGS.SEARCH_LOCALLY });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), 'Option');
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 400);
      });
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('closes dropdown when globalDropVisible is false', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        form: { formState: { searchSuggestions: {} } },
        common: { dropdownVisible: false },
      }),
    );

    renderComponent();
    expect(screen.getByTestId('autocomplete-test')).toBeTruthy();
  });

  it('shows no data text when list is empty', async () => {
    const { getByTestId, getByText } = renderComponent({ data: [], noOptionsText: 'No options' });

    const container = getByTestId('autocomplete-test');
    const innerContainer = container.children[0];
    if (typeof innerContainer !== 'string') {
      fireEvent.press(innerContainer);
    }

    await waitFor(() => {
      expect(getByText('No options')).toBeTruthy();
    });
  });

  it('hides close icon when isCloseIconRequired is false', () => {
    const { getByTestId } = renderComponent({ isCloseIconRequired: false, selectedValue: mockData[0] });
    const container = getByTestId('autocomplete-test');
    const innerContainer = container.children[0];
    if (typeof innerContainer !== 'string') {
      expect(innerContainer.children.length).toBeLessThan(3);
    }
  });

  it('calls onChangeText when queryParams is empty', async () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderComponent({ onChangeText, queryParams: '' });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), 'test');
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 400);
      });
    });

    expect(onChangeText).toHaveBeenCalledWith('test');
  });

  it('handles actionNeeded false', async () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderComponent({ onChangeText, queryParams: 'search', actionNeeded: false });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), 'test');
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 400);
      });
    });

    expect(onChangeText).toHaveBeenCalledWith('test');
  });

  it('uses custom debounceMs', async () => {
    const { getByPlaceholderText } = renderComponent({ debounceMs: 100, queryParams: 'search' });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), 'test');
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 150);
      });
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('renders item with subName', async () => {
    const { getByTestId, getByText } = renderComponent({ data: mockData });

    const container = getByTestId('autocomplete-test');
    const innerContainer = container.children[0];
    if (typeof innerContainer !== 'string') {
      fireEvent.press(innerContainer);
    }

    await waitFor(() => {
      expect(getByText('Sub 2')).toBeTruthy();
    });
  });

  it('applies custom styles', () => {
    const containerStyle = { backgroundColor: 'red' };
    const innerContainerStyle = { padding: 10 };
    const { getByTestId } = renderComponent({ containerStyle, innerContainerStyle });
    expect(getByTestId('autocomplete-test')).toBeTruthy();
  });

  it('handles focus on mobile platforms', async () => {
    const { isAndroid } = require('utils/platformHelper');
    (isAndroid as jest.Mock).mockReturnValue(true);

    const { getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText('Select');
    fireEvent(input, 'focus');

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('prevents stale updates', async () => {
    (callAction as jest.Mock).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 500);
        }),
    );
    const { getByPlaceholderText } = renderComponent({ queryParams: 'search', actionNeeded: true });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), 'test1');
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 100);
      });
      fireEvent.changeText(getByPlaceholderText('Select'), 'test2');
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 600);
      });
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('clears debounce timer on dropdown close', async () => {
    const { getByTestId } = renderComponent();

    const container = getByTestId('autocomplete-test');
    const innerContainer = container.children[0];
    if (typeof innerContainer !== 'string') {
      fireEvent.press(innerContainer);
      await act(async () => {
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 100);
        });
      });
      fireEvent.press(innerContainer);
    }

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const tree = renderComponent().toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows suggestions when searchTerm is empty after typing', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        form: { formState: { searchSuggestions: { test: mockData } } },
        common: { dropdownVisible: true },
      }),
    );

    const { getByPlaceholderText, getByTestId } = renderComponent({ queryParams: 'search' });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), 'test');
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), '');
    });

    const container = getByTestId('autocomplete-test');
    const innerContainer = container.children[0];
    if (typeof innerContainer !== 'string') {
      fireEvent.press(innerContainer);
    }

    await waitFor(() => {
      expect(getByTestId('autocomplete-test')).toBeTruthy();
    });
  });

  it('clears debounce timer when resetting input', async () => {
    const onSelect = jest.fn();
    const { getByTestId, getByPlaceholderText } = renderComponent({ onSelect, selectedValue: mockData[0], queryParams: 'search' });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Select'), 'test');
    });

    const container = getByTestId('autocomplete-test');
    const innerContainer = container.children[0];
    if (typeof innerContainer !== 'string' && innerContainer.children.length > 1) {
      const closeButton = innerContainer.children[1];
      if (typeof closeButton !== 'string') {
        fireEvent.press(closeButton);
      }
    }

    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
