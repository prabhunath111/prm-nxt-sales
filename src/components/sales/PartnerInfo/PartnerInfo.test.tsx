import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider, useSelector as useReduxSelector } from 'react-redux';
import { store } from 'store';
import PartnerInfo from './PartnerInfo';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('Test for the component PartnerInfo', () => {
  beforeEach(() => {
    (useReduxSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        evdBalanceInfo: {
          balanceInfo: {
            donarRMN: '12345',
            childName: 'John Doe',
            recipientRMN: '67890',
            currentBalance: '500',
          },
        },
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('render component PartnerInfo', () => {
    render(
      <Provider store={store}>
        <PartnerInfo />
      </Provider>,
    );
  });

  test('snapshot tests for PartnerInfo', () => {
    const component = render(
      <Provider store={store}>
        <PartnerInfo />
      </Provider>,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});
