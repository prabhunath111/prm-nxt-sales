import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import ReactMoE, { MoEngageLogger } from 'react-native-moengage';
import MoEReactInbox from 'react-native-moengage-inbox';
import * as platformHelper from 'utils/platformHelper';
import { FORMS } from 'const/strings';
import MoengageNotifications from './MoengageNotifications';

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('utils/platformHelper', () => ({
  isiOS: jest.fn(() => false),
}));

const eventListeners: { [key: string]: (payload: any) => void } = {};
jest.mock('react-native-moengage', () => ({
  setEventListener: jest.fn((event, callback) => {
    eventListeners[event] = callback;
  }),
  initialize: jest.fn(),
  registerForPush: jest.fn(),
  requestPushPermissionAndroid: jest.fn(),
  showInApp: jest.fn(),
  showNudge: jest.fn(),
  getSelfHandledInApp: jest.fn(),
  MoEInitConfig: jest.fn(),
  MoEPushConfig: {
    defaultConfig: jest.fn(),
  },
  MoEngageLogConfig: jest.fn(),
  MoEngageLogLevel: { VERBOSE: 'VERBOSE' },
  MoEngageLogger: {
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock('react-native-moengage-inbox', () => ({
  initialize: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    dummy: (state = {}) => state,
  },
});

describe('Test for the component MoengageNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(eventListeners).forEach((key) => delete eventListeners[key]);
  });

  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <MoengageNotifications />
        </NavigationContainer>
      </Provider>,
    );

  test('render component MoengageNotifications', () => {
    renderComponent();
    expect(screen.getByTestId('moengageTest')).toBeTruthy();
    expect(ReactMoE.initialize).toHaveBeenCalled();
    expect(MoEReactInbox.initialize).toHaveBeenCalled();
  });

  test('registers for push if on iOS', () => {
    (platformHelper.isiOS as jest.Mock).mockReturnValue(true);
    renderComponent();
    expect(ReactMoE.registerForPush).toHaveBeenCalled();
  });

  test('handles pushClicked event with deepLink', () => {
    renderComponent();
    const payload = {
      data: {
        payload: {
          moeFeatures: JSON.stringify({
            richPush: {
              defaultActions: [{ value: 'tpsales://home?param=1' }],
            },
          }),
        },
      },
    };

    act(() => {
      eventListeners.pushClicked(payload);
    });

    expect(mockNavigate).toHaveBeenCalledWith('home');
  });

  test('handles pushClicked event with gcm_webUrl', () => {
    renderComponent();
    const payload = {
      data: {
        payload: {
          gcm_webUrl: 'http://example.com',
        },
      },
    };

    act(() => {
      eventListeners.pushClicked(payload);
    });

    expect(mockNavigate).toHaveBeenCalledWith('http://example.com');
  });

  test('handles pushClicked event with invalid JSON', () => {
    renderComponent();
    const payload = {
      data: {
        payload: {
          moeFeatures: 'invalid json',
        },
      },
    };

    act(() => {
      eventListeners.pushClicked(payload);
    });

    expect(MoEngageLogger.error).toHaveBeenCalledWith('MoE DeepLink parse failed', expect.any(Error));
  });

  test('handles inAppCampaignClicked event', () => {
    renderComponent();
    const campaign = {
      action: {
        navigationUrl: 'tpsales://profile',
      },
    };

    act(() => {
      eventListeners.inAppCampaignClicked(campaign);
    });

    expect(mockNavigate).toHaveBeenCalledWith('profile');
  });

  test('handles inAppCampaignClicked event error', () => {
    renderComponent();
    // Passing navigationUrl as an object to cause .replace() to fail
    const campaign = {
      action: {
        navigationUrl: {},
      },
    };
    act(() => {
      eventListeners.inAppCampaignClicked(campaign);
    });
    expect(MoEngageLogger.error).toHaveBeenCalledWith('InApp DeepLink parse failed', expect.any(Error));
  });

  test('handles pushTokenGenerated event', () => {
    renderComponent();
    const payload = { token: 'abc' };

    act(() => {
      eventListeners.pushTokenGenerated(payload);
    });

    expect(MoEngageLogger.debug).toHaveBeenCalled();
  });

  test('dispatches modal action for demoBoxDetail route', () => {
    renderComponent();
    const campaign = {
      action: {
        navigationUrl: `tpsales://${FORMS.demoBoxDetail}`,
      },
    };

    act(() => {
      eventListeners.inAppCampaignClicked(campaign);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles pushClicked event with missing deepLink and webUrl', () => {
    renderComponent();
    const payload = {
      data: {
        payload: {
          moeFeatures: JSON.stringify({ richPush: {} }),
        },
      },
    };

    act(() => {
      eventListeners.pushClicked(payload);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handles inAppCampaignClicked event with missing deepLink', () => {
    renderComponent();
    const campaign = {
      action: {},
    };

    act(() => {
      eventListeners.inAppCampaignClicked(campaign);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('snapshot tests for MoengageNotifications', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
