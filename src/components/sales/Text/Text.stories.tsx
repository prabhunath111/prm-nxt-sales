import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Colors, Typography } from 'styles';
import Text from './Text';

export default {
  title: 'components/Text',
  component: Text,
} as ComponentMeta<typeof Text>;

export const Basic: ComponentStory<typeof Text> = (args) => <Text {...args} />;

Basic.args = {
  label: 'Custom Text',
  color: Colors.neutral.black,
  fontSize: Typography.fontSize.x30.fontSize,
  style: {
    backgroundColor: Colors.neutral.g200,
  },
};
