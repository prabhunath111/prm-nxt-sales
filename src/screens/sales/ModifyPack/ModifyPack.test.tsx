import { View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import { store } from 'store';
import * as navigationHelper from 'utils/navigationHelper';
import * as platformHelper from 'utils/platformHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import ModifyPack from './ModifyPack';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({ goBack: mockGoBack, navigate: mockNavigate }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'mobile' }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
}));

jest.mock('utils/navigationHelper', () => ({
  redirectToManagePackViaPost: jest.fn(),
}));

jest.mock('utils/platformHelper', () => ({
  isWeb: false,
  isiOS: jest.fn(() => false),
  isAndroid: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  platform: jest.fn(() => ({ OS: 'ios' })),
}));

jest.mock('utils/languageHelper', () => ({
  getRedirectionLangPayload: jest.fn(() => 'en'),
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
  useInflection: () => ({ inflection: 'mobile' }),
}));

const mockState = {
  modifyPack: {
    packSelectorAccountInfo: {
      rmn: '1234567890',
      checksum: 'test-checksum',
      subscriberId: 'SUB123',
      subscriberName: 'Test User',
      subscriberNameNT: 'TestUser',
      agentUserId: 'AGENT123',
      redirectionUrl: 'https://test.com',
    },
  },
};

describe('Test for the component ModifyPack', () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) => cb(mockState));
    jest.clearAllMocks();
  });

  test('render component ModifyPack', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('modifyPack-test')).toBeTruthy();
  });

  test('snapshot tests for ModifyPack', () => {
    const component = render(
      <Provider store={store}>
        <View>
          <NavigationContainer>
            <ModifyPack />
          </NavigationContainer>
        </View>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('displays masked mobile number', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('12******90')).toBeTruthy();
  });

  test('displays subscriber information', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Test User')).toBeTruthy();
    expect(screen.getByText('SUB123')).toBeTruthy();
  });

  test('handles proceed button click on web', () => {
    (platformHelper as any).isWeb = true;
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    const proceedButton = screen.getByText('strings.proceed');
    fireEvent.press(proceedButton);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  test('handles proceed button click on mobile', () => {
    (platformHelper as any).isWeb = false;
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    const proceedButton = screen.getByText('strings.proceed');
    fireEvent.press(proceedButton);
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('handles proceed button click with webkit', () => {
    (platformHelper as any).isWeb = false;
    (global as any).window = { webkit: { messageHandlers: { cordova_iab: {} } } };
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    const proceedButton = screen.getByText('strings.proceed');
    fireEvent.press(proceedButton);
    expect(navigationHelper.redirectToManagePackViaPost).toHaveBeenCalled();
    delete (global as any).window;
  });

  test('handles cancel button click', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    const cancelButton = screen.getByText('strings.cancel');
    fireEvent.press(cancelButton);
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('masks mobile number with default options', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('12******90')).toBeTruthy();
  });

  test('handles undefined mobile number', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        modifyPack: {
          packSelectorAccountInfo: {
            ...mockState.modifyPack.packSelectorAccountInfo,
            rmn: undefined,
          },
        },
      }),
    );
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('NA')).toBeTruthy();
  });

  test('handles null mobile number', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        modifyPack: {
          packSelectorAccountInfo: {
            ...mockState.modifyPack.packSelectorAccountInfo,
            rmn: null,
          },
        },
      }),
    );
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('NA')).toBeTruthy();
  });

  test('handles empty mobile number', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        modifyPack: {
          packSelectorAccountInfo: {
            ...mockState.modifyPack.packSelectorAccountInfo,
            rmn: '',
          },
        },
      }),
    );
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('NA')).toBeTruthy();
  });

  test('handles short mobile number', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        modifyPack: {
          packSelectorAccountInfo: {
            ...mockState.modifyPack.packSelectorAccountInfo,
            rmn: '123',
          },
        },
      }),
    );
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ModifyPack />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('***')).toBeTruthy();
  });
});
