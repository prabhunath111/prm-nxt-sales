import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Text, View } from 'react-native';
import { Colors } from 'styles';
import styles from './Tooltip.styles';

import Tooltip from './Tooltip';

export default {
  title: 'components/Tooltip',
  component: Tooltip,
  argTypes: {
    text: { control: 'text' },
    tooltipTextStyle: { control: 'object' },
    tooltipContainerStyle: { control: 'object' },
  },
} as ComponentMeta<typeof Tooltip>;

export const Basic: ComponentStory<typeof Tooltip> = (args) => (
  <View style={styles.container}>
    <Tooltip {...args}>
      <Text>Hover over me!</Text>
    </Tooltip>
  </View>
);

Basic.args = {
  text: 'This is a tooltip',
  tooltipTextStyle: { color: Colors.neutral.white },
  tooltipContainerStyle: { backgroundColor: Colors.neutral.g400 },
};
