/* eslint-disable react/no-array-index-key */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ICONS, QUERY, ROUTE } from 'const';
import { PARTNER_ROLES } from 'const/strings';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import ActionPartnerRequest from './ActionPartnerRequest';

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

jest.mock('store/sales/actions/partnerApproval', () => ({
  setSelectedPartner: jest.fn((data: any) => ({ type: 'SET_SELECTED_PARTNER', payload: data })),
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
    Dropdown: ({ onSelect, data, placeholder, testID }: any) => (
      <rn.View testID={testID || 'dropdown'}>
        <rn.Text>{placeholder}</rn.Text>
        {data?.map((item: any) => (
          <rn.TouchableOpacity key={item.value} onPress={() => onSelect(item)} testID={`dropdown-item-${item.value}`}>
            <rn.Text>{item.name}</rn.Text>
          </rn.TouchableOpacity>
        ))}
      </rn.View>
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

describe('ActionPartnerRequest Screen', () => {
  const mockDispatch = jest.fn();

  const mockPartnerList = [
    {
      key: '1',
      partnerName: 'Partner A',
      partnerNameNT: 'Partner A',
      mobileNumber: '9999999999',
      role: 'Dealer',
      outletType: 'Type 1',
      outletTypeNT: 'Type 1',
      createdDate: '2023-01-01',
      createdDateNT: '2023-01-01',
    },
    {
      key: '2',
      partnerName: 'Partner B',
      partnerNameNT: 'Partner B',
      mobileNumber: '8888888888',
      role: 'Sub-Dealer',
      outletType: 'Type 2',
      outletTypeNT: 'Type 2',
      createdDate: '2023-02-01',
      createdDateNT: '2023-02-01',
    },
  ];

  const mockDropDownList = {
    DropdownList: [
      { name: 'ASI 1', value: 'asi1' },
      { name: 'ASI 2', value: 'asi2' },
    ],
  };

  const mockUserState = {
    info: { roleId: PARTNER_ROLES.dealer },
  };

  const sharedState = {
    partnerApproval: {
      dropDownListAndRejectReasons: mockDropDownList,
      partnerList: mockPartnerList,
      initialData: null,
    },
    user: mockUserState,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockReturnValue(Promise.resolve({ status: true }));
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(sharedState));
    (useInflection as unknown as jest.Mock).mockReturnValue({ inflection: 'md' });
  });

  test('renders correctly and handles initial mount effects', async () => {
    render(<ActionPartnerRequest />);
    expect(screen.getByText('Partner A')).toBeTruthy();
    expect(screen.getByText('strings.search')).toBeTruthy();

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledWith({}, QUERY.GetDropDownListAndRejectReasons);
    });
  });

  test('handles search filtering', async () => {
    render(<ActionPartnerRequest />);
    const searchInput = screen.getByTestId('search-input');

    fireEvent.changeText(searchInput, 'Partner A');
    expect(screen.getByText('Partner A')).toBeTruthy();
    expect(screen.queryByText('Partner B')).toBeNull();

    fireEvent.changeText(searchInput, '');
    expect(screen.getByText('Partner A')).toBeTruthy();
    expect(screen.getByText('Partner B')).toBeTruthy();
  });

  test('handles approve partner action', () => {
    render(<ActionPartnerRequest />);
    const approveButtons = screen.getAllByText('strings.approve');
    fireEvent.press(approveButtons[0]);
    expect(callAction).toHaveBeenCalledWith(expect.anything(), QUERY.ApprovalConfirmation);
  });

  test('handles reject partner action', () => {
    render(<ActionPartnerRequest />);
    const rejectButtons = screen.getAllByText('strings.reject');
    fireEvent.press(rejectButtons[0]);
    expect(callAction).toHaveBeenCalledWith(expect.anything(), QUERY.RejectPartnerApproval);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  test('navigates to details screen', () => {
    render(<ActionPartnerRequest />);
    const detailIcons = screen.getAllByTestId(`image-${ICONS.PINK_CHEVRON_DOWN}`);
    fireEvent.press(detailIcons[0].parent as any);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.PARTNER_APPROVAL_DETAILS);
  });

  test('handles back press', () => {
    render(<ActionPartnerRequest />);
    const cancelButton = screen.getByText('strings.cancel');
    fireEvent.press(cancelButton);
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('renders for Mobile layout and handles interactions', () => {
    (useInflection as unknown as jest.Mock).mockReturnValue({ inflection: 'sm' });

    render(<ActionPartnerRequest />);
    expect(screen.getByText('Partner A')).toBeTruthy();

    // Test interactions in Mobile layout
    const approveButtons = screen.getAllByText('strings.approve');
    fireEvent.press(approveButtons[0]);
    expect(callAction).toHaveBeenCalledWith(expect.anything(), QUERY.ApprovalConfirmation);

    const rejectButtons = screen.getAllByText('strings.reject');
    fireEvent.press(rejectButtons[0]);
    expect(callAction).toHaveBeenCalledWith(expect.anything(), QUERY.RejectPartnerApproval);

    const detailIcons = screen.getAllByTestId(`image-${ICONS.PINK_CHEVRON_RIGHT}`);
    fireEvent.press(detailIcons[0].parent as any);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.PARTNER_APPROVAL_DETAILS);
  });

  test('handles CSM role with dropdown', async () => {
    const csmState = {
      ...sharedState,
      user: { info: { roleId: PARTNER_ROLES.CSM } },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(csmState));

    render(<ActionPartnerRequest />);
    expect(screen.getByText('strings.selectAsiAsm')).toBeTruthy();

    const dropdownItem = screen.getByTestId('dropdown-item-asi1');
    fireEvent.press(dropdownItem);

    expect(callAction).toHaveBeenCalledWith(expect.objectContaining({ value: 'asi1' }), QUERY.GetDropDownListAndRejectReasons);
  });

  test('shows "no data" message when list is empty', () => {
    const emptyState = {
      ...sharedState,
      partnerApproval: {
        ...sharedState.partnerApproval,
        partnerList: [],
      },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(emptyState));

    render(<ActionPartnerRequest />);
    expect(screen.getByText('errors.noDataFound')).toBeTruthy();
  });

  test('handles search filtering for other fields', () => {
    render(<ActionPartnerRequest />);
    const searchInput = screen.getByTestId('search-input');

    fireEvent.changeText(searchInput, 'Sub-Dealer');
    expect(screen.getByText('Partner B')).toBeTruthy();

    fireEvent.changeText(searchInput, 'Type 1');
    expect(screen.getByText('Partner A')).toBeTruthy();

    fireEvent.changeText(searchInput, '2023-01-01');
    expect(screen.getByText('Partner A')).toBeTruthy();
  });
});
