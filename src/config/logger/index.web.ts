import { InteractionManager } from 'react-native';
import {
  logger,
  transportFunctionType,
  consoleTransport,
} from 'react-native-logs';

const customTransport: transportFunctionType<object> = () => {
  // input { msg, rawMsg, level }
  // Add the custom logic for web here
};

const config = {
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
  enabled: __DEV__, // Disable logging in production
};

export const LOG = logger.createLogger(config);
