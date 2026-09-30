/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render } from '@testing-library/react-native';
import useParams from 'hooks/useParams';
import AutoPostWebView from './AutoPostWebView';

// Mocking dependencies
jest.mock('hooks/useParams', () => jest.fn());

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return {
    WebView: (props: any) => <View {...props} testID="mock-webview" />,
  };
});

describe('AutoPostWebView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render safe html content in WebView', () => {
    (useParams as jest.Mock).mockReturnValue({ html: '<div>Safe Content</div>' });
    const { getByTestId } = render(<AutoPostWebView />);
    const webView = getByTestId('mock-webview');
    expect(webView.props.source.html).toBe('<div>Safe Content</div>');
  });

  test('should return null when html contains unsafe script tags', () => {
    (useParams as jest.Mock).mockReturnValue({ html: '<script>alert("unsafe")</script>' });
    const { queryByTestId } = render(<AutoPostWebView />);
    expect(queryByTestId('mock-webview')).toBeNull();
  });

  test('should render empty string when html is null or undefined', () => {
    (useParams as jest.Mock).mockReturnValue({ html: undefined });
    const { getByTestId } = render(<AutoPostWebView />);
    const webView = getByTestId('mock-webview');
    expect(webView.props.source.html).toBe('');
  });

  test('onShouldStartLoadWithRequest should always return false', () => {
    (useParams as jest.Mock).mockReturnValue({ html: '<div>Content</div>' });
    const { getByTestId } = render(<AutoPostWebView />);
    const webView = getByTestId('mock-webview');
    const result = webView.props.onShouldStartLoadWithRequest();
    expect(result).toBe(false);
  });
});
