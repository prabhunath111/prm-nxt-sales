/**
 * This component will initilize the moengage and ask for permissions
 *
 * @module components/MoengageNotifications
 * @memberof CommonComponent
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import ReactMoE, { MoEInitConfig, MoEPushConfig, MoEngageLogConfig, MoEngageLogLevel, MoEngageLogger } from 'react-native-moengage';
import env from 'config/env';
import { FORMS, MOENGAGE } from 'const/strings';
import { isiOS } from 'utils/platformHelper';
import actions from 'store/sales/actions/ui';
import MoEReactInbox from 'react-native-moengage-inbox';
import useNavigate from 'hooks/useNavigate';
import { CHILD_TYPE } from 'const';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { useTranslation } from 'react-i18next';

/**
 * Represents a MoengageNotifications component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered MoengageNotifications component
 *
 * @example
 * <MoengageNotifications text="Hello World!" />
 */

const MoengageNotifications = () => {
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const handleRouteAction = (route: string) => {
    switch (route) {
      case FORMS.demoBoxDetail:
        dispatch(
          actions.showBottomModal({
            isModalVisible: true,
            isCenterModal: true,
            type: CHILD_TYPE.DYNAMIC_FORM,
            headerTitle: t('forms.demoBoxDetails'),
            showCloseIcon: true,
            showHeader: true,
            formName: FORMS.demoBoxDetail,
          }),
        );
        break;

      default:
        navigate(route);
        break;
    }
  };
  useEffect(() => {
    ReactMoE.setEventListener('pushClicked', (payload: any) => {
      try {
        const dataPayload = payload?.data?.payload;
        const moeFeatures = dataPayload?.moeFeatures;
        if (moeFeatures) {
          const parsed = JSON.parse(moeFeatures);
          const deepLink = parsed?.richPush?.defaultActions?.[0]?.value;

          if (deepLink) {
            const cleanLink = deepLink.replace('tpsales://', '');
            const [screen] = cleanLink.split('?');
            handleRouteAction(screen);
            return;
          }
        }

        const webUrl = dataPayload?.gcm_webUrl;
        if (webUrl) {
          handleRouteAction(webUrl);
        }
      } catch (e) {
        MoEngageLogger.error('MoE DeepLink parse failed', e);
      }
    });

    ReactMoE.setEventListener('inAppCampaignClicked', (campaign: any) => {
      try {
        const deepLink = campaign?.action?.navigationUrl;

        if (deepLink) {
          const cleanLink = deepLink.replace('tpsales://', '');
          const [screen] = cleanLink.split('?');
          handleRouteAction(screen);
        }
      } catch (e) {
        MoEngageLogger.error('InApp DeepLink parse failed', e);
      }
    });

    ReactMoE.setEventListener('pushTokenGenerated', (payload) => {
      MoEngageLogger.debug(MOENGAGE.PUSH_TOKEN_GENERATED, payload);
    });
    const APP_ID = env.MOENGAGE_KEY;

    // Optionally pass configuration for the React-Native Plugins
    const moEInitConfig = new MoEInitConfig(MoEPushConfig.defaultConfig(), new MoEngageLogConfig(MoEngageLogLevel.VERBOSE, true));

    if (isiOS()) {
      ReactMoE.registerForPush();
    }

    ReactMoE.initialize(APP_ID, moEInitConfig);
    MoEReactInbox.initialize(APP_ID);

    ReactMoE.requestPushPermissionAndroid();
    ReactMoE.showInApp();
    ReactMoE.showNudge();
    // Fetch and handle self-handled In-App messages
    ReactMoE.getSelfHandledInApp();
  }, []);

  return <View testID="moengageTest" />;
};

export default MoengageNotifications;
