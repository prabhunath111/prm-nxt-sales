import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Provider } from 'react-redux';
import * as userActions from 'store/sales/actions/user';
import * as i18nConfig from 'config/i18n';
import * as validationHelper from 'utils/ValidationHelper';
import * as useNavigateHook from 'hooks/useNavigate';
import LoginPage from './LoginPage';

// Mock all dependencies
jest.mock('react-native', () => ({
  Platform: { OS: 'ios', select: jest.fn((obj) => obj.ios || obj.default) },
  Dimensions: { get: jest.fn(() => ({ width: 375, height: 812 })) },
  StyleSheet: { create: jest.fn((styles) => styles), hairlineWidth: 1 },
  SafeAreaView: 'SafeAreaView',
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  ScrollView: 'ScrollView',
  Image: 'Image',
  Alert: { alert: jest.fn() },
}));
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: any }) => children,
}));
jest.mock('realm', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    write: jest.fn(),
    create: jest.fn(),
    objects: jest.fn(() => []),
    delete: jest.fn(),
    close: jest.fn(),
  })),
}));
jest.mock('redux-persist', () => ({
  persistReducer: jest.fn((reducer) => reducer),
  persistStore: jest.fn(() => ({ purge: jest.fn(), flush: jest.fn(), pause: jest.fn(), persist: jest.fn() })),
  createTransform: jest.fn(() => ({})),
}));
jest.mock('redux-persist/lib/storage', () => ({ default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() } }));
jest.mock('utils/platformHelper', () => ({ isWeb: false, platform: jest.fn(() => ({ OS: 'ios' })) }));
jest.mock('utils/languageHelper', () => ({ getLanguageMapping: jest.fn(() => 'en'), redirectionLangMapping: { en: 'eng', hi: 'hi' } }));
jest.mock('services/storageService', () => ({ getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() }));
jest.mock('utils/sessionHelper', () => ({ getSessionData: jest.fn(), setSessionData: jest.fn(), clearSessionData: jest.fn() }));
jest.mock('react-native-device-info', () => ({
  getModel: jest.fn(() => 'mock-model'),
  getFreeDiskStorageSync: jest.fn(() => 1024),
  getDeviceId: jest.fn(() => 'mock-device-id'),
  getManufacturerSync: jest.fn(() => 'mock-manufacturer'),
  getSerialNumberSync: jest.fn(() => 'mock-serial-number'),
  getSystemName: jest.fn(() => 'mock-system-name'),
  getSystemVersion: jest.fn(() => 'mock-system-version'),
  getVersion: jest.fn(() => 'mock-app-version'),
  isEmulatorSync: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  getReadableVersion: jest.fn(() => 'mock-readable-version'),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
}));
jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(),
  setUserId: jest.fn(),
}));
jest.mock('react-native-vision-camera', () => ({
  Camera: () => null,
  useCameraPermission: jest.fn(() => [true, null]),
  useCameraDevice: jest.fn(() => null),
  useCodeScanner: jest.fn(() => ({ scan: jest.fn() })),
}));
jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));
jest.mock('store/sales/actions/user', () => ({
  __esModule: true,
  default: { doLogin: jest.fn(), getAsmCsmMobileName: jest.fn() },
}));
jest.mock('store/sales/actions/fetchLanguage/fetchLanguage.action', () => ({
  fetchLanguageAction: jest.fn(),
}));
jest.mock('config/i18n', () => ({ changeLanguage: jest.fn() }));
jest.mock('utils/ValidationHelper', () => ({ loginValidation: jest.fn() }));
jest.mock('hooks/useNavigate', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('utils/navigationHelper', () => ({ safePath: jest.fn((path) => path) }));
jest.mock('wrappers/inflection/InflectionProvider', () => ({ useInflection: () => ({ inflection: 'ltr' }) }));
jest.mock('styles/dimentionHelper', () => ({
  getPlatformInformation: jest.fn(() => ({ os: 'web', platform: 'web' })),
  getOSType: jest.fn(() => 'web'),
  responsiveHeight: jest.fn((height) => height),
  responsiveWidth: jest.fn((width) => width),
  getScreenHeight: jest.fn(() => 812),
  getScreenWidth: jest.fn(() => 375),
}));
jest.mock('styles', () => ({
  Colors: {
    gradient: { theme: ['#000', '#fff'] },
    neutral: { white: '#fff', g50: '#f5f5f5', g400: '#999' },
    error: { primary: '#f00' },
    primary: { theme: '#007AFF' },
    transparent: { clear: 'transparent' },
  },
  Sizing: {
    layout: { x2: 2, x4: 16, x30: 120, x20: 20, x50: 50 },
    layoutP: { xp100: '100%', xp90: '90%' },
  },
  Typography: {
    fontSize: { x15: { fontSize: 15 }, x18: { fontSize: 18 }, x20: { fontSize: 20 }, x30: { fontSize: 30 } },
    fontWeight: { x700: { fontWeight: '700' }, x400: { fontWeight: '400' }, x500: { fontWeight: '500' } },
  },
  Forms: { commonContainer: { purpleBg: {}, whiteBg: {} } },
  Outlines: {
    borderRadius: { base: 8, small: 4, large: 16 },
    borderWidth: { thin: 1, base: 2, thick: 3, hairline: 0.5 },
  },
}));
jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => ({})),
  isXL: jest.fn(() => false),
  isLG: jest.fn(() => false),
  isMD: jest.fn(() => false),
  isMDL: jest.fn(() => false),
  isSM: jest.fn(() => false),
  isDesktop: false,
  BreakPoints: { XL: 'xl', LG: 'lg', MD: 'md', MD_L: 'md_l', SM: 'sm' },
}));
jest.mock('components/sales', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const React = require('react');
  return {
    TextInput: React.forwardRef((props: any, ref: any) => React.createElement('TextInput', { ...props, ref })),
    Link: (props: any) => React.createElement('Link', props),
    Text: (props: any) => React.createElement('Text', props),
    Image: (props: any) => React.createElement('Image', props),
    Button: (props: any) => React.createElement('Button', props),
    Gradient: (props: any) => React.createElement('Gradient', props),
  };
});
jest.mock('const/strings', () => ({
  PLATFORM: { WEB: 'web', ANDROID: 'android', IOS: 'ios', I_OS: 'iOS', IPAD_OS: 'iPadOS' },
  ROLES_DEFAULT_ROUTES: { ASI: '/asi-dashboard', CSM: '/csm-dashboard', default: '/dashboard' },
  REDIRECTION_LANG: { en: 'eng', hi: 'hi', mr: 'mar', ml: 'mal', kn: 'kan', bn: 'ben', te: 'tel', ta: 'tam', pa: 'pun', gu: 'guj', or: 'ori', pu: 'pun' },
}));
jest.mock('const', () => ({
  ICONS: { LOGO: 'logo-icon' },
  PROPERTIES: { ROLES: { asi: 'asi', csm: 'csm' } },
  STRINGS: { EN: 'en' },
  STYLES: { TYPE: { SECONDARY: 'secondary' } },
  ALERT: { INFO: 'info', SUCCESS: 'success', ERROR: 'error', WARNING: 'warning' },
  MODAL: { YES: 'Yes', NO: 'No' },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'strings.userName': 'Username',
        'strings.password': 'Password',
        'strings.version': 'Version',
        'strings.forgotPassword': 'Forgot Password?',
        login: 'LOGIN',
        'errors.userName': 'Username is required',
        'errors.password': 'Password is required',
      };
      return translations[key] || key;
    },
  }),
}));

