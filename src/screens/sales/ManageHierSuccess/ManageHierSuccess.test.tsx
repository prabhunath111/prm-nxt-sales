/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import { ROUTE } from 'const';
import { PARTNER_ROLES } from 'const/strings';
import ManageHierSuccess from './ManageHierSuccess';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => jest.fn());

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'sm' }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => 'partnerContainer'),
}));

jest.mock('components/sales', () => {
  const { Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="home-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    CommonSuccess: ({ primaryText }: { primaryText: string }) => <Text>{primaryText}</Text>,
    Image: () => null,
    Text: ({ children, label }: any) => <Text>{label || children}</Text>,
  };
});

describe('ManageHierSuccess Component', () => {
  const mockNavigate = jest.fn();
  const mockGoHome = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue({ navigate: mockNavigate, goHome: mockGoHome });
  });

  const renderWithState = (userState: any, manageHierState: any) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: userState,
        manageHierarchy: manageHierState,
      };
      return selector(state);
    });
    return render(<ManageHierSuccess />);
  };

  it('renders for fos role and handles moduleRouteHandler', () => {
    const userState = { info: { roleId: PARTNER_ROLES.fos }, isRedirection: true };
    const manageHierState = {
      ccPartnerSuccessData: { message: 'Success', result: { approvalName: 'Approver', approvalPosition: 'Pos', partnerUserName: 'Partner', partnerUserId: '123' } },
      successRoleTypeData: { role: 'fos' },
    };
    renderWithState(userState, manageHierState);
    expect(screen.getByText('Success')).toBeTruthy();
    expect(screen.getByText('strings.moreActionsForYou')).toBeTruthy();

    const createDealerBtn = screen.getByText('forms.createNewDealer');
    fireEvent.press(createDealerBtn);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CREATE_CHANNEL_PARTNER);
  });

  it('renders for non-fos, non-ASI role and handles handleNavigation', () => {
    const userState = { info: { roleId: 'DEALER' }, isRedirection: false };
    const manageHierState = {
      ccPartnerSuccessData: { message: 'Success', result: {} },
      successRoleTypeData: { role: 'dealer' },
    };
    renderWithState(userState, manageHierState);

    // Test handleNavigation(FORMS.createChannelPartner)
    fireEvent.press(screen.getByText('strings.createAnotherChannelPartner'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CREATE_CHANNEL_PARTNER);

    // Test handleNavigation(FORMS.viewMyTeamDetails)
    fireEvent.press(screen.getByText('strings.viewMyTeamDetails'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.VIEW_MY_TEAM_DETAILS);
  });

  it('renders for ASI role with tsra no and handles partner approval navigation', () => {
    const userState = { info: { roleId: PARTNER_ROLES.ASI }, isRedirection: false };
    const manageHierState = {
      ccPartnerSuccessData: { message: 'Success', result: {} },
      successRoleTypeData: { role: 'dealer', tsra: 'no' },
    };
    renderWithState(userState, manageHierState);

    fireEvent.press(screen.getByText('strings.partnerApproval'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.PARTNER_APPROVAL);
  });

  it('renders for ASI role with tsra yes (no partner approval)', () => {
    const userState = { info: { roleId: PARTNER_ROLES.ASI }, isRedirection: false };
    const manageHierState = {
      ccPartnerSuccessData: { message: 'Success', result: {} },
      successRoleTypeData: { role: 'dealer', tsra: 'yes' },
    };
    renderWithState(userState, manageHierState);
    expect(screen.queryByText('strings.partnerApproval')).toBeNull();
  });

  it('handles goHome when back to home button is pressed', () => {
    const userState = { info: { roleId: 'DEALER' }, isRedirection: true };
    const manageHierState = {
      ccPartnerSuccessData: { message: 'Success', result: {} },
      successRoleTypeData: {},
    };
    renderWithState(userState, manageHierState);
    fireEvent.press(screen.getByTestId('home-button'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  it('matches snapshot', () => {
    const userState = { info: { roleId: 'DEALER' }, isRedirection: false };
    const manageHierState = {
      ccPartnerSuccessData: { message: 'Success', result: {} },
      successRoleTypeData: { role: 'dealer' },
    };
    const tree = renderWithState(userState, manageHierState).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
