import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ICONS, STYLES } from 'const';
import { Sizing, Outlines, Typography, Colors } from 'styles';
import Button from './Button';

export default {
  title: 'components/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Basic: ComponentStory<typeof Button> = (args) => <Button {...args} />;

Basic.args = {
  label: 'Custom Button',
  isOnlyIcon: true,
  iconName: ICONS.SETTINGS,
  iconPosition: STYLES.POSITION.LEFT,
  borderRadius: Outlines.borderRadius.small,
  iconHeight: Sizing.layout.x5,
  iconWidth: Sizing.layout.x5,
  iconRadius: Outlines.borderRadius.large,
  fontSize: Typography.fontSize.x30.fontSize,
  fontColor: Colors.error.primary,
  labelStyle: {},
  type: STYLES.TYPE.SECONDARY,
  size: STYLES.SIZE.MD,
  style: {},
  iconStyle: {},
  disabled: false,
  loading: false,
  onPress: () => {},
};
