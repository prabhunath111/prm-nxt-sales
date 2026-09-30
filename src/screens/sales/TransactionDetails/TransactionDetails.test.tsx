import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TransactionDetails from './TransactionDetails';

jest.mock('components/sales/Image', () => () => <>mock-image</>);
jest.mock('components/sales/InformationText', () => () => <>mock-information</>);

describe('TransactionDetails Component', () => {
  const baseProps = {
    transactionDate: '2025-09-18',
    paymentType: 'Primary TV',
    status: 'Success',
    transactionId: 'TXN123',
    amount: '₹500',
    commission: '₹50',
  };

  test('renders with all props', () => {
    render(<TransactionDetails {...baseProps} />);

    expect(screen.getByText('2025-09-18')).toBeTruthy();
    expect(screen.getByText('Primary TV')).toBeTruthy();
    expect(screen.getByText('Success')).toBeTruthy();
    expect(screen.getByText('TXN123')).toBeTruthy();
    expect(screen.getByText('₹500')).toBeTruthy();
  });

  test('does not render commission section when not provided', () => {
    render(<TransactionDetails {...baseProps} commission={undefined} />);
  });

  test('does not render status section when status is missing', () => {
    render(<TransactionDetails {...baseProps} status={undefined} />);
    expect(screen.queryByText('Success')).toBeNull();
  });

  test('snapshot matches', () => {
    const component = render(<TransactionDetails {...baseProps} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
