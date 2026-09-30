/**
 * this screen will be a webview for the mobile to redirect
 *
 * @module components/RedirectToManagePack
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { getRedirectionLangPayload } from 'utils/languageHelper';

// import styles from "./RedirectToManagePack.styles";

/**
 * Represents a RedirectToManagePack component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const RedirectToManagePack = () => {
  const { packSelectorAccountInfo } = useSelector((state: RootState) => state.modifyPack);
  const { checksum, subscriberId, subscriberNameNT, source, agentUserId, redirectionUrl } = packSelectorAccountInfo;
  const { i18n } = useTranslation();

  const payload = `${source}|${subscriberId}|${subscriberNameNT}|${getRedirectionLangPayload(i18n.language)}|${agentUserId}|NA|NA|${checksum}`;

  const formHtml = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
      <style>
        body { opacity: 0; }
      </style>
    </head>
    <body onload="document.forms[0].submit()">
      <form method="POST" action="${redirectionUrl}">
        <textarea name="recomendationParam" style="display:none;">${payload}</textarea>
      </form>
    </body>
  </html>
  `;

  return <WebView source={{ html: formHtml }} setBuiltInZoomControls={false} setDisplayZoomControls={false} />;
};

export default memo(RedirectToManagePack);
