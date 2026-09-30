/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTE, STATE_KEY } from 'const';
import { PARTNER_ROLES } from 'const/strings';
import { getGeoLocation } from 'utils/geoLocationHelper';
import { callAction } from 'utils/formBuilderHelper';
import CreateChannelPartner from './CreateChannelPartner';

// Mock dependencies
let mockIsWeb = false;
jest.mock('utils/platformHelper', () => ({
  get isWeb() {
    return mockIsWeb;
  },
}));

let mockRouteNameValue = ROUTE.WEB.CREATE_CHANNEL_PARTNER;
jest.mock('hooks/useCurrentRoute', () => () => ({ routeName: mockRouteNameValue }));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'xl' }),
  BreakPoints: { XL: 'xl', LG: 'lg', MD: 'md', MD_L: 'mdL', SM: 'sm', XS: 'xs' },
}));

jest.mock('utils/geoLocationHelper', () => ({
  getGeoLocation: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('components/sales', () => {
  const { Text, TouchableOpacity, View } = require('react-native');
  return {
    RadioContainer: ({ onSelectionChange, items }: any) => (
      <View testID="radio-container">
        {items?.map((item: any) => <TouchableOpacity key={item.value} testID={`radio-${item.value}`} onPress={() => onSelectionChange(item.value)} />)}
      </View>
    ),
    RegistrationFormBuilder: ({ onSubmit }: any) => (
      <View testID="form-builder">
        <TouchableOpacity testID="submit-nav" onPress={() => onSubmit({}, 'navigation', 'query', 'dest')} />
        <TouchableOpacity testID="submit-submit-nav" onPress={() => onSubmit({}, 'navigationWithSubmit', 'query', 'dest')} />
        <TouchableOpacity testID="submit-capture" onPress={() => onSubmit({}, 'capture', 'query', 'dest')} />
        <TouchableOpacity testID="submit-link" onPress={() => onSubmit({}, 'link', 'query', 'dest')} />
        <TouchableOpacity testID="submit-default" onPress={() => onSubmit({}, 'OTHER', 'query', 'dest')} />
      </View>
    ),
    Text: ({ children, label }: any) => <Text>{label || children}</Text>,
  };
});

describe('CreateChannelPartner Component', () => {
  const mockDispatch = jest.fn();
  const mockState = {
    user: {
      info: {
        roleId: 'AD',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((fn) => fn(mockState));
    mockRouteNameValue = ROUTE.WEB.CREATE_CHANNEL_PARTNER;
    (getGeoLocation as jest.Mock).mockResolvedValue({ latitude: '10', longitude: '20' });
    mockDispatch.mockReturnValue(Promise.resolve({ status: true, route: 'dynamic-route' }));
    mockIsWeb = false;
    (global as any).window = { webkit: { messageHandlers: { cordova_iab: {} } } };
  });

  test('renders correctly and fetches location', async () => {
    render(<CreateChannelPartner stateKey={STATE_KEY.FORM_STATE} />);
    await waitFor(() => {
      expect(getGeoLocation).toHaveBeenCalled();
    });
  });

  test('handles location fetch failure', async () => {
    (getGeoLocation as jest.Mock).mockRejectedValue(new Error('failed'));
    render(<CreateChannelPartner />);
    await waitFor(() => {
      expect(getGeoLocation).toHaveBeenCalled();
    });
  });

  test('updates when filter is changed', async () => {
    render(<CreateChannelPartner />);
    act(() => {
      fireEvent.press(screen.getByTestId('radio-fos'));
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles onSubmit types', async () => {
    render(<CreateChannelPartner />);

    // NAVIGATION
    fireEvent.press(screen.getByTestId('submit-nav'));
    expect(mockNavigate).toHaveBeenCalledWith('dest');

    // SUBMIT_NAVIGATION
    fireEvent.press(screen.getByTestId('submit-submit-nav'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('dynamic-route');
    });

    // LINK
    fireEvent.press(screen.getByTestId('submit-link'));
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    // CAPTURE
    fireEvent.press(screen.getByTestId('submit-capture'));
    expect(callAction).toHaveBeenCalled();

    // DEFAULT
    fireEvent.press(screen.getByTestId('submit-default'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('checks role based logic ASI and ASM', () => {
    mockState.user.info.roleId = PARTNER_ROLES.ASI;
    const { rerender } = render(<CreateChannelPartner />);
    expect(callAction).toHaveBeenCalled();

    mockState.user.info.roleId = PARTNER_ROLES.ASM;
    rerender(<CreateChannelPartner />);
    expect(callAction).toHaveBeenCalled();
  });

  test('webkit location logic', () => {
    mockIsWeb = true;
    render(<CreateChannelPartner />);
    expect(getGeoLocation).toHaveBeenCalled();
  });

  test('different route widths - 360PX', () => {
    mockRouteNameValue = 'multiTvRegistration';
    render(<CreateChannelPartner />);
  });

  test('different route widths - 70P', () => {
    mockRouteNameValue = 'trackDealerFeedback';
    render(<CreateChannelPartner />);
  });

  test('different route widths - 80P', () => {
    mockRouteNameValue = 'eTSKRegistration';
    render(<CreateChannelPartner />);
  });

  test('render for non-AD roles', () => {
    mockState.user.info.roleId = PARTNER_ROLES.fos;
    render(<CreateChannelPartner />);
    expect(screen.queryByTestId('radio-container')).toBeNull();
  });
});
