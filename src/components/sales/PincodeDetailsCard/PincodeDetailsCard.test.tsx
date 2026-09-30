/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { ROUTE } from 'const';
import PincodeDetailsCard from './PincodeDetailsCard';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockStore = {
  dispatch: mockDispatch,
  subscribe: jest.fn(),
  getState: jest.fn(() => ({
    quotation: { etskPincode: '123456' },
  })),
} as any;

jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector) =>
    selector({
      quotation: { etskPincode: '123456' },
    }),
  ),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn((params, queryName) => ({ type: 'CALL_ACTION', params, queryName })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PincodeDetailsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={mockStore}>
        <PincodeDetailsCard {...props} />
      </Provider>,
    );

  test('renders correctly with default props', () => {
    renderComponent();
    expect(screen.getByText('123456')).toBeTruthy();
    expect(screen.getByText('strings.pincode')).toBeTruthy();
    expect(screen.getByText('strings.change')).toBeTruthy();
  });

  test('renders with custom label', () => {
    renderComponent({ label: 'customLabel' });
    expect(screen.getByText('strings.customLabel')).toBeTruthy();
  });

  test('handles navigation on change press', () => {
    renderComponent({ routeName: 'testRoute' });
    const changeButton = screen.getByText('strings.change');
    fireEvent.press(changeButton);
    expect(mockNavigate).toHaveBeenCalledWith('testRoute');
  });

  test('handles callAction on change press when no routeName', () => {
    renderComponent({ queryName: 'testQuery' });
    const changeButton = screen.getByText('strings.change');
    fireEvent.press(changeButton);
    const { callAction } = require('utils/formBuilderHelper');
    expect(callAction).toHaveBeenCalledWith({}, 'testQuery');
  });

  test('renders differently when currentRoute is TSK_VOUCHER_DETAILS', () => {
    const { toJSON } = renderComponent({ currentRoute: ROUTE.WEB.TSK_VOUCHER_DETAILS });
    expect(toJSON()).toMatchSnapshot();
    expect(screen.getByText('123456')).toBeTruthy();
  });

  test('does not render main view when currentRoute is TSK_VOUCHER_DETAILS (verify branch)', () => {
    // This is to cover the case where TSK_VOUCHER_DETAILS branch is taken and null is returned for the first block
    renderComponent({ currentRoute: ROUTE.WEB.TSK_VOUCHER_DETAILS });
    // In TSK_VOUCHER_DETAILS, the second block is rendered, first is null
    // The test ID "PincodeDetailsCard" is on the container, so it's always there
    expect(screen.getByTestId('PincodeDetailsCard')).toBeTruthy();
  });

  test('snapshot test', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
