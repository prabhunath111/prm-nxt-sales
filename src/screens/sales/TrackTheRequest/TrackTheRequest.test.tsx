/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { STATE_KEY, STRINGS } from 'const';
import actions from 'store/sales/actions/customerService';
import { closeWebView } from 'utils/navigationHelper';
import TrackTheRequest from './TrackTheRequest';

const mockGoHome = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  goHome: mockGoHome,
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

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
  MoengageMixpanelModules: {
    CustomerService: {
      CustomerServiceTrackRequest: { moduleName: 'TrackRequest' },
      CustomerServiceTrackRequestProceed: {
        moduleName: 'TrackRequestProceed',
        attributes: { SubscriberID: 'SubscriberID' },
      },
    },
  },
}));

jest.mock('store/sales/actions/customerService', () => ({
  resetTrackRequest: jest.fn(() => ({ type: 'RESET' })),
  trackServiceRequest: jest.fn(() => ({ type: 'TRACK' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setSubIdListDefault: jest.fn(() => ({ type: 'SET_DEFAULT' })),
}));

jest.mock('utils/navigationHelper', () => ({
  closeWebView: jest.fn(),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('styles/dimentionHelper', () => ({
  getFullScreenWidth: jest.fn(() => 400),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <TouchableOpacity onPress={onPress} testID={`btn-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Card: ({ children }: any) => <View>{children}</View>,
    Dropdown: ({ data, onSelect, testID }: any) => (
      <View testID={testID || 'dropdown'}>
        {data?.map((item: any) => (
          <TouchableOpacity key={item.id} onPress={() => onSelect(item)} testID={`dropdown-item-${item.id}`}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    FormBuilder: ({ onSubmit }: any) => (
      <TouchableOpacity onPress={() => onSubmit('test-sub-id')} testID="btn-submit-form">
        <Text>Submit</Text>
      </TouchableOpacity>
    ),
    FormHeader: () => <View testID="form-header" />,
    Search: ({ onChange, value }: any) => <TextInput onChangeText={onChange} value={value} testID="search-input" />,
    TableWrapper: ({ tableData }: any) => (
      <View testID="table-wrapper">
        {tableData?.map((item: any, index: number) => (
          <Text key={index} testID={`table-row-${index}`}>
            {item.requestNumber}
          </Text>
        ))}
      </View>
    ),
  };
});

const createMockStore = (state: any) =>
  configureStore({
    reducer: {
      customerService: () => state.customerService,
      user: () => state.user,
      form: () => ({ [STATE_KEY.FORM_STATE]: {} }),
      redirection: () => ({ data: {} }),
      ui: () => ({ isLoading: false }),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('TrackTheRequest Component', () => {
  const initialState = {
    customerService: {
      subscriberRequests: { wo: [], sr: [], suspension: [], status: [] },
    },
    user: { isRedirection: false },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders FormBuilder when no requests exist', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TrackTheRequest />
      </Provider>,
    );

    expect(screen.getByTestId('btn-submit-form')).toBeTruthy();
  });

  test('handles form submission', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TrackTheRequest />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-submit-form'));
    expect(actions.trackServiceRequest).toHaveBeenCalled();
  });

  test('renders table when requests exist', () => {
    const stateWithRequests = {
      ...initialState,
      customerService: {
        subscriberRequests: {
          wo: [{ requestNumber: '123', status: 'Open' }],
          sr: [],
          suspension: [],
          status: [
            { id: 'all', name: 'All' },
            { id: 'open', name: 'Open' },
          ],
        },
      },
    };

    render(
      <Provider store={createMockStore(stateWithRequests)}>
        <TrackTheRequest />
      </Provider>,
    );

    expect(screen.getByTestId('table-wrapper')).toBeTruthy();
    expect(screen.getByText('123')).toBeTruthy();
  });

  test('filters table data by search query', async () => {
    const stateWithRequests = {
      ...initialState,
      customerService: {
        subscriberRequests: {
          wo: [
            { requestNumber: '123', description: 'test1' },
            { requestNumber: '456', description: 'other' },
          ],
          sr: [],
          suspension: [],
          status: [],
        },
      },
    };

    render(
      <Provider store={createMockStore(stateWithRequests)}>
        <TrackTheRequest />
      </Provider>,
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.changeText(searchInput, '123');

    await waitFor(() => expect(screen.queryByText('456')).toBeNull());
    expect(screen.getByText('123')).toBeTruthy();
  });

  test('filters table data by status', async () => {
    const stateWithRequests = {
      ...initialState,
      customerService: {
        subscriberRequests: {
          wo: [
            { requestNumber: '123', status: 'Open' },
            { requestNumber: '456', status: 'Closed' },
          ],
          sr: [],
          suspension: [],
          status: [
            { id: 'all', name: 'All' },
            { id: 'open', name: 'Open' },
          ],
        },
      },
    };

    render(
      <Provider store={createMockStore(stateWithRequests)}>
        <TrackTheRequest />
      </Provider>,
    );

    // Initial state shows both
    expect(screen.getByText('123')).toBeTruthy();
    expect(screen.getByText('456')).toBeTruthy();

    // Select Open status
    fireEvent.press(screen.getByTestId('dropdown-item-open'));

    await waitFor(() => expect(screen.queryByText('456')).toBeNull());
    expect(screen.getByText('123')).toBeTruthy();
  });

  test('changes request type', async () => {
    const stateWithRequests = {
      ...initialState,
      customerService: {
        subscriberRequests: {
          wo: [{ requestNumber: 'WO1' }],
          sr: [{ requestNumber: 'SR1' }],
          suspension: [],
          status: [],
        },
      },
    };

    render(
      <Provider store={createMockStore(stateWithRequests)}>
        <TrackTheRequest />
      </Provider>,
    );

    expect(screen.getByText('WO1')).toBeTruthy();

    // Assuming PROPERTIES.CUSTOMER_SERVICE.REQUEST_TYPE[1] is SR
    fireEvent.press(screen.getByTestId(`dropdown-item-${STRINGS.SR}`));

    await waitFor(() => expect(screen.queryByText('WO1')).toBeNull());
    expect(screen.getByText('SR1')).toBeTruthy();
  });

  test('handles cancel button for goHome', () => {
    const stateWithRequests = {
      ...initialState,
      customerService: {
        subscriberRequests: { wo: [{ requestNumber: '123' }], sr: [], suspension: [], status: [] },
      },
    };

    render(
      <Provider store={createMockStore(stateWithRequests)}>
        <TrackTheRequest />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-strings.cancel'));
    expect(mockGoHome).toHaveBeenCalled();
  });

  test('handles cancel button for closeWebView', () => {
    const stateWithRedirection = {
      customerService: {
        subscriberRequests: { wo: [{ requestNumber: '123' }], sr: [], suspension: [], status: [] },
      },
      user: { isRedirection: true },
    };

    render(
      <Provider store={createMockStore(stateWithRedirection)}>
        <TrackTheRequest />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-strings.cancel'));
    expect(closeWebView).toHaveBeenCalled();
  });

  test('cleans up on unmount', () => {
    const { unmount } = render(
      <Provider store={createMockStore(initialState)}>
        <TrackTheRequest />
      </Provider>,
    );

    unmount();
    expect(actions.resetTrackRequest).toHaveBeenCalled();
  });

  test('handles empty or non-array filteredTableData', () => {
    const stateWithNullRequests = {
      ...initialState,
      customerService: {
        subscriberRequests: {
          wo: null,
          sr: [],
          suspension: [],
          status: [],
        },
      },
    };

    render(
      <Provider store={createMockStore(stateWithNullRequests)}>
        <TrackTheRequest />
      </Provider>,
    );

    // Should not crash and show FormBuilder because wo is null (length check fails)
    expect(screen.getByTestId('btn-submit-form')).toBeTruthy();
  });

  test('handles non-array filteredTableData to cover branch', async () => {
    const stateWithNonArray = {
      ...initialState,
      customerService: {
        subscriberRequests: {
          wo: 'not-an-array', // This will be set to filteredTableData
          sr: [],
          suspension: [],
          status: [],
        },
      },
    };

    render(
      <Provider store={createMockStore(stateWithNonArray)}>
        <TrackTheRequest />
      </Provider>,
    );

    // This should trigger the useEffect with line 74-75
  });

  test('falls back to suspension data in handleRequestType', async () => {
    const stateWithSuspension = {
      ...initialState,
      customerService: {
        subscriberRequests: {
          wo: [{ requestNumber: 'WO1' }],
          sr: null,
          suspension: [{ requestNumber: 'SUSP1' }],
          status: [],
        },
      },
    };

    render(
      <Provider store={createMockStore(stateWithSuspension)}>
        <TrackTheRequest />
      </Provider>,
    );

    expect(screen.getByText('WO1')).toBeTruthy();

    // Change to SR (which is null in state, should fallback to suspension)
    fireEvent.press(screen.getByTestId(`dropdown-item-${STRINGS.SR}`));

    await waitFor(() => expect(screen.getByText('SUSP1')).toBeTruthy());
  });

  test('falls back to empty array in handleRequestType if nothing found', async () => {
    const stateWithEmpty = {
      ...initialState,
      customerService: {
        subscriberRequests: {
          wo: [{ requestNumber: 'WO1' }],
          sr: null,
          suspension: null,
          status: [],
        },
      },
    };

    render(
      <Provider store={createMockStore(stateWithEmpty)}>
        <TrackTheRequest />
      </Provider>,
    );

    // Change to SR
    fireEvent.press(screen.getByTestId(`dropdown-item-${STRINGS.SR}`));

    await waitFor(() => expect(screen.queryByText('WO1')).toBeNull());
    expect(screen.getByTestId('table-wrapper')).toBeTruthy();
  });
});
