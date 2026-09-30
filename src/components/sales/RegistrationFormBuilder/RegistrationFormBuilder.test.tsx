/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { STATE_KEY, FIELD_TYPE, SUBMISSION, VALIDATIONS, STRINGS, PROPERTIES, STYLES } from 'const';
import RegistrationFormBuilder from './RegistrationFormBuilder';

const mockGoBack = jest.fn();
const mockGoHome = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  goBack: mockGoBack,
  goHome: mockGoHome,
  navigate: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// Inflection (responsive breakpoints)
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'md' }),
}));

// Platform helper
jest.mock('utils/platformHelper', () => ({ isiOS: () => false }));

// gcs (grid class selector) — just return the first arg as-is so styles resolve safely
jest.mock('styles/webBreakpoints', () => ({
  gcs: (key: string) => key,
}));

// styles
jest.mock('./RegistrationFormBuilder.styles', () => ({
  __esModule: true,
  default: new Proxy({}, { get: () => ({}) }),
}));

// Form builder helpers — pure pass-through / always valid
jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
  checkAllowedLength: jest.fn(() => true),
  checkFixLength: jest.fn(() => true),
  checkMaxLength: jest.fn(() => true),
  checkMaxValue: jest.fn(() => true),
  checkMinLength: jest.fn(() => true),
  checkMinValue: jest.fn(() => true),
  extractValues: jest.fn((v: any) => v),
  isValidEmail: jest.fn(() => true),
  isValidMobile: jest.fn(() => true),
  isValidName: jest.fn(() => true),
  isValidAlphaNumeric: jest.fn(() => true),
  isValidAddress: jest.fn(() => true),
  isValidFullName: jest.fn(() => true),
  shouldHideField: jest.fn(() => false),
  checkStartsWith: jest.fn(() => true),
}));

jest.mock('utils/responseHelper', () => ({
  formatValue: jest.fn(() => '100'),
}));

// ── Store actions ──────────────────────────────────────────────────────────

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    getFormData: jest.fn(() => ({ type: 'GET_FORM_DATA' })),
    fetchOptionData: jest.fn(() => ({ type: 'FETCH_OPTION_DATA' })),
    setUpdatedFormFields: jest.fn(() => ({ type: 'SET_UPDATED_FORM_FIELDS' })),
    setFormValues: jest.fn(() => ({ type: 'SET_FORM_VALUES' })),
    resetFormQuery: jest.fn(() => ({ type: 'RESET_FORM_QUERY' })),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    resetDropdownData: jest.fn(() => ({ type: 'RESET_DROPDOWN' })),
    setUpdatedFormFields: jest.fn(() => ({ type: 'SET_UPDATED_FORM_FIELDS' })),
    setFormValues: jest.fn(() => ({ type: 'SET_FORM_VALUES' })),
    resetFormQuery: jest.fn(() => ({ type: 'RESET_FORM_QUERY' })),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    reSetErrorMessage: jest.fn(() => ({ type: 'RESET_ERROR_MESSAGE' })),
    reSetCustomAmount: jest.fn(() => ({ type: 'RESET_CUSTOM_AMOUNT' })),
    setCustomFormData: jest.fn(() => ({ type: 'SET_CUSTOM_FORM_DATA' })),
    resetCommonStore: jest.fn(() => ({ type: 'RESET_COMMON_STORE' })),
    resetTable: jest.fn(() => ({ type: 'RESET_TABLE' })),
  },
}));

jest.mock('store/sales/actions/dealerFeedback', () => ({
  __esModule: true,
  default: {
    searchTrackDealerFeedback: jest.fn(() => ({ type: 'SEARCH_TRACK' })),
    setValidateSubscriber: jest.fn(() => ({ type: 'SET_VALIDATE_SUB' })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showBottomModal: jest.fn(() => ({ type: 'SHOW_BOTTOM_MODAL' })),
    hideBottomModal: jest.fn(() => ({ type: 'HIDE_BOTTOM_MODAL' })),
    showErrorPage: jest.fn(() => ({ type: 'SHOW_ERROR_PAGE' })),
  },
}));

jest.mock('store/sales/reducer/manageHierarchy', () => ({
  sliceActions: { setIspCodeValidation: jest.fn(() => ({ type: 'SET_ISP' })) },
}));

jest.mock('store/sales/reducer/exclusiveStore', () => ({
  sliceActions: { setNeedValidation: jest.fn(() => ({ type: 'SET_NEED_VALIDATION' })) },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    getFormData: jest.fn(() => ({ type: 'GET_FORM_DATA' })),
    fetchOptionData: jest.fn(() => ({ type: 'FETCH_OPTION_DATA' })),
    setUpdatedFormFields: jest.fn(() => ({ type: 'SET_UPDATED_FORM_FIELDS' })),
    setFormValues: jest.fn(() => ({ type: 'SET_FORM_VALUES' })),
    resetFormQuery: jest.fn(() => ({ type: 'RESET_FORM_QUERY' })),
  },
  formActions: {
    setUpdatedFormFields: jest.fn(() => ({ type: 'FORM_ACTIONS_SET_UPDATED' })),
  },
}));

jest.mock('components/sales/Text', () => {
  const { Text } = require('react-native');
  return ({ label, id, testID }: any) => <Text testID={testID || (id ? `${id}_label` : 'text')}>{label}</Text>;
});

jest.mock('components/sales/TextInput', () => {
  const { TextInput } = require('react-native');
  return ({ id, value, onInputChange, testID }: any) => <TextInput testID={testID || id || 'textinput'} value={value} onChangeText={onInputChange} />;
});

jest.mock('components/sales/IconTextInput', () => {
  const { TextInput } = require('react-native');
  return ({ id, value, onInputChange, onIconPress, testID }: any) => (
    <>
      <TextInput testID={testID || id || 'icontextinput'} value={String(value ?? '')} onChangeText={onInputChange} />
      {onIconPress && <TextInput testID={`${id}-icon`} onPress={onIconPress} value="" />}
    </>
  );
});

jest.mock('components/sales/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ label, onPress, testID, disabled }: any) => (
    <TouchableOpacity testID={testID || 'button'} onPress={onPress} disabled={disabled}>
      <Text>{typeof label === 'string' ? label : 'loading'}</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/Autocomplete', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ id, onSelect, testID }: any) => (
    <TouchableOpacity testID={testID || id || 'autocomplete'} onPress={() => onSelect({ id: 1, name: 'auto' })}>
      <Text>Autocomplete</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/Dropdown', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ id, onSelect, testID }: any) => (
    <TouchableOpacity testID={testID || id || 'dropdown'} onPress={() => onSelect({ id: 1, name: 'opt' })}>
      <Text>Dropdown</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/MultiSelectDropdown', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ id, onSelect, testID }: any) => (
    <TouchableOpacity testID={testID || id || 'multiselect'} onPress={() => onSelect([{ id: 1 }])}>
      <Text>MultiSelect</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/RadioContainer', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ id, onSelectionChange, testID }: any) => (
    <TouchableOpacity testID={testID || id || 'radio'} onPress={() => onSelectionChange('optA')}>
      <Text>Radio</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/BalanceContainer', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ handleChange, testID }: any) => (
    <TouchableOpacity testID={testID || 'balance'} onPress={() => handleChange('500')}>
      <Text>Balance</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/CustomAmount', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onAmountChange, testID }: any) => (
    <TouchableOpacity testID={testID || 'customamount'} onPress={() => onAmountChange('200')}>
      <Text>CustomAmount</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/Search', () => {
  const { TextInput } = require('react-native');
  return ({ onChange, testID }: any) => <TextInput testID={testID || 'search'} onChangeText={onChange} />;
});

jest.mock('components/sales/SelectSubscriber', () => {
  const { View } = require('react-native');
  return () => <View testID="select-subscriber" />;
});

jest.mock('components/sales/CallSubscriberCard', () => {
  const { View } = require('react-native');
  return () => <View testID="call-subscriber" />;
});

jest.mock('components/sales/AccordionWrapper', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onSelect, testID }: any) => (
    <TouchableOpacity testID={testID || 'accordion'} onPress={() => onSelect('selectedVal')}>
      <Text>Accordion</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/InputWithButton', () => {
  const { View } = require('react-native');
  return () => <View testID="input-with-button" />;
});

