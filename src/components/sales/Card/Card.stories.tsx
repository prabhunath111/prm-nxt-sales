import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { View } from 'react-native';
import { Typography } from 'styles';
import { Text, TextInput } from 'components/sales';
import Card from './Card';
import styles from './Card.styles';

export default {
  title: 'components/Card',
  component: Card,
} as ComponentMeta<typeof Card>;

export const Basic: ComponentStory<typeof Card> = (args) => <Card {...args} />;

const children = (
  <View>
    <Text
      label="Select Plan"
      style={{
        fontSize: Typography.fontSize.x20.fontSize,
      }}
    />
    <TextInput />
  </View>
);

Basic.args = {
  children,
  cardStyle: styles.container,
};
