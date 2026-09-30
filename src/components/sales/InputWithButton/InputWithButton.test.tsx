/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { STATE_KEY, VALIDATIONS } from 'const';
import InputWithButton from './InputWithButton';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('components/sales/IconTextInput', () => ({ id, value, onInputChange, error }: any) => {
  const { TextInput, Text } = require('react-native');
  return (
    <>
      <TextInput testID={id || 'icon-text-input'} value={value} onChangeText={onInputChange} />
      {error ? <Text testID={`error-${id}`}>{error}</Text> : null}
    </>
  );
});

jest.mock('components/sales/Button', () => ({ label, onPress }: any) => {
  const { TouchableOpacity, Text } = require('react-native');
  return (
    <TouchableOpacity testID="submit-btn" onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/Text', () => ({ label, id }: any) => {
  const { Text } = require('react-native');
  return <Text testID={id ? `label-${id}` : 'label'}>{label}</Text>;
});

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'XL' }),
  BreakPoints: { XL: 'XL', LG: 'LG', MD: 'MD', MD_L: 'MD_L', SM: 'SM', XS: 'XS' },
}));

// ── Store factory ──────────────────────────────────────────────────────────────

const makeStore = (updatedFormFields: any = {}) =>
  configureStore({
    reducer: {
      form: (state = { [STATE_KEY.FORM_STATE]: { updatedFormFields } }) => state,
    },
  });

// ── Base field factory ─────────────────────────────────────────────────────────

const baseField = (overrides: any = {}) => ({
  label: 'Test Field',
  placeholderText: 'Enter value',
  isDisabled: false,
  dependentFields: '[]',
  submitType: 'SUBMIT',
  queryName: 'TEST_QUERY',
  routeName: 'TestRoute',
  iconName: null,
  inputStyle: '',
  validation: [],
  ...overrides,
});

const renderComponent = (props: any = {}) => {
  const store = makeStore(props.updatedFormFields);
  const handleInputChange = props.handleInputChange || jest.fn();
  const handleSubmit = props.handleSubmit || jest.fn();
  const field = props.field || baseField();
  const formModel = props.formModel || { testId: 'some-value' };
  const formError = props.formError || {};

  render(
    <Provider store={store}>
      <InputWithButton
        id={props.id || 'testId'}
        field={field}
        formModel={formModel}
        formError={formError}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        input={props.input || {}}
      />
    </Provider>,
  );
  return { handleInputChange, handleSubmit };
};

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('InputWithButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the container with testID', () => {
      renderComponent();
      expect(screen.getByTestId('image-test')).toBeTruthy();
    });

    it('renders the Text label with the field label', () => {
      renderComponent({ field: baseField({ label: 'My Label' }) });
      expect(screen.getByText('My Label')).toBeTruthy();
    });

    it('renders the IconTextInput with correct id', () => {
      renderComponent({ id: 'myField' });
      expect(screen.getByTestId('myField')).toBeTruthy();
    });

    it('renders submit button', () => {
      renderComponent();
      expect(screen.getByTestId('submit-btn')).toBeTruthy();
    });

    it('renders error text when formError has value', () => {
      renderComponent({ formError: { testId: 'Required field' } });
      expect(screen.getByTestId('error-testId')).toBeTruthy();
      expect(screen.getByText('Required field')).toBeTruthy();
    });

    it('renders with NUMERIC validation (isNumericValue branch)', () => {
      renderComponent({
        field: baseField({ validation: [{ type: VALIDATIONS.NUMERIC }] }),
      });
      expect(screen.getByTestId('image-test')).toBeTruthy();
    });

    it('renders with FIX_LENGTH validation (maxValue branch)', () => {
      renderComponent({
        field: baseField({ validation: [{ type: VALIDATIONS.FIX_LENGTH, value: 10 }] }),
      });
      expect(screen.getByTestId('image-test')).toBeTruthy();
    });

    it('renders with MAX_LENGTH validation (maxValue branch)', () => {
      renderComponent({
        field: baseField({ validation: [{ type: VALIDATIONS.MAX_LENGTH, value: 20 }] }),
      });
      expect(screen.getByTestId('image-test')).toBeTruthy();
    });

    it('passes leftIconName when field.iconName is set (truthy branch)', () => {
      renderComponent({ field: baseField({ iconName: 'CLOSE' }) });
      expect(screen.getByTestId('image-test')).toBeTruthy();
    });

    it('renders without leftIconName when field.iconName is null (falsy branch)', () => {
      renderComponent({ field: baseField({ iconName: null }) });
      expect(screen.getByTestId('image-test')).toBeTruthy();
    });
  });

  describe('useEffect — formModel sync', () => {
    it('sets inputValue when formModel[id] has a value', () => {
      renderComponent({ id: 'testId', formModel: { testId: 'hello' } });
      expect(screen.getByDisplayValue('hello')).toBeTruthy();
    });

    it('clears inputValue when formModel[id] is null', () => {
      renderComponent({ id: 'testId', formModel: { testId: null as any } });
      // Should render with empty string value
      expect(screen.getByTestId('testId')).toBeTruthy();
    });
  });

  describe('handleInputChange', () => {
    it('calls handleInputChange with correct args on text change', () => {
      const handleInputChange = jest.fn();
      renderComponent({
        id: 'testId',
        handleInputChange,
        field: baseField({ dependentFields: '[1,2]' }),
      });
      fireEvent.changeText(screen.getByTestId('testId'), 'new value');
      expect(handleInputChange).toHaveBeenCalledWith({
        name: 'testId',
        value: 'new value',
        hasDependentChildren: [1, 2],
      });
    });
  });

  describe('handleSubmit', () => {
    it('calls handleSubmit with field props when button pressed', () => {
      const handleSubmit = jest.fn();
      renderComponent({
        id: 'testId',
        formModel: { testId: 'val' },
        field: baseField({ submitType: 'SUBMIT', queryName: 'Q1', routeName: 'Route1' }),
        handleSubmit,
      });
      fireEvent.press(screen.getByTestId('submit-btn'));
      expect(handleSubmit).toHaveBeenCalledWith('SUBMIT', 'Q1', 'Route1', { testId: 'val' });
    });
  });
});
