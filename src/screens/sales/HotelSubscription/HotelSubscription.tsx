import React, { memo, useEffect, useState } from 'react';
import { View, Linking } from 'react-native';
import actions from 'store/sales/actions/common';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { QUERY, STRINGS } from 'const';
import useNavigate from 'hooks/useNavigate';
import { ParentObject } from 'store/sales/types/common';
import { isWeb } from 'utils/platformHelper';
import { Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { openBrowser } from 'utils/externalAppLinkHelper';
import styles from './HotelSubscription.styles';

const HotelSubscription = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { goHome } = useNavigate();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const [popupBlockedUrl, setPopupBlockedUrl] = useState<string | null>(null);
  const { t } = useTranslation();

  function arePopupsAllowed() {
    const popup = window.open('', '', 'width=100,height=100');

    if (popup === null || typeof popup === 'undefined') {
      return false;
    }
    popup.close(); // Clean up

    return true;
  }

  useEffect(() => {
    dispatch(actions.getHotelSubscriptionURL({ moduleName: STRINGS.HOTEL_SUBSCRIPTION }, QUERY.GetHotelSubscriptionURL)).then((response: ParentObject) => {
      const url = response?.data?.url;
      if (!url) return;

      if (isWeb) {
        // iOS webview
        const { webkit } = window as any;
        if (webkit?.messageHandlers?.cordova_iab) {
          const message = { action: 'download', url: encodeURIComponent(url) };
          webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(message));
          return;
        }

        // ✅ Open a popup immediately (must be in sync with user gesture)
        // const windowFeatures = `noopener,noreferrer,left=0,top=0,width=${getFullScreenWidth()},height=${getFullScreenHeight()}`;
        window.open(url, '_blank', 'noopener,noreferrer');

        if (!arePopupsAllowed()) {
          setPopupBlockedUrl(url);
        } else {
          goHome(isRedirection);
        }
      } else {
        // Not web
        openBrowser(url);
        goHome(isRedirection);
      }
    });
  }, []);

  return (
    <View testID="hotelSubscription">
      {/* Fallback link if popup was blocked */}
      {popupBlockedUrl && (
        <Text
          style={styles.navigationTextStyle}
          onPress={() => {
            if (isWeb) {
              window.open(popupBlockedUrl, '_blank', 'noopener,noreferrer');
              goHome(isRedirection);
            } else {
              Linking.openURL(popupBlockedUrl);
            }
          }}
          label={t('strings.popupBlocked')}
        />
      )}
    </View>
  );
};

export default memo(HotelSubscription);
