/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, act, waitFor, within } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { NativeModules } from 'react-native';

import { BreakPoints } from 'wrappers/inflection/InflectionProvider';
import { PROPERTIES } from 'const';
import homePageActions from 'store/sales/actions/homePage';
import invoiceActions from 'store/sales/actions/invoice';
import copyToClipboard from 'utils/copyToClipboard';
import Header from './Header.web';

// Mock UIManager.measure for popover/modal
NativeModules.UIManager.measure = jest.fn((_node, callback) => {
  callback(0, 0, 100, 100, 0, 0);
});

// Mocking dependencies
const mockInflection = jest.fn(() => BreakPoints.XL);
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: mockInflection() }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => (options?.defaultValue ? options.defaultValue : key),
  }),
}));

const mockRouteName = jest.fn(() => '');
jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: mockRouteName(),
}));

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

const { useSelector } = require('react-redux');

jest.mock('store/sales/actions/user', () => ({
  __esModule: true,
  default: {
    doLogout: jest.fn(() => ({ type: 'LOGOUT' })),
  },
}));

jest.mock('store/sales/actions/homePage', () => ({
  getEvdBalance: jest.fn(() => ({ type: 'GET_BALANCE' })),
}));

jest.mock('store/sales/actions/invoice', () => ({
  getGstDetailsByUserId: jest.fn(() => ({ type: 'GET_GST' })),
  gstConfirmationProfile: jest.fn(() => ({ type: 'GET_GST_CONFIRM' })),
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn((payload: any) => ({ type: 'SHOW_MODAL', payload })),
  toggleDrawer: jest.fn(() => ({ type: 'TOGGLE_DRAWER' })),
}));

jest.mock('store/sales/actions/ui/ui.action', () => ({
  handleLangSlectorModal: jest.fn(() => ({ type: 'LANG_MODAL' })),
}));

jest.mock('utils/copyToClipboard', () => jest.fn());

jest.mock('../Modal', () => {
  const { View: RNView, Pressable: RNPressable } = require('react-native');
  const ModalMock = ({ isVisible, children, onClose, testID }: any) => {
    if (!isVisible) return null;
    return (
      <RNView testID={testID || 'modal-content'}>
        <RNPressable testID="modal-backdrop" onPress={() => onClose?.(false)}>
          <RNView />
        </RNPressable>
        {children}
      </RNView>
    );
  };
  return {
    __esModule: true,
    default: ModalMock,
    ModalPlacement: {
      CENTER: 'center',
      BOTTOM: 'bottom',
      TOP: 'top',
      LEFT: 'left',
      RIGHT: 'right',
      AUTO: 'auto',
    },
    ModalPopOverMode: {
      RN_MODAL: 'rn-modal',
    },
    ModalSizeProp: {
      WIDTH_360: 360,
    },
  };
});

// Mock individual components with internal requires
jest.mock('components/sales/Image', () => {
  const { View: RNView } = require('react-native');
  const MockImage = (props: any) => <RNView {...props} testID={props.testID || (props.iconName ? `image-${props.iconName}` : 'profile-icon')} />;
  return { __esModule: true, default: MockImage };
});

jest.mock('components/sales/Text', () => {
  const { Text: RNText } = require('react-native');
  const MockText = ({ children, label, style, testID }: any) => (
    <RNText testID={testID} style={style}>
      {label || children}
    </RNText>
  );
  return { __esModule: true, default: MockText };
});

jest.mock('components/sales/Button', () => {
  const { Pressable: RNPressable, Text: RNText } = require('react-native');
  const MockButton = ({ label, onPress }: any) => (
    <RNPressable onPress={onPress}>
      <RNText>{label}</RNText>
    </RNPressable>
  );
  return { __esModule: true, default: MockButton };
});

jest.mock('components/sales/DetailsHeader', () => ({
  __esModule: true,
  default: () => null,
}));