const mockStore = {
  getState: jest.fn(() => ({})),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
  [Symbol.observable]: jest.fn(),
};

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

describe('Test for the component LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigateHook.default as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        return action(mockDispatch);
      }
      return Promise.resolve(action);
    });
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
  });

  const createComponent = () =>
    renderer.create(
      <Provider store={mockStore}>
        <LoginPage />
      </Provider>,
    );

  test('renders component LoginPage correctly', () => {
    const component = createComponent();
    expect(component.toJSON()).toBeTruthy();
  });

  test('calls changeLanguage on component mount', () => {
    createComponent();
    expect(i18nConfig.changeLanguage).toHaveBeenCalledWith('en');
  });

  test('handles validation errors when login validation fails', async () => {
    (validationHelper.loginValidation as jest.Mock).mockReturnValue(true);

    const component = createComponent();

    // Find and trigger login button
    const { root } = component;
    const button = root.findByProps({ label: 'LOGIN' });

    await act(async () => {
      button.props.onPress();
    });

    expect(validationHelper.loginValidation).toHaveBeenCalled();
  });

  test('handles successful login with ASI role', async () => {
    (validationHelper.loginValidation as jest.Mock).mockReturnValue(false);
    const mockLoginResponse = { internalRoleNT: 'asi', internalRole: 'ASI' };
    const mockLoginAction = jest.fn(() => Promise.resolve(mockLoginResponse));
    const mockGetAsmCsmAction = jest.fn(() => Promise.resolve());

    (userActions.default.doLogin as jest.Mock).mockReturnValue(mockLoginAction);
    (userActions.default.getAsmCsmMobileName as jest.Mock).mockReturnValue(mockGetAsmCsmAction);

    const component = createComponent();

    // Find and trigger login button
    const { root } = component;
    const button = root.findByProps({ label: 'LOGIN' });

    await act(async () => {
      button.props.onPress();
    });

    expect(validationHelper.loginValidation).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles successful login with CSM role', async () => {
    (validationHelper.loginValidation as jest.Mock).mockReturnValue(false);
    const mockLoginResponse = { internalRoleNT: 'csm', internalRole: 'CSM' };
    const mockLoginAction = jest.fn(() => Promise.resolve(mockLoginResponse));
    const mockGetAsmCsmAction = jest.fn(() => Promise.resolve());

    (userActions.default.doLogin as jest.Mock).mockReturnValue(mockLoginAction);
    (userActions.default.getAsmCsmMobileName as jest.Mock).mockReturnValue(mockGetAsmCsmAction);

    const component = createComponent();

    // Find and trigger login button
    const { root } = component;
    const button = root.findByProps({ label: 'LOGIN' });

    await act(async () => {
      button.props.onPress();
    });

    expect(validationHelper.loginValidation).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles successful login with other roles', async () => {
    (validationHelper.loginValidation as jest.Mock).mockReturnValue(false);
    const mockLoginResponse = { internalRoleNT: 'other', internalRole: 'OTHER' };
    const mockLoginAction = jest.fn(() => Promise.resolve(mockLoginResponse));

    (userActions.default.doLogin as jest.Mock).mockReturnValue(mockLoginAction);

    const component = createComponent();

    // Find and trigger login button
    const { root } = component;
    const button = root.findByProps({ label: 'LOGIN' });

    await act(async () => {
      button.props.onPress();
    });

    expect(validationHelper.loginValidation).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles input changes', () => {
    const component = createComponent();

    // Find TextInput components and trigger changes
    const { root } = component;
    const usernameInput = root.findByProps({ placeholder: 'Username' });
    const passwordInput = root.findByProps({ placeholder: 'Password' });

    act(() => {
      usernameInput.props.onInputChange('testuser');
      passwordInput.props.onInputChange('testpass');
    });

    expect(component.toJSON()).toBeTruthy();
  });

  test('handles forgot password press', () => {
    const component = createComponent();

    // Find Link component and trigger press
    const { root } = component;
    const link = root.findByProps({ label: 'Forgot Password?' });

    act(() => {
      link.props.onPress();
    });

    expect(component.toJSON()).toBeTruthy();
  });

  test('component structure is correct', () => {
    const component = createComponent();
    const json = component.toJSON() as any;

    expect(json).toBeTruthy();
    expect(json.type).toBe('SafeAreaView');
    expect(json.props.testID).toBe('loginPage');

    // Check for main components
    const gradient = json.children[0];
    expect(gradient.type).toBe('Gradient');

    const card = gradient.children[0];
    expect(card.type).toBe('View');

    // Verify essential elements exist
    const findByType = (node: any, type: string): any => {
      if (!node) return null;
      if (node.type === type) return node;
      if (node.children) {
        // eslint-disable-next-line no-restricted-syntax
        for (const child of node.children) {
          const found = findByType(child, type);
          if (found) return found;
        }
      }
      return null;
    };

    expect(findByType(json, 'TextInput')).toBeTruthy();
    expect(findByType(json, 'Button')).toBeTruthy();
    expect(findByType(json, 'Link')).toBeTruthy();
    expect(findByType(json, 'Image')).toBeTruthy();
  });
});
