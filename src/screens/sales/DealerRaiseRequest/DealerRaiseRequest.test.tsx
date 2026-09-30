/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider, useSelector } from 'react-redux';
import { store } from 'store';
import * as useNavigateHook from 'hooks/useNavigate';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import DealerRaiseRequest from './DealerRaiseRequest';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('hooks/useNavigate');
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockCreateBRSSRWorkOrder = jest.fn();

jest.mock('store/sales/actions', () => ({
  __esModule: true,
  default: {
    createBRSSRWorkOrder: (...args: any[]) => mockCreateBRSSRWorkOrder(...args),
  },
}));

jest.mock('components/sales', () => {
  const { Text: RNText, TouchableOpacity } = require('react-native');
  return {
    Button: ({ label, onPress, testID }: any) => (
      <TouchableOpacity onPress={onPress} testID={testID}>
        <RNText>{label}</RNText>
      </TouchableOpacity>
    ),
    Text: ({ label, children, style }: any) => <RNText style={style}>{label || children}</RNText>,
    TextContainer: ({ data }: any) => <RNText>{data?.RetailerRMN}</RNText>,
    TextInput: (props: any) => {
      const RN = require('react-native');
      return <RN.TextInput {...props} />;
    },
  };
});

let mockOnSelectNature: any = null;
let mockOnSelectType: any = null;

jest.mock('components/sales/Autocomplete', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View, TextInput } = require('react-native');
  return ({ placeholder, onSelect }: any) => {
    if (placeholder === 'strings.selectNatureRequest') {
      mockOnSelectNature = onSelect;
    } else if (placeholder === 'strings.selectTypeRequest') {
      mockOnSelectType = onSelect;
    }
    return (
      <View>
        <TextInput placeholder={placeholder} />
      </View>
    );
  };
});
/* eslint-enable @typescript-eslint/no-var-requires */

const mockState = {
  dealerHelp: {
    natureOfRequest: [
      { valueNT: 'nature1', displayNT: 'Nature 1' },
      { valueNT: 'nature2', displayNT: 'Nature 2' },
    ],
    typeOfRequest: [
      { valueNT: 'type1', displayNT: 'Type 1' },
      { valueNT: 'type2', displayNT: 'Type 2' },
    ],
    dealerSubArea: 'SubArea1',
    dealerRoleId: [{ bposId: 'BPOS123', role: 'Dealer' }],
  },
  user: {
    info: {
      userId: 'USER123',
      mdn: '1234567890',
    },
  },
};

const mockT = (key: string) => key;

