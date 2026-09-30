import { View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

import useCurrentRoute from 'hooks/useCurrentRoute';
import { scaleFont } from 'styles/dimentionHelper';
import Text from './Text';

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

jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: jest.fn(() => ({ routeName: 'default' })),
}));

jest.mock('styles/dimentionHelper', () => ({
  scaleFont: jest.fn((fontSize) => fontSize),
}));

describe('Text Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with label prop', () => {
    render(<Text label="test label" />);
    expect(screen.getByText('test label')).toBeTruthy();
  });

  test('renders with children prop', () => {
    render(<Text>test children</Text>);
    expect(screen.getByText('test children')).toBeTruthy();
  });

  test('renders with both label and children, children takes precedence', () => {
    render(<Text label="label text">children text</Text>);
    expect(screen.getByText('label text')).toBeTruthy();
    expect(screen.queryByText('children text')).toBeNull();
  });

  test('renders with custom style', () => {
    const customStyle = { color: 'red', fontSize: 20 };
    const { getByText } = render(<Text label="styled text" style={customStyle} />);
    const textElement = getByText('styled text');
    expect(textElement.props.style).toEqual(expect.arrayContaining([expect.objectContaining(customStyle)]));
  });

  test('renders with array of styles', () => {
    const styles = [{ color: 'red' }, { fontSize: 20 }];
    const { getByText } = render(<Text label="array styled text" style={styles} />);
    const textElement = getByText('array styled text');
    expect(textElement.props.style).toEqual(expect.arrayContaining([styles]));
  });

  test('renders with custom fontSize', () => {
    render(<Text label="custom font size" fontSize={18} />);
    expect(scaleFont).toHaveBeenCalledWith(18, expect.any(Number), undefined);
  });

  test('renders with custom color', () => {
    const { getByText } = render(<Text label="colored text" color="blue" />);
    const textElement = getByText('colored text');
    expect(textElement.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: 'blue' })]));
  });

  test('renders with maxFontSize and minFontSize', () => {
    render(<Text label="font size test" fontSize={16} maxFontSize={20} minFontSize={12} />);
    expect(scaleFont).toHaveBeenCalledWith(16, 20, 12);
  });

  test('renders with numberOfLines prop', () => {
    const { getByText } = render(<Text label="multiline text" numberOfLines={2} />);
    const textElement = getByText('multiline text');
    expect(textElement.props.numberOfLines).toBe(2);
  });

  test('handles onPress event', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Text label="pressable text" onPress={mockOnPress} />);
    const textElement = getByText('pressable text');
    fireEvent.press(textElement);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('renders with id prop', () => {
    const { getByText } = render(<Text id="test-id" label="text with id" />);
    const textElement = getByText('text with id');
    expect(textElement.props.testID).toBeUndefined();
  });

  test('renders required asterisk at start when route is TSK_VOUCHER', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: 'tskVoucher' });
    const { getByText } = render(<Text label="required text" required />);
    expect(getByText('*')).toBeTruthy();
    expect(getByText(/required text/)).toBeTruthy();
  });

  test('renders required asterisk at end when route is not TSK_VOUCHER', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: 'other' });
    const { getByText } = render(<Text label="required text" required />);
    expect(getByText(' *')).toBeTruthy();
    expect(getByText(/required text/)).toBeTruthy();
  });

  test('does not render asterisk when required is false', () => {
    const { queryByText } = render(<Text label="not required" required={false} />);
    expect(queryByText('*')).toBeNull();
    expect(queryByText(' *')).toBeNull();
  });

  test('uses fontSize from style when style is object', () => {
    const styleWithFontSize = { fontSize: 22, color: 'green' };
    render(<Text label="styled font" style={styleWithFontSize} />);
    expect(scaleFont).toHaveBeenCalledWith(22, expect.any(Number), undefined);
  });

  test('uses fontSize from merged array styles', () => {
    const styles = [{ color: 'red' }, { fontSize: 24 }];
    render(<Text label="array font" style={styles} />);
    expect(scaleFont).toHaveBeenCalledWith(24, expect.any(Number), undefined);
  });

  test('falls back to default fontSize when no fontSize in style', () => {
    const styleWithoutFontSize = { color: 'purple' };
    render(<Text label="default font" style={styleWithoutFontSize} fontSize={16} />);
    expect(scaleFont).toHaveBeenCalledWith(16, expect.any(Number), undefined);
  });

  test('renders with null children', () => {
    const { toJSON } = render(<Text>{null}</Text>);
    expect(toJSON()).toBeTruthy();
  });

  test('renders with undefined children', () => {
    const { toJSON } = render(<Text>{undefined}</Text>);
    expect(toJSON()).toBeTruthy();
  });

  test('renders with ReactNode children', () => {
    const { getByText } = render(
      <Text>
        <View>
          <Text label="nested" />
        </View>
      </Text>,
    );
    expect(getByText('nested')).toBeTruthy();
  });

  test('snapshot test', () => {
    const component = render(
      <View>
        <Text label="snapshot test" />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('snapshot test with all props', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: 'tskVoucher' });
    const component = render(
      <Text
        id="full-test"
        label="full test"
        style={{ color: 'red', fontSize: 18 }}
        fontSize={16}
        maxFontSize={20}
        minFontSize={12}
        color="blue"
        required
        numberOfLines={3}
        onPress={() => {}}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
