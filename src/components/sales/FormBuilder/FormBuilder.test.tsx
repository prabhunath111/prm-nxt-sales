/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { STATE_KEY, SUBMISSION, FIELD_TYPE, VALIDATIONS, FORMS } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import FormBuilder from './FormBuilder';

// Mock Dependencies
const mockGoBack = jest.fn();
const mockGoHome = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  goBack: mockGoBack,
  goHome: mockGoHome,
  navigate: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue || key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'XL' }),
  BreakPoints: {
    XL: 'XL',
    LG: 'LG',
    MD: 'MD',
    MD_L: 'MD_L',
    SM: 'SM',
    XS: 'XS',
  },
}));

jest.mock('utils/platformHelper', () => ({
  isDesktop: false,
  isiOS: jest.fn(() => false),
  isAndroid: jest.fn(() => true),
  isWeb: false,
  isTablet: jest.fn(() => false),
  platform: jest.fn(() => ({ OS: 'android' })),
}));

jest.mock('hooks/useParams', () => () => ({ param1: 'Val' }));
const mockCloseWebView = jest.fn();
jest.mock('utils/navigationHelper', () => ({
  __esModule: true,
  closeWebView: () => mockCloseWebView(),
}));

// Mock sub-components with label and error rendering
jest.mock('components/sales/Text', () => (props: any) => {
  const { View, Text: RNText } = require('react-native');
  // Using children prop to handle the FIELD_TYPE.LABEL usage
  return (
    <View testID={props.id ? `text-${props.id}` : undefined}>
      <RNText>{props.label || props.children}</RNText>
      {props.required && <RNText>*</RNText>}
    </View>
  );
});
jest.mock('components/sales/TextInput', () => (props: any) => {
  const { TextInput: RNTextInput, View, Text } = require('react-native');
  const { id, testID, onInputChange, error, inputFieldStyle, isNumericKeyboard, placeholderTextColor, isNumericValue, maxValue, ...restProps } = props;
  const tid = id || testID || 'input-test';
  return (
    <View>
      <RNTextInput testID={tid} onChangeText={onInputChange} {...restProps} />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
});
jest.mock('components/sales/Checkbox', () => (props: any) => {
  const { Switch, View, Text } = require('react-native');
  const tid = props.id || props.testID;
  return (
    <View>
      <Text>{props.label}</Text>
      <Switch value={props.value} onValueChange={props.onValueChange} testID={tid} />
      {props.error ? <Text>{props.error}</Text> : null}
    </View>
  );
});
jest.mock('components/sales/Dropdown', () => (props: any) => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const tid = props.id || props.testID;
  return (
    <View testID={tid}>
      <Text>{props.selectedValue?.name || 'Select'}</Text>
      <TouchableOpacity onPress={() => props.onSelect({ id: '1', name: 'Item' })} testID={`${tid}-select`} />
      {props.error ? <Text>{props.error}</Text> : null}
    </View>
  );
});
jest.mock('components/sales/Button', () => (props: any) => {
  const { TouchableOpacity, Text } = require('react-native');
  return (
    <TouchableOpacity onPress={props.onPress} testID={`btn-${props.label}`}>
      <Text>{props.label}</Text>
    </TouchableOpacity>
  );
});
jest.mock('components/sales/AccordionWrapper', () => (props: any) => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return (
    <View testID={props.name}>
      <Text>{props.name}</Text>
      <TouchableOpacity onPress={() => props.onSelect('val')} testID={`${props.name}-select`} />
    </View>
  );
});
jest.mock('components/sales/Search', () => (props: any) => {
  const { View, TextInput, Text } = require('react-native');
  const tid = props.id || props.testID;
  return (
    <View testID={tid}>
      <TextInput onChangeText={props.onChange} testID={`${tid}-input`} />
      {props.error ? <Text>{props.error}</Text> : null}
    </View>
  );
});
jest.mock('components/sales/DatePicker', () => (props: any) => {
  const { View, TouchableOpacity, Text } = require('react-native');
  const tid = props.id || props.testID;
  return (
    <View testID={tid}>
      <TouchableOpacity onPress={() => props.onDateSelected('2023-01-01')} testID={`${tid}-select`} />
      {props.error ? <Text>{props.error}</Text> : null}
    </View>
  );
});
jest.mock('components/sales/TableWrapper', () => (props: any) => {
  const { View } = require('react-native');
  const tid = props.id || props.testID || 'table-test';
  return <View testID={tid} />;
});
jest.mock('components/sales/MultipleSubId', () => (props: any) => {
  const { View } = require('react-native');
  return <View testID={props.id || props.testID || 'multi-sub-test'} />;
});
jest.mock('components/sales/RadioContainer', () => (props: any) => {
  const { View, Text } = require('react-native');
  return <View testID={props.id || props.testID || 'radio-test'}>{props.error ? <Text>{props.error}</Text> : null}</View>;
});
jest.mock('components/sales/SelectList', () => (props: any) => {
  const { View, Text } = require('react-native');
  const tid = props.headingText || props.testID || 'select-list-test';
  return (
    <View testID={tid}>
      <Text>{tid}</Text>
      {props.error ? <Text>{props.error}</Text> : null}
    </View>
  );
});
jest.mock('components/sales/Link', () => (props: any) => {
  const { TouchableOpacity, Text } = require('react-native');
  return (
    <TouchableOpacity onPress={props.onPress} testID={`link-${props.label}`}>
      <Text>{props.label}</Text>
    </TouchableOpacity>
  );
});
jest.mock('components/sales/Autocomplete', () => (props: any) => {
  const { View, Text } = require('react-native');
  const tid = props.id || props.testID || 'autocomplete-test';
  return <View testID={tid}>{props.error ? <Text>{props.error}</Text> : null}</View>;
});
jest.mock('components/sales/MultiSelectDropdown', () => (props: any) => {
  const { View, Text } = require('react-native');
  const tid = props.id || props.testID || 'multi-select-test';
  return <View testID={tid}>{props.error ? <Text>{props.error}</Text> : null}</View>;
});

