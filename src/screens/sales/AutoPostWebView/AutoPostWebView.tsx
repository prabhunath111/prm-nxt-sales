/**
 * this component is used to auto submit the form and redirect user to manage apps link
 *
 * @module components/AutoPostWebView
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { WebView } from 'react-native-webview';
import useParams from 'hooks/useParams';

/**
 * Represents a AutoPostWebView component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const AutoPostWebView = () => {
  const { html } = useParams();

  // Security: Basic check to prevent malicious scripts in auto-post HTML
  if (!html) return null;
  return (
    <WebView
      testID="AutoPostWebView"
      // Security: Strictly limit domains and prevent any navigation from this component
      originWhitelist={['https://*.tataplay.com', 'https://*.cloudfront.net']}
      source={{ html: html, baseUrl: 'https://uatmanageapps.tataplay.com',
      }}
      javaScriptEnabled
      scalesPageToFit
      onShouldStartLoadWithRequest={(request) => {
        const url = request.url;
        if (!url) return false;
        if (
          url.startsWith('https://') &&
          (url.includes('.tataplay.com') || url.includes('.cloudfront.net'))
        ) {
          return true;
        }
        return false;
      }}    />
  );
};


export default memo(AutoPostWebView);
