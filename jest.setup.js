import { NativeModules } from 'react-native';

NativeModules.SettingsManager = NativeModules.SettingsManager || {
  settings: {
    AppleLocale: 'en_US',
    AppleLanguages: ['en'],
  },
};
NativeModules.I18nManager = NativeModules.I18nManager || {
  localeIdentifier: 'en_US',
  isRTL: false,
};

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const actual = jest.requireActual('react-native/Libraries/Utilities/Platform');
  return {
    ...actual,
    OS: 'ios',
    select: (objs) => objs.ios,
  };
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    ScrollView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    BaseButton: View,
    Directions: {},
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock for global.localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(() => null),
  length: 0,
};

// Mock for global.sessionStorage
global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(() => null),
  length: 0,
};

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('utils/mixPanelHelper', () => ({
  init: jest.fn(),
  capitalizeFirstLetter: jest.fn(),
}));

jest.mock('utils/platformHelper', () => ({
  platform: jest.fn(() => ({ OS: 'ios' })),
  isAndroid: jest.fn(() => false),
  isiOS: jest.fn(() => true),
  isWeb: false,
  isTablet: jest.fn(() => false),
  isIpad: jest.fn(() => false),
  isDesktop: false,
  getDeviceID: jest.fn(() => Promise.resolve('mock-device-id')),
  getDeviceInformation: jest.fn(() => Promise.resolve({
    deviceId: 'mock-device-id',
    deviceName: 'Mock Device',
    systemVersion: '16.0',
    brand: 'Apple',
    model: 'iPhone',
    os: 'iOS',
    appVersion: '1.0.0',
  })),
}));

jest.mock('react-native-permissions', () => {
  return {
    PERMISSIONS: {
      ANDROID: {},
      IOS: {},
    },
    RESULTS: {
      UNAVAILABLE: 'unavailable',
      DENIED: 'denied',
      BLOCKED: 'blocked',
      GRANTED: 'granted',
      LIMITED: 'limited',
    },
    check: jest.fn(() => Promise.resolve('granted')),
    request: jest.fn(() => Promise.resolve('granted')),
    openSettings: jest.fn(() => Promise.resolve()),
  };
});

// Global mock: storageService to avoid Realm side effects in tests
jest.mock('services/storageService', () => require('./__mocks__/services/storageService.js'));

jest.mock('@react-native-clipboard/clipboard', () => ({
  __esModule: true,
  default: {
    setString: jest.fn(),
    getString: jest.fn().mockResolvedValue(''),
  },
}));

jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockImplementation((config, callback) => {
    if (callback) callback();
    return Promise.resolve();
  }),
  t: jest.fn((key) => key),
  changeLanguage: jest.fn().mockResolvedValue('en'),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn().mockResolvedValue('en'),
    },
  }),
  I18nextProvider: ({ children }) => children,
}));

jest.mock('i18next-browser-languagedetector', () => ({
  __esModule: true,
  default: {
    type: 'languageDetector',
    init: jest.fn(),
    detect: jest.fn(() => 'en'),
    cacheUserLanguage: jest.fn(),
  },
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }),
    useSafeAreaInsets: () => ({ top: 0, left: 0, right: 0, bottom: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaView: ({ children, style }) => <View style={style}>{children}</View>,
  };
});

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn().mockImplementation((config, reducer) => reducer),
    persistStore: jest.fn().mockReturnValue({
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(),
      replaceReducer: jest.fn(),
      flush: jest.fn().mockResolvedValue(null),
      purge: jest.fn().mockResolvedValue(null),
      pause: jest.fn(),
      resume: jest.fn(),
    }),
  };
});

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }) => children,
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
  useInflection: () => ({
    inflection: 'xl',
    orientation: 'landscape',
  }),
}));

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
  logout: jest.fn(),
  refresh: jest.fn(),
  revoke: jest.fn(),
}));

jest.mock('jail-monkey', () => ({
  isJailBroken: jest.fn(() => false),
  canMockLocation: jest.fn(() => false),
  trustFall: jest.fn(() => true),
  isOnExternalStorage: jest.fn(() => false),
  isDebuggedMode: jest.fn(() => Promise.resolve(false)),
  isDevelopmentSettingsMode: jest.fn(() => Promise.resolve(false)),
}));

jest.mock('@apollo/client', () => {
  const React = require('react');
  return {
    ApolloProvider: ({ children }) => children,
    useQuery: jest.fn(() => ({ loading: false, data: {}, error: null })),
    useMutation: jest.fn(() => [jest.fn(), { loading: false, data: {}, error: null }]),
    useLazyQuery: jest.fn(() => [jest.fn(), { loading: false, data: {}, error: null }]),
    useSubscription: jest.fn(() => ({ loading: false, data: {}, error: null })),
    ApolloClient: jest.fn(() => ({
      query: jest.fn().mockResolvedValue({ data: {} }),
      mutate: jest.fn().mockResolvedValue({ data: {} }),
    })),
    InMemoryCache: jest.fn(),
    HttpLink: jest.fn(),
    from: jest.fn((links) => links[0]),
    ApolloLink: jest.fn(function(execute) { this.execute = execute; }),
    Observable: jest.fn(function(subscribe) { this.subscribe = subscribe; }),
    gql: (strs) => strs[0],
    createHttpLink: jest.fn(),
  };
});

jest.mock('@apollo/client/link/context', () => ({
  setContext: jest.fn(() => ({
    concat: jest.fn(),
  })),
}));

jest.mock('@apollo/client/link/remove-typename', () => ({
  removeTypenameFromVariables: jest.fn(() => ({
    concat: jest.fn(),
  })),
}));

jest.mock('apollo3-cache-persist', () => ({
  persistCache: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
      isFocused: jest.fn(() => true),
    }),
    useRoute: () => ({
      params: {},
    }),
    useNavigationState: jest.fn((selector) => selector({ routes: [] })),
    NavigationContainer: ({ children }) => children,
    useFocusEffect: (effect) => {
      require('react').useEffect(effect, []);
    },
  };
});

jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: 'MockRoute',
}));