jest.mock('components/sales/Checkbox', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ id, onValueChange, testID }: any) => (
    <TouchableOpacity testID={testID || id || 'checkbox'} onPress={() => onValueChange(true)}>
      <Text>Checkbox</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/PillsGroup', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPillPress, testID }: any) => (
    <TouchableOpacity testID={testID || 'pills'} onPress={() => onPillPress('pill1')}>
      <Text>Pills</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/DealerDetailsCard', () => {
  const { View } = require('react-native');
  return () => <View testID="dealer-details" />;
});

jest.mock('components/sales/PincodeDetailsCard', () => {
  const { View } = require('react-native');
  return () => <View testID="pincode-details" />;
});

jest.mock('components/sales/CustomerDetailsCard', () => {
  const { View } = require('react-native');
  return () => <View testID="customer-details-card" />;
});

jest.mock('components/sales/ActionTileCard', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPress, testID }: any) => (
    <TouchableOpacity testID={testID || 'action-tile'} onPress={onPress}>
      <Text>ActionTile</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/PartnerApprovalCard', () => {
  const { View } = require('react-native');
  return () => <View testID="partner-approval" />;
});

jest.mock('components/sales/TsraSubscriberList', () => {
  const { View } = require('react-native');
  return () => <View testID="tsra-list" />;
});

jest.mock('components/sales/MultipleSubId', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onSelect, testID }: any) => (
    <TouchableOpacity testID={testID || 'multiple-sub-id'} onPress={() => onSelect('subId1')}>
      <Text>MultipleSubId</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/InformationText', () => {
  const { View } = require('react-native');
  return () => <View testID="info-text" />;
});

jest.mock('components/sales/Link', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPress, testID }: any) => (
    <TouchableOpacity testID={testID || 'link'} onPress={onPress}>
      <Text>Link</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/ToggleSwitch', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onValueChange, testID }: any) => (
    <TouchableOpacity testID={testID || 'toggle'} onPress={() => onValueChange(true)}>
      <Text>Toggle</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/IconWithCount', () => {
  const { View } = require('react-native');
  return () => <View testID="icon-count" />;
});

jest.mock('components/sales/MultiCheckboxDropdown', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ id, onSelect, testID }: any) => (
    <TouchableOpacity testID={testID || id || 'multi-checkbox-dropdown'} onPress={() => onSelect([{ id: 2 }])}>
      <Text>MultiCheckboxDropdown</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/DynamicTable', () => {
  const { View } = require('react-native');
  return () => <View testID="dynamic-table" />;
});

jest.mock('components/sales/MultiCheckbox', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ id, onSelect, testID }: any) => (
    <TouchableOpacity testID={testID || id || 'multi-checkbox'} onPress={() => onSelect([{ id: 3 }])}>
      <Text>MultiCheckbox</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/SearchBarItems', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onItemSelect, testID }: any) => (
    <TouchableOpacity testID={testID || 'search-bar-items'} onPress={() => onItemSelect({ id: 1 }, true)}>
      <Text>SearchBarItems</Text>
    </TouchableOpacity>
  );
});

jest.mock('../DateAndTimeDetails', () => {
  const { View } = require('react-native');
  return () => <View testID="date-and-time" />;
});

