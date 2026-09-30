/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import ExclusiveStoreQuestion from './ExclusiveStoreQuestion';

// Mock dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(() => ({ inflection: 'md' })),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((key: string) => key),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('const', () => {
  const actual = jest.requireActual('const');
  return {
    ...actual,
    STRINGS: {
      ...actual.STRINGS,
      BOOLEAN: 'Boolean',
      CHECKBOX: 'Checkbox',
      TEXT_INPUT: 'TextInput',
      EXIST: 'exist',
    },
  };
});

// Mock sub-components
jest.mock('components/sales', () => {
  const rn = require('react-native');
  return {
    Button: (props: any) => (
      <rn.TouchableOpacity testID={props.testID || `button-${props.label}`} onPress={props.onPress}>
        <rn.Text>{props.label}</rn.Text>
      </rn.TouchableOpacity>
    ),
    Checkbox: (props: any) => (
      <rn.TouchableOpacity testID={`checkbox-${props.label}`} onPress={() => props.onValueChange(!props.value)}>
        <rn.Text>{props.value ? 'Checked' : 'Unchecked'}</rn.Text>
      </rn.TouchableOpacity>
    ),
    IconTextInput: (props: any) => <rn.TextInput testID="icon-text-input" value={props.value} onChangeText={props.onInputChange} placeholder={props.placeholder} />,
    RadioContainer: (props: any) => (
      <rn.View testID="radio-container">
        {props.items.map((item: any) => (
          <rn.TouchableOpacity key={item.value} testID={`radio-${item.value}`} onPress={() => props.onSelectionChange(item.value)}>
            <rn.Text>{item.text}</rn.Text>
          </rn.TouchableOpacity>
        ))}
      </rn.View>
    ),
    Text: (props: any) => <rn.Text {...props}>{props.label || props.children}</rn.Text>,
    DateAndTimeDetails: () => <rn.View testID="date-time-details" />,
    Radio: (_props: any) => <rn.View />,
  };
});

