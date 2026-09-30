/* eslint-disable react/no-array-index-key */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ICONS, QUERY, ROUTE } from 'const';
import { STRINGS } from 'const/strings';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import ActionTsraRequest from './ActionTsraRequest';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goBack: mockGoBack,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(() => ({ inflection: 'md' })),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => Promise.resolve({ status: true })),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('components/sales', () => {
  const rn = require('react-native');
  return {
    Button: ({ onPress, label, testID }: any) => (
      <rn.TouchableOpacity onPress={onPress} testID={testID || `button-${label}`}>
        <rn.Text>{label}</rn.Text>
      </rn.TouchableOpacity>
    ),
    Image: ({ iconName, testID }: any) => <rn.View testID={testID || `image-${iconName}`} />,
    List: ({ data, renderItem }: any) => <rn.View>{data?.map((item: any, index: number) => <rn.View key={index}>{renderItem({ item, index })}</rn.View>)}</rn.View>,
    Search: ({ onChange, value, placeholder, testID }: any) => (
      <rn.View>
        <rn.Text>{placeholder}</rn.Text>
        <rn.TextInput testID={testID || 'search-input'} onChangeText={onChange} value={value} />
      </rn.View>
    ),
    Text: ({ label, children, style, onPress }: any) => (
      <rn.Text style={style} onPress={onPress}>
        {label || children}
      </rn.Text>
    ),
    TextContainer: ({ data, dataArray, testID }: any) => (
      <rn.View testID={testID || 'text-container'}>{dataArray?.map((item: any, index: number) => <rn.Text key={index}>{data[item.key]}</rn.Text>)}</rn.View>
    ),
  };
});

describe('ActionTsraRequest Screen', () => {
  const mockDispatch = jest.fn();

  const mockTsraList = [
    {
      key: '1',
      tsraCode: 'TSRA001',
      tsraNameNT: 'TSRA Alpha',
      tsraMobileNumber: '9876543210',
      createdDate: '2023-01-01',
      createdDateNT: '2023-01-01',
    },
    {
      key: '2',
      tsraCode: 'TSRA002',
      tsraNameNT: 'TSRA Beta',
      tsraMobileNumber: '8765432109',
      createdDate: '2023-02-01',
      createdDateNT: '2023-02-01',
    },
  ];

  const sharedState = {
    tsraApproval: {
      tsraApprovalListData: {
        result: {
          dataList: mockTsraList,
        },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockReturnValue(Promise.resolve({ status: true }));
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(sharedState));
    (useInflection as unknown as jest.Mock).mockReturnValue({ inflection: 'md' });
  });

  test('renders correctly and handles initial mount effects', async () => {
    render(<ActionTsraRequest />);
    expect(screen.getByText('TSRA Alpha')).toBeTruthy();
    expect(screen.getByText('TSRA Beta')).toBeTruthy();
    expect(screen.getByText('strings.search')).toBeTruthy();

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledWith({}, QUERY.GetTSRAApprovalList);
    });
  });

  test('handles search filtering', async () => {
    render(<ActionTsraRequest />);
    const searchInput = screen.getByTestId('search-input');

    // Search by name
    fireEvent.changeText(searchInput, 'Alpha');
    expect(screen.getByText('TSRA Alpha')).toBeTruthy();
    expect(screen.queryByText('TSRA Beta')).toBeNull();

    // Search by mobile
    fireEvent.changeText(searchInput, '432109');
    expect(screen.getByText('TSRA Beta')).toBeTruthy();
    expect(screen.queryByText('TSRA Alpha')).toBeNull();

    // Clear search
    fireEvent.changeText(searchInput, '');
    expect(screen.getByText('TSRA Alpha')).toBeTruthy();
    expect(screen.getByText('TSRA Beta')).toBeTruthy();
  });

  test('handles approve action', () => {
    render(<ActionTsraRequest />);
    const approveButtons = screen.getAllByText('strings.approve');
    fireEvent.press(approveButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.ACTION_TSRA_SUMMARY, { selectedTab: STRINGS.APPROVE });
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(callAction).toHaveBeenCalledWith(expect.anything(), QUERY.SetSelectedDealer);
  });

  test('handles reject action', () => {
    render(<ActionTsraRequest />);
    const rejectButtons = screen.getAllByText('strings.reject');
    fireEvent.press(rejectButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.ACTION_TSRA_SUMMARY, { selectedTab: STRINGS.REJECT });
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(callAction).toHaveBeenCalledWith(expect.anything(), QUERY.SetSelectedDealer);
  });

  test('handles back press', () => {
    render(<ActionTsraRequest />);
    const cancelButton = screen.getByText('strings.cancel');
    fireEvent.press(cancelButton);
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('renders for Mobile layout and handles interactions', () => {
    (useInflection as unknown as jest.Mock).mockReturnValue({ inflection: 'sm' });

    render(<ActionTsraRequest />);
    expect(screen.getByText('TSRA Alpha')).toBeTruthy();

    const approveButtons = screen.getAllByText('strings.approve');
    fireEvent.press(approveButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.ACTION_TSRA_SUMMARY, { selectedTab: STRINGS.APPROVE });

    const rejectButtons = screen.getAllByText('strings.reject');
    fireEvent.press(rejectButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.ACTION_TSRA_SUMMARY, { selectedTab: STRINGS.REJECT });

    const detailIcons = screen.getAllByTestId(`image-${ICONS.PINK_CHEVRON_RIGHT}`);
    fireEvent.press(detailIcons[0].parent as any);
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('shows "no data" message when list is empty', () => {
    const emptyState = {
      tsraApproval: {
        tsraApprovalListData: {
          result: {
            dataList: [],
          },
        },
      },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(emptyState));

    render(<ActionTsraRequest />);
    expect(screen.getByText('errors.noDataFound')).toBeTruthy();
  });

  test('handles search filtering for other fields (Date)', () => {
    render(<ActionTsraRequest />);
    const searchInput = screen.getByTestId('search-input');

    fireEvent.changeText(searchInput, '2023-01-01');
    expect(screen.getByText('TSRA Alpha')).toBeTruthy();
  });
});