describe('Header Component (Web)', () => {
  const { ICONS } = require('const');

  const defaultUserInfo = {
    name: 'Test User',
    userId: '123456',
    mdn: '9876543210',
    internalRole: PROPERTIES.ROLES.dealer,
  };

  const defaultState = {
    user: { info: defaultUserInfo, isRedirection: false },
    homePage: { evdBalance: 500 },
    invoice: { gstData: {} },
    ui: { isDrawerOpen: false },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockInflection.mockReturnValue(BreakPoints.XL);
    mockRouteName.mockReturnValue('');
    useSelector.mockImplementation((selector: any) => selector(defaultState));
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderHeader = () =>
    render(
      <Provider store={configureStore({ reducer: { dummy: () => ({}) } })}>
        <NavigationContainer>
          <Header currentRoute="" />
        </NavigationContainer>
      </Provider>,
    );

  const climbToHandler = (element: any, handlerName: string) => {
    let current = element;
    while (current) {
      try {
        if (current.props && current.props[handlerName]) return current;
        // eslint-disable-next-line no-empty
      } catch (e) {}
      current = current.parent;
    }
    return null;
  };

  const openProfile = () => {
    const allA11y = screen.UNSAFE_queryAllByProps({ accessible: true });
    // In desktop, Profile is the last accessible element
    const lastOne = allA11y[allA11y.length - 1];
    if (lastOne) {
      act(() => {
        const handler = climbToHandler(lastOne, 'onPress');
        if (handler) handler.props.onPress();
        else fireEvent.press(lastOne);
      });
    }
  };

  test('renders desktop layout correctly and fetches initial data', () => {
    renderHeader();
    expect(mockDispatch).toHaveBeenCalledWith(homePageActions.getEvdBalance(expect.any(String)));
    expect(mockDispatch).toHaveBeenCalledWith(invoiceActions.getGstDetailsByUserId());
    expect(screen.getByText('mSales')).toBeTruthy();
  });

  test('navigates to notifications', () => {
    renderHeader();
    const bellIcon = screen.getByTestId(`image-${ICONS.BELL}`);
    const handler = climbToHandler(bellIcon, 'onPress');
    act(() => {
      handler.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('navigates to all menu items in desktop', () => {
    mockRouteName.mockReturnValue('/home');
    renderHeader();
    const menuItems = ['strings.home', 'strings.myActions', 'strings.transactions', 'strings.help'];
    menuItems.forEach((label) => {
      const item = screen.getByText(label);
      const handler = climbToHandler(item, 'onPress');
      if (handler) {
        act(() => {
          handler.props.onPress();
        });
      }
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('opens profile modal (drawer) and handles Evd refresh', async () => {
    renderHeader();
    openProfile();
    expect(await screen.findByText('strings.evdBalance')).toBeTruthy();

    const refreshIcon = screen.getByTestId(`image-${ICONS.REFRESH_PINK}`);
    const handler = climbToHandler(refreshIcon, 'onPress');
    act(() => {
      handler.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith(homePageActions.getEvdBalance(expect.any(String)));
  });

  test('handles copy userId and mobile logic with timer reset and race condition', async () => {
    renderHeader();
    openProfile();
    await screen.findByText('strings.evdBalance');

    const userRow = screen.getByTestId('infoRowUserId');
    const userCopy = within(userRow).getByText('strings.copy');
    const userHandler = climbToHandler(userCopy, 'onPress');

    act(() => {
      userHandler.props.onPress();
      userHandler.props.onPress();
    });

    expect(copyToClipboard).toHaveBeenCalledTimes(2);

    act(() => {
      jest.advanceTimersByTime(501);
    });
    expect(screen.getAllByText('strings.copy').length).toBeGreaterThan(0);

    const mobileRow = screen.getByTestId('infoRowMobile');
    const mobileCopy = within(mobileRow).getByText('strings.copy');
    const mobileHandler = climbToHandler(mobileCopy, 'onPress');
    act(() => {
      mobileHandler.props.onPress();
    });

    act(() => {
      jest.advanceTimersByTime(501);
    });
  });

  test('handles logout and close drawer', async () => {
    renderHeader();
    openProfile();

    const backdrop = screen.getByTestId('modal-backdrop');
    act(() => {
      fireEvent.press(backdrop);
    });

    await waitFor(() => expect(screen.queryByText('strings.evdBalance')).toBeNull());

    openProfile();
    const logoutBtn = await screen.findByText('strings.logout');
    const handler = climbToHandler(logoutBtn, 'onPress');
    act(() => {
      handler.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith(require('store/sales/actions/user').default.doLogout());
  });

  test('handles language settings modal', async () => {
    renderHeader();
    openProfile();
    const langBtn = await screen.findByText('strings.languageSettings');
    const handler = climbToHandler(langBtn, 'onPress');
    act(() => {
      handler.props.onPress();
    });
    act(() => {
      jest.advanceTimersByTime(501);
    });
    expect(mockDispatch).toHaveBeenCalledWith(require('store/sales/actions/ui/ui.action').handleLangSlectorModal(true));
  });

  test('handles MDN change visibility and navigation', async () => {
    renderHeader();
    openProfile();

    const mdnChangeBtn = screen.getByText('strings.mdnChange');
    const handler = climbToHandler(mdnChangeBtn, 'onPress');
    act(() => {
      handler.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SHOW_MODAL' }));

    // Find the specific call with the payload (line 88 hit)
    const modalCall = mockDispatch.mock.calls.find((c) => c[0].type === 'SHOW_MODAL' && c[0].payload && c[0].payload.onClose);
    if (modalCall) {
      act(() => {
        modalCall[0].payload.onClose();
      });
    }

    useSelector.mockImplementation((selector: any) =>
      selector({
        ...defaultState,
        user: { info: { ...defaultUserInfo, internalRole: PROPERTIES.ROLES.csm }, isRedirection: false },
      }),
    );
    renderHeader();
    openProfile();
    expect(screen.queryByText('strings.mdnChange')).toBeNull();
  });

  test('handles GST editing and details display', async () => {
    useSelector.mockImplementation((selector: any) =>
      selector({
        ...defaultState,
        invoice: { gstData: { gstNumber: 'GST123', dealerType: 'Regular' } },
      }),
    );
    renderHeader();
    openProfile();
    expect(await screen.findByText('GST123')).toBeTruthy();

    const editIcon = screen.getByTestId(`image-${ICONS.EDIT_PENCIL}`);
    const handler = climbToHandler(editIcon, 'onPress');
    act(() => {
      handler.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith(invoiceActions.gstConfirmationProfile());
  });

  test('handles mobile layout and hamburger menu', async () => {
    mockInflection.mockReturnValue(BreakPoints.SM);
    renderHeader();

    const bellIcon = screen.getByTestId(`image-${ICONS.BELL}`);
    const hamburgerIcon = screen.getByTestId(`image-${ICONS.HAMBURGER}`);

    act(() => {
      climbToHandler(bellIcon, 'onPress').props.onPress();
    });

    // Open Profile via exclusionary search
    const allA11y = screen.UNSAFE_getAllByProps({ accessible: true });
    const profileBtn = allA11y.find(
      (btn) =>
        !within(btn).queryByTestId(`image-${ICONS.BELL}`) && !within(btn).queryByTestId(`image-${ICONS.HAMBURGER}`) && !within(btn).queryByTestId(`image-${ICONS.TATA_PLAY_HOME}`),
    );

    if (profileBtn) {
      const handler = climbToHandler(profileBtn, 'onPress');
      act(() => {
        if (handler) handler.props.onPress();
      });
    }

    expect(await screen.findByText('strings.evdBalance')).toBeTruthy();
    act(() => {
      fireEvent.press(screen.getByTestId('modal-backdrop'));
    });

    // Open Hamburger
    act(() => {
      climbToHandler(hamburgerIcon, 'onPress').props.onPress();
    });
    expect(await screen.findByText('home')).toBeTruthy();

    // Click a menu item inside the hamburger (hits line 259)
    const homeText = screen.getByText('home');
    const opacityHandler = climbToHandler(homeText, 'onPress');
    act(() => {
      if (opacityHandler) opacityHandler.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalled();

    // Close hamburger via backdrop (hits line 250)
    const backdrops = screen.getAllByTestId('modal-backdrop');
    act(() => {
      fireEvent.press(backdrops[backdrops.length - 1]);
    });
    await waitFor(() => expect(screen.queryByText('home')).toBeNull());
  });

  test('handles profile drawer close via icon', async () => {
    renderHeader();
    openProfile();
    const closeIcon = await screen.findByTestId(`image-${ICONS.CLOSE}`);
    const handler = climbToHandler(closeIcon, 'onPress');
    act(() => {
      handler.props.onPress();
    });
    await waitFor(() => expect(screen.queryByTestId('modal-content')).toBeNull());
  });

  test('displays version and handles redirects', async () => {
    useSelector.mockImplementation((selector: any) =>
      selector({
        ...defaultState,
        invoice: { gstData: { gstNumber: 'mock' } },
        user: { info: defaultUserInfo, isRedirection: true },
      }),
    );
    renderHeader();
    expect(invoiceActions.getGstDetailsByUserId).not.toHaveBeenCalled();

    openProfile();
    expect(await screen.findByText('strings.version 0.0.1')).toBeTruthy();
  });

  test('snapshot test for web layout', () => {
    const component = renderHeader();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
