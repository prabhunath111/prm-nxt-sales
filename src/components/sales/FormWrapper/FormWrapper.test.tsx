import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { FORMS, STATE_KEY } from 'const';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FormWrapper from './FormWrapper';

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

jest.mock('react-native-vision-camera', () => ({
  Camera: () => null,
  useCameraPermission: jest.fn(() => [true, null]),
  useCameraDevice: jest.fn(() => null),
  useCodeScanner: jest.fn(() => ({ scan: jest.fn() })),
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

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('components/sales/FormBuilder', () => () => null);

const mockStore = configureStore({
  reducer: {
    redirection: () => ({ data: {} }),
    form: () => ({ [STATE_KEY.FORM_STATE]: { formDependentDefault: {}, formData: {}, subIdList: [] } }),
    ui: () => ({ isLoading: false }),
    user: () => ({ isRedirection: false, info: {} }),
  },
});

describe('Test for the component FormWrapper', () => {
  test('render component FormWrapper', async () => {
    render(
      <Provider store={mockStore}>
        <FormWrapper onSubmit={() => {}} formName={FORMS.customerRecharge as FormNameKeys} />
      </Provider>,
    );

    expect(await screen.findByTestId('form-wrapper')).toBeTruthy();
  });

  test('snapshot tests for FormWrapper', () => {
    const component = render(
      <Provider store={mockStore}>
        <FormWrapper onSubmit={() => {}} formName={FORMS.customerRecharge as FormNameKeys} />
      </Provider>,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});
