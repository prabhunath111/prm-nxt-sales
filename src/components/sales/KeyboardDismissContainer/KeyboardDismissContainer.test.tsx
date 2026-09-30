import React from 'react';
import { View, Keyboard, Platform } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import KeyboardDismissContainer from './KeyboardDismissContainer';

// Mock platformHelper with a dynamic getter
let mockIsWeb = false;
jest.mock('utils/platformHelper', () => ({
  get isWeb() {
    return mockIsWeb;
  },
}));

describe('Test for the component KeyboardDismissContainer', () => {
  let keyboardDismissSpy: jest.SpyInstance;

  beforeEach(() => {
    keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});
  });

  afterEach(() => {
    keyboardDismissSpy.mockRestore();
    jest.clearAllMocks();
  });

  test('render component KeyboardDismissContainer on Mobile (iOS)', () => {
    mockIsWeb = false;
    Platform.OS = 'ios';

    render(
      <KeyboardDismissContainer>
        <View testID="child-view" />
      </KeyboardDismissContainer>,
    );
    expect(screen.getByTestId('keyboard-test-container')).toBeTruthy();
    expect(screen.getByTestId('child-view')).toBeTruthy();

    fireEvent.press(screen.getByTestId('child-view'));
    expect(keyboardDismissSpy).toHaveBeenCalled();
  });

  test('render component KeyboardDismissContainer on Mobile (Android)', () => {
    mockIsWeb = false;
    Platform.OS = 'android';

    render(
      <KeyboardDismissContainer>
        <View />
      </KeyboardDismissContainer>,
    );
    expect(screen.getByTestId('keyboard-test-container')).toBeTruthy();
  });

  test('render component KeyboardDismissContainer on Web', () => {
    mockIsWeb = true;

    const { queryByTestId } = render(
      <KeyboardDismissContainer>
        <View testID="child-view" />
      </KeyboardDismissContainer>,
    );
    expect(queryByTestId('keyboard-test-container')).toBeNull();
    expect(screen.getByTestId('child-view')).toBeTruthy();
  });

  test('snapshot tests for KeyboardDismissContainer', () => {
    mockIsWeb = false;
    const component = render(
      <View>
        <KeyboardDismissContainer>
          <View />
        </KeyboardDismissContainer>
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
