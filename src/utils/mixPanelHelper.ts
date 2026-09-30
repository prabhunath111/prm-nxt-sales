import { Mixpanel } from 'mixpanel-react-native';
import env from 'config/env';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { isTimeExpired } from './dateHelper';

const trackAutomaticEvents = false; // disable legacy mobile autotrack
const useNative = false; // disable Native Mode, use Javascript Mode
export const mixpanelHelper = new Mixpanel(env.MIXPANEL_PROJECT_TOKEN, trackAutomaticEvents, useNative);
mixpanelHelper.init();

export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

// getCustomMoEngagePayload.ts

export const getCustomMoEngagePayload = (kvPair: Record<string, any>): Record<string, string> => {
  if (!kvPair) return {};

  const knownSystemKeyPrefixes = ['moe_', 'gcm_', 'mi_', 'push_', 'inbox_', 'time_'];
  const blockedExactKeys = ['moeFeatures'];

  const customPayload: Record<string, string> = {};

  Object.entries(kvPair).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    const isSystemKey = knownSystemKeyPrefixes.some((prefix) => lowerKey.startsWith(prefix)) || blockedExactKeys.includes(key);
    if (!isSystemKey) {
      customPayload[key] = String(value);
    }
  });

  return customPayload;
};

export const getMoEngageImageUrl = (item: any): string | null => {
  if (item?.media?.url) {
    return item.media.url;
  }

  const moeFeaturesStr = item?.action?.[0]?.kvPair?.moeFeatures;
  if (!moeFeaturesStr) return null;

  try {
    const parsed = JSON.parse(moeFeaturesStr);

    return parsed?.richPush?.expanded?.cards?.[0]?.widgets?.find((w: any) => w.type === 'image')?.content || null;
  } catch {
    return null;
  }
};

export const getFilteredNotifications = async (tabName: string) => {
  const notificationsData: any = await MoengageMixpanel.getMoEngageMessages();
  const searchText = tabName.toLowerCase();

  const filteredNotificationData = Object.values(notificationsData.messages).filter((notification: any) => {
    if (searchText === 'all') return true;
    const kvPair = notification?.action?.['0']?.kvPair;
    const text = notification?.text;
    if (!kvPair && !text) return false;

    // Step 1: Get custom keys from kvPair
    const customData = getCustomMoEngagePayload(kvPair || {});
    const customKeys = Object.keys(customData);
    const customValues = Object.values(customData);

    const foundInKvPair = customKeys.some((k) => k.toLowerCase().includes(searchText)) || customValues.some((v) => v.toLowerCase().includes(searchText));

    // Step 2: Search inside text.title, message, summary
    const foundInText =
      (text?.title && text.title.toLowerCase().includes(searchText)) ||
      (text?.message && text.message.toLowerCase().includes(searchText)) ||
      (text?.summary && text.summary.toLowerCase().includes(searchText));

    return foundInKvPair || foundInText;
  });
  // Filter out expired
  return filteredNotificationData.filter((el: any) => !isTimeExpired(el.expiry));
};
