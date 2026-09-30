/**
 * this is card with image and title to perform a action
 *
 * @module components/ActionTileCard
 * @memberof CommonComponent
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import Image from 'components/sales/Image';
import { ICONS } from 'const';
import Text from 'components/sales/Text';
import { ParentObject } from 'store/sales/types/common';
import styles from './ActionTileCard.styles';

/**
 * Component type definitions
 *
 * @typedef {object} ActionTileCardProps
 * @property {Function} onPress - Function to be called when the button is pressed.
 * @property {string} label - Text label for the button.
 * @property {string} [iconName] - Name of the icon to be displayed.
 */

export type ActionTileCardProps = {
  onPress?: () => void;
  label?: string;
  iconName?: string;
  iconStyle?: ParentObject;
};

/**
 * Represents a ActionTileCard component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered ActionTileCard component
 *
 * @example
 * <ActionTileCard label="Hello World!" />
 */

const ActionTileCard = ({ onPress, label, iconName, iconStyle }: ActionTileCardProps) => (
  <Pressable style={styles.cardContainer} onPress={onPress} testID="action-tile-card">
    <View style={styles.container}>
      {iconName && <Image iconName={iconName} style={[styles.chevronIconStyle, iconStyle]} />}
      <Text style={styles.textStyle}>{label}</Text>
    </View>
    <View style={styles.iconContainer}>
      <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronIconStyle} />
    </View>
  </Pressable>
);

export default ActionTileCard;
