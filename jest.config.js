module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-firebase|@realm|@react-native-async-storage|react-redux|react-native-popover-view|react-native-swipe-gestures|react-native-linear-gradient|react-native-calendars|react-native-webview|react-native-razorpay|react-native-device-info|react-native-push-notification|mixpanel-react-native|@react-navigation|@reduxjs/toolkit|immer|react-native-safe-area-context|jail-monkey)/)',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    'react-native-webview': '<rootDir>/__mocks__/react-native-webview.js',
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/asyncStorage.js',
    '^@react-native-firebase/crashlytics$': '<rootDir>/__mocks__/crashlytics.js',
    '^react-native-razorpay$': '<rootDir>/__mocks__/react-native-razorpay.js',
    '^victory-native$': '<rootDir>/__mocks__/victory-native.js',
    '^react-native-device-info$': '<rootDir>/__mocks__/react-native-device-info.js',
    '^react-native-vision-camera$': '<rootDir>/__mocks__/react-native-vision-camera.js',
    '^utils/imageHelper$': '<rootDir>/__mocks__/utils/imageHelper.js',
    '^react-native-moengage$': '<rootDir>/__mocks__/react-native-moengage.js',
    '^react-native-push-notification$': '<rootDir>/__mocks__/react-native-push-notification.js',
    '^mixpanel-react-native$': '<rootDir>/__mocks__/mixpanel-react-native.js',
    '^utils/mixPanelHelper$': '<rootDir>/__mocks__/utils/mixPanelHelper.js',
    '^locales/(.+)\\.json$': '<rootDir>/__mocks__/locale.js',
    uuid: require.resolve('uuid'),
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest to transform JS/TS files
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/components/**/*.tsx', 'src/screens/**/*.tsx', 'src/store/sales/actions/**/*.ts', '!src/**/*.stories.tsx', '!src/**/*.test.tsx', '!src/**/*.styles.tsx'],
};