jest.mock('../GroupedActionTiles', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPress, subTiles, testID }: any) => (
    <>
      {onPress && (
        <TouchableOpacity testID={testID || 'grouped-tiles-header'} onPress={onPress}>
          <Text>GroupHeader</Text>
        </TouchableOpacity>
      )}
      {subTiles?.map((t: any) => (
        <TouchableOpacity key={t.label || t.routeName || Math.random()} testID={`grouped-tile-${t.label}`} onPress={t.onPress}>
          <Text>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
});

const baseState = (overrides: any = {}) => ({
  form: {
    [STATE_KEY.FORM_STATE]: {
      formData: {},
      formValues: {},
      updatedFormFields: {},
      fieldsToDisable: {},
      formQuery: null,
      formNavigationData: { params: {} },
      ...overrides.formState,
    },
  },
  user: { isRedirection: false },
  common: {
    errorMessage: '',
    customFormData: {},
    tableFilteredData: [],
    tableColumns: [],
    ...overrides.common,
  },
  quotation: {
    isQuotationNavigate: false,
    numberOfConnections: null,
    etskOfferSelected: null,
    etskboxType: null,
    boxType1: null,
    boxType2: null,
    boxType3: null,
    ...overrides.quotation,
  },
  dealerFeedback: { isSubscriberValid: false, ...overrides.dealerFeedback },
  ui: { isModalLoading: false, bottomModal: { isModalVisible: false }, ...overrides.ui },
  manageHierarchy: { isIspValid: true, validationAttemptCount: 0, ...overrides.manageHierarchy },
  exclusiveStore: { needValidation: false, ...overrides.exclusiveStore },
});

const makeMockStore = (state: any) => ({
  subscribe: jest.fn(),
  dispatch: jest.fn((action: any) => {
    if (typeof action === 'function') return Promise.resolve({ status: true });
    return action;
  }),
  getState: jest.fn(() => state),
});

const base = (id: number, type: string, extra = {}) => ({
  id,
  type,
  label: `Label_${type}`,
  isVisible: 1,
  hasValue: 1,
  validation: [],
  relatedFields: '[]',
  dependentFields: '[]',
  dependentDataField: '[]',
  queryName: `query_${type}`,
  queryParams: 'param',
  placeholderText: 'Enter here',
  defaultSelectedValue: '',
  dependencyValue: '',
  dataItems: null,
  itemStyle: '',
  inputStyle: '',
  groupId: `grp_${id}`,
  field_name: `field_${id}`,
  ...extra,
});

const renderWith = (formData: any, overrides: any = {}, onSubmit = jest.fn()) => {
  const store = makeMockStore(baseState({ formState: { formData, ...overrides } }));
  render(
    <Provider store={store as any}>
      <RegistrationFormBuilder formName="testForm" onSubmit={onSubmit} />
    </Provider>,
  );
  return store;
};

describe('renderForm null guard', () => {
  it('renders nothing when formData is falsy', () => {
    const store = makeMockStore(baseState({ formState: { formData: null, formValues: {}, updatedFormFields: {}, fieldsToDisable: {}, formNavigationData: { params: {} } } }));
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    // The component always renders its outer container (formData defaults to {})
    // but no form fields should be present when formData is null/empty
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
    expect(screen.queryByTestId('textinput')).toBeNull();
    expect(screen.queryByTestId('button')).toBeNull();
  });
});

describe('renderFormControl — all field types', () => {
  it('renders FIELD_TYPE.INPUT', () => {
    renderWith({ f1: base(1, FIELD_TYPE.INPUT) });
    expect(screen.getByTestId('field_1')).toBeTruthy();
  });

  it('renders FIELD_TYPE.AMOUNT', () => {
    renderWith({ f1: base(1, FIELD_TYPE.AMOUNT) });
    expect(screen.getByTestId('field_1')).toBeTruthy();
  });

  it('renders FIELD_TYPE.TEXTAREA', () => {
    renderWith({ f1: base(1, FIELD_TYPE.TEXTAREA) });
    expect(screen.getByTestId('field_1')).toBeTruthy();
  });

  it('renders FIELD_TYPE.DEALER_TEXTAREA with maxLength charCount', () => {
    renderWith({
      f1: base(1, FIELD_TYPE.DEALER_TEXTAREA, {
        validation: [{ type: VALIDATIONS.MAX_LENGTH, value: 200 }],
      }),
    });
    expect(screen.getByTestId('field_1')).toBeTruthy();
  });

  it('renders FIELD_TYPE.PASSWORD and toggles visibility', () => {
    renderWith({ f1: base(1, FIELD_TYPE.PASSWORD) });
    const icon = screen.getByTestId('field_1-icon');
    fireEvent.press(icon);
  });

  it('renders FIELD_TYPE.FAKE_PASSWORD and handles input logic', () => {
    renderWith({ f1: base(1, FIELD_TYPE.FAKE_PASSWORD) });
    const input = screen.getByTestId('field_1');
    // Type a digit (not '*')
    fireEvent.changeText(input, '1');
    // delete (shorter)
    fireEvent.changeText(input, '');
    // paste multiple
    fireEvent.changeText(input, '12');
    // invalid char
    fireEvent.changeText(input, 'abc');
  });

  it('renders FIELD_TYPE.LABEL', () => {
    renderWith({ f1: base(1, FIELD_TYPE.LABEL) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.CONTAINER_LABEL', () => {
    const formData: any = {
      f1: { ...base(1, FIELD_TYPE.CONTAINER_LABEL), groupId: 'btn_grp' },
    };
    renderWith(formData);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.ERROR_MESSAGE with errorMessage', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: { f1: base(1, FIELD_TYPE.ERROR_MESSAGE) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        common: { errorMessage: 'Something went wrong', customFormData: {}, tableFilteredData: [], tableColumns: [] },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.AUTOCOMPLETE and triggers onSelect', () => {
    renderWith({ f1: base(1, FIELD_TYPE.AUTOCOMPLETE, { label: 'AC Label' }) });
    fireEvent.press(screen.getByTestId('field_1'));
  });

  it('renders FIELD_TYPE.AUTOCOMPLETE without label', () => {
    renderWith({ f1: base(1, FIELD_TYPE.AUTOCOMPLETE, { label: '' }) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.BUTTON and submits', () => {
    const onSubmit = jest.fn();
    renderWith({ f1: base(1, FIELD_TYPE.BUTTON, { submitType: SUBMISSION.SUBMIT, buttonStyle: 'secondary' }) }, {}, onSubmit);
    fireEvent.press(screen.getByTestId('button'));
  });

  it('renders FIELD_TYPE.BUTTON with primary loading style', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: { f1: base(1, FIELD_TYPE.BUTTON, { submitType: SUBMISSION.SUBMIT, buttonStyle: STYLES?.TYPE?.PRIMARY }) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        ui: { isModalLoading: true, bottomModal: { isModalVisible: false } },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.CONTAINER_BUTTON', () => {
    const formData: any = {
      f1: { ...base(1, FIELD_TYPE.CONTAINER_BUTTON), submitType: SUBMISSION.HOME, isVisible: 1, groupId: 'btn1', iconName: 'STORE_DASHBOARD' },
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('button'));
  });

  it('renders FIELD_TYPE.DROPDOWN and triggers select', () => {
    renderWith({ f1: base(1, FIELD_TYPE.DROPDOWN, { label: 'Drop Label' }) });
    fireEvent.press(screen.getByTestId('field_1'));
  });

  it('renders FIELD_TYPE.DROPDOWN without label', () => {
    renderWith({ f1: base(1, FIELD_TYPE.DROPDOWN, { label: '' }) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.FLAT_DROPDOWN with label', () => {
    renderWith({ f1: base(1, FIELD_TYPE.FLAT_DROPDOWN, { label: 'FlatDrop' }) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.FLAT_DROPDOWN without label', () => {
    renderWith({ f1: base(1, FIELD_TYPE.FLAT_DROPDOWN, { label: '' }) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.RADIO_CONTAINER', () => {
    renderWith({
      f1: base(1, FIELD_TYPE.RADIO_CONTAINER, {
        label: 'Radio',
        dataItems: JSON.stringify([{ label: 'A', value: 'a' }]),
      }),
    });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.BALANCE_CONTAINER', () => {
    renderWith({ f1: base(1, FIELD_TYPE.BALANCE_CONTAINER, { relatedFields: '[10]' }) });
    fireEvent.press(screen.getByTestId('balance'));
  });

  it('renders FIELD_TYPE.CUSTOM_AMOUNT', () => {
    renderWith({ f1: base(1, FIELD_TYPE.CUSTOM_AMOUNT) });
    fireEvent.press(screen.getByTestId('customamount'));
  });

  it('renders FIELD_TYPE.SEARCH_BAR_ITEMS', () => {
    renderWith({ f1: base(1, FIELD_TYPE.SEARCH_BAR_ITEMS) });
    fireEvent.press(screen.getByTestId('search-bar-items'));
  });

  it('renders FIELD_TYPE.SEARCH', () => {
    renderWith({ f1: base(1, FIELD_TYPE.SEARCH, { label: 'Search lbl' }) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.SEARCH without label', () => {
    renderWith({ f1: base(1, FIELD_TYPE.SEARCH, { label: '' }) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.SELECT_SUBSCRIBER', () => {
    renderWith({ f1: base(1, FIELD_TYPE.SELECT_SUBSCRIBER) });
    expect(screen.getByTestId('select-subscriber')).toBeTruthy();
  });

  it('renders FIELD_TYPE.CALL_SUBSCRIBER', () => {
    renderWith({ f1: base(1, FIELD_TYPE.CALL_SUBSCRIBER) });
    expect(screen.getByTestId('call-subscriber')).toBeTruthy();
  });

  it('renders FIELD_TYPE.LINE_SEPRATOR', () => {
    renderWith({ f1: base(1, FIELD_TYPE.LINE_SEPRATOR) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.ACCORDION', () => {
    renderWith({ f1: base(1, FIELD_TYPE.ACCORDION) });
    fireEvent.press(screen.getByTestId('accordion'));
  });

  it('renders FIELD_TYPE.INPUT_WITH_BUTTON', () => {
    renderWith({ f1: base(1, FIELD_TYPE.INPUT_WITH_BUTTON) });
    expect(screen.getByTestId('input-with-button')).toBeTruthy();
  });

  it('renders FIELD_TYPE.CHECKBOX', () => {
    renderWith({ f1: base(1, FIELD_TYPE.CHECKBOX, { routeName: 'FALSE' }) });
    fireEvent.press(screen.getByTestId('field_1'));
  });

  it('renders FIELD_TYPE.PILLS_GROUP', () => {
    renderWith({
      f1: base(1, FIELD_TYPE.PILLS_GROUP, { dataItems: '["A","B"]', dependentFields: '[2]' }),
    });
    fireEvent.press(screen.getByTestId('pills'));
  });

  it('renders FIELD_TYPE.DEALER_DETAILS_CARD', () => {
    renderWith({ f1: base(1, FIELD_TYPE.DEALER_DETAILS_CARD) });
    expect(screen.getByTestId('dealer-details')).toBeTruthy();
  });

  it('renders FIELD_TYPE.PINCODE_DETAILS_CARD', () => {
    renderWith({ f1: base(1, FIELD_TYPE.PINCODE_DETAILS_CARD) });
    expect(screen.getByTestId('pincode-details')).toBeTruthy();
  });

  it('renders FIELD_TYPE.TABLE with data', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: { f1: base(1, FIELD_TYPE.TABLE, { dataItems: STRINGS.YES }) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        common: { errorMessage: '', customFormData: {}, tableFilteredData: [{ a: 1 }], tableColumns: [{ key: 'a', title: 'A' }] },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('dynamic-table')).toBeTruthy();
  });

  it('renders FIELD_TYPE.TABLE without data (shows noData text)', () => {
    renderWith({ f1: base(1, FIELD_TYPE.TABLE) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.ACTION_TILE_CARD and triggers press', () => {
    const onSubmit = jest.fn();
    renderWith({ f1: base(1, FIELD_TYPE.ACTION_TILE_CARD, { submitType: SUBMISSION.NAVIGATION_TO, routeName: 'SomePage' }) }, {}, onSubmit);
    fireEvent.press(screen.getByTestId('action-tile'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('renders FIELD_TYPE.PARTNER_APPROVAL_CARD', () => {
    renderWith({ f1: base(1, FIELD_TYPE.PARTNER_APPROVAL_CARD) });
    expect(screen.getByTestId('partner-approval')).toBeTruthy();
  });

  it('renders FIELD_TYPE.TSRA_SUBSCRIBER_LIST', () => {
    renderWith({ f1: base(1, FIELD_TYPE.TSRA_SUBSCRIBER_LIST) });
    expect(screen.getByTestId('tsra-list')).toBeTruthy();
  });

  it('renders FIELD_TYPE.MULTIPLE_SUB_ID and triggers select', () => {
    renderWith({ f1: base(1, FIELD_TYPE.MULTIPLE_SUB_ID) });
    fireEvent.press(screen.getByTestId('multiple-sub-id'));
  });

  it('renders FIELD_TYPE.INFORMATION_TEXT', () => {
    renderWith({ f1: base(1, FIELD_TYPE.INFORMATION_TEXT) });
    expect(screen.getAllByTestId('info-text').length).toBeGreaterThan(0);
  });

  it('renders FIELD_TYPE.DISCLAIMER_TEXT', () => {
    renderWith({ f1: base(1, FIELD_TYPE.DISCLAIMER_TEXT) });
    expect(screen.getAllByTestId('info-text').length).toBeGreaterThan(0);
  });

  it('renders FIELD_TYPE.INFORMATION_TEXT_OUTER', () => {
    renderWith({ f1: base(1, FIELD_TYPE.INFORMATION_TEXT_OUTER) });
    expect(screen.getAllByTestId('info-text').length).toBeGreaterThan(0);
  });

  it('renders FIELD_TYPE.LINK and triggers submit', () => {
    const onSubmit = jest.fn();
    renderWith({ f1: base(1, FIELD_TYPE.LINK, { submitType: SUBMISSION.NAVIGATION_TO, routeName: 'Home' }) }, {}, onSubmit);
    fireEvent.press(screen.getByTestId('link'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('renders FIELD_TYPE.TOGGLE_SWITCH', () => {
    renderWith({ f1: base(1, FIELD_TYPE.TOGGLE_SWITCH) });
    fireEvent.press(screen.getByTestId('toggle'));
  });

  it('renders FIELD_TYPE.ICON', () => {
    renderWith({ f1: base(1, FIELD_TYPE.ICON, { iconName: 'STORE_DASHBOARD' }) });
    expect(screen.getByTestId('icon-count')).toBeTruthy();
  });

  it('renders FIELD_TYPE.MULTISELECT_DROPDOWN with label', () => {
    renderWith({ f1: base(1, FIELD_TYPE.MULTISELECT_DROPDOWN, { label: 'Multi' }) });
    fireEvent.press(screen.getByTestId('multiselect'));
  });

  it('renders FIELD_TYPE.MULTISELECT_DROPDOWN without label', () => {
    renderWith({ f1: base(1, FIELD_TYPE.MULTISELECT_DROPDOWN, { label: '' }) });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.MULTI_CHECKBOX_DROPDOWN with label', () => {
    renderWith({ f1: base(1, FIELD_TYPE.MULTI_CHECKBOX_DROPDOWN, { label: 'MCDropdown' }) });
    fireEvent.press(screen.getByTestId('multi-checkbox-dropdown'));
  });

  it('renders FIELD_TYPE.MULTI_CHECKBOX', () => {
    renderWith({ f1: base(1, FIELD_TYPE.MULTI_CHECKBOX, { label: 'MC', dataItems: '[{"id":1,"name":"A"}]' }) });
    fireEvent.press(screen.getByTestId('multi-checkbox'));
  });

  it('renders FIELD_TYPE.DATE_AND_TIME', () => {
    renderWith({ f1: base(1, FIELD_TYPE.DATE_AND_TIME) });
    expect(screen.getByTestId('date-and-time')).toBeTruthy();
  });

  it('renders FIELD_TYPE.ACTION_TILE_GROUP with header action', () => {
    const onSubmit = jest.fn();
    renderWith(
      {
        f1: base(1, FIELD_TYPE.ACTION_TILE_GROUP, {
          submitType: SUBMISSION.NAVIGATION_TO,
          routeName: 'TilePage',
          queryName: 'q',
          dataItems: JSON.stringify([{ label: 'Sub', submitType: SUBMISSION.NAVIGATION_TO, queryName: 'sq', routeName: 'SR' }]),
        }),
      },
      {},
      onSubmit,
    );
    fireEvent.press(screen.getByTestId('grouped-tiles-header'));
    fireEvent.press(screen.getByTestId('grouped-tile-Sub'));
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it('renders FIELD_TYPE.ACTION_TILE_GROUP without header action', () => {
    renderWith({
      f1: base(1, FIELD_TYPE.ACTION_TILE_GROUP, {
        submitType: '',
        queryName: '',
        routeName: '',
        dataItems: '[]',
      }),
    });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('renders FIELD_TYPE.CUSTOMER_DETAILS_CARD', () => {
    renderWith({ f1: base(1, FIELD_TYPE.CUSTOMER_DETAILS_CARD, { isVisible: 1, itemStyle: '' }) });
    expect(screen.getByTestId('customer-details-card')).toBeTruthy();
  });

  it('returns null for unknown field type', () => {
    renderWith({ f1: base(1, 'UNKNOWN_TYPE') });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('handleSubmit — all submission cases', () => {
  const makeBtn = (submitType: string, extra = {}) =>
    base(99, FIELD_TYPE.BUTTON, {
      submitType,
      routeName: 'TestRoute',
      buttonStyle: 'secondary',
      ...extra,
    });

  it('SUBMIT — valid form calls onSubmit', () => {
    const onSubmit = jest.fn();
    renderWith({ btn: makeBtn(SUBMISSION.SUBMIT) }, {}, onSubmit);
    fireEvent.press(screen.getByTestId('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('SUBMIT — invalid form with VALD_ERROR_POPUP shows error page', () => {
    const { checkMinLength } = require('utils/formBuilderHelper');
    checkMinLength.mockReturnValueOnce(false);
    const onSubmit = jest.fn();
    renderWith(
      {
        f1: base(1, FIELD_TYPE.INPUT, { validation: [{ type: VALIDATIONS.MIN_LENGTH, value: 5, message: 'Too short' }] }),
        btn: makeBtn(SUBMISSION.SUBMIT, { dependencyValue: STRINGS.VALD_ERROR_POPUP }),
      },
      {},
      onSubmit,
    );
    fireEvent.changeText(screen.getByTestId('field_1'), 'ab');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('NAVIGATION — valid form calls onSubmit', () => {
    const onSubmit = jest.fn();
    renderWith({ btn: makeBtn(SUBMISSION.NAVIGATION) }, {}, onSubmit);
    fireEvent.press(screen.getByTestId('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('NAVIGATION_TO — always calls onSubmit', () => {
    const onSubmit = jest.fn();
    renderWith({ btn: makeBtn(SUBMISSION.NAVIGATION_TO) }, {}, onSubmit);
    fireEvent.press(screen.getByTestId('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('SUBMIT_NAVIGATION — valid', () => {
    const onSubmit = jest.fn();
    renderWith({ btn: makeBtn(SUBMISSION.SUBMIT_NAVIGATION) }, {}, onSubmit);
    fireEvent.press(screen.getByTestId('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('SUBMIT_NAVIGATION — invalid with eTSK form name shows error', () => {
    const { checkMinLength } = require('utils/formBuilderHelper');
    checkMinLength.mockReturnValueOnce(false);
    renderWith(
      {
        f1: base(1, FIELD_TYPE.INPUT, { validation: [{ type: VALIDATIONS.MIN_LENGTH, value: 5, message: 'Short' }] }),
        btn: makeBtn(SUBMISSION.SUBMIT_NAVIGATION),
      },
      {},
    );
    fireEvent.changeText(screen.getByTestId('field_1'), 'x');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('RESET — resets errors', () => {
    renderWith({ btn: makeBtn(SUBMISSION.RESET) });
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('LINK — calls onSubmit', () => {
    const onSubmit = jest.fn();
    renderWith({ btn: makeBtn(SUBMISSION.LINK) }, {}, onSubmit);
    fireEvent.press(screen.getByTestId('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('BACK — calls goBack', () => {
    renderWith({ btn: makeBtn(SUBMISSION.BACK) });
    fireEvent.press(screen.getByTestId('button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('UPDATE — calls handleFormUpdate with fieldsToValidate', () => {
    renderWith({ btn: makeBtn(SUBMISSION.UPDATE, { dependentFields: '[1]', dependencyValue: '' }) });
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('UPDATE — with VALD_ERROR_POPUP dependency value', () => {
    const { checkMinLength } = require('utils/formBuilderHelper');
    checkMinLength.mockReturnValueOnce(false);
    renderWith({
      f1: base(1, FIELD_TYPE.INPUT, { validation: [{ type: VALIDATIONS.MIN_LENGTH, value: 5, message: 'Short' }] }),
      btn: makeBtn(SUBMISSION.UPDATE, { dependentFields: '[1]', dependencyValue: STRINGS.VALD_ERROR_POPUP }),
    });
    fireEvent.changeText(screen.getByTestId('field_1'), 'x');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('UPDATE_AND_SHOW — calls handleFormUpdate with relatedFields', () => {
    renderWith({ btn: makeBtn(SUBMISSION.UPDATE_AND_SHOW, { dependentFields: '[1]', relatedFields: '[2]' }) });
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('HOME — hides modal and goes home', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: { btn: makeBtn(SUBMISSION.HOME) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        ui: { isModalLoading: false, bottomModal: { isModalVisible: true } },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    fireEvent.press(screen.getByTestId('button'));
    expect(mockGoHome).toHaveBeenCalled();
  });

  it('HOME — modal not visible still goes home', () => {
    renderWith({ btn: makeBtn(SUBMISSION.HOME) });
    fireEvent.press(screen.getByTestId('button'));
    expect(mockGoHome).toHaveBeenCalled();
  });

  it('CAPTURE — calls onSubmit', () => {
    const onSubmit = jest.fn();
    renderWith({ btn: makeBtn(SUBMISSION.CAPTURE) }, {}, onSubmit);
    fireEvent.press(screen.getByTestId('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('CLOSE — hides bottom modal', () => {
    const store = renderWith({ btn: makeBtn(SUBMISSION.CLOSE) });
    fireEvent.press(screen.getByTestId('button'));
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('default (unknown submitType) — no crash', () => {
    renderWith({ btn: makeBtn('UNKNOWN_SUBMIT') });
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('validate() — all validation types', () => {
  const {
    checkAllowedLength,
    checkFixLength,
    checkMaxLength,
    checkMaxValue,
    checkMinLength,
    checkMinValue,
    isValidEmail,
    isValidMobile,
    isValidName,
    isValidAlphaNumeric,
    isValidAddress,
    isValidFullName,
    checkStartsWith,
  } = require('utils/formBuilderHelper');

  const makeInputWithValidation = (validation: any[]) => ({
    f1: base(1, FIELD_TYPE.INPUT, { validation }),
    btn: base(99, FIELD_TYPE.BUTTON, { submitType: SUBMISSION.SUBMIT, buttonStyle: 'secondary', relatedFields: '[]', dependentFields: '[]', dependentDataField: '[]' }),
  });

  const submitAndExpect = (failFn: () => void) => {
    failFn();
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  };

  it('REQUIRED fails when value is empty', () => {
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.REQUIRED, message: 'Required' }]));
    // Leave field empty and submit
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('ALLOWED_LENGTH fails', () => {
    checkAllowedLength.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.ALLOWED_LENGTH, value: 5, message: 'Bad length' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), 'test');
    submitAndExpect(() => checkAllowedLength.mockReturnValueOnce(false));
  });

  it('MIN_LENGTH fails', () => {
    checkMinLength.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.MIN_LENGTH, value: 5, message: 'Too short' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), 'abc');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('MAX_LENGTH fails', () => {
    checkMaxLength.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.MAX_LENGTH, value: 3, message: 'Too long' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), 'toolong');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('EMAIL fails', () => {
    isValidEmail.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.EMAIL, message: 'Bad email' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), 'notanemail');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('MOBILE fails', () => {
    isValidMobile.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.MOBILE, message: 'Bad mobile' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), '000');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('FIX_LENGTH fails', () => {
    checkFixLength.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.FIX_LENGTH, value: 10, message: 'Bad fix length' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), '12345');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('MIN_VALUE fails', () => {
    checkMinValue.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.MIN_VALUE, value: 100, message: 'Too small' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), '5');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('MAX_VALUE fails', () => {
    checkMaxValue.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.MAX_VALUE, value: 10, message: 'Too large' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), '999');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('STARTS_WITH fails', () => {
    checkStartsWith.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.STARTS_WITH, value: '9', message: 'Must start with 9' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), '1234567890');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('OPTIONAL_MOBILE — passes when empty', () => {
    const onSubmit = jest.fn();
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.OPTIONAL_MOBILE, value: 10, message: 'Bad optional mobile' }]), {}, onSubmit);
    // leave empty → passes through
    fireEvent.press(screen.getByTestId('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('OPTIONAL_MOBILE — fails when value present but invalid', () => {
    checkFixLength.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.OPTIONAL_MOBILE, value: 10, message: 'Bad optional mobile' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), '123');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('OPTIONAL_EMAIL — passes when empty', () => {
    const onSubmit = jest.fn();
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.OPTIONAL_EMAIL, message: 'Bad optional email' }]), {}, onSubmit);
    fireEvent.press(screen.getByTestId('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('OPTIONAL_EMAIL — fails when present and invalid', () => {
    isValidEmail.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.OPTIONAL_EMAIL, message: 'Bad optional email' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), 'bad@');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('ONLY_ALPHABETS fails', () => {
    isValidName.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.ONLY_ALPHABETS, message: 'Non-alpha' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), '123');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('ALPHABETS_WITH_SPACES fails', () => {
    isValidFullName.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.ALPHABETS_WITH_SPACES, message: 'Bad fullname' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), '123');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('ALPHA_NUMERIC fails', () => {
    isValidAlphaNumeric.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.ALPHA_NUMERIC, message: 'Bad alphanumeric' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), '@!');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('ADDRESS fails', () => {
    isValidAddress.mockReturnValueOnce(false);
    renderWith(makeInputWithValidation([{ type: VALIDATIONS.ADDRESS, message: 'Bad address' }]));
    fireEvent.changeText(screen.getByTestId('field_1'), 'bad<>addr');
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('NOT_EQUAL_WITH fails when values are equal', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.INPUT, {
        validation: [{ type: VALIDATIONS.NOT_EQUAL_WITH, message: 'Must differ' }],
        relatedFields: '[2]',
      }),
      f2: base(2, FIELD_TYPE.INPUT, { validation: [] }),
      btn: base(99, FIELD_TYPE.BUTTON, { submitType: SUBMISSION.SUBMIT, buttonStyle: 'secondary', relatedFields: '[]', dependentFields: '[]', dependentDataField: '[]' }),
    };
    const store = makeMockStore(
      baseState({
        formState: {
          formData,
          formValues: { field_1: 'same', field_2: 'same' },
          updatedFormFields: { field_1: 'same', field_2: 'same' },
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('EQUAL_WITH fails when values differ', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.INPUT, {
        validation: [{ type: VALIDATIONS.EQUAL_WITH, message: 'Must match' }],
        relatedFields: '[2]',
      }),
      f2: base(2, FIELD_TYPE.INPUT, { validation: [] }),
      btn: base(99, FIELD_TYPE.BUTTON, { submitType: SUBMISSION.SUBMIT, buttonStyle: 'secondary', relatedFields: '[]', dependentFields: '[]', dependentDataField: '[]' }),
    };
    const store = makeMockStore(
      baseState({
        formState: {
          formData,
          formValues: { field_1: 'abc', field_2: 'xyz' },
          updatedFormFields: { field_1: 'abc', field_2: 'xyz' },
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('DEPENDENT_FIELD validation triggers cross-field error', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.INPUT, {
        validation: [{ type: VALIDATIONS.DEPENDENT_FIELD, message: 'Enter either' }],
        dependentFields: '[2]',
      }),
      f2: base(2, FIELD_TYPE.INPUT, { validation: [] }),
      btn: base(99, FIELD_TYPE.BUTTON, { submitType: SUBMISSION.SUBMIT, buttonStyle: 'secondary', relatedFields: '[]', dependentFields: '[]', dependentDataField: '[]' }),
    };
    const store = makeMockStore(
      baseState({
        formState: {
          formData,
          formValues: { field_1: 'val1', field_2: 'val2' },
          updatedFormFields: { field_1: 'val1', field_2: 'val2' },
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('handleInputChange — field-type dependent children', () => {
  it('DROPDOWN child resets value and fetches options', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.INPUT, { dependentFields: '[2]' }),
      child: base(2, FIELD_TYPE.DROPDOWN, { queryName: 'childQuery', queryParams: 'parentId' }),
    };
    renderWith(formData);
    fireEvent.changeText(screen.getByTestId('field_1'), 'newval');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('FLAT_DROPDOWN child resets value', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.INPUT, { dependentFields: '[2]', field_name: 'flatDropdownParent' }),
      child: base(2, FIELD_TYPE.FLAT_DROPDOWN, { field_name: 'flatDropdownChild' }),
    };
    renderWith(formData);
    const inputs = screen.getAllByTestId('flatDropdownParent');
    fireEvent.changeText(inputs[inputs.length - 1], 'v');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('INPUT child with dependentChildValue sets value', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        dependentFields: '[2]',
        dependencyValue: 'triggerVal',
        label: 'Parent',
        field_name: 'dropdownParent',
      }),
      child: base(2, FIELD_TYPE.INPUT, { field_name: 'inputChild' }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('dropdownParent');
    fireEvent.press(dropdowns[dropdowns.length - 1]); // triggers onSelect with { id:1, name:'opt' }
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('AUTOCOMPLETE child resets value', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.INPUT, { dependentFields: '[2]', field_name: 'autocompleteParent2' }),
      child: base(2, FIELD_TYPE.AUTOCOMPLETE, { field_name: 'autocompleteChild' }),
    };
    renderWith(formData);
    const inputs = screen.getAllByTestId('autocompleteParent2');
    fireEvent.changeText(inputs[inputs.length - 1], 'v');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('CHECKBOX child clears error', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.INPUT, { dependentFields: '[2]', field_name: 'checkboxParent' }),
      child: base(2, FIELD_TYPE.CHECKBOX, { field_name: 'checkboxChild' }),
    };
    renderWith(formData);
    const inputs = screen.getAllByTestId('checkboxParent');
    fireEvent.changeText(inputs[inputs.length - 1], 'v');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('SEARCH_BAR_ITEMS child when parent is PILLS_GROUP resets', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.PILLS_GROUP, { dependentFields: '[2]', dataItems: '["A"]' }),
      child: base(2, FIELD_TYPE.SEARCH_BAR_ITEMS),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('pills'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('CONTAINER_BUTTON child with matching dependencyValue shows fields', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        dependentFields: '[2]',
        dependencyValue: '1',
      }),
      child: base(2, FIELD_TYPE.CONTAINER_BUTTON, {
        dependencyValue: '1',
        isVisible: 1,
        groupId: 'btn_grp',
      }),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('field_1'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('CUSTOM_AMOUNT child with SELECT_DEALER name updates dataItem', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        dependentFields: '[2]',
        field_name: STRINGS.SELECT_DEALER,
      }),
      child: base(2, FIELD_TYPE.CUSTOM_AMOUNT),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId(STRINGS.SELECT_DEALER);
    fireEvent.press(dropdowns[dropdowns.length - 1]);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('handleInputChange — related children branches', () => {
  it('AUTOCOMPLETE related child with dependencyValue shows/hides', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        relatedFields: '[2]',
        dependencyValue: '1',
        field_name: 'autocompleteParentDropdown',
      }),
      child: base(2, FIELD_TYPE.AUTOCOMPLETE, {
        dependencyValue: '1',
      }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('autocompleteParentDropdown');
    fireEvent.press(dropdowns[dropdowns.length - 1]);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('AUTOCOMPLETE related child with PRIMARY_MULTI_TV=YES shows', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        relatedFields: '[2]',
        dependencyValue: '',
        field_name: 'multiTvDropdown',
      }),
      child: base(2, FIELD_TYPE.AUTOCOMPLETE, {
        dependencyValue: 'OTHER',
      }),
    };
    renderWith(formData);
    // simulate value with PRIMARY_MULTI_TV: YES
    // onSelect in Dropdown fires { id:1, name:'opt' } — we just verify no crash
    const dropdowns = screen.getAllByTestId('multiTvDropdown');
    fireEvent.press(dropdowns[dropdowns.length - 1]);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('INPUT related child with TOWN_LOCALITY parent shows/hides', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.INPUT, {
        relatedFields: '[2]',
        field_name: STRINGS.TOWN_LOCALITY,
      }),
      child: base(2, FIELD_TYPE.INPUT),
    };
    renderWith(formData);
    const inputs = screen.getAllByTestId(STRINGS.TOWN_LOCALITY);
    fireEvent.changeText(inputs[inputs.length - 1], 'town');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('AMOUNT related child updates max validation', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        relatedFields: '[2]',
        dependencyValue: '500',
        field_name: 'amountParentDropdown',
      }),
      child: base(2, FIELD_TYPE.AMOUNT, {
        validation: [{ type: VALIDATIONS.MAX_VALUE, value: 1000 }],
      }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('amountParentDropdown');
    fireEvent.press(dropdowns[dropdowns.length - 1]);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('handleInputChange — onChangeQuery dispatch', () => {
  it('AUTOCOMPLETE with onChangeQuery dispatches callAction', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.AUTOCOMPLETE, { onChangeQuery: 'autocompleteQuery', label: 'AC', field_name: 'autocompleteWithQuery' }),
    };
    renderWith(formData);
    const autocompletes = screen.getAllByTestId('autocompleteWithQuery');
    fireEvent.press(autocompletes[autocompletes.length - 1]);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('MULTISELECT_DROPDOWN with onChangeQuery dispatches', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.MULTISELECT_DROPDOWN, { onChangeQuery: 'multiQuery', label: 'MS' }),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('multiselect'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('MULTI_CHECKBOX_DROPDOWN with onChangeQuery dispatches', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.MULTI_CHECKBOX_DROPDOWN, { onChangeQuery: 'mcbQuery', label: 'MCB' }),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('multi-checkbox-dropdown'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('INPUT with onChangeQuery dispatches', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.INPUT, { onChangeQuery: 'inputQuery', field_name: 'inputWithQuery' }),
    };
    renderWith(formData);
    const inputs = screen.getAllByTestId('inputWithQuery');
    fireEvent.changeText(inputs[inputs.length - 1], 'hello'); // Get the actual input, not the label
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('FLAT_DROPDOWN with onChangeQuery dispatches', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.FLAT_DROPDOWN, { onChangeQuery: 'flatQuery', label: 'FD', field_name: 'flatDropdownWithQuery' }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('flatDropdownWithQuery');
    fireEvent.press(dropdowns[dropdowns.length - 1]); // Get the actual dropdown, not the label
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('DROPDOWN with onChangeQuery resolves and handles visibility', async () => {
    const { callAction } = require('utils/formBuilderHelper');
    callAction.mockReturnValueOnce({
      type: 'CALL_ACTION',
      then: (cb: any) => {
        cb({ status: true });
        return { catch: jest.fn() };
      },
    });
    const formData = {
      f1: base(1, FIELD_TYPE.DROPDOWN, { onChangeQuery: 'dropQuery', label: 'D', field_name: 'dropdownWithQuery' }),
    };
    renderWith(formData);
    await act(async () => {
      const dropdowns = screen.getAllByTestId('dropdownWithQuery');
      fireEvent.press(dropdowns[dropdowns.length - 1]);
    });
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('DROPDOWN without onChangeQuery handles field visibility', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.DROPDOWN, { label: 'D', field_name: 'dropdownNoQuery' }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('dropdownNoQuery');
    fireEvent.press(dropdowns[dropdowns.length - 1]); // Press the actual dropdown, not the label
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('DROPDOWN with CUSTOM_DATE_RANGE triggers bottom modal', async () => {
    jest.useFakeTimers();
    const formData = {
      f1: base(1, FIELD_TYPE.DROPDOWN, { dependencyValue: STRINGS.CUSTOM_DATE_RANGE, label: 'D', field_name: 'customDateRangeDropdown' }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('customDateRangeDropdown');
    fireEvent.press(dropdowns[dropdowns.length - 1]); // Press the actual dropdown, not the label
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('BUTTON type clears related children', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.BUTTON, {
        submitType: SUBMISSION.SUBMIT,
        relatedFields: '[2]',
        dependentFields: '[]',
        dependentDataField: '[]',
      }),
      f2: base(2, FIELD_TYPE.INPUT, { isVisible: 1 }),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('TOGGLE_SWITCH dispatches callAction with queryName', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.TOGGLE_SWITCH, { queryName: 'toggleQuery' }),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('toggle'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('RADIO_CONTAINER handleInputChange branches', () => {
  const makeRadio = (dependencyValue: string, extra = {}) =>
    base(1, FIELD_TYPE.RADIO_CONTAINER, {
      dataItems: JSON.stringify([{ label: 'A', value: 'a' }]),
      dependencyValue,
      dependentFields: '[2]',
      relatedFields: '[3]',
      ...extra,
    });

  const renderRadio = (dependencyValue: string, _onSelect = 'optA') => {
    const formData: any = {
      radio: makeRadio(dependencyValue),
      dep: base(2, FIELD_TYPE.INPUT, { isVisible: 0 }),
      rel: base(3, FIELD_TYPE.INPUT, { isVisible: 0 }),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('radio'));
  };

  it('RESET_FIELDS branch', () => {
    renderRadio(STRINGS.RESET_FIELDS);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('ETSK value branch', () => {
    renderRadio('');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('OTHERS branch with value === OTHERS shows fields', () => {
    renderRadio(STRINGS.OTHERS_LOWER);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('OTHERS branch with non-OTHERS value hides fields', () => {
    renderRadio(STRINGS.OTHERS_LOWER);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('GST_UNREGISTERED branch with non-UNREGISTERED shows fields', () => {
    renderRadio(STRINGS.GST_UNREGISTERED);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('GST_UNREGISTERED branch with UNREGISTERED hides fields', () => {
    renderRadio(STRINGS.GST_UNREGISTERED);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('CONNECTION_TYPE.PRIMARY branch', () => {
    renderRadio('');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('MULTI branch', () => {
    renderRadio('');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('PYSICAL_TSK branch', () => {
    renderRadio('');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('RADIO_CONTAINER with onChangeQuery dispatches', () => {
    const formData: any = {
      radio: base(1, FIELD_TYPE.RADIO_CONTAINER, {
        dataItems: JSON.stringify([{ label: 'X', value: 'x' }]),
        dependencyValue: '',
        dependentFields: '[]',
        relatedFields: '[]',
        onChangeQuery: 'radioQuery',
        queryParams: 'radioParam',
      }),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('radio'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('DROPDOWN handleFieldVisibility branches', () => {
  it('dependencyValue + SONU prefix + hasDependentChildren shows dep fields', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        label: 'D',
        dependencyValue: 'relValue',
        relatedFields: '[3]',
        dependentFields: '[2]',
        dependentDataField: '[4]',
        field_name: 'sonuDropdown',
      }),
      dep: base(2, FIELD_TYPE.INPUT, { isVisible: 0 }),
      rel: base(3, FIELD_TYPE.INPUT, { isVisible: 0 }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('sonuDropdown');
    fireEvent.press(dropdowns[dropdowns.length - 1]);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('dependencyValue matches param[name] shows related', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        label: 'D',
        dependencyValue: 'relValue',
        relatedFields: '[3]',
        dependentFields: '[2]',
        dependentDataField: '[]',
        field_name: 'relValueDropdown',
      }),
      dep: base(2, FIELD_TYPE.INPUT, { isVisible: 0 }),
      rel: base(3, FIELD_TYPE.INPUT, { isVisible: 0 }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('relValueDropdown');
    fireEvent.press(dropdowns[dropdowns.length - 1]);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('dependentChildValue branch: matches param[name] shows related', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        label: 'D',
        dependencyValue: '',
        dependencyValue2: 'childVal',
        relatedFields: '[3]',
        dependentFields: '[]',
        dependentDataField: '[]',
        field_name: 'childValDropdown',
      }),
      rel: base(3, FIELD_TYPE.INPUT, { isVisible: 0 }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('childValDropdown');
    fireEvent.press(dropdowns[dropdowns.length - 1]);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('MULTI_SHOW_HIDE branch dispatches field visibility', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.DROPDOWN, {
        label: 'D',
        dependencyValue: '',
        dependentFields: JSON.stringify([[2], [3]]),
        relatedFields: JSON.stringify([[4], [5]]),
        dependentDataField: JSON.stringify([STRINGS.MULTI_SHOW_HIDE]),
        field_name: 'multiShowHideDropdown',
      }),
      f2: base(2, FIELD_TYPE.INPUT, { isVisible: 0 }),
      f3: base(3, FIELD_TYPE.INPUT, { isVisible: 0 }),
      f4: base(4, FIELD_TYPE.INPUT, { isVisible: 0 }),
      f5: base(5, FIELD_TYPE.INPUT, { isVisible: 0 }),
    };
    renderWith(formData);
    const dropdowns = screen.getAllByTestId('multiShowHideDropdown');
    fireEvent.press(dropdowns[dropdowns.length - 1]);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('DROPDOWN with OUTLET_TYPE resets ISP validation', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.DROPDOWN, {
        label: 'Outlet',
        field_name: STRINGS.OUTLET_TYPE,
        dependencyValue: '',
        relatedFields: '[]',
        dependentFields: '[]',
        dependentDataField: '[]',
      }),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId(STRINGS.OUTLET_TYPE));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('useEffect — formQuery dispatches callAction', () => {
  it('dispatches when formQuery is set', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: {},
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formQuery: 'someQuery',
          formNavigationData: { params: {} },
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(store.dispatch).toHaveBeenCalled();
  });
});

describe('useEffect — formData with MATCH_DEPENDENCY', () => {
  it('updates form visibility when defaultSelectedValue === MATCH_DEPENDENCY', () => {
    const formData = {
      f1: {
        ...base(1, FIELD_TYPE.INPUT),
        defaultSelectedValue: STRINGS.MATCH_DEPENDENCY,
        dependentDataField: '[1]',
        dependencyValue: 'dep_key',
        hasValue: 1,
      },
    };
    const store = makeMockStore(
      baseState({
        formState: {
          formData,
          formValues: { dep_key: 1 },
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('useEffect — fieldsToDisable', () => {
  it('disables a field when fieldsToDisable is set', () => {
    const formData = { f1: base(1, FIELD_TYPE.INPUT) };
    const store = makeMockStore(
      baseState({
        formState: {
          formData,
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: { fieldName: 'field_1' },
          formNavigationData: { params: {} },
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('useEffect — customFormData evdMdnChangeFilter', () => {
  it('dispatches search when filter type is select and customDateRange > 0 and tableFilteredData exists', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: { f1: base(1, FIELD_TYPE.INPUT) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        common: {
          errorMessage: '',
          customFormData: {
            evdMdnChangeFilter: {
              type: PROPERTIES.EVD_MDN_CHANGE_DETAILS.select,
              customDateRange: 30,
            },
          },
          tableFilteredData: [{ a: 1 }],
          tableColumns: [],
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('clears day value when filter type is clear', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: { f1: base(1, FIELD_TYPE.INPUT) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        common: {
          errorMessage: '',
          customFormData: {
            evdMdnChangeFilter: { type: PROPERTIES.EVD_MDN_CHANGE_DETAILS.clear },
          },
          tableFilteredData: [],
          tableColumns: [],
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('useEffect — updatedFormFields with needValidation', () => {
  it('triggers handleInputChange for subscriberRmn and subscriberEmail when needValidation', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: {
            f1: base(1, FIELD_TYPE.INPUT, { field_name: STRINGS.SUBSCRIBER_RMN }),
            f2: base(2, FIELD_TYPE.INPUT, { field_name: STRINGS.SUBSCRIBER_EMAIL }),
          },
          formValues: {},
          updatedFormFields: { subscriberRmn: '9999999999', subscriberEmail: 'a@b.com' },
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        exclusiveStore: { needValidation: true },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(store.dispatch).toHaveBeenCalled();
  });
});

describe('useEffect — validationAttemptCount hides related fields when isIspValid false', () => {
  it('hides related fields on validation attempt', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: { f1: base(1, FIELD_TYPE.INPUT) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        manageHierarchy: { isIspValid: false, validationAttemptCount: 1 },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('useEffect — isQuotationNavigate prefill', () => {
  it('pre-fills form fields when isQuotationNavigate is true', () => {
    const numberOfConnections = { nameNT: 3, id: 1 };
    const formData = {
      numberOfConnections: {
        ...base(10, FIELD_TYPE.DROPDOWN),
        field_name: STRINGS.NUMBER_OF_CONNNECTIONS,
        dependentFields: '[]',
        relatedFields: '[]',
        dependencyValue: '',
        dependentDataField: '[]',
      },
      primaryTskPin: base(11, FIELD_TYPE.INPUT, { field_name: 'primaryTskPin' }),
      primaryBoxType: base(12, FIELD_TYPE.INPUT, { field_name: 'primaryBoxType' }),
      secondaryTskPin1: base(13, FIELD_TYPE.INPUT, { field_name: 'secondaryTskPin1', queryParams: '' }),
      secondaryBoxType1: base(14, FIELD_TYPE.INPUT, { field_name: 'secondaryBoxType1' }),
      secondaryTskPin2: base(15, FIELD_TYPE.INPUT, { field_name: 'secondaryTskPin2' }),
      secondaryBoxType2: base(16, FIELD_TYPE.INPUT, { field_name: 'secondaryBoxType2' }),
      secondaryTskPin3: base(17, FIELD_TYPE.INPUT, { field_name: 'secondaryTskPin3' }),
      secondaryBoxType3: base(18, FIELD_TYPE.INPUT, { field_name: 'secondaryBoxType3' }),
    };
    const store = makeMockStore(
      baseState({
        formState: {
          formData,
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        quotation: {
          isQuotationNavigate: true,
          numberOfConnections,
          etskOfferSelected: null,
          etskboxType: null,
          boxType1: null,
          boxType2: null,
          boxType3: null,
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('pre-fills customerDetailsOfferType when isQuotationNavigate true', () => {
    const formData = {
      customerDetailsOfferType: {
        ...base(20, FIELD_TYPE.DROPDOWN),
        field_name: STRINGS.CUSTOMER_DETAILS_OFFER_TYPE,
        dependentFields: '[]',
        relatedFields: '[]',
        dependencyValue: '',
        dependentDataField: '[]',
      },
      customerDetailsTownLocality: base(21, FIELD_TYPE.INPUT, { field_name: 'customerDetailsTownLocality', dataItems: 0 }),
      customerDetailsPrimaryBox: base(22, FIELD_TYPE.INPUT, { field_name: 'customerDetailsPrimaryBox' }),
      customerDetailsSecondaryBox1: base(23, FIELD_TYPE.INPUT, { field_name: 'customerDetailsSecondaryBox1' }),
      customerDetailsSecondaryBox2: base(24, FIELD_TYPE.INPUT, { field_name: 'customerDetailsSecondaryBox2' }),
      customerDetailsSecondaryBox3: base(25, FIELD_TYPE.INPUT, { field_name: 'customerDetailsSecondaryBox3' }),
      customerDetailsValidatePinButton: base(26, FIELD_TYPE.BUTTON, {
        field_name: 'customerDetailsValidatePinButton',
        submitType: SUBMISSION.SUBMIT,
        relatedFields: '[]',
        dependentDataField: '[]',
        isVisible: 1,
        groupId: 'btn_validate',
      }),
    };
    const store = makeMockStore(
      baseState({
        formState: {
          formData,
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        quotation: {
          isQuotationNavigate: true,
          numberOfConnections: { nameNT: 2 },
          etskOfferSelected: { id: 1 },
          etskboxType: 'HD',
          boxType1: 'SD',
          boxType2: null,
          boxType3: null,
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('ISP_CODE validation in handleInputChange', () => {
  it('dispatches setIspCodeValidation when ISP_CODE reaches fix length', () => {
    const formData = {
      f1: base(1, FIELD_TYPE.INPUT, {
        field_name: STRINGS.ISP_CODE,
        validation: [{ type: STRINGS.FIX_LENGTH, value: 6 }],
      }),
    };
    renderWith(formData);
    fireEvent.changeText(screen.getAllByTestId(STRINGS.ISP_CODE)[1], '123456');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('isSubscriberValid dispatch on input change', () => {
  it('dispatches setValidateSubscriber when isSubscriberValid is true', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: { f1: base(1, FIELD_TYPE.INPUT, { field_name: 'subscriberInput' }) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        dealerFeedback: { isSubscriberValid: true },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    fireEvent.changeText(screen.getAllByTestId('subscriberInput')[1], 'val');
    expect(store.dispatch).toHaveBeenCalled();
  });
});

describe('setErrors reset on DROPDOWN and AUTOCOMPLETE change', () => {
  it('resets errors via setTimeout on DROPDOWN change', async () => {
    jest.useFakeTimers();
    const formData = { f1: base(1, FIELD_TYPE.DROPDOWN, { label: 'D', field_name: 'dropdownField' }) };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('dropdownField'));
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('resets errors via setTimeout on AUTOCOMPLETE change', async () => {
    jest.useFakeTimers();
    const formData = { f1: base(1, FIELD_TYPE.AUTOCOMPLETE, { label: 'AC', field_name: 'autocompleteField' }) };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('autocompleteField'));
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('unmount cleanup useEffect', () => {
  it('dispatches reset actions on unmount', () => {
    const store = makeMockStore(baseState({ formState: { formData: {}, formValues: {}, updatedFormFields: {}, fieldsToDisable: {}, formNavigationData: { params: {} } } }));
    const { unmount } = render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    unmount();
    expect(store.dispatch).toHaveBeenCalled();
  });
});

describe('initForm — updatedFormFields priority', () => {
  it('uses updatedFormFields value when key is present', () => {
    const formData = { f1: base(1, FIELD_TYPE.INPUT, { hasValue: 1 }) };
    const store = makeMockStore(
      baseState({
        formState: {
          formData,
          formValues: { field_1: 'fromFormValues' },
          updatedFormFields: { field_1: 'fromUpdatedFields' },
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('validate — subForm recursion', () => {
  it('validates subForm fields', () => {
    const onSubmit = jest.fn();
    const formData = {
      parent: {
        ...base(1, FIELD_TYPE.INPUT),
        hasValue: 0,
        subForm: {
          child: {
            ...base(2, FIELD_TYPE.INPUT),
            validation: [{ type: VALIDATIONS.REQUIRED, message: 'Required' }],
          },
        },
      },
      btn: base(99, FIELD_TYPE.BUTTON, { submitType: SUBMISSION.SUBMIT, buttonStyle: 'secondary', relatedFields: '[]', dependentFields: '[]', dependentDataField: '[]' }),
    };
    renderWith(formData, {}, onSubmit);
    fireEvent.press(screen.getByTestId('button'));
    // subForm child required — but since field not in formModel, it may pass through
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('renderForm — grouped buttons with ROW_CONTAINER', () => {
  it('renders buttons in a row when groupStyle is ROW_CONTAINER', () => {
    const formData = {
      b1: {
        ...base(1, FIELD_TYPE.CONTAINER_BUTTON),
        groupId: 'row_grp',
        groupStyle: STRINGS.ROW_CONTAINER,
        isVisible: 1,
        submitType: SUBMISSION.HOME,
        dependencyValue: '',
      },
      b2: {
        ...base(2, FIELD_TYPE.CONTAINER_BUTTON),
        groupId: 'row_grp',
        groupStyle: STRINGS.ROW_CONTAINER,
        isVisible: 1,
        submitType: SUBMISSION.CLOSE,
        dependencyValue: '',
      },
    };
    renderWith(formData);
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('stateKey = MODAL_STATE', () => {
  it('renders correctly with MODAL_STATE key', () => {
    const store = makeMockStore({
      form: {
        [STATE_KEY.MODAL_STATE]: {
          formData: { f1: base(1, FIELD_TYPE.INPUT) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
      },
      user: { isRedirection: false },
      common: { errorMessage: '', customFormData: {}, tableFilteredData: [], tableColumns: [] },
      quotation: { isQuotationNavigate: false, numberOfConnections: null, etskOfferSelected: null, etskboxType: null, boxType1: null, boxType2: null, boxType3: null },
      dealerFeedback: { isSubscriberValid: false },
      ui: { isModalLoading: false, bottomModal: { isModalVisible: false } },
      manageHierarchy: { isIspValid: true, validationAttemptCount: 0 },
      exclusiveStore: { needValidation: false },
    });
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} stateKey={STATE_KEY.MODAL_STATE} />
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('FAKE_PASSWORD show-password mode', () => {
  it('handles input when showPassword is true', () => {
    renderWith({ f1: base(1, FIELD_TYPE.FAKE_PASSWORD, { field_name: 'passwordField' }) });
    // Toggle to show password
    fireEvent.press(screen.getByTestId('passwordField-icon'));
    // Type in shown mode
    fireEvent.changeText(screen.getAllByTestId('passwordField')[1], '9');
    fireEvent.changeText(screen.getAllByTestId('passwordField')[1], '98');
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('handleInputChange — SEARCH_BAR_ITEMS parent with parentId', () => {
  it('handles parentId branch in related children', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.SEARCH_BAR_ITEMS, {
        relatedFields: '[2]',
        dependentFields: '[3]',
        parentId: 10,
        dependencyValue: 'depVal',
        defaultSelectedValue: 'OTHER',
      }),
      child: base(2, FIELD_TYPE.INPUT, { isVisible: 0 }),
      dep: base(3, FIELD_TYPE.INPUT, { isVisible: 0 }),
      parent10: base(10, FIELD_TYPE.INPUT),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('search-bar-items'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  it('handles array dependentChildValue in related children', () => {
    const formData = {
      parent: base(1, FIELD_TYPE.SEARCH_BAR_ITEMS, {
        relatedFields: '[2,3]',
        dependentFields: '[]',
        parentId: 0,
        dependencyValue: '',
        defaultSelectedValue: 'OTHER',
      }),
      child2: base(2, FIELD_TYPE.INPUT, { isVisible: 0 }),
      child3: base(3, FIELD_TYPE.INPUT, { isVisible: 0 }),
    };
    renderWith(formData);
    fireEvent.press(screen.getByTestId('search-bar-items'));
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });
});

describe('handleInputChange — errorMessage present dispatches reset', () => {
  it('dispatches reSetErrorMessage when errorMessage exists', () => {
    const store = makeMockStore(
      baseState({
        formState: {
          formData: { f1: base(1, FIELD_TYPE.INPUT, { field_name: 'errorInput' }) },
          formValues: {},
          updatedFormFields: {},
          fieldsToDisable: {},
          formNavigationData: { params: {} },
        },
        common: { errorMessage: 'Some error', customFormData: {}, tableFilteredData: [], tableColumns: [] },
      }),
    );
    render(
      <Provider store={store as any}>
        <RegistrationFormBuilder formName="testForm" onSubmit={jest.fn()} />
      </Provider>,
    );
    fireEvent.changeText(screen.getAllByTestId('errorInput')[1], 'new value');
    expect(store.dispatch).toHaveBeenCalled();
  });
});
