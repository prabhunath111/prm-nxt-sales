/**
 * This screen will be used to open webview
 *
 * @module components/WebViewScreen
 * @memberof - View Component
 */
import React, { memo, useMemo, useState } from 'react';
import { View } from 'react-native';
import useParams from 'hooks/useParams';
import { WebView as RNWebView } from 'react-native-webview';
import { Text } from 'components/sales';
import { LOG } from 'config/logger';
import { WebViewErrorEvent, WebViewHttpErrorEvent, WebViewSource } from 'react-native-webview/lib/WebViewTypes';
import { useTranslation } from 'react-i18next';
import env from 'config/env';
import styles from './WebViewScreen.styles';

// Security: Define an allowlist for trusted domains, externalized via env
const TRUSTED_DOMAINS: string[] = (env.WEBVIEW_TRUSTED_DOMAINS || 'tataplay.com').split(',');

/**
 * Validates if the given URL is safe to load in the WebView.
 * @param {string} url - The URL to validate.
 * @returns {boolean} True if the URL is safe, false otherwise.
 */
const validateUrl = (url: string | undefined): boolean => {
  if (!url) return false;

  // Security: Explicitly block the "javascript:" execution pattern to prevent XSS/RCE
  // eslint-disable-next-line no-script-url
  if (url.toLowerCase().startsWith('javascript:')) {
    LOG.error('Security Alert:', 'Blocked attempt to execute JavaScript via URL protocol.');
    return false;
  }

  // Security: Validate the domain against the allowlist
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.toLowerCase();
    return TRUSTED_DOMAINS.some((trustedDomain) => domain.endsWith(trustedDomain));
  } catch (error) {
    // If it's a relative path ("/") or an internal scheme ("tpsales://"), allow it if it doesn't have a protocol
    return !url.includes(':') || url.startsWith('tpsales://');
  }
};

/**
 * Represents a WebViewScreen component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const WebViewScreen = () => {
  const { source, ...props } = useParams();
  const [showError, setShowError] = useState(false);
  const { t } = useTranslation();

  // Handle WebView errors and log them
  const handleWebViewError = (syntheticEvent: WebViewErrorEvent) => {
    const { nativeEvent } = syntheticEvent;
    LOG.error('WebView Error:', nativeEvent.description || 'Unknown error');
    setShowError(true);
  };

  // Handle HTTP errors
  const handleHttpError = (syntheticEvent: WebViewHttpErrorEvent) => {
    const { nativeEvent } = syntheticEvent;
    LOG.error('HTTP Error:', `HTTP error code: ${nativeEvent.statusCode}`);
  };

  // Handle rendering process termination
  const handleRenderProcessGone = () => {
    LOG.error('WebView Render Process Gone:', 'The WebView rendering process was terminated.');
    setShowError(true);
  };

  const webViewSource = useMemo(() => {
    if (!source) {
      LOG.error('Error:', 'No source provided for the WebView');
      setShowError(true);
      return null;
    }

    const uri = typeof source === 'string' ? source : (source as any).uri;

    // Security check: Validate the source URI before loading
    if (uri && !validateUrl(uri)) {
      LOG.error('Security Violation:', `Blocked unauthorized URL/Protocol: ${uri}`);
      setShowError(true);
      return null;
    }

    if (typeof source === 'string') {
      return { uri: source };
    }
    if (typeof source === 'object') {
      return source;
    }

    return null;
  }, [source]);

  if (showError || !webViewSource) {
    return (
      <View style={styles.errorContainer} testID="webViewScreen">
        <Text style={styles.errorText}>{t('errors.invalidUrl')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="webViewScreen">
      <RNWebView
        source={webViewSource as WebViewSource}
        onError={handleWebViewError}
        onHttpError={handleHttpError}
        onRenderProcessGone={handleRenderProcessGone}
        startInLoadingState
        javaScriptEnabled // Enabled securely for trusted origins
        // Security: Remove '*' wildcard and implement strict origin allowlist
        originWhitelist={TRUSTED_DOMAINS.map((d) => (d.includes('.') ? `https://*.${d}` : d))}
        onShouldStartLoadWithRequest={(request) => {
          // Security: Validate every outbound navigation request
          const isSafe = validateUrl(request.url);
          if (!isSafe) {
            LOG.error('Security Violation:', `Navigation to unauthorized origin blocked: ${request.url}`);
          }
          return isSafe;
        }}
        {...props}
      />
    </View>
  );
};


export default memo(WebViewScreen);