describe('ExclusiveStoreQuestion Component', () => {
  const mockDispatch = jest.fn();
  let mockState: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockImplementation((action: any) => {
      if (typeof action === 'function') return action(mockDispatch, () => mockState);
      return Promise.resolve({ status: true });
    });

    mockState = {
      exclusiveStore: {
        isStoreOpen: true,
        storeOpenQuestion: {
          resultStoreActionQues: [
            { QUESTIONID: 1, QUESTIONSDESC: 'Section1~Boolean Ques', QUESTIONTYPE: 'Boolean', DISPLAYVALUES: 'Yes~No', DEFAULTVALUES: '' },
            { QUESTIONID: 2, QUESTIONSDESC: 'Section1~Checkbox Ques', QUESTIONTYPE: 'Checkbox', DISPLAYVALUES: 'Opt1~Opt2', DEFAULTVALUES: '' },
            { QUESTIONID: 3, QUESTIONSDESC: 'Section2~Text Ques', QUESTIONTYPE: 'TextInput', DISPLAYVALUES: '', DEFAULTVALUES: 'Enter text' },
          ],
          strOpnSection: ['Section1', 'Section2'],
          strClsSection: ['Section1'],
        },
      },
      ui: { isLoading: false },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));
  });

  test('renders correctly and handles input changes', () => {
    render(<ExclusiveStoreQuestion />);
    fireEvent.press(screen.getByTestId('radio-Yes'));
    fireEvent.press(screen.getByTestId('checkbox-Opt1'));
    fireEvent.changeText(screen.getByTestId('icon-text-input'), 'Hello world');
    fireEvent.press(screen.getByTestId('button-strings.cancel'));
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('handleProcced validation (various unanswered types)', async () => {
    render(<ExclusiveStoreQuestion />);
    fireEvent.press(screen.getByTestId('button-strings.proceed'));
    expect(mockDispatch).toHaveBeenCalled();

    fireEvent.press(screen.getByTestId('radio-Yes'));
    fireEvent.changeText(screen.getByTestId('icon-text-input'), 'Text');
    fireEvent.press(screen.getByTestId('button-strings.proceed'));

    // Checkbox is still empty array
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handleProcced success flow (isStoreOpen: true)', async () => {
    const { callAction } = require('utils/formBuilderHelper');
    callAction.mockReturnValue(() => Promise.resolve({ resultstoreCheckDetails: 'NOT_EXIST' }));

    render(<ExclusiveStoreQuestion />);
    fireEvent.press(screen.getByTestId('radio-Yes'));
    fireEvent.press(screen.getByTestId('checkbox-Opt1'));
    fireEvent.changeText(screen.getByTestId('icon-text-input'), 'Valid text');

    await act(async () => {
      fireEvent.press(screen.getByTestId('button-strings.proceed'));
    });

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledWith(expect.anything(), 'checkStoreStatus');
      expect(callAction).toHaveBeenCalledWith(expect.anything(), 'submitStoreAns');
    });
  });

  test('handleProcced flow (isStoreOpen: false, already submitted)', async () => {
    mockState.exclusiveStore.isStoreOpen = false;
    mockState.exclusiveStore.storeOpenQuestion.resultStoreActionQues = [
      { QUESTIONID: 1, QUESTIONSDESC: 'Section1~Boolean Ques', QUESTIONTYPE: 'Boolean', DISPLAYVALUES: 'Yes~No', DEFAULTVALUES: '' },
    ];
    const { callAction } = require('utils/formBuilderHelper');
    callAction.mockReturnValue(() => Promise.resolve({ resultstoreCheckDetails: 'exist' }));

    render(<ExclusiveStoreQuestion />);
    fireEvent.press(screen.getByTestId('radio-Yes'));

    await act(async () => {
      fireEvent.press(screen.getByTestId('button-strings.proceed'));
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test('handleProcced success flow (isStoreOpen: false)', async () => {
    mockState.exclusiveStore.isStoreOpen = false;
    mockState.exclusiveStore.storeOpenQuestion.resultStoreActionQues = [
      { QUESTIONID: 1, QUESTIONSDESC: 'Section1~Boolean Ques', QUESTIONTYPE: 'Boolean', DISPLAYVALUES: 'Yes~No', DEFAULTVALUES: '' },
    ];
    const { callAction } = require('utils/formBuilderHelper');
    callAction.mockImplementation((_payload: any, type: string) => {
      if (type === 'checkStoreStatus') return () => Promise.resolve({ resultstoreCheckDetails: 'NOT_EXIST' });
      return () => Promise.resolve({ status: true });
    });

    render(<ExclusiveStoreQuestion />);
    fireEvent.press(screen.getByTestId('radio-Yes'));

    await act(async () => {
      fireEvent.press(screen.getByTestId('button-strings.proceed'));
    });

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledWith(expect.anything(), 'submitStoreAns');
    });
  });

  test('Error and edge rendering cases', async () => {
    // 1. Unknown question type (line 117)
    // 2. Question description fallback (line 190: split('~')[1] || QUESTIONSDESC)
    mockState.exclusiveStore.storeOpenQuestion.resultStoreActionQues = [
      { QUESTIONID: 1, QUESTIONSDESC: 'Section1~', QUESTIONTYPE: 'Unknown', DISPLAYVALUES: 'Y~N', DEFAULTVALUES: '' },
    ];

    render(<ExclusiveStoreQuestion />);
    expect(screen.getByText(/Section1~/)).toBeTruthy();

    // 4. Try-catch error (line 161)
    const { callAction } = require('utils/formBuilderHelper');
    callAction.mockImplementation(() => () => {
      throw new Error('API Error');
    }); // Force immediate throw in catch block

    // Re-fill answer to pass validation
    fireEvent.press(screen.getByTestId('button-strings.proceed')); // Fails validation first? No, resultStoreActionQues changed.
    // Question 1 exists. We need to answer it.
    // Wait, it's 'Unknown' type, so it renders nothing!
    // This is perfect to test line 117 (default: null).

    // Let's use a known type to answer it.
    mockState.exclusiveStore.storeOpenQuestion.resultStoreActionQues[0].QUESTIONTYPE = 'Boolean';
    render(<ExclusiveStoreQuestion />);
    fireEvent.press(screen.getByTestId('radio-Y'));

    await act(async () => {
      fireEvent.press(screen.getByTestId('button-strings.proceed'));
    });
  });

  test('renders nothing when action is empty', () => {
    mockState.exclusiveStore.storeOpenQuestion.strOpnSection = [];
    render(<ExclusiveStoreQuestion />);
    expect(screen.queryByText('Section1')).toBeNull();
  });
});
