/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import useCurrentRoute from 'hooks/useCurrentRoute';
import useNavigate from 'hooks/useNavigate';
import actions from 'store/sales/actions/form';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import uiActions from 'store/sales/actions/ui';
import { STATE_KEY, SUBMISSION, DYNAMIC_FORM_WIDTH_360PX, DYNAMIC_FORM_WIDTH_50P, DYNAMIC_FORM_WIDTH_70P, DYNAMIC_FORM_WIDTH_80P, DYNAMIC_FORM_WIDTH_100P } from 'const';
import { DYNAMIC_FORM_WIDTH_50P_WITH_PADDING } from 'const/strings';
import DynamicSalesNext from './DynamicSalesNext';

// Mocking dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('hooks/useCurrentRoute', () => jest.fn());
jest.mock('hooks/useNavigate', () => jest.fn());
jest.mock('store/sales/actions/form', () => ({
  setFormValues: jest.fn(),
  resetDropdownData: jest.fn(),
  setNavigationData: jest.fn(),
  submitForm: jest.fn(),
}));
jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    resetDropdownData: jest.fn(),
  },
}));
jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(),
}));

const mockOnSubmit = jest.fn();
jest.mock('components/sales/DynamicFormBuilder', () => {
  const { View, Button } = require('react-native');
  return (props: any) => {
    mockOnSubmit.mockImplementation(props.onSubmit);
    return (
      <View testID="mock-form-builder">
        <Button testID="submit-button" title="Submit" onPress={() => props.onSubmit({ key: 'value' }, props.submitType || 'SUBMIT', 'query', 'nextRoute')} />
      </View>
    );
  };
});

describe('DynamicSalesNext', () => {
  const mockDispatch = jest.fn((action) => (typeof action === 'function' ? action() : action));
  const mockNavigate = jest.fn();
  const mockRouteName = 'testRoute';

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as unknown as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: mockRouteName });
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector({ user: { info: { user: 'test' } } }));
  });

  test('should dispatch initial actions on mount', () => {
    render(<DynamicSalesNext />);
    expect(actions.setFormValues).toHaveBeenCalledWith({ user: 'test' });
    expect(formAction.resetDropdownData).toHaveBeenCalledWith({});
  });

  test('should hide bottom modal if stateKey is FORM_STATE', () => {
    render(<DynamicSalesNext stateKey={STATE_KEY.FORM_STATE} />);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('should set containerWidthStyle based on routeName for all branches', () => {
    const routeWidths = [
      { route: DYNAMIC_FORM_WIDTH_360PX[0] },
      { route: DYNAMIC_FORM_WIDTH_50P[0] },
      { route: DYNAMIC_FORM_WIDTH_70P[0] },
      { route: DYNAMIC_FORM_WIDTH_80P[0] },
      { route: DYNAMIC_FORM_WIDTH_100P[0] },
      { route: DYNAMIC_FORM_WIDTH_50P_WITH_PADDING[0] },
    ];

    routeWidths.forEach(({ route }) => {
      (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: route });
      render(<DynamicSalesNext />);
    });
  });

  test('should handle onSubmit with NAVIGATION type', () => {
    render(<DynamicSalesNext />);
    mockOnSubmit({ val: 'test' }, SUBMISSION.NAVIGATION, 'query', 'nextRoute');
    expect(actions.setNavigationData).toHaveBeenCalledWith({ val: 'test' }, 'query', 'testRoute', 'testRoute');
    expect(mockNavigate).toHaveBeenCalledWith('nextRoute');
  });

  test('should handle onSubmit with NAVIGATION_TO type', () => {
    render(<DynamicSalesNext />);
    mockOnSubmit({ val: 'test' }, SUBMISSION.NAVIGATION_TO, 'query', 'nextRoute');
    expect(actions.setNavigationData).toHaveBeenCalledWith({ val: 'test' }, 'query', 'testRoute', 'testRoute');
    expect(mockNavigate).toHaveBeenCalledWith('nextRoute');
  });

  test('should handle onSubmit with SUBMIT_NAVIGATION type and success', async () => {
    const mockSubmitForm = actions.submitForm as jest.Mock;
    const promise = Promise.resolve({ status: true, route: 'successRoute' });
    mockSubmitForm.mockReturnValue(promise);

    render(<DynamicSalesNext />);
    await mockOnSubmit({ val: 'test' }, SUBMISSION.SUBMIT_NAVIGATION, 'query', 'nextRoute');

    // Wait for promise to resolve
    await promise;

    expect(actions.setNavigationData).toHaveBeenCalledWith({ val: 'test' }, 'query', 'testRoute', 'testRoute');
    expect(actions.submitForm).toHaveBeenCalledWith({ val: 'test' }, 'query');
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('successRoute');
  });

  test('should handle onSubmit with LINK type and success (default route)', async () => {
    const mockSubmitForm = actions.submitForm as jest.Mock;
    const promise = Promise.resolve({ status: true });
    mockSubmitForm.mockReturnValue(promise);

    render(<DynamicSalesNext />);
    await mockOnSubmit({ val: 'test' }, SUBMISSION.LINK, 'query', 'nextRoute');

    await promise;

    expect(mockNavigate).toHaveBeenCalledWith('nextRoute');
  });

  test('should handle onSubmit with SUBMIT_NAVIGATION type and failure', async () => {
    const mockSubmitForm = actions.submitForm as jest.Mock;
    const promise = Promise.resolve({ status: false });
    mockSubmitForm.mockReturnValue(promise);

    render(<DynamicSalesNext />);
    await mockOnSubmit({ val: 'test' }, SUBMISSION.SUBMIT_NAVIGATION, 'query', 'nextRoute');

    await promise;

    expect(mockNavigate).not.toHaveBeenCalledWith('nextRoute');
  });

  test('should handle default onSubmit case', () => {
    render(<DynamicSalesNext />);
    mockOnSubmit({ val: 'test' }, 'OTHER', 'query', 'nextRoute');
    expect(actions.submitForm).toHaveBeenCalledWith({ val: 'test' }, 'query', '', mockNavigate);
  });

  test('should use customFormName if provided', () => {
    render(<DynamicSalesNext customFormName="customForm" />);
    mockOnSubmit({ val: 'test' }, SUBMISSION.NAVIGATION, 'query', 'nextRoute');
    expect(actions.setNavigationData).toHaveBeenCalledWith({ val: 'test' }, 'query', 'customForm', 'testRoute');
  });
});
