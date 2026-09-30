import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { STATE_KEY, FIELD_TYPE, SUBMISSION } from 'const';
import DynamicFormBuilder from './DynamicFormBuilder';

const createMockStore = (initialState: any) => ({
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(() => initialState),
});

jest.mock('hooks/useNavigate', () => () => ({
  goBack: jest.fn(),
  goHome: jest.fn(),
  navigate: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  getFormData: jest.fn(() => ({ type: 'GET_FORM_DATA' })),
  fetchOptionData: jest.fn(() => ({ type: 'FETCH_OPTION_DATA' })),
  setFormValues: jest.fn(() => ({ type: 'SET_FORM_VALUES' })),
}));

jest.mock('store/sales/actions/common', () => ({
  setCustomFormData: jest.fn(() => ({ type: 'SET_CUSTOM_FORM_DATA' })),
  reSetErrorMessage: jest.fn(() => ({ type: 'RESET_ERROR_MESSAGE' })),
  reSetCustomAmount: jest.fn(() => ({ type: 'RESET_CUSTOM_AMOUNT' })),
}));

jest.mock('utils/formBuilderHelper', () => ({
  ...jest.requireActual('utils/formBuilderHelper'),
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

describe('DynamicFormBuilder final pass', () => {
  let store: any;

  const createFields = (extra = {}) => ({
    f1: { id: 1, type: FIELD_TYPE.INPUT, label: 'Input', isVisible: 1, hasValue: 1, validation: [], relatedFields: '[]', dependentFields: '[]', dependentDataField: '[]' },
    btn: {
      id: 2,
      type: FIELD_TYPE.BUTTON,
      label: 'Btn',
      isVisible: 1,
      submitType: SUBMISSION.SUBMIT,
      relatedFields: '[]',
      dependentFields: '[]',
      dependentDataField: '[]',
      ...extra,
    },
  });

  const createInitialState = (formData: any = {}, formValues: any = {}) => ({
    form: {
      [STATE_KEY.FORM_STATE]: {
        formData,
        formValues,
        formNavigationData: { params: {} },
        updatedFormFields: {},
        fieldsToDisable: {},
        fieldsToShow: [],
      },
    },
    user: { isRedirection: false },
    common: { errorMessage: '', customFormData: {}, tableFilteredData: [], tableColumns: [] },
    dealerFeedback: { isSubscriberValid: false },
    partnerApproval: { showDynamicNoData: false },
    ui: { isModalLoading: false, bottomModal: {} },
    utility: { isEngValidate: false },
  });

  test('renders basics', () => {
    store = createMockStore(createInitialState(createFields()));
    render(
      <Provider store={store}>
        <DynamicFormBuilder formName="test" onSubmit={() => {}} />
      </Provider>,
    );
    expect(screen.getByText(/Input/i)).toBeTruthy();
  });

  test('handles navigation', () => {
    const mockOnSubmit = jest.fn();
    store = createMockStore(createInitialState(createFields({ submitType: SUBMISSION.NAVIGATION, routeName: 'Home' })));
    render(
      <Provider store={store}>
        <DynamicFormBuilder formName="test" onSubmit={mockOnSubmit} />
      </Provider>,
    );
    fireEvent.press(screen.getByText(/Btn/i));
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
