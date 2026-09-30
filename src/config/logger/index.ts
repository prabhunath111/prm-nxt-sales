import { InteractionManager } from 'react-native';
import {
  logger,
  transportFunctionType,
  consoleTransport,
} from 'react-native-logs';
import crashlytics from '@react-native-firebase/crashlytics';

const customTransport: transportFunctionType<object> = ({ msg, rawMsg, level }) => {
  if (level.severity === 3) {
    crashlytics().recordError(rawMsg as Error);
  } else {
    crashlytics().log(`${level.text}: ${msg} ---> ${rawMsg}`);
  }
};

const config:any = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  transport: __DEV__ ? consoleTransport : customTransport,
  severity: __DEV__ ? 'debug' : 'error',
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  async: true,
  asyncFunc: InteractionManager.runAfterInteractions,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  fixedExtLvlLength: false,
  enabled: true,
};

export const LOG = logger.createLogger(config);
