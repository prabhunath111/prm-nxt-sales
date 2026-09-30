import React, { useEffect } from 'react';
import { View } from 'react-native';
import Moengage from '@moengage/web-sdk';
import env from 'config/env';
import { MOENGAGE, VALIDATIONS } from 'const/strings';

const MoengageNotifications = () => {
  const initializeMoEngage = () => {
    try {
      // Initialize MoEngage
      Moengage.initialize({
        app_id: env.MOENGAGE_KEY,
        cluster: MOENGAGE.DATA_CENTER,
        swPath: MOENGAGE.SW_PATH,
        debug_logs: 1,
      });

      // Check notification permissions
      Notification.requestPermission()
        .then((permission) => {
          Moengage.call_web_push();
          if (permission === VALIDATIONS.GRANTED) {
            Moengage.track_event(MOENGAGE.NOTIFICATION_ENABLED, {});
          } else {
            Moengage.track_event(MOENGAGE.NOTIFICATION_DENIED, {});
          }
        })
        .catch((error) => {
          Moengage.track_event(MOENGAGE.PERMISSION_ERROR, { error: error.message });
        });

      Moengage.track_event(MOENGAGE.MOENGAGE_INITIALIZED, {});
    } catch (error) {
      Moengage.track_event(MOENGAGE.INITILIZATION_ERROR, { error });
    }
  };

  useEffect(() => {
    initializeMoEngage();
  }, []);

  return <View />;
};

export default MoengageNotifications;
