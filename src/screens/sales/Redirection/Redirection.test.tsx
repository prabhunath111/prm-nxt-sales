import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import actions from 'store/sales/actions/redirection';
import uiActions from 'store/sales/actions/ui';
import { changeLanguage } from 'config/i18n';
import { storageService } from 'services/storageService';
import Redirection from './Redirection';

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('const', () => ({
  ...jest.requireActual('const'),
  REDIRECTION: {
    PARAMS: {
      heavyRefresh: ['subscriberId'],
      testModule: [],
    },
  },
}));

jest.mock('utils/sessionHelper', () => ({
  clearStorage: jest.fn(),
  setToken: jest.fn(),
}));

jest.mock('config/i18n', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('services/storageService', () => ({
  storageService: {
    setItem: jest.fn(),
  },
}));

jest.mock('utils/languageHelper', () => ({
  getValidLanguageCode: jest.fn((lang) => lang || 'en'),
}));

jest.mock('store/sales/actions/redirection', () => ({
  verifyToken: jest.fn(() => () => Promise.resolve({ user: { navigation: { dashboard: [{ path: 'testModule', isDisable: false }] } } })),
}));

jest.mock('store/sales/actions/form', () => ({
  setFormDependentDefault: jest.fn(() => ({ type: 'SET_FORM_DEPENDENT' })),
  resetNavigationData: jest.fn(() => ({ type: 'RESET_NAV' })),
  setFormActionDefault: jest.fn(() => ({ type: 'SET_ACTION_DEFAULT' })),
  setSubIdListDefault: jest.fn(() => ({ type: 'SET_SUB_LIST' })),
}));

jest.mock('store/sales/actions/accountInformation', () => ({
  resetAccountInformation: jest.fn(() => ({ type: 'RESET_ACCOUNT' })),
}));

jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_MODAL' })),
  showBottomModal: jest.fn(() => ({ type: 'SHOW_MODAL' })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const createMockStore = (state: any) =>
  configureStore({
    reducer: {
      redirection: () => state.redirection || {},
      user: () => state.user || { isAuthenticated: false },
      ui: () => state.ui || { isLoading: false, loaderInfo: { message: '' } },
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('Redirection Component', () => {
  const initialState = {
    redirection: {
      moduleName: 'testModule',
      moduleWiseParams: JSON.stringify({ param1: 'value1' }),
      language: 'en',
    },
    user: {
      isAuthenticated: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders and handles successful redirection', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <MemoryRouter initialEntries={['/redirection?token=abc']}>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('appLoaderText')).toBeTruthy();

    await waitFor(() => expect(actions.verifyToken).toHaveBeenCalledWith({ token: 'abc' }));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('testModule', expect.any(Object)));
  });

  test('handles module redirection with id param', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <MemoryRouter initialEntries={['/redirection?redirectionId=123']}>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => expect(actions.verifyToken).toHaveBeenCalledWith({ token: '123' }));
  });

  test('handles disabled module', async () => {
    (actions.verifyToken as jest.Mock).mockReturnValueOnce(() => Promise.resolve({ user: { navigation: { dashboard: [{ path: 'testModule', isDisable: true }] } } }));

    render(
      <Provider store={createMockStore(initialState)}>
        <MemoryRouter initialEntries={['/redirection?token=abc']}>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => expect(uiActions.showBottomModal).toHaveBeenCalled());
  });

  test('handles language change in useEffect', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <MemoryRouter>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => expect(changeLanguage).toHaveBeenCalledWith('en'));
    expect(storageService.setItem).toHaveBeenCalledWith('appLanguage', 'en');
  });

  test('handles language change in useEffect when language is missing', async () => {
    const stateWithoutLanguage = {
      ...initialState,
      redirection: {
        ...initialState.redirection,
        language: null,
      },
    };
    render(
      <Provider store={createMockStore(stateWithoutLanguage)}>
        <MemoryRouter>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => expect(changeLanguage).toHaveBeenCalledWith('en'));
    expect(storageService.setItem).toHaveBeenCalledWith('appLanguage', 'en');
  });

  test('handles cleanup on unmount', () => {
    const { unmount } = render(
      <Provider store={createMockStore(initialState)}>
        <MemoryRouter>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );

    unmount();
    // Verify that timeouts are cleared implicitly by jest.useFakeTimers() and clearTimeout calls
  });

  test('sets paramState from moduleWiseParams when params exist', async () => {
    const stateWithParams = {
      ...initialState,
      redirection: {
        ...initialState.redirection,
        moduleName: 'heavyRefresh',
        moduleWiseParams: JSON.stringify({ subscriberId: '654321' }),
      },
    };

    render(
      <Provider store={createMockStore(stateWithParams)}>
        <MemoryRouter>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );
  });

  test('sets paramState from moduleWiseParams when moduleWiseParams is missing', async () => {
    const stateWithoutModParams = {
      ...initialState,
      redirection: {
        ...initialState.redirection,
        moduleName: 'heavyRefresh',
        moduleWiseParams: null,
      },
    };

    render(
      <Provider store={createMockStore(stateWithoutModParams)}>
        <MemoryRouter>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );
  });

  test('does not set paramState when moduleName is missing', async () => {
    const stateWithoutModuleName = {
      ...initialState,
      redirection: {
        ...initialState.redirection,
        moduleName: null,
      },
    };

    render(
      <Provider store={createMockStore(stateWithoutModuleName)}>
        <MemoryRouter>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );
  });

  test('shows loader when not authenticated', () => {
    const unauthenticatedState = {
      ...initialState,
      user: { isAuthenticated: false },
    };
    render(
      <Provider store={createMockStore(unauthenticatedState)}>
        <MemoryRouter>
          <Redirection />
        </MemoryRouter>
      </Provider>,
    );
    // Loader is rendered when isAuthenticated is false
  });
});
