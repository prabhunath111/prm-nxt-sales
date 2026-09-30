import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { STRINGS } from 'const/strings';
import { RootState } from 'store';
import { LOG } from 'config/logger/index.web';
import { mixpanelHelper } from 'utils/mixPanelHelper';
import env from 'config/env';

declare const Moengage: any;
export class MoengageMixpanel {
  static registerUser(userInfo: RootState['user']['info']) {
    if (env.ENABLE_MOENGAGE_MIXPANEL_EVENTS !== 'true') return;
    try {
      // Get the app version
      const deviceDetails = {
        deviceModel: DeviceInfo.getModel(),
        deviceOS: Platform.OS,
        deviceOSVersion: DeviceInfo.getSystemVersion(),
        appVersion: DeviceInfo.getVersion(),
      };
      Moengage?.add_unique_user_id(userInfo?.userId);
      // Disabled user contact number due to Tata Play security restrictions
      // Moengage?.add_mobile(userInfo?.mdn);
      Moengage?.add_user_name(userInfo?.name);
      Moengage?.add_user_attribute(STRINGS.DEVICE_DETAILS, deviceDetails);
      Moengage?.add_user_attribute(STRINGS.PARTNER_ROLE, userInfo?.roleId);

      if (
        mixpanelHelper !== undefined &&
        mixpanelHelper?.identify !== undefined
      ) {
        // Set Mixpanel user details
        mixpanelHelper?.identify(userInfo?.userId);
      }
    } catch (error) {
      LOG.error('Error in registering user', error);
    }
  }

  static trackEvent(moduleName: string, attributes: any) {
    if (env.ENABLE_MOENGAGE_MIXPANEL_EVENTS !== 'true') return;
    try {
      Moengage.track_event(moduleName, attributes);
      mixpanelHelper?.track(moduleName, attributes);
    } catch (error) {
      LOG.error('Error in tracking event', error);
    }
  }
}
