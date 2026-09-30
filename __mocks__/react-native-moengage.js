export default {
  initialize: jest.fn(),
  trackEvent: jest.fn(),
  setUserAttribute: jest.fn(),
  setEventListener: jest.fn(),
  requestPushPermissionAndroid: jest.fn(),
  showInApp: jest.fn(),
  showNudge: jest.fn(),
  getSelfHandledInApp: jest.fn(),
  setUserUniqueID: jest.fn(),
  registerForPush: jest.fn(),
};

export const MoEProperties = jest.fn().mockImplementation(() => ({
  setAttribute: jest.fn(),
  addAttribute: jest.fn(),
  addDateAttribute: jest.fn(),
  addLocationAttribute: jest.fn(),
}));

export const MoEInitConfig = jest.fn();
export const MoEPushConfig = {
  defaultConfig: jest.fn(() => ({
    notificationChannelName: 'Default Channel',
    notificationChannelDescription: 'Default Channel Description',
  })),
};
export const MoEngageLogConfig = jest.fn();
export const MoEngageLogLevel = {
  VERBOSE: 'VERBOSE',
  DEBUG: 'DEBUG',
};
export const MoEngageLogger = {
  debug: jest.fn(),
  error: jest.fn(),
};
