/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { STRINGS } from 'const';
import * as platformHelper from 'utils/platformHelper';
import actions from 'store/sales/actions/form';
import { NativeModules } from 'react-native';
import MultiCheckboxDropdown from './MultiCheckboxDropdown';

const mockDispatch = jest.fn();
const mockDropdownOptions: any = {
  mockQuery: [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
    { id: 'all', name: STRINGS.ALL },
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
  { id: '3', name: 'Three' },
];

describe('MultiCheckboxDropdown', () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <MultiCheckboxDropdown data={defaultData} onSelect={onSelect} {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('render component MultiCheckboxDropdown and toggles visibility', () => {
    renderComponent({ placeholder: 'Select Items' });
    const container = screen.getByTestId('MultiCheckboxDropdown-test-container');
    expect(container).toBeTruthy();

    const pressable = screen.getByDisplayValue('Select Items');
    fireEvent.press(pressable);

    // Should show items
    expect(screen.getByText('One')).toBeTruthy();

    // Trigger onLayout
    const innerContainer = container.children[0] as ReactTestInstance;
    fireEvent(innerContainer, 'layout', {
      nativeEvent: { layout: { width: 300 } },
    });

    // Toggle back
    fireEvent.press(pressable);
  });

  test('calls onSelect when an item is pressed', () => {
    renderComponent();
    fireEvent.press(screen.getByDisplayValue('Select'));
    fireEvent.press(screen.getByText('One'));
    expect(onSelect).toHaveBeenCalledWith([{ id: '1', name: 'One' }]);
  });

  test('handles deselection of an item', () => {
    renderComponent({ selectedValues: [{ id: '1', name: 'One' }] });
    fireEvent.press(screen.getByDisplayValue('One'));
    fireEvent.press(screen.getByText('One'));
    expect(onSelect).toHaveBeenCalledWith([]);
  });

  test('handles "ALL" selection (select all)', () => {
    const dataWithAll = [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
      { id: 'all', name: STRINGS.ALL },
    ];
    renderComponent({ data: dataWithAll });
    fireEvent.press(screen.getByDisplayValue('Select'));
    fireEvent.press(screen.getByText(STRINGS.ALL));
    expect(onSelect).toHaveBeenCalledWith(dataWithAll);
  });

  test('handles "ALL" deselection (clear all)', () => {
    const dataWithAll = [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
      { id: 'all', name: STRINGS.ALL },
    ];
    renderComponent({ data: dataWithAll, selectedValues: dataWithAll });
    fireEvent.press(screen.getByDisplayValue('One, Two, All'));
    fireEvent.press(screen.getByText(STRINGS.ALL));
    expect(onSelect).toHaveBeenCalledWith([]);
  });

  test('auto-selects "ALL" when all individual items are selected', () => {
    const dataWithAll = [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
      { id: 'all', name: STRINGS.ALL },
    ];
    renderComponent({ data: dataWithAll, selectedValues: [{ id: '1', name: 'One' }] });
    fireEvent.press(screen.getByDisplayValue('One'));
    fireEvent.press(screen.getByText('Two'));

    const lastCall = onSelect.mock.calls[onSelect.mock.calls.length - 1][0];
    expect(lastCall.find((i: any) => i.name === STRINGS.ALL)).toBeTruthy();
  });

  test('deselects "ALL" when an item is deselected', () => {
    const dataWithAll = [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
      { id: 'all', name: STRINGS.ALL },
    ];
    renderComponent({ data: dataWithAll, selectedValues: dataWithAll });
    fireEvent.press(screen.getByDisplayValue('One, Two, All'));
    fireEvent.press(screen.getByText('One'));

    const lastCall = onSelect.mock.calls[onSelect.mock.calls.length - 1][0];
    expect(lastCall.find((i: any) => i.name === STRINGS.ALL)).toBeFalsy();
  });

  test('renders error message', () => {
    renderComponent({ error: 'Field Required' });
    expect(screen.getByText('Field Required')).toBeTruthy();
  });

  test('isDisabled prevents toggle', () => {
    renderComponent({ isDisabled: true });
    fireEvent.press(screen.getByDisplayValue('Select'));
    expect(screen.queryByText('One')).toBeNull();
  });

  test('fetches data if queryName and queryParams are provided', () => {
    // Clear initial calls
    jest.clearAllMocks();

    // Test fetch logic in first useEffect
    renderComponent({ queryName: 'newQuery', queryParams: 'params' });
    expect(actions.fetchOptionData).toHaveBeenCalled();
  });

  test('fetches data for ACCOUNT_STATUS_FILTER or BOX_TYPE_FILTER', () => {
    renderComponent({ queryName: STRINGS.ACCOUNT_STATUS_FILTER, queryParams: 'status' });
    expect(actions.fetchOptionData).toHaveBeenCalled();
  });

  test('updates selectedItems when selectedValues prop changes to non-array', () => {
    const { rerender } = renderComponent({ selectedValues: [{ id: '1', name: 'One' }] });
    expect(screen.getByDisplayValue('One')).toBeTruthy();

    rerender(
      <Provider store={mockStore}>
        <NavigationContainer>
          <MultiCheckboxDropdown data={defaultData} selectedValues={null as any} />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.queryByDisplayValue('One')).toBeNull();
  });

  test('updates optionData from dropdownOptions', () => {
    renderComponent({ queryName: 'mockQuery' });
    fireEvent.press(screen.getByDisplayValue('Select'));
    // data from mockDropdownOptions
    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.getByText('Two')).toBeTruthy();
  });

  test('renders web modal when not on mobile and handles onClose', () => {
    (platformHelper.isAndroid as jest.Mock).mockReturnValue(false);
    (platformHelper.isiOS as jest.Mock).mockReturnValue(false);

    renderComponent();
    fireEvent.press(screen.getByDisplayValue('Select'));

    // Should render Modal
    expect(screen.getByText('One')).toBeTruthy();

    // Find and trigger onClose from Modal
    fireEvent.press(screen.getByTestId('modal-close'));
    expect(screen.queryByText('One')).toBeNull();
  });

  test('snapshot tests for MultiCheckboxDropdown', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
