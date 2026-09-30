import { View, LayoutAnimation } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Text from 'components/sales/Text';
import Accordion from './Accordion';
import styles from './Accordion.styles';

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

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.SettingsManager = {
    settings: {
      AppleLanguages: ['en_US'],
    },
    getConstants: () => ({
      settings: {
        AppleLanguages: ['en_US'],
      },
    }),
  };
  RN.NativeModules.I18nManager = {
    localeIdentifier: 'en_US',
    getConstants: () => ({
      isRTL: false,
      doLeftAndRightSwapInRTL: false,
      localeIdentifier: 'en_US',
    }),
  };
  return RN;
});

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

jest.mock('react-native-calendars', () => ({
  Calendar: 'Calendar',
  CalendarList: 'CalendarList',
  Agenda: 'Agenda',
}));

jest.mock('services/apolloClient', () => ({
  client: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(() => ({ inflection: 'sm' })),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('utils/platformHelper', () => ({
  isDesktop: false,
  isTablet: jest.fn(() => false),
  isiOS: jest.fn(() => false),
  isAndroid: jest.fn(() => true),
  isWeb: false,
  platform: jest.fn(() => ({ OS: 'android' })),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => 'buttonStyle'),
}));

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useNavigationState: jest.fn(() => [{ name: 'TestRoute' }]),
}));

jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: jest.fn(() => 'TestRoute'),
}));

const body = (
  <View>
    <Text style={styles.sectionTitle} label="MONTHLY ADD ON PACKAGES" />
    <Text style={styles.sectionDescription} label="Tamil 1 Month Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Telugu 1 Month Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Malayalam 1 Month Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Kannada 1 Month Free Regional Pack" />
    <Text style={styles.sectionTitle} label="ANNUALLY ADD ON PACKAGES" />
    <Text style={styles.sectionDescription} label="Tamil 1 Year Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Telugu 1 Year Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Malayalam 1 Year Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Kannada 1 Year Free Regional Pack" />
  </View>
);

describe('Test for the component Accordion', () => {
  beforeEach(() => {
    jest.spyOn(LayoutAnimation, 'configureNext');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('render component Accordion', () => {
    render(
      <Accordion title="Recharge Plan" expandIcon="add" collapseIcon="remove">
        {body}
      </Accordion>,
    );
    expect(screen.getByText('Recharge Plan')).toBeTruthy();
  });

  test('snapshot tests for Accordion', () => {
    const component = render(
      <View>
        <Accordion title="Recharge Plan" expandIcon="add" collapseIcon="remove">
          {body}
        </Accordion>
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('toggles accordion open and closed on press', () => {
    const { getByTestId, queryByText } = render(
      <Accordion title="Recharge Plan" expandIcon="add" collapseIcon="remove">
        {body}
      </Accordion>,
    );

    const button = getByTestId('button');
    expect(queryByText('MONTHLY ADD ON PACKAGES')).toBeNull();

    fireEvent.press(button);
    expect(screen.getByText('MONTHLY ADD ON PACKAGES')).toBeTruthy();

    fireEvent.press(button);
    expect(queryByText('MONTHLY ADD ON PACKAGES')).toBeNull();
  });

  test('renders with isOpenDefault true', () => {
    render(
      <Accordion title="Recharge Plan" isOpenDefault>
        {body}
      </Accordion>,
    );
    expect(screen.getByText('MONTHLY ADD ON PACKAGES')).toBeTruthy();
  });

  test('renders with dataCount', () => {
    render(
      <Accordion title="Recharge Plan" dataCount={5}>
        {body}
      </Accordion>,
    );
    expect(screen.getByText('Recharge Plan (5)')).toBeTruthy();
  });

  test('renders with custom accordionStyle', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <Accordion title="Recharge Plan" accordionStyle={customStyle}>
        {body}
      </Accordion>,
    );
    const container = getByTestId('header');
    expect(container.props.style).toMatchObject(customStyle);
  });

  test('renders with custom buttonStyle', () => {
    const customButtonStyle = { padding: 20 };
    render(
      <Accordion title="Recharge Plan" buttonStyle={customButtonStyle}>
        {body}
      </Accordion>,
    );
    expect(screen.getByText('Recharge Plan')).toBeTruthy();
  });

  test('renders with custom titleColor', () => {
    render(
      <Accordion title="Recharge Plan" titleColor="blue">
        {body}
      </Accordion>,
    );
    expect(screen.getByText('Recharge Plan')).toBeTruthy();
  });

  test('renders with custom listStyle', () => {
    const customListStyle = { padding: 10 };
    render(
      <Accordion title="Recharge Plan" listStyle={customListStyle} isOpenDefault>
        {body}
      </Accordion>,
    );
    expect(screen.getByText('MONTHLY ADD ON PACKAGES')).toBeTruthy();
  });

  test('renders with custom icon dimensions', () => {
    render(
      <Accordion title="Recharge Plan" iconHeight={30} iconWidth={30} isDimension>
        {body}
      </Accordion>,
    );
    expect(screen.getByText('Recharge Plan')).toBeTruthy();
  });

  test('renders with subDetails', () => {
    render(
      <Accordion title="Recharge Plan" subDetails="Additional Info">
        {body}
      </Accordion>,
    );
    expect(screen.getByText('Recharge Plan')).toBeTruthy();
  });

  test('renders with subDetailsTextStyle', () => {
    const customSubStyle = { color: 'green' };
    render(
      <Accordion title="Recharge Plan" subDetails="Info" subDetailsTextStyle={customSubStyle}>
        {body}
      </Accordion>,
    );
    expect(screen.getByText('Recharge Plan')).toBeTruthy();
  });

  test('renders with iconStyle', () => {
    const customIconStyle = { tintColor: 'red' };
    render(
      <Accordion title="Recharge Plan" iconStyle={customIconStyle}>
        {body}
      </Accordion>,
    );
    expect(screen.getByText('Recharge Plan')).toBeTruthy();
  });

  test('calls LayoutAnimation on toggle', () => {
    const { getByTestId } = render(<Accordion title="Recharge Plan">{body}</Accordion>);

    const button = getByTestId('button');
    fireEvent.press(button);
    expect(LayoutAnimation.configureNext).toHaveBeenCalled();
  });

  test('renders without children', () => {
    render(<Accordion title="Empty Accordion" />);
    expect(screen.getByText('Empty Accordion')).toBeTruthy();
  });

  test('renders with default expand and collapse icons', () => {
    render(<Accordion title="Default Icons">{body}</Accordion>);
    expect(screen.getByText('Default Icons')).toBeTruthy();
  });
});
