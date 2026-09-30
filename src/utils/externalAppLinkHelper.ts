import { Linking, Platform } from 'react-native';
import { WHATSAPP_LINKS, EXTERNAL_APP_PREFIXES, PLATFORM } from 'const';
import { LOG } from 'config/logger';
import { WHATS_APP_LINKS } from 'const/links';
import { isMobileDevice, platform } from './platformHelper';

const checkAppInstalled = (url: string, fallbackUrl: string) => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      Linking.openURL(fallbackUrl);
    }
  });
};

export const openWhatsApp = (message: string): void => {
  const url = `${EXTERNAL_APP_PREFIXES.WHATSAPP}/send?text=${message}`;
  let fallbackUrl = WHATSAPP_LINKS.WEB;
  switch (platform().OS) {
    case PLATFORM.ANDROID:
      fallbackUrl = WHATSAPP_LINKS.ANDROID;
      break;
    case PLATFORM.IOS:
      fallbackUrl = WHATSAPP_LINKS.IOS;
      break;
    default:
  }
  checkAppInstalled(url, fallbackUrl);
};

export const openSMS = (number: string): void => {
  const url = `${EXTERNAL_APP_PREFIXES.SMS + number}`;
  const fallbackUrl = EXTERNAL_APP_PREFIXES.SMS;
  checkAppInstalled(url, fallbackUrl);
};

export const openEmail = (emailAddress: string): void => {
  const url = `${EXTERNAL_APP_PREFIXES.EMAIL + emailAddress}`;
  const fallbackUrl = EXTERNAL_APP_PREFIXES.EMAIL;
  checkAppInstalled(url, fallbackUrl);
};

export const openBrowser = (url: string): void => {
  const fallbackUrl = url;
  checkAppInstalled(url, fallbackUrl);
};

export const parseJSON = (jsonString: string): object => {
  try {
    const jsonObject: object = JSON.parse(jsonString);
    return jsonObject;
  } catch (error) {
    return {};
  }
};

export const openInAppBrowser = async (url: string) => {
  try {
    // 1️ Normal open (default browser)
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      return Linking.openURL(url);
    }

    // 2️ Android-specific Samsung Internet / Chrome Intent fallback
    if (Platform.OS === 'android') {
      const intentUrl = `intent:${url}#Intent;scheme=https;package=com.android.chrome;end`;

      try {
        return Linking.openURL(intentUrl);
      } catch (e) {
        // fallback to Samsung Internet
        const samsungIntent = `intent:${url}#Intent;scheme=https;package=com.sec.android.app.sbrowser;end`;
        return Linking.openURL(samsungIntent);
      }
    }
  } catch (err) {
    LOG.info('openBrowser error', err);
  }

  // 3️ Final fallback – at least try to open
  return Linking.openURL(url);
};
export const openWhatsAppWithNumber = (number: string): void => {
  const url = Platform.select({
    ios: `${WHATS_APP_LINKS.MOBILE}${number}`,
    android: `${WHATS_APP_LINKS.MOBILE}${number}`,
    default: `${WHATS_APP_LINKS.WEB}${number}`,
  });

  if (isMobileDevice()) {
    window.open(url, '_blank');
  } else {
    Linking.openURL(url);
  }
};
