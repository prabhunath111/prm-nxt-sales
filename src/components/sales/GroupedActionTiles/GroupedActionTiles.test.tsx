import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import GroupedActionTiles from './GroupedActionTiles';

// Mock MoengageMixpanel
jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

// Mock ActionTileCard to easily trigger onPress
jest.mock('components/sales/ActionTileCard', () => {
  const { Pressable, Text } = jest.requireActual('react-native');
  return ({ label, onPress }: any) => (
    <Pressable onPress={onPress}>
      <Text>{label}</Text>
    </Pressable>
  );
});

describe('GroupedActionTiles Component', () => {
  const mockOnPress = jest.fn();
  const mockSubTilePress = jest.fn();

  const subTiles: any[] = [
    { label: 'Walk-In Details', onPress: mockSubTilePress, iconName: 'WALK_IN' },
    { label: 'Over the Phone Lead Details', onPress: mockSubTilePress, iconName: 'PHONE' },
    { label: 'Tele-calling Lead Details', onPress: mockSubTilePress, iconName: 'PHONE' },
    { label: 'Outbound Activity Lead Details', onPress: mockSubTilePress, iconName: 'OUTBOUND' },
    { label: 'Special Comments', onPress: mockSubTilePress, iconName: 'COMMENTS' },
    { label: 'Normal Tile', onPress: mockSubTilePress, iconName: 'HOME' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly without props', () => {
    render(<GroupedActionTiles />);
    expect(screen.getByTestId('GroupedActionTiles')).toBeTruthy();
  });

  test('renders with title and handles main onPress', () => {
    render(<GroupedActionTiles title="Test Group" onPress={mockOnPress} />);
    expect(screen.getByText('Test Group')).toBeTruthy();
    fireEvent.press(screen.getByText('Test Group'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('triggers Moengage event and onPress for "Walk-In Details"', () => {
    render(<GroupedActionTiles subTiles={[subTiles[0]]} />);
    fireEvent.press(screen.getByText('Walk-In Details'));
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreWalkInDetailsPageVisit.moduleName, {
      [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreWalkInDetailsPageVisit.attributes.Status]: true,
    });
    expect(mockSubTilePress).toHaveBeenCalled();
  });

  test('triggers Moengage event and onPress for "Over the Phone Lead Details"', () => {
    render(<GroupedActionTiles subTiles={[subTiles[1]]} />);
    fireEvent.press(screen.getByText('Over the Phone Lead Details'));
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreOverThePhoneDetailsPageVisit.moduleName, {
      [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreOverThePhoneDetailsPageVisit.attributes.Status]: true,
    });
    expect(mockSubTilePress).toHaveBeenCalled();
  });

  test('triggers Moengage event and onPress for "Tele-calling Lead Details"', () => {
    render(<GroupedActionTiles subTiles={[subTiles[2]]} />);
    fireEvent.press(screen.getByText('Tele-calling Lead Details'));
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreTeleCallingDetailsPageVisit.moduleName, {
      [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreTeleCallingDetailsPageVisit.attributes.Status]: true,
    });
    expect(mockSubTilePress).toHaveBeenCalled();
  });

  test('triggers Moengage event and onPress for "Outbound Activity Lead Details"', () => {
    render(<GroupedActionTiles subTiles={[subTiles[3]]} />);
    fireEvent.press(screen.getByText('Outbound Activity Lead Details'));
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreOutBoundDetailsPageVisit.moduleName, {
      [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreOutBoundDetailsPageVisit.attributes.Status]: true,
    });
    expect(mockSubTilePress).toHaveBeenCalled();
  });

  test('triggers Moengage event and onPress for "Special Comments"', () => {
    render(<GroupedActionTiles subTiles={[subTiles[4]]} />);
    fireEvent.press(screen.getByText('Special Comments'));
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsPageVisit.moduleName, {
      [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsPageVisit.attributes.Status]: true,
    });
    expect(mockSubTilePress).toHaveBeenCalled();
  });

  test('triggers only onPress for normal tile', () => {
    render(<GroupedActionTiles subTiles={[subTiles[5]]} />);
    fireEvent.press(screen.getByText('Normal Tile'));
    expect(MoengageMixpanel.trackEvent).not.toHaveBeenCalled();
    expect(mockSubTilePress).toHaveBeenCalled();
  });

  test('snapshot test', () => {
    const component = render(<GroupedActionTiles title="Test Group" subTiles={subTiles} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
