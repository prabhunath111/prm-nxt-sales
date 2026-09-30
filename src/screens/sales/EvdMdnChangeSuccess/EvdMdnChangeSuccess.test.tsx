/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { closeWebView } from 'utils/navigationHelper';
import actions from 'store/sales/actions';
import EvdMdnChangeSuccess from './EvdMdnChangeSuccess';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(),
}));

jest.mock('utils/navigationHelper', () => ({
  closeWebView: jest.fn(),
}));

jest.mock('store/sales/actions', () => ({
  doLogout: jest.fn(() => ({ type: 'LOGOUT' })),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style, _inflection, _bool, _sizes) => style),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('components/sales', () => {
  const { Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="proceed-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Image: () => null,
    Text: ({ label, children, style }: any) => {
      if (typeof children === 'string') return <Text style={style}>{children}</Text>;
      if (label) return <Text style={style}>{label}</Text>;
      return <Text style={style}>{children}</Text>;
    },
  };
});

describe('EvdMdnChangeSuccess Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useInflection as jest.Mock).mockReturnValue({ inflection: 'sm' });
  });

  const renderWithState = (isRedirection: boolean, changeData: any) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: { isRedirection },
        evdMdnChange: { evdMdnChangeData: changeData },
      };
      return selector(state);
    });
    return render(<EvdMdnChangeSuccess />);
  };

  it('renders correctly and handles logout when isRedirection is false', () => {
    const changeData = { message: 'Success Message', newMDN: '1234567890' };
    renderWithState(false, changeData);

    expect(screen.getByText('Success Message')).toBeTruthy();
    expect(screen.getByText('1234567890')).toBeTruthy();

    fireEvent.press(screen.getByTestId('proceed-button'));
    expect(actions.doLogout).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });
  });

  it('handles logout when isRedirection is true', () => {
    const changeData = { message: 'Success', newMDN: '123' };
    renderWithState(true, changeData);

    fireEvent.press(screen.getByTestId('proceed-button'));
    expect(closeWebView).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('renders for md inflection', () => {
    (useInflection as jest.Mock).mockReturnValue({ inflection: 'md' });
    renderWithState(false, { message: 'Success' });
    expect(screen.getByText('Success')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const changeData = { message: 'Success Message', newMDN: '123' };
    const tree = renderWithState(false, changeData).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
