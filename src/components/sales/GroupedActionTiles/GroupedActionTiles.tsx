import React from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import { ICONS } from 'const';
import ActionTileCard from 'components/sales/ActionTileCard';
import { Image, Text } from 'components/sales';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './GroupedActionTiles.styles';

type SubTile = {
  label: string;
  onPress: () => void;
  iconName: keyof typeof ICONS;
};

type GroupedActionTilesProps = {
  title?: string;
  iconName?: string;
  subTiles?: SubTile[];
  onPress?: (event: GestureResponderEvent) => void;
};

const GroupedActionTiles = ({ title, iconName, subTiles, onPress }: GroupedActionTilesProps) => {
  const handleSubTilePress = (tile: SubTile) => {
    if (tile.label === 'Walk-In Details') {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreWalkInDetailsPageVisit.moduleName, {
        [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreWalkInDetailsPageVisit.attributes.Status]: true,
      });
    }
    if (tile.label === 'Over the Phone Lead Details') {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreOverThePhoneDetailsPageVisit.moduleName, {
        [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreOverThePhoneDetailsPageVisit.attributes.Status]: true,
      });
    }
    if (tile.label === 'Tele-calling Lead Details') {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreTeleCallingDetailsPageVisit.moduleName, {
        [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreTeleCallingDetailsPageVisit.attributes.Status]: true,
      });
    }
    if (tile.label === 'Outbound Activity Lead Details') {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreOutBoundDetailsPageVisit.moduleName, {
        [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreOutBoundDetailsPageVisit.attributes.Status]: true,
      });
    }
    if (tile.label === 'Special Comments') {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsPageVisit.moduleName, {
        [MoengageMixpanelModules.ExclusiveStore.ExclusiveStoreSpecialCommentsPageVisit.attributes.Status]: true,
      });
    }
    tile.onPress();
  };

  return (
    <View style={styles.groupContainer} testID="GroupedActionTiles">
      <Pressable onPress={onPress}>
        <View style={styles.headerContainer}>
          <Image iconName={ICONS[iconName as keyof typeof ICONS]} style={styles.headerIcon} />
          <Text style={styles.textStyle}>{title}</Text>
        </View>
      </Pressable>

      {subTiles?.map((tile) => (
        <View key={tile.label} style={styles.tileDivider}>
          <ActionTileCard label={tile.label} iconName={tile.iconName} onPress={() => handleSubTilePress(tile)} />
        </View>
      ))}
    </View>
  );
};
export default GroupedActionTiles;
