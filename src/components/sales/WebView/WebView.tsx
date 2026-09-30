/**
 * Common web view for showing  PTF, Videos URLs etc.
 *
 * @module components/WebView
 * @memberof CommonComponent
 */

import React from 'react';
import { View } from 'react-native';
import Text from 'components/sales/Text';
import { WebView as RNWebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import styles from './WebView.styles';

/**
 * Component type definitions
 *
 * @typedef {object} WebViewProps
 * @property {string} [uri] - This is the URL of the video,pdf or any link in webview
 */

export type WebViewProps = {
  uri?: string;
};

/**
 * Represents a WebView component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.uri] - This is the URL of the video,pdf or any link in webview
 * @returns {JSX.Element} The rendered WebView component
 */

const WebView = ({ uri }: WebViewProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.webViewContainer} testID="WebView-test">
      {uri ? (
        <RNWebView source={{ uri }} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.errorText}>{t('strings.invalidUrl')}</Text>
        </View>
      )}
    </View>
  );
};

export default WebView;
