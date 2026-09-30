/**
 * A common component that wraps the content in TouchableWithoutFeedback to handle the keyboard dismiss functionality
 * for mobile platforms and renders a simple view for web platforms.
 *
 * @module components/KeyboardDismissContainer
 * @memberof CommonComponent
 */

import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Sizing } from 'styles';
import { isWeb } from 'utils/platformHelper';

/**
 * Props for the KeyboardDismissContainer component.
 *
 * @typedef {object} KeyboardDismissContainerProps
 * @property {React.ReactNode} children - The content to be wrapped by the component.
 * @property {ViewStyle} [style] - The style object for the outer View container.
 */

export type KeyboardDismissContainerProps = {
  children: React.ReactNode;
  style?: any;
};

/**
 * Represents a KeyboardDismissContainer component.
 *
 * @param {KeyboardDismissContainerProps} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered KeyboardDismissContainer component.
 *
 * @example
 * // Example usage of KeyboardDismissContainer in a screen
 * <KeyboardDismissContainer style={{ flex: 1, padding: 10 }}>
 *   <TextInput placeholder="Enter something" />
 * </KeyboardDismissContainer>
 */

const KeyboardDismissContainer = ({ children, style }: KeyboardDismissContainerProps) => {
  // If the platform is web, just return the content without `TouchableWithoutFeedback`
  if (isWeb) {
    return <View style={style}>{children}</View>;
  }

  // For mobile platforms, wrap content in `TouchableWithoutFeedback`
  return (
    <KeyboardAvoidingView
      testID="keyboard-test-container"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? Sizing.layout.x0 : -Sizing.layout.x50}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={style}>{children}</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KeyboardDismissContainer;
