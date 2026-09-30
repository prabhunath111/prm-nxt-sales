/**
 * Represents a localAuthHelper utils.
 *
 * @namespace localAuthenticationHelper
 */

import { LOG } from 'config/logger';
import { LOCAL_AUTH } from 'const/strings';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export const checkBiometrySupport = async () => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    return { available, biometryType };
  } catch (error) {
    LOG.info(error);
    return null;
  }
};

export const handleLocalAuthenticate = async () => {
  try {
    const success = await rnBiometrics.simplePrompt({
      promptMessage: LOCAL_AUTH.TITLE,
    });
    return success;
  } catch (error) {
    LOG.info(error);
    return false;
  }
};
