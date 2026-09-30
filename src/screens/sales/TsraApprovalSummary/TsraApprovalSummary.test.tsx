/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import actions from 'store/sales/actions/form';
import uiActions from 'store/sales/actions/ui';
import TsraApprovalSummary from './TsraApprovalSummary';

const mockUseCurrentRoute = jest.fn();
jest.mock('hooks/useCurrentRoute', () => () => mockUseCurrentRoute());

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('hooks/useParams', () => () => ({
  selectedTab: 'approve',
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'xl' }),
  BreakPoints: { XL: 'xl', LG: 'lg', MD: 'md', SM: 'sm', XS: 'xs' },
}));

jest.mock('store/sales/actions/form', () => ({
  setNavigationData: jest.fn(() => ({ type: 'SET_NAV' })),
  submitForm: jest.fn(() => () => Promise.resolve({ status: true, route: 'SUCCESS_ROUTE' })),
  setUpdatedFormFields: jest.fn(() => ({ type: 'SET_FIELDS' })),
  setMultipleDropdownOptionsData: jest.fn(() => ({ type: 'SET_OPTIONS' })),
}));

jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_MODAL' })),
}));

jest.mock('components/sales', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    RadioContainer: ({ onSelectionChange, selectedValue }: any) => (
      <View testID="radio-container">
        <TouchableOpacity onPress={() => onSelectionChange('reject')} testID="select-reject">
          <Text>Reject</Text>
        </TouchableOpacity>
        <Text testID="selected-value">{selectedValue}</Text>
      </View>
    ),
    RegistrationFormBuilder: ({ onSubmit, formName }: any) => (
      <View testID="form-builder">
        <Text testID="form-name">{formName}</Text>
        <TouchableOpacity onPress={() => onSubmit({ name: 'test' }, 'navigation', 'query', 'NAV_ROUTE')} testID="submit-nav">
          <Text>Submit Nav</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSubmit({ name: 'test' }, 'navigateTo', 'query', 'NAV_ROUTE')} testID="submit-nav-to">
          <Text>Submit Nav To</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSubmit({ name: 'test' }, 'navigationWithSubmit', 'query', 'NAV_ROUTE')} testID="submit-submit-nav">
          <Text>Submit Submit Nav</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSubmit({ name: 'test' }, 'link', 'query', 'NAV_ROUTE')} testID="submit-link">
          <Text>Submit Link</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSubmit({ name: 'test' }, 'DEFAULT', 'query', '')} testID="submit-default">
          <Text>Submit Default</Text>
        </TouchableOpacity>
      </View>
    ),
    Text: ({ label, children }: any) => <Text>{label || children}</Text>,
    Image: ({ iconName }: any) => <View testID={`image-${iconName}`} />,
  };
});

const createMockStore = (state: any) =>
  configureStore({
    reducer: {
      tsraApproval: (s = state.tsraApproval) => s,
      form: (s = { formFields: {} }) => s,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('TsraApprovalSummary Component', () => {
  const initialState = {
    tsraApproval: {
      selectedDealer: { tsraNameNT: 'Dealer', tsraMobileNumber: '123' },
      tsraApprovalListData: { result: [] },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCurrentRoute.mockReturnValue({ routeName: 'TSRA_APPROVAL' });
  });

  test('renders and handles radio selection', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TsraApprovalSummary />
      </Provider>,
    );
    expect(screen.getByTestId('tsraSummary')).toBeTruthy();
    expect(screen.getByTestId('selected-value').children[0]).toBe('approve');

    fireEvent.press(screen.getByTestId('select-reject'));
    expect(screen.getByTestId('selected-value').children[0]).toBe('reject');
  });

  test('handles NAVIGATION submission', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TsraApprovalSummary />
      </Provider>,
    );
    fireEvent.press(screen.getByTestId('submit-nav'));
    expect(actions.setNavigationData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('NAV_ROUTE');
  });

  test('handles SUBMIT_NAVIGATION submission and response', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TsraApprovalSummary />
      </Provider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId('submit-submit-nav'));
    });
    expect(actions.submitForm).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('SUCCESS_ROUTE');
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('handles default submission', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TsraApprovalSummary />
      </Provider>,
    );
    fireEvent.press(screen.getByTestId('submit-default'));
    expect(actions.submitForm).toHaveBeenCalled();
  });

  test('handles submitForm failure', async () => {
    (actions.submitForm as any).mockReturnValueOnce(() => Promise.resolve({ status: false }));
    render(
      <Provider store={createMockStore(initialState)}>
        <TsraApprovalSummary />
      </Provider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId('submit-submit-nav'));
    });
    expect(mockNavigate).not.toHaveBeenCalledWith('SUCCESS_ROUTE');
  });

  test('handles NAVIGATION_TO submission', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TsraApprovalSummary />
      </Provider>,
    );
    fireEvent.press(screen.getByTestId('submit-nav-to'));
    expect(mockNavigate).toHaveBeenCalledWith('NAV_ROUTE');
  });

  test('handles LINK submission', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TsraApprovalSummary />
      </Provider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId('submit-link'));
    });
    expect(actions.submitForm).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('SUCCESS_ROUTE');
  });

  test('handles submission success without route in response', async () => {
    (actions.submitForm as any).mockReturnValueOnce(() => Promise.resolve({ status: true }));
    render(
      <Provider store={createMockStore(initialState)}>
        <TsraApprovalSummary />
      </Provider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId('submit-submit-nav'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('NAV_ROUTE');
  });

  test('updates width style based on routeName', () => {
    const routes = ['multiTvRegistration', 'trackDealerFeedback', 'eTSKRegistration'];
    routes.forEach((route) => {
      mockUseCurrentRoute.mockReturnValue({ routeName: route });
      const { unmount } = render(
        <Provider store={createMockStore(initialState)}>
          <TsraApprovalSummary />
        </Provider>,
      );
      unmount();
    });
  });
});
