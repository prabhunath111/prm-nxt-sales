import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { sliceActions } from 'store/sales/reducer/purchaseOrder';
import uiActions from 'store/sales/actions/ui';
import { HEADER_TITLE, QUERY, ROUTE, STRINGS } from 'const';
import i18next from 'i18next';
import RegisterPaymentOptions from './RegisterPaymentOptions';

// Mocking hooks and external dependencies
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

// Mock uiActions which is a default export
jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showBottomModal: jest.fn((payload: any) => ({ type: 'SHOW_BOTTOM_MODAL', payload })),
  },
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
  memo: (c: any) => c,
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((base) => base),
}));

const mockedUseSelector = useSelector as unknown as jest.Mock;

describe('RegisterPaymentOptions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseSelector.mockReturnValue({
      walletDetails: [],
      paymentTypeArray: [],
    });
    mockDispatch.mockImplementation((action: any) => action);
    // Setup i18next.t mock behavior for these tests
    (i18next.t as jest.Mock).mockImplementation((key, options) => {
      if (options?.amount) return `${key}_${options.amount}`;
      return key;
    });
  });

  test('renders correctly and matches snapshot', () => {
    const { toJSON } = render(<RegisterPaymentOptions />);
    expect(toJSON()).toMatchSnapshot();
    expect(screen.getByTestId('SelectBox')).toBeTruthy();
  });

  test('renders wallet details when present', () => {
    mockedUseSelector.mockReturnValue({
      walletDetails: [
        { id: '1', displayName: 'Bank-TestAccount', paymentTypeNT: STRINGS.BANK },
        { id: '2', displayName: 'Wallet-Other', paymentTypeNT: 'OTHER' },
      ],
      paymentTypeArray: [],
    });

    render(<RegisterPaymentOptions />);
    expect(screen.getByText('Bank-TestAccount')).toBeTruthy();
    expect(screen.getByText('Wallet-Other')).toBeTruthy();
  });

  test('handleEdit dispatches actions and navigates', () => {
    const item = { id: '1', displayName: 'Bank-TestAccount', paymentTypeNT: STRINGS.BANK };
    mockedUseSelector.mockReturnValue({
      walletDetails: [item],
      paymentTypeArray: [],
    });

    render(<RegisterPaymentOptions />);
    fireEvent.press(screen.getByText('strings.edit'));

    expect(mockDispatch).toHaveBeenCalledWith(sliceActions.setEditData(item));
    expect(mockDispatch).toHaveBeenCalledWith(sliceActions.setIsEditable(true));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.REGISTER_NEW_PAYMENT_ID);
  });

  test('handleDelete shows confirmation modal for BANK type', () => {
    const item = {
      id: '1',
      displayName: 'Bank-TestAccount',
      paymentTypeNT: STRINGS.BANK,
      userNameNT: 'user',
      bankNameNT: 'bank',
      ifscNoNT: 'ifsc',
      paymentIdNT: 'id',
    };
    mockedUseSelector.mockReturnValue({
      walletDetails: [item],
      paymentTypeArray: [],
    });

    render(<RegisterPaymentOptions />);
    fireEvent.press(screen.getByText('strings.delete'));

    expect(i18next.t).toHaveBeenCalledWith('strings.paymentIdDeleteBank', { amount: STRINGS.BANK });
    expect(mockDispatch).toHaveBeenCalledWith(
      uiActions.showBottomModal(
        expect.objectContaining({
          headerTitle: HEADER_TITLE.CONFIRMATION,
          buttonInfo: expect.objectContaining({
            childData: 'strings.paymentIdDeleteBank_Bank',
            queryName: QUERY.DistributorPaymentIdUpdate,
            queryParams: expect.objectContaining({
              paymentType: item.paymentTypeNT,
            }),
          }),
        }),
      ),
    );
  });

  test('handleDelete shows confirmation modal for non-BANK type', () => {
    const item = {
      id: '2',
      displayName: 'Wallet-OtherName',
      paymentTypeNT: 'OTHER',
      paymentIdNT: 'id2',
    };
    mockedUseSelector.mockReturnValue({
      walletDetails: [item],
      paymentTypeArray: [],
    });

    render(<RegisterPaymentOptions />);
    fireEvent.press(screen.getByText('strings.delete'));

    expect(i18next.t).toHaveBeenCalledWith('strings.paymentIdDelete', { amount: 'OtherName' });
    expect(mockDispatch).toHaveBeenCalledWith(
      uiActions.showBottomModal(
        expect.objectContaining({
          buttonInfo: expect.objectContaining({
            childData: 'strings.paymentIdDelete_OtherName',
          }),
        }),
      ),
    );
  });

  test('handleSubmit filters payment types and adds Bank if missing', () => {
    const walletDetails = [{ id: '1', paymentTypeNT: 'EXISTING_TYPE' }];
    const paymentTypeArray = [
      { id: '10', nameNT: 'EXISTING_TYPE' },
      { id: '11', nameNT: 'NEW_TYPE' },
    ];
    mockedUseSelector.mockReturnValue({ walletDetails, paymentTypeArray });

    render(<RegisterPaymentOptions />);
    fireEvent.press(screen.getByText('strings.registerNewPaymentID'));

    const expectedFiltered = [
      { id: '11', nameNT: 'NEW_TYPE' },
      { id: STRINGS.BANK, name: 'strings.bank', nameNT: STRINGS.BANK, object: {} },
    ];

    expect(mockDispatch).toHaveBeenCalledWith(sliceActions.setIsEditable(false));
    expect(mockDispatch).toHaveBeenCalledWith(sliceActions.setEditData({}));
    expect(mockDispatch).toHaveBeenCalledWith(sliceActions.setPaymentType(expect.arrayContaining(expectedFiltered)));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.REGISTER_NEW_PAYMENT_ID);
  });

  test('handleSubmit adds Bank even if all current payment types are filtered out', () => {
    mockedUseSelector.mockReturnValue({
      walletDetails: [{ id: '1', paymentTypeNT: 'TYPE_A' }],
      paymentTypeArray: [{ id: '2', nameNT: 'TYPE_A' }],
    });

    render(<RegisterPaymentOptions />);
    fireEvent.press(screen.getByText('strings.registerNewPaymentID'));

    expect(mockDispatch).toHaveBeenCalledWith(sliceActions.setPaymentType([{ id: STRINGS.BANK, name: 'strings.bank', nameNT: STRINGS.BANK, object: {} }]));
  });

  test('handleSubmit adds Bank when other types exist but Bank is missing', () => {
    mockedUseSelector.mockReturnValue({
      walletDetails: [],
      paymentTypeArray: [{ id: '2', nameNT: 'OTHER_TYPE' }],
    });

    render(<RegisterPaymentOptions />);
    fireEvent.press(screen.getByText('strings.registerNewPaymentID'));

    expect(mockDispatch).toHaveBeenCalledWith(
      sliceActions.setPaymentType([
        { id: '2', nameNT: 'OTHER_TYPE' },
        { id: STRINGS.BANK, name: 'strings.bank', nameNT: STRINGS.BANK, object: {} },
      ]),
    );
  });

  test('handleBack navigates to PURCHASE_ORDER_REQUEST', () => {
    render(<RegisterPaymentOptions />);
    fireEvent.press(screen.getByText('modal.cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.PURCHASE_ORDER_REQUEST);
  });
});
