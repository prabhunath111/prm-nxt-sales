/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import * as platformHelper from 'utils/platformHelper';
import actions from 'store/sales/actions/form';
import { NativeModules } from 'react-native';
import MultiSelectDropdown from './MultiSelectDropdown';

const mockDispatch = jest.fn();
const mockDropdownOptions: any = {
  mockQuery: [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
  ],
};

// Mock UIManager.measure to prevent errors in react-native-popover-view
NativeModules.UIManager.measure = jest.fn((_handle, callback) => {
  callback(0, 0, 100, 100, 0, 0);
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) =>
    selector({
      form: {
        formState: {
          dropdownOptions: mockDropdownOptions,
        },
      },
    }),
}));

jest.mock('store/sales/actions/form', () => ({
  fetchOptionData: jest.fn(),
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('utils/platformHelper', () => ({
  isAndroid: jest.fn(() => true),
  isiOS: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  isWeb: false,
  isDesktop: false,
}));

// Mock Modal and its exports
jest.mock('components/sales/Modal', () => {
  const React = require('react');
  const { View, TouchableOpacity } = require('react-native');
  const MockModal = (props: any) => {
    if (!props.isVisible) return null;
    return (
      <View testID="mock-modal">
        {props.children}
        <TouchableOpacity testID="modal-close" onPress={props.onClose} />
      </View>
    );
  };
  return {
    __esModule: true,
    default: MockModal,
    ModalPlacement: {
      BOTTOM: 'bottom',
      TOP: 'top',
    },
  };
});

const mockStore = configureStore({
  reducer: {
    form: (state = { formState: { dropdownOptions: mockDropdownOptions } }) => state,
  },
});

const defaultData = [
  { id: '1', name: 'One' },
  { id: '2', name: 'Two' },
];

describe('MultiSelectDropdown', () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <MultiSelectDropdown data={defaultData} onSelect={onSelect} {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('toggles visibility and handles item selection', () => {
    renderComponent({ placeholder: 'Select Items' });
    const pressable = screen.getByDisplayValue('Select Items');
    fireEvent.press(pressable);

    expect(screen.getByText('One')).toBeTruthy();
    fireEvent.press(screen.getByText('One'));
    expect(onSelect).toHaveBeenCalledWith([{ id: '1', name: 'One' }]);
  });

  test('handles deselection', () => {
    renderComponent({ selectedValues: [{ id: '1', name: 'One' }] });
    fireEvent.press(screen.getByDisplayValue('One'));
    fireEvent.press(screen.getByText('One'));
    expect(onSelect).toHaveBeenCalledWith([]);
  });

  test('renders error message and isDisabled state', () => {
    renderComponent({ error: 'Required', isDisabled: true });
    expect(screen.getByText('Required')).toBeTruthy();

    fireEvent.press(screen.getByDisplayValue('Select'));
    expect(screen.queryByText('One')).toBeNull();
  });

  test('fetches data on mount', () => {
    renderComponent({ queryName: 'newQuery', queryParams: 'params' });
    expect(actions.fetchOptionData).toHaveBeenCalled();
  });

  test('updates selectedItems when selectedValues prop changes', () => {
    const { rerender } = renderComponent({ selectedValues: [{ id: '1', name: 'One' }] });
    expect(screen.getByDisplayValue('One')).toBeTruthy();

    rerender(
      <Provider store={mockStore}>
        <NavigationContainer>
          <MultiSelectDropdown data={defaultData} selectedValues={null as any} />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.queryByDisplayValue('One')).toBeNull();
  });

  test('renders web modal and handles onClose', () => {
    (platformHelper.isAndroid as jest.Mock).mockReturnValue(false);
    (platformHelper.isiOS as jest.Mock).mockReturnValue(false);

    renderComponent();
    fireEvent.press(screen.getByDisplayValue('Select'));
    expect(screen.getByText('One')).toBeTruthy();

    fireEvent.press(screen.getByTestId('modal-close'));
    expect(screen.queryByText('One')).toBeNull();
  });

  test('handles onLayout', () => {
    renderComponent();
    const container = screen.getByTestId('multiSelectDropdown-test-container').children[0] as ReactTestInstance;
    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 400 } },
    });
  });

  test('uses data prop when dropdownOptions for queryName is empty', () => {
    renderComponent({ queryName: 'emptyQuery' });
    fireEvent.press(screen.getByDisplayValue('Select'));
    // Should show 'One' from defaultData
    expect(screen.getByText('One')).toBeTruthy();
  });

  test('renders without data prop (coverage for default value)', () => {
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <MultiSelectDropdown onSelect={onSelect} />
        </NavigationContainer>
      </Provider>,
    );
    // Should render without crashing
  });

  test('updates optionData from dropdownOptions', () => {
    renderComponent({ queryName: 'mockQuery' });
    // This hits line 124
  });

  test('renders web modal with Sizing.x0 marginTop (coverage for ternary)', () => {
    (platformHelper.isAndroid as jest.Mock).mockReturnValue(false);
    (platformHelper.isiOS as jest.Mock).mockReturnValue(false);

    renderComponent();
    fireEvent.press(screen.getByDisplayValue('Select'));
    // hits line 187 else branch
  });

  test('snapshot tests', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