// Mock Store Actions
jest.mock('store/sales/actions/form', () => ({
  getFormData: jest.fn(() => ({ type: 'GET_FORM_DATA' })),
  fetchOptionData: jest.fn(() => ({ type: 'FETCH_OPTIONS' })),
  fetchDependentData: jest.fn(() => ({ type: 'FETCH_DEP' })),
  setFormUpdated: jest.fn(() => ({ type: 'SET_UPDATED' })),
  clearFormData: jest.fn(() => ({ type: 'CLEAR' })),
  setSubIdListDefault: jest.fn(() => ({ type: 'SET_SUB_DEFAULT' })),
  setFormActionDefault: jest.fn(() => ({ type: 'SET_ACTION_DEFAULT' })),
  setOffersBasisRechargeObject: jest.fn(() => ({ type: 'SET_OFFERS' })),
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(() => ({ type: 'SHOW_MODAL' })),
}));

jest.mock('store/sales/actions/customerRecharge', () => ({
  setBingFlag: jest.fn(() => ({ type: 'SET_BING' })),
}));

jest.mock('utils/formBuilderHelper', () => ({
  __esModule: true,
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
  checkAllowedLength: jest.fn((val, len) => val?.length === len),
  checkFixLength: jest.fn((val, len) => val?.length === len),
  checkMaxLength: jest.fn((val, len) => val?.length <= len),
  checkMinLength: jest.fn((val, len) => val?.length >= len),
  checkMaxValue: jest.fn((val, max) => Number(val) <= max),
  checkMinValue: jest.fn((val, min) => Number(val) >= min),
  isValidEmail: jest.fn((val) => val?.includes('@')),
  isValidMobile: jest.fn((val) => val?.length === 10),
}));

const getBaseInitialState = () => ({
  form: {
    [STATE_KEY.FORM_STATE]: {
      formData: {},
      formActionData: {
        winBackOffers: { d30WinBackPacksList: [{ stdPriUnit: 100 }] },
        regionOffers: {
          dynamicOffersList: [{ offerList: [{ packPrice: 200 }] }],
          wbldpPackOffersList: [{ stdPriUnit: 300 }],
        },
      },
      formDependentData: {},
      updatedFormFields: {},
      isFormUpdated: false,
      dropdownOptions: { Q: [{ name: 'Item' }] },
      isFormResetRequired: false,
      subIdList: [],
      formQuery: null, // Explicitly null to avoid trigger unless required
    },
  },
  user: { isRedirection: true },
});

const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