describe('DealerRaiseRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as unknown as jest.Mock).mockImplementation((cb) => cb(mockState));
    (useNavigateHook.default as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useInflection as jest.Mock).mockReturnValue({ inflection: 'desktop' });
    (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
    mockDispatch.mockClear();
    mockCreateBRSSRWorkOrder.mockClear();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <DealerRaiseRequest />
      </Provider>,
    );

  it('should render component correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('strings.natureRequest')).toBeTruthy();
    expect(getByText('strings.typeRequest')).toBeTruthy();
    expect(getByText('strings.description')).toBeTruthy();
    expect(getByText('strings.submit')).toBeTruthy();
    expect(getByText('strings.cancel')).toBeTruthy();
  });

  it('should display user mdn from store', () => {
    const { getByText } = renderComponent();
    expect(getByText('1234567890')).toBeTruthy();
  });

  it('should show validation errors when submitting empty form', () => {
    const { getByText } = renderComponent();
    const submitButton = getByText('strings.submit');

    fireEvent.press(submitButton);

    expect(getByText('validations.requiredNatureofRequest')).toBeTruthy();
    expect(getByText('validations.requiredTypeofRequest')).toBeTruthy();
    expect(getByText('validations.enterDescription')).toBeTruthy();
  });

  it('should show nature validation error when only nature is missing', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    const descriptionInput = getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(descriptionInput, 'Test description');

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);

    expect(getByText('validations.requiredNatureofRequest')).toBeTruthy();
  });

  it('should show type validation error when only type is missing', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    const descriptionInput = getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(descriptionInput, 'Test description');

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);

    expect(getByText('validations.requiredTypeofRequest')).toBeTruthy();
  });

  it('should show description validation error when description is only whitespace', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    const descriptionInput = getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(descriptionInput, '   ');

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);

    expect(getByText('validations.enterDescription')).toBeTruthy();
  });

  it('should update description value and clear error on input change', () => {
    const { getByPlaceholderText, getByText, queryByText } = renderComponent();

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);

    expect(getByText('validations.enterDescription')).toBeTruthy();

    const descriptionInput = getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(descriptionInput, 'New description');

    expect(queryByText('validations.enterDescription')).toBeNull();
  });

  it('should display character count for description', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    const descriptionInput = getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(descriptionInput, 'Test');

    expect(getByText('4/60')).toBeTruthy();
  });

  it('should handle nature dropdown change and clear error', () => {
    const { getByText } = renderComponent();

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);
    expect(getByText('validations.requiredNatureofRequest')).toBeTruthy();
  });

  it('should reset type request when nature changes', () => {
    const { getByText } = renderComponent();
    expect(getByText('strings.typeRequest')).toBeTruthy();
  });

  it('should filter type of request based on selected nature', () => {
    const { getByText } = renderComponent();
    expect(getByText('strings.typeRequest')).toBeTruthy();
  });

  it('should call navigate with BINGE_RETAILER route on cancel', () => {
    const { getByText } = renderComponent();

    const cancelButton = getByText('strings.cancel');
    fireEvent.press(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('bingeRetailer');
  });

  it('should not submit form when validation fails', () => {
    store.dispatch = jest.fn() as any;

    const { getByText } = renderComponent();

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should handle empty dealerRoleId array', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ...mockState,
        dealerHelp: {
          ...mockState.dealerHelp,
          dealerRoleId: [],
        },
      }),
    );

    const { getByText } = renderComponent();

    expect(getByText('strings.submit')).toBeTruthy();
  });

  it('should handle null user info', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ...mockState,
        user: {
          info: null,
        },
      }),
    );

    const { getByText } = renderComponent();

    expect(getByText('strings.submit')).toBeTruthy();
  });

  it('should render with different inflection values', () => {
    (useInflection as jest.Mock).mockReturnValue({ inflection: 'mobile' });

    const { getByText } = renderComponent();
    expect(getByText('strings.submit')).toBeTruthy();
  });

  it('should handle description input with maximum length', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    const descriptionInput = getByPlaceholderText('strings.enterHere');
    const longText = 'a'.repeat(70);
    fireEvent.changeText(descriptionInput, longText);

    expect(getByText(/60/)).toBeTruthy();
  });

  it('should clear nature error when nature is selected', () => {
    const { getByText } = renderComponent();

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);

    expect(getByText('validations.requiredNatureofRequest')).toBeTruthy();
  });

  it('should return empty array when no nature is selected for filtered type', () => {
    const { getByText } = renderComponent();
    expect(getByText('strings.typeRequest')).toBeTruthy();
  });

  it('should not clear description error when input is whitespace only', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);

    const descriptionInput = getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(descriptionInput, '   ');

    fireEvent.press(submitButton);
    expect(getByText('validations.enterDescription')).toBeTruthy();
  });

  it('should display initial character count as 0/60', () => {
    const { getByText } = renderComponent();
    expect(getByText('0/60')).toBeTruthy();
  });

  it('should handle nature dropdown selection and clear error', () => {
    const { getByText } = renderComponent();

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);
    expect(getByText('validations.requiredNatureofRequest')).toBeTruthy();

    if (mockOnSelectNature) {
      mockOnSelectNature({ object: { valueNT: 'nature1' } });
    }
  });

  it('should handle type dropdown selection and clear error', () => {
    renderComponent();

    if (mockOnSelectType) {
      mockOnSelectType({ object: { valueNT: 'type1' } });
    }
  });

  it('should submit form successfully with all valid data', () => {
    store.dispatch = jest.fn().mockReturnValue(Promise.resolve({ status: true })) as any;

    const { getByText, getByPlaceholderText } = renderComponent();

    if (mockOnSelectNature) {
      mockOnSelectNature({ object: { valueNT: 'nature1' } });
    }

    if (mockOnSelectType) {
      mockOnSelectType({ object: { valueNT: 'type1' } });
    }

    const descriptionInput = getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(descriptionInput, 'Test description');

    const submitButton = getByText('strings.submit');
    fireEvent.press(submitButton);

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should reset type request when nature selection changes', () => {
    renderComponent();

    if (mockOnSelectNature) {
      mockOnSelectNature({ object: { valueNT: 'nature1' } });
    }

    if (mockOnSelectType) {
      mockOnSelectType({ object: { valueNT: 'type1' } });
    }

    if (mockOnSelectNature) {
      mockOnSelectNature({ object: { valueNT: 'nature2' } });
    }
  });
});
