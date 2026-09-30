import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { STRINGS } from 'const/strings';
import { RootState } from 'store';
import ReactMoE, { MoEProperties } from 'react-native-moengage';
import { LOG } from 'config/logger';
import { mixpanelHelper } from 'utils/mixPanelHelper';
import env from 'config/env';
import MoEReactInbox from 'react-native-moengage-inbox';

export class MoengageMixpanel {
  static registerUser(userInfo: RootState['user']['info']) {
    if(env.ENABLE_MOENGAGE_MIXPANEL_EVENTS !== "true") return;
    try {
      const deviceDetails = {
        deviceModel: DeviceInfo.getModel(),
        deviceOS: Platform.OS,
        deviceOSVersion: DeviceInfo.getSystemVersion(),
        appVersion: DeviceInfo.getVersion(),
      };
      LOG.info('Registering user with MoEngage and Mixpanel', userInfo?.name, userInfo?.mdn, userInfo?.userId);
      ReactMoE?.identifyUser(userInfo?.userId);
      ReactMoE?.setUserName(userInfo?.name);
      // Disabled user contact number due to Tata Play security restrictions
     // ReactMoE?.setUserContactNumber(userInfo?.mdn);
      ReactMoE?.setUserAttribute(STRINGS.DEVICE_DETAILS, deviceDetails);
      ReactMoE?.setUserAttribute(STRINGS.PARTNER_ROLE, userInfo?.roleId);

      // Set Mixpanel user details
      mixpanelHelper.identify(userInfo?.userId);
    } catch (error) {
      LOG.error('Error in registering user', error);
    }
  }

  static trackEvent(moduleName: string, attributes: any) {
    if(env.ENABLE_MOENGAGE_MIXPANEL_EVENTS !== "true") return;
    try {
      const properties = new MoEProperties();
      Object.keys(attributes).forEach((key) => {
        properties.addAttribute(key, attributes[key]);
      });
      ReactMoE.trackEvent(moduleName, properties);
      mixpanelHelper.track(moduleName, attributes);
    } catch (error) {
        LOG.error('Error in tracking event', error);
    }
  }

    static getMoEngageMessages = async () => MoEReactInbox.fetchAllMessages();

}