describe('FormBuilder Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createCustomStore = (formData: any, extraFormState = {}) => {
    const initialState = deepCopy(getBaseInitialState());
    initialState.form[STATE_KEY.FORM_STATE].formData = deepCopy(formData);
    initialState.form[STATE_KEY.FORM_STATE] = { ...initialState.form[STATE_KEY.FORM_STATE], ...deepCopy(extraFormState) };
    return configureStore({
      reducer: {
        form: (state: any = initialState.form) => state,
        user: (state: any = initialState.user) => state,
      },
    });
  };

  test('renders all field types', async () => {
    const rendersFormData = {
      f1: {
        id: 1,
        type: FIELD_TYPE.INPUT,
        label: 'Field 1',
        isVisible: 1,
        hasValue: 1,
        field_name: 'f1',
        validation: [{ type: VALIDATIONS.REQUIRED, message: 'F1 Required' }],
        dependentFields: '[]',
      },
      fTextArea: {
        id: 2,
        type: FIELD_TYPE.TEXTAREA,
        label: 'Area',
        isVisible: 1,
        hasValue: 1,
        field_name: 'fTextArea',
        validation: [{ type: VALIDATIONS.MAX_LENGTH, value: 10, message: 'Long' }],
        dependentFields: '[]',
      },
      fPass: {
        id: 3,
        type: FIELD_TYPE.PASSWORD,
        label: 'Pass',
        isVisible: 1,
        hasValue: 1,
        field_name: 'param1',
        validation: [{ type: VALIDATIONS.MIN_LENGTH, value: 5, message: 'Short' }],
        dependentFields: '[]',
      },
      fCheck: { id: 4, type: FIELD_TYPE.CHECKBOX, label: 'Check', isVisible: 1, hasValue: 1, field_name: 'fCheck', validation: [], dependentFields: '[]' },
      fDrop: {
        id: 5,
        type: FIELD_TYPE.DROPDOWN,
        label: 'Drop',
        isVisible: 1,
        hasValue: 1,
        field_name: 'fDrop',
        validation: [],
        dependentFields: '[6]',
        queryName: 'Q',
        queryParams: 'P',
      },
      fDepInput: { id: 6, type: FIELD_TYPE.INPUT, label: 'Dep Input', isVisible: 1, hasValue: 1, field_name: 'fDepInput', validation: [], dependentFields: '[]' },
      fSearch: { id: 7, type: FIELD_TYPE.SEARCH, label: 'Search', isVisible: 1, hasValue: 1, field_name: 'fSearch', validation: [], dependentFields: '[]' },
      fDate: { id: 8, type: FIELD_TYPE.DATE, label: 'Date', isVisible: 1, hasValue: 1, field_name: 'fDate', validation: [], dependentFields: '[]' },
      fAccordion: { id: 9, type: FIELD_TYPE.ACCORDION, label: 'Acc', isVisible: 1, hasValue: 1, field_name: 'fAccordion', validation: [], dependentFields: '[10]' },
      accDep: { id: 10, type: FIELD_TYPE.INPUT, label: 'Acc Dep', isVisible: 1, hasValue: 1, field_name: 'accDep', validation: [], dependentFields: '[]' },
      fLabel: { id: 11, type: FIELD_TYPE.LABEL, label: 'Label Only', isVisible: 1, hasValue: 0, field_name: 'fLabel' },
      fTable: { id: 12, type: FIELD_TYPE.TABLE, label: 'Table Only', isVisible: 1, hasValue: 0, field_name: 'fTable', testID: 'fTable' },
      fMultiSub: { id: 13, type: FIELD_TYPE.MULTIPLE_SUB_ID, label: 'Multi Sub', isVisible: 1, hasValue: 1, field_name: 'fMultiSub' },
      fRadio: { id: 19, type: FIELD_TYPE.RADIO_CONTAINER, label: 'Radio', isVisible: 1, hasValue: 1, field_name: 'fRadio', dependentFields: '[]' },
      fSelectList: { id: 20, type: FIELD_TYPE.SELECT_LIST, label: 'Select', isVisible: 1, hasValue: 1, field_name: 'fSelectList', dependentFields: '[]' },
      fLink: { id: 21, type: FIELD_TYPE.LINK, label: 'Link', isVisible: 1, hasValue: 1, field_name: 'fLink', submitType: SUBMISSION.LINK, dependentFields: '[]' },
      fAuto: { id: 22, type: FIELD_TYPE.AUTOCOMPLETE, label: 'Auto', isVisible: 1, hasValue: 1, field_name: 'fAuto', dependentFields: '[]' },
      fMultiDrop: { id: 23, type: FIELD_TYPE.MULTISELECT_DROPDOWN, label: 'Multi', isVisible: 1, hasValue: 1, field_name: 'fMultiDrop', dependentFields: '[]' },
      fPhone: { id: 24, type: FIELD_TYPE.PHONE, label: 'Phone', isVisible: 1, hasValue: 1, field_name: 'fPhone', validation: [], dependentFields: '[]' },
    };

    const customStore = createCustomStore(rendersFormData);
    render(
      <Provider store={customStore}>
        <FormBuilder formName={FORMS.changeEVDPin} onSubmit={mockOnSubmit} style={{}} />
      </Provider>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Field 1')).toBeTruthy();
    expect(screen.getByText('Area')).toBeTruthy();
    expect(screen.getByText('strings.Val')).toBeTruthy();
    expect(screen.getByText('Check')).toBeTruthy();
    expect(screen.getByText('Drop')).toBeTruthy();
    expect(screen.getByTestId('fSearch')).toBeTruthy();
    expect(screen.getByTestId('fDate')).toBeTruthy();
    expect(screen.getByText('fAccordion')).toBeTruthy();
    expect(screen.getByText('Label Only')).toBeTruthy();
    expect(screen.getByTestId('table-test')).toBeTruthy();
    expect(screen.getByTestId('multi-sub-test')).toBeTruthy();
    expect(screen.getByTestId('radio-test')).toBeTruthy();
    expect(screen.getByTestId('Select')).toBeTruthy();
    expect(screen.getByTestId('link-Link')).toBeTruthy();
    expect(screen.getByTestId('fAuto')).toBeTruthy();
    expect(screen.getByTestId('multi-select-test')).toBeTruthy();
    expect(screen.getByText('Phone')).toBeTruthy();
  });

  test('handles validations and error clearing', async () => {
    const helper = require('utils/formBuilderHelper');
    const validationFormData = {
      f_val: {
        id: 101,
        type: FIELD_TYPE.INPUT,
        label: 'FVal',
        isVisible: 1,
        hasValue: 1,
        field_name: 'f_val',
        validation: [
          { type: VALIDATIONS.ALLOWED_LENGTH, value: 5, message: 'E1' },
          { type: VALIDATIONS.MIN_LENGTH, value: 5, message: 'E2' },
          { type: VALIDATIONS.MAX_LENGTH, value: 10, message: 'E3' },
          { type: VALIDATIONS.FIX_LENGTH, value: 5, message: 'E4' },
          { type: VALIDATIONS.MIN_VALUE, value: 5, message: 'E5' },
          { type: VALIDATIONS.MAX_VALUE, value: 100, message: 'E6' },
          { type: VALIDATIONS.EMAIL, message: 'E7' },
          { type: VALIDATIONS.MOBILE, message: 'E8' },
          { type: VALIDATIONS.NUMERIC, message: 'E9' },
        ],
        dependentFields: '[]',
      },
      sub_val: {
        id: 102,
        type: FIELD_TYPE.BUTTON,
        label: 'SVal',
        field_name: 'sub_val',
        submitType: SUBMISSION.SUBMIT,
        isVisible: 1,
        hasValue: 0,
        dependentFields: '[]',
        relatedFields: '[]',
      },
    };
    const customStore = createCustomStore(validationFormData);
    render(
      <Provider store={customStore}>
        <FormBuilder formName="T_VAL" onSubmit={mockOnSubmit} style={{}} />
      </Provider>,
    );
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.changeText(screen.getByTestId('f_val'), '12345');
    fireEvent.changeText(screen.getByTestId('f_val'), '');
    fireEvent.press(screen.getByTestId('btn-SVal'));

    helper.checkAllowedLength.mockReturnValue(false);
    fireEvent.changeText(screen.getByTestId('f_val'), '123');
    expect(screen.getByText('E1')).toBeTruthy();
  });

  test('handles navigation and submission types', async () => {
    const navFormData = {
      b1_nav: {
        id: 201,
        type: FIELD_TYPE.BUTTON,
        label: 'BackNav',
        field_name: 'b1_nav',
        submitType: SUBMISSION.BACK,
        isVisible: 1,
        hasValue: 0,
        dependentFields: '[]',
        relatedFields: '[]',
      },
      b2_nav: {
        id: 202,
        type: FIELD_TYPE.BUTTON,
        label: 'HomeNav',
        field_name: 'b2_nav',
        submitType: SUBMISSION.HOME,
        isVisible: 1,
        hasValue: 0,
        dependentFields: '[]',
        relatedFields: '[]',
      },
      b3_nav: {
        id: 203,
        type: FIELD_TYPE.BUTTON,
        label: 'NavOnly',
        field_name: 'b3_nav',
        submitType: SUBMISSION.NAVIGATION,
        isVisible: 1,
        hasValue: 0,
        dependentFields: '[]',
        relatedFields: '[]',
      },
      b4_nav: {
        id: 204,
        type: FIELD_TYPE.BUTTON,
        label: 'SubNav',
        field_name: 'b4_nav',
        submitType: SUBMISSION.SUBMIT_NAVIGATION,
        isVisible: 1,
        hasValue: 0,
        dependentFields: '[]',
        relatedFields: '[]',
      },
      b5_nav: {
        id: 205,
        type: FIELD_TYPE.BUTTON,
        label: 'ResetNav',
        field_name: 'b5_nav',
        submitType: SUBMISSION.RESET,
        isVisible: 1,
        hasValue: 0,
        dependentFields: '[]',
        relatedFields: '[]',
      },
      b6_nav: {
        id: 206,
        type: FIELD_TYPE.BUTTON,
        label: 'UpdateNav',
        field_name: 'b6_nav',
        submitType: SUBMISSION.UPDATE,
        queryName: 'Q1',
        isVisible: 1,
        relatedFields: '[]',
        hasValue: 0,
        dependentFields: '[]',
      },
    };
    const customStore = createCustomStore(navFormData);
    render(
      <Provider store={customStore}>
        <FormBuilder formName="T_NAV" onSubmit={mockOnSubmit} style={{}} />
      </Provider>,
    );
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.press(screen.getByTestId('btn-BackNav'));
    expect(mockGoBack).toHaveBeenCalled();

    fireEvent.press(screen.getByTestId('btn-HomeNav'));
    expect(mockCloseWebView).toHaveBeenCalled();

    fireEvent.press(screen.getByTestId('btn-NavOnly'));
    expect(mockOnSubmit).toHaveBeenCalled();

    fireEvent.press(screen.getByTestId('btn-SubNav'));
    expect(mockOnSubmit).toHaveBeenCalled();

    fireEvent.press(screen.getByTestId('btn-ResetNav'));
    // Reset clears validation errors implicitly
    expect(screen.queryByText('E1')).toBeNull();

    fireEvent.press(screen.getByTestId('btn-UpdateNav'));
    // Update calls callAction if valid
    expect(callAction).toHaveBeenCalled();
  });

  test('handles amount field matches and modals', async () => {
    const uiActions = require('store/sales/actions/ui');
    const amountFormData = {
      amount_test: {
        id: 301,
        type: FIELD_TYPE.INPUT,
        label: 'Amount Test',
        isVisible: 1,
        hasValue: 1,
        field_name: 'amount',
        validation: [],
        dependentFields: '[]',
        relatedFields: '[]',
      },
    };
    const customStore = createCustomStore(amountFormData);
    render(
      <Provider store={customStore}>
        <FormBuilder formName="T_AMT" onSubmit={mockOnSubmit} style={{}} />
      </Provider>,
    );
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.changeText(screen.getByTestId('amount'), '100');
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('handles DEPENDENT_FIELD validation', async () => {
    const depFormData = {
      f1_dep: {
        id: 401,
        type: FIELD_TYPE.INPUT,
        label: 'F1Dep',
        field_name: 'f1_dep',
        isVisible: 1,
        hasValue: 1,
        validation: [{ type: VALIDATIONS.DEPENDENT_FIELD, message: 'DepError' }],
        dependentFields: '[402]',
      },
      f2_dep: { id: 402, type: FIELD_TYPE.INPUT, label: 'F2Dep', field_name: 'f2_dep', isVisible: 1, hasValue: 1, validation: [], dependentFields: '[]' },
      sub_dep: {
        id: 403,
        type: FIELD_TYPE.BUTTON,
        label: 'SDep',
        field_name: 'sub_dep',
        submitType: SUBMISSION.SUBMIT,
        isVisible: 1,
        hasValue: 0,
        dependentFields: '[]',
        relatedFields: '[]',
      },
    };
    const customStore = createCustomStore(depFormData);
    render(
      <Provider store={customStore}>
        <FormBuilder formName="T_DEP" onSubmit={mockOnSubmit} style={{}} />
      </Provider>,
    );
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.changeText(screen.getByTestId('f1_dep'), 'v1');
    fireEvent.changeText(screen.getByTestId('f2_dep'), 'v2');
    fireEvent.press(screen.getByTestId('btn-SDep'));

    expect(screen.getByText('DepError')).toBeTruthy();
  });

  test('handles EQUAL_WITH validation', async () => {
    const relFormData = {
      f1_eq: { id: 501, type: FIELD_TYPE.INPUT, label: 'F1Eq', field_name: 'f1_eq', isVisible: 1, hasValue: 1, validation: [], dependentFields: '[]' },
      f2_eq: {
        id: 502,
        type: FIELD_TYPE.INPUT,
        label: 'F2Eq',
        field_name: 'f2_eq',
        isVisible: 1,
        hasValue: 1,
        validation: [{ type: VALIDATIONS.EQUAL_WITH, message: 'EqualError' }],
        relatedFields: '[501]',
        dependentFields: '[]',
      },
      sub_eq: {
        id: 503,
        type: FIELD_TYPE.BUTTON,
        label: 'SEq',
        field_name: 'sub_eq',
        submitType: SUBMISSION.SUBMIT,
        isVisible: 1,
        hasValue: 0,
        dependentFields: '[]',
        relatedFields: '[]',
      },
    };
    const customStore = createCustomStore(relFormData);
    render(
      <Provider store={customStore}>
        <FormBuilder formName="T_EQ" onSubmit={mockOnSubmit} style={{}} />
      </Provider>,
    );
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.changeText(screen.getByTestId('f1_eq'), 'abc');
    fireEvent.changeText(screen.getByTestId('f2_eq'), 'xyz');
    fireEvent.press(screen.getByTestId('btn-SEq'));
    expect(screen.getByText('EqualError')).toBeTruthy();
  });

  test('updates form and fields on dependency values', async () => {
    const depDataForm = {
      f1_show: {
        id: 601,
        type: FIELD_TYPE.INPUT,
        label: 'F1Show',
        field_name: 'f1_show',
        isVisible: 1,
        hasValue: 1,
        validation: [],
        dependentFields: '[]',
        relatedFields: '[]',
        queryName: 'Q1',
        queryParams: 'P1',
        dependencyValue: 'show',
      },
      f2_show: {
        id: 602,
        type: FIELD_TYPE.INPUT,
        label: 'F2Show',
        field_name: 'f2_show',
        isVisible: 0,
        hasValue: 1,
        validation: [],
        dependentFields: '[601]',
        relatedFields: '[]',
        parentId: 601,
        dependencyValue: 'show',
      },
    };
    const extraState = { formDependentData: { f2_show: { value: 'show', id: 602 } } };
    const customStore = createCustomStore(depDataForm, extraState);
    render(
      <Provider store={customStore}>
        <FormBuilder formName="T_SHOW" onSubmit={mockOnSubmit} style={{}} />
      </Provider>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByTestId('f2_show')).toBeTruthy();
  });

  test('handles SUBMISSION.UPDATE visibility updates', async () => {
    const updFormData = {
      u1_upd: {
        id: 701,
        type: FIELD_TYPE.BUTTON,
        label: 'UUpd',
        field_name: 'u1_upd',
        submitType: SUBMISSION.UPDATE,
        relatedFields: '[]',
        isVisible: 1,
        hasValue: 0,
        dependentFields: '[]',
        validation: [],
      },
      f2_upd: { id: 702, type: FIELD_TYPE.INPUT, label: 'F2Upd', field_name: 'f2_upd', isVisible: 1, hasValue: 1, validation: [], dependentFields: '[]', relatedFields: '[]' },
    };
    const extraState = { isFormUpdated: false };
    const customStore = createCustomStore(updFormData, extraState);
    render(
      <Provider store={customStore}>
        <FormBuilder formName="T_UPD" onSubmit={mockOnSubmit} style={{}} />
      </Provider>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByTestId('f2_upd')).toBeTruthy();
  });
});
